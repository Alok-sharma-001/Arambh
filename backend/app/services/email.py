import os
import logging

logger = logging.getLogger(__name__)

def send_streak_warning_email(to_email: str, username: str, streak_days: int):
    """
    Dispatches streak retention warning email to inactive user.
    Uses SMTP or external email service API if configured.
    """
    logger.info(f"📧 Sending Streak Warning Email to {to_email} (User: {username}, Streak: {streak_days} days)")
    
    resend_api_key = os.getenv("RESEND_API_KEY")
    if resend_api_key:
        try:
            import urllib.request
            import json
            
            req = urllib.request.Request(
                "https://api.resend.com/emails",
                data=json.dumps({
                    "from": "Arambh Academy <notifications@arambh.dev>",
                    "to": [to_email],
                    "subject": f"⚠️ {username}, your {streak_days}-day streak is about to reset!",
                    "html": f"<p>Greetings Adventurer <b>{username}</b>,</p><p>You haven't logged into Arambh in 36 hours. Log in now to keep your {streak_days}-day streak intact!</p>"
                }).encode("utf-8"),
                headers={
                    "Authorization": f"Bearer {resend_api_key}",
                    "Content-Type": "application/json"
                },
                method="POST"
            )
            urllib.request.urlopen(req)
            logger.info(f"Streak email sent to {to_email} via Resend API")
        except Exception as e:
            logger.warning(f"Failed to dispatch Resend email: {e}")
    else:
        logger.info(f"[SIMULATED EMAIL] To: {to_email} | Subject: Streak Reset Warning | Streak: {streak_days}")
