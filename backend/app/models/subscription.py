from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, text
from sqlalchemy.orm import relationship
from app.database.session import Base

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    plan = Column(String, nullable=False, default="free")  # 'free', 'monthly', 'yearly'
    razorpay_order_id = Column(String, nullable=True)
    razorpay_payment_id = Column(String, nullable=True)
    razorpay_signature = Column(String, nullable=True)
    status = Column(String, nullable=False, default="active")  # 'active', 'cancelled', 'expired'
    created_at = Column(DateTime(timezone=True), server_default=text('CURRENT_TIMESTAMP'))
    expires_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="subscription")
