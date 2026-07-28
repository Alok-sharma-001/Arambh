import os
import json
import hmac
import hashlib
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.router import get_current_user
from app.models.user import User
from app.models.subscription import Subscription

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/payments", tags=["payments"])

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_mock_key")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "rzp_mock_secret")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")

PLAN_PRICES = {
    "monthly": {"amount": 49900, "currency": "INR", "label": "₹499/month", "days": 30},
    "yearly": {"amount": 299900, "currency": "INR", "label": "₹2,999/year", "days": 365},
}

class CreateOrderRequest(BaseModel):
    plan: str  # 'monthly' or 'yearly'

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    plan: str

class SubscriptionStatusResponse(BaseModel):
    plan: str
    status: str
    is_premium: bool
    expires_at: Optional[datetime] = None


def _activate_subscription(user_id: int, plan: str, order_id: str, payment_id: str, signature: str, db: Session):
    """Shared logic to activate or update a user's subscription."""
    if plan not in PLAN_PRICES:
        return
    days = PLAN_PRICES[plan]["days"]
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(days=days)

    sub = db.query(Subscription).filter(Subscription.user_id == user_id).first()
    if not sub:
        sub = Subscription(user_id=user_id)
        db.add(sub)

    sub.plan = plan
    sub.status = "active"
    sub.razorpay_order_id = order_id
    sub.razorpay_payment_id = payment_id
    sub.razorpay_signature = signature
    sub.expires_at = expires_at

    db.commit()
    db.refresh(sub)
    return sub


@router.post("/create-order")
def create_order(
    req: CreateOrderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req.plan not in PLAN_PRICES:
        raise HTTPException(status_code=400, detail="Invalid subscription plan.")

    plan_info = PLAN_PRICES[req.plan]
    order_id = f"order_arambh_{current_user.id}_{int(datetime.now().timestamp())}"

    # Use real Razorpay if configured, or sandbox mock if using default dev keys
    if RAZORPAY_KEY_SECRET != "rzp_mock_secret":
        try:
            import razorpay
            client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
            rzp_order = client.order.create({
                "amount": plan_info["amount"],
                "currency": plan_info["currency"],
                "receipt": order_id,
                "notes": {"user_id": str(current_user.id), "plan": req.plan}
            })
            order_id = rzp_order["id"]
        except Exception as e:
            logger.error(f"Razorpay order creation failed: {e}")
            raise HTTPException(
                status_code=503,
                detail="Payment service temporarily unavailable. Please try again later."
            )

    return {
        "order_id": order_id,
        "amount": plan_info["amount"],
        "currency": plan_info["currency"],
        "key_id": RAZORPAY_KEY_ID,
        "plan": req.plan
    }


@router.post("/verify", response_model=SubscriptionStatusResponse)
def verify_payment(
    req: VerifyPaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req.plan not in PLAN_PRICES:
        raise HTTPException(status_code=400, detail="Invalid plan.")

    # In production, verify HMAC-SHA256 signature
    if RAZORPAY_KEY_SECRET != "rzp_mock_secret":
        msg = f"{req.razorpay_order_id}|{req.razorpay_payment_id}"
        generated_sig = hmac.new(
            RAZORPAY_KEY_SECRET.encode(),
            msg.encode(),
            hashlib.sha256
        ).hexdigest()
        if not hmac.compare_digest(generated_sig, req.razorpay_signature):
            raise HTTPException(status_code=400, detail="Invalid payment signature.")

    sub = _activate_subscription(
        user_id=current_user.id,
        plan=req.plan,
        order_id=req.razorpay_order_id,
        payment_id=req.razorpay_payment_id,
        signature=req.razorpay_signature,
        db=db
    )

    return SubscriptionStatusResponse(
        plan=sub.plan,
        status=sub.status,
        is_premium=True,
        expires_at=sub.expires_at
    )


@router.post("/webhook")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Razorpay Webhook Handler — processes payment events server-side.
    This ensures subscriptions activate even if the user closes their browser
    after payment but before the frontend /verify call completes.
    """
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")

    if not RAZORPAY_WEBHOOK_SECRET:
        logger.warning("RAZORPAY_WEBHOOK_SECRET not configured — webhook verification skipped")
        raise HTTPException(status_code=500, detail="Webhook secret not configured.")

    # Verify webhook signature
    expected = hmac.new(
        RAZORPAY_WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected, signature):
        logger.warning("Invalid Razorpay webhook signature received")
        raise HTTPException(status_code=400, detail="Invalid webhook signature.")

    payload = json.loads(body)
    event = payload.get("event", "")

    if event == "payment.captured":
        payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
        order_id = payment_entity.get("order_id", "")
        payment_id = payment_entity.get("id", "")
        notes = payment_entity.get("notes", {})
        user_id = notes.get("user_id")
        plan = notes.get("plan", "monthly")

        if user_id:
            try:
                _activate_subscription(
                    user_id=int(user_id),
                    plan=plan,
                    order_id=order_id,
                    payment_id=payment_id,
                    signature="webhook_verified",
                    db=db
                )
                logger.info(f"Webhook: Activated subscription for user {user_id} (plan={plan})")
            except Exception as e:
                logger.error(f"Webhook subscription activation failed: {e}")
                raise HTTPException(status_code=500, detail="Failed to activate subscription.")

    elif event == "payment.failed":
        payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
        logger.warning(f"Payment failed for order {payment_entity.get('order_id')}: {payment_entity.get('error_description')}")

    return {"status": "ok"}


@router.get("/status", response_model=SubscriptionStatusResponse)
def get_subscription_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sub = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()
    
    if not sub:
        return SubscriptionStatusResponse(
            plan="free",
            status="active",
            is_premium=False,
            expires_at=None
        )

    # Check if subscription has expired
    is_expired = False
    if sub.expires_at:
        now = datetime.now(timezone.utc)
        sub_expires = sub.expires_at
        if sub_expires.tzinfo is None:
            sub_expires = sub_expires.replace(tzinfo=timezone.utc)
        if now > sub_expires:
            is_expired = True

    if is_expired:
        return SubscriptionStatusResponse(
            plan="free",
            status="expired",
            is_premium=False,
            expires_at=sub.expires_at
        )

    is_prem = sub.status == "active" and sub.plan in ("monthly", "yearly")
    return SubscriptionStatusResponse(
        plan=sub.plan if is_prem else "free",
        status=sub.status,
        is_premium=is_prem,
        expires_at=sub.expires_at
    )
