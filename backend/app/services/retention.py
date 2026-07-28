import logging
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session

from app.models.user import UserStats
from app.services.email import send_streak_warning_email

logger = logging.getLogger(__name__)

def check_and_notify_inactive_streaks(db: Session):
    """
    Finds users whose last claim was between 36 and 46 hours ago,
    and dispatches a streak saver reminder email.
    """
    now = datetime.now(timezone.utc)
    lower_bound = now - timedelta(hours=46)
    upper_bound = now - timedelta(hours=36)

    # Query active stats with daily_streak > 0
    stats_list = db.query(UserStats).filter(
        UserStats.streak_days > 0,
        UserStats.last_claimed_at >= lower_bound,
        UserStats.last_claimed_at <= upper_bound
    ).all()

    count = 0
    for stat in stats_list:
        if stat.user and stat.user.email:
            send_streak_warning_email(stat.user.email, stat.user.username, stat.streak_days)
            count += 1

    logger.info(f"Retention check complete: Sent {count} streak reminder emails.")
    return count
