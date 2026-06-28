import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, not_
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

from app.database.session import get_db
from app.auth.router import get_current_user
from app.models.user import User, UserStats
from app.models.progression import LessonProgress, RegionProgress, Revision
from app.models.mentor import MentorMessage
from app.models.analytics import AnalyticsEvent, LessonFeedback, BugReport, BetaFeedback, ExitSurveyResponse
from app.schemas.analytics import (
    AnalyticsEventCreate,
    LessonFeedbackCreate,
    BugReportCreate,
    FounderDashboardResponse,
    BetaAdminPanelResponse,
    BugReportResponse,
    StuckUser,
    DifficultConcept,
    DifficultRegion,
    BetaFeedbackCreate,
    BetaFeedbackResponse,
    ExitSurveyCreate,
    ExitSurveyResponseSchema
)

router = APIRouter(prefix="/analytics", tags=["analytics"])

def is_founder(user: User):
    if user.username not in ("founder", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Founder access only."
        )

def safe_parse_json(text_val: Optional[str]) -> Dict[str, Any]:
    if not text_val:
        return {}
    try:
        return json.loads(text_val)
    except Exception:
        return {}

@router.post("/event")
def log_event(
    event_in: AnalyticsEventCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    details_str = None
    if event_in.details is not None:
        try:
            details_str = json.dumps(event_in.details)
        except Exception:
            details_str = str(event_in.details)

    event = AnalyticsEvent(
        user_id=current_user.id if current_user else None,
        event_type=event_in.event_type,
        details=details_str
    )
    db.add(event)
    db.commit()
    return {"status": "success"}

@router.post("/feedback")
def submit_feedback(
    feedback_in: LessonFeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Store explicit feedback record
    fb = LessonFeedback(
        user_id=current_user.id,
        region_id=feedback_in.region_id,
        lesson_id=feedback_in.lesson_id,
        helpful=feedback_in.helpful
    )
    db.add(fb)
    
    # Also log it as an analytics event for unified timeline
    event = AnalyticsEvent(
        user_id=current_user.id,
        event_type="lesson_feedback",
        details=json.dumps({
            "region_id": feedback_in.region_id,
            "lesson_id": feedback_in.lesson_id,
            "helpful": feedback_in.helpful
        })
    )
    db.add(event)
    
    db.commit()
    return {"status": "success"}

@router.post("/bug-report")
def submit_bug_report(
    bug_in: BugReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = BugReport(
        user_id=current_user.id,
        category=bug_in.category,
        description=bug_in.description,
        context_info=bug_in.context_info
    )
    db.add(report)

    # Log analytics event
    event = AnalyticsEvent(
        user_id=current_user.id,
        event_type="bug_report_submitted",
        details=json.dumps({
            "category": bug_in.category,
            "description": bug_in.description[:100]
        })
    )
    db.add(event)

    db.commit()
    return {"status": "success"}

@router.post("/beta-feedback", response_model=BetaFeedbackResponse)
def submit_beta_feedback(
    fb_in: BetaFeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    feedback = BetaFeedback(
        user_id=current_user.id,
        feedback_type=fb_in.feedback_type,
        description=fb_in.description,
        context_info=fb_in.context_info
    )
    db.add(feedback)
    
    # Log analytics event
    event = AnalyticsEvent(
        user_id=current_user.id,
        event_type="beta_feedback_submitted",
        details=json.dumps({
            "feedback_type": fb_in.feedback_type,
            "description": fb_in.description[:100]
        })
    )
    db.add(event)
    db.commit()
    db.refresh(feedback)
    
    return BetaFeedbackResponse(
        id=feedback.id,
        user_id=feedback.user_id,
        username=current_user.username,
        feedback_type=feedback.feedback_type,
        description=feedback.description,
        context_info=feedback.context_info,
        created_at=feedback.created_at
    )

@router.post("/exit-survey")
def submit_exit_survey(
    survey_in: ExitSurveyCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    survey = ExitSurveyResponse(
        user_id=current_user.id if current_user else None,
        reason=survey_in.reason,
        details=survey_in.details,
        context=survey_in.context
    )
    db.add(survey)
    
    # Log analytics event
    event = AnalyticsEvent(
        user_id=current_user.id if current_user else None,
        event_type="exit_survey_submitted",
        details=json.dumps({
            "reason": survey_in.reason,
            "context": survey_in.context
        })
    )
    db.add(event)
    db.commit()
    return {"status": "success"}

@router.get("/founder-dashboard", response_model=FounderDashboardResponse)
def get_founder_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    is_founder(current_user)

    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)

    # 1. Total Users
    total_users = db.query(User).count()

    # 2. Active Users Today (any event in last 24h)
    active_users_today = db.query(AnalyticsEvent.user_id)\
        .filter(AnalyticsEvent.created_at >= today_start)\
        .filter(AnalyticsEvent.user_id.isnot(None))\
        .distinct().count()

    # 3. XP Earned Today (sum from events with 'gain_xp')
    xp_earned_today = 0
    xp_events = db.query(AnalyticsEvent.details)\
        .filter(AnalyticsEvent.event_type == "gain_xp")\
        .filter(AnalyticsEvent.created_at >= today_start).all()
    for row in xp_events:
        d = safe_parse_json(row[0])
        xp_earned_today += d.get("amount", 0)

    # 4. Telemetry events mapping for complex stats
    all_events = db.query(AnalyticsEvent).all()
    
    # 5. Calculate Most Failed Lesson
    # Parse lesson_start and lesson_complete events
    starts_by_lesson = {}
    completes_by_lesson = {}
    for ev in all_events:
        if ev.event_type == "lesson_start":
            d = safe_parse_json(ev.details)
            l_id = d.get("lesson_id")
            if l_id:
                starts_by_lesson[l_id] = starts_by_lesson.get(l_id, 0) + 1
        elif ev.event_type == "lesson_complete":
            d = safe_parse_json(ev.details)
            l_id = d.get("lesson_id")
            if l_id:
                completes_by_lesson[l_id] = completes_by_lesson.get(l_id, 0) + 1

    most_failed_lesson = None
    min_success_rate = 1.1
    for l_id, starts in starts_by_lesson.items():
        completes = completes_by_lesson.get(l_id, 0)
        rate = completes / starts if starts > 0 else 0
        if rate < min_success_rate:
            min_success_rate = rate
            most_failed_lesson = {
                "lesson_id": l_id,
                "attempts": starts,
                "success_rate": round(rate * 100, 1)
            }

    # 6. Calculate Most Failed Boss
    attempts_by_boss = {}
    victories_by_boss = {}
    for ev in all_events:
        if ev.event_type == "boss_attempt":
            d = safe_parse_json(ev.details)
            b_title = d.get("boss_title") or d.get("boss_id")
            if b_title:
                attempts_by_boss[b_title] = attempts_by_boss.get(b_title, 0) + 1
        elif ev.event_type == "boss_victory":
            d = safe_parse_json(ev.details)
            b_title = d.get("boss_title") or d.get("boss_id")
            if b_title:
                victories_by_boss[b_title] = victories_by_boss.get(b_title, 0) + 1

    most_failed_boss = None
    min_boss_rate = 1.1
    for b_title, attempts in attempts_by_boss.items():
        vics = victories_by_boss.get(b_title, 0)
        rate = vics / attempts if attempts > 0 else 0
        if rate < min_boss_rate:
            min_boss_rate = rate
            most_failed_boss = {
                "boss_title": b_title,
                "attempts": attempts,
                "success_rate": round(rate * 100, 1)
            }

    # 7. Most Viewed Concept
    concept_views = {}
    for ev in all_events:
        if ev.event_type == "concept_view":
            d = safe_parse_json(ev.details)
            c_id = d.get("concept_id")
            if c_id:
                concept_views[c_id] = concept_views.get(c_id, 0) + 1
    most_viewed_concept = None
    if concept_views:
        best_c = max(concept_views, key=concept_views.get)
        most_viewed_concept = {"concept_id": best_c, "views": concept_views[best_c]}

    # 8. AI Mentor Requests
    mentor_requests_total = db.query(AnalyticsEvent)\
        .filter(AnalyticsEvent.event_type == "mentor_request").count()

    # 9. Simple 1-day Retention:
    # Users registered before today who are active today / total registered before today
    registered_before_today = db.query(User).filter(User.created_at < today_start).count()
    active_retained_today = db.query(AnalyticsEvent.user_id)\
        .join(User, AnalyticsEvent.user_id == User.id)\
        .filter(User.created_at < today_start)\
        .filter(AnalyticsEvent.created_at >= today_start)\
        .distinct().count()
    retention_rate = (active_retained_today / registered_before_today) if registered_before_today > 0 else 1.0

    # 10. Funnel Progression
    # Funnel: Register -> First Lesson -> First Region Complete -> First Boss Complete -> Memory Vault Usage -> Region 12 Arrival
    funnel_register = total_users
    funnel_first_lesson = db.query(AnalyticsEvent.user_id)\
        .filter(AnalyticsEvent.event_type.in_(["lesson_start", "lesson_complete"]))\
        .distinct().count()
    funnel_first_region = db.query(RegionProgress.user_id)\
        .filter(RegionProgress.status == "completed")\
        .distinct().count()
    funnel_first_boss = db.query(RegionProgress.user_id)\
        .filter(RegionProgress.boss_defeated == True)\
        .distinct().count()
    funnel_vault_usage = db.query(Revision.user_id).distinct().count()
    funnel_region_12 = db.query(RegionProgress.user_id)\
        .filter(RegionProgress.region_id == "iterator-isles")\
        .distinct().count()

    user_funnel = {
        "register": funnel_register,
        "first_lesson": funnel_first_lesson,
        "first_region_complete": funnel_first_region,
        "first_boss_complete": funnel_first_boss,
        "memory_vault_usage": funnel_vault_usage,
        "region_12_arrival": funnel_region_12
    }

    # 11. Dropoff Report
    # Compile a lists of lessons to return dropoff metrics
    # Pre-populate lessons
    lessons_list = ["v-basic-syntax", "v-data-types", "v-naming-rules", "v-memory-model", "v-dynamic-typing",
                    "l-for-loops", "l-while-loops", "l-range", "l-nested-loops", "l-control-flow",
                    "i1", "i2", "i3", "i4"]
    dropoff_report = []
    for l_id in lessons_list:
        starts = starts_by_lesson.get(l_id, 0)
        completes = completes_by_lesson.get(l_id, 0)
        
        # Calculate avg completion time
        durations = []
        for ev in all_events:
            if ev.event_type == "lesson_complete":
                d = safe_parse_json(ev.details)
                if d.get("lesson_id") == l_id and "duration_seconds" in d:
                    durations.append(d["duration_seconds"])
        avg_dur = int(sum(durations) / len(durations)) if durations else 0

        dropoff_report.append({
            "lesson_id": l_id,
            "attempts": starts,
            "success_rate": round((completes / starts * 100), 1) if starts > 0 else 100.0,
            "avg_duration": avg_dur
        })

    lesson_completion_modal_viewed_count = db.query(AnalyticsEvent)\
        .filter(AnalyticsEvent.event_type == "lesson_completion_modal_viewed").count()
    next_lesson_clicked_count = db.query(AnalyticsEvent)\
        .filter(AnalyticsEvent.event_type == "next_lesson_clicked").count()
    return_to_map_clicked_count = db.query(AnalyticsEvent)\
        .filter(AnalyticsEvent.event_type == "return_to_map_clicked").count()

    # Sprint 18: Cohort Retention Calculations (D1, D3, D7)
    d1_denom = 0
    d1_num = 0
    d3_denom = 0
    d3_num = 0
    d7_denom = 0
    d7_num = 0

    all_users = db.query(User).all()
    for u in all_users:
        signup_time = u.created_at
        if signup_time.tzinfo is not None:
            signup_time = signup_time.replace(tzinfo=None)
        age_days = (now - signup_time).total_seconds() / 86400

        if age_days >= 1:
            d1_denom += 1
            has_d1_event = db.query(AnalyticsEvent).filter(
                AnalyticsEvent.user_id == u.id,
                AnalyticsEvent.created_at >= signup_time + timedelta(days=1),
                AnalyticsEvent.created_at <= signup_time + timedelta(days=2)
            ).first() is not None
            if has_d1_event:
                d1_num += 1

        if age_days >= 3:
            d3_denom += 1
            has_d3_event = db.query(AnalyticsEvent).filter(
                AnalyticsEvent.user_id == u.id,
                AnalyticsEvent.created_at >= signup_time + timedelta(days=3),
                AnalyticsEvent.created_at <= signup_time + timedelta(days=4)
            ).first() is not None
            if has_d3_event:
                d3_num += 1

        if age_days >= 7:
            d7_denom += 1
            has_d7_event = db.query(AnalyticsEvent).filter(
                AnalyticsEvent.user_id == u.id,
                AnalyticsEvent.created_at >= signup_time + timedelta(days=7),
                AnalyticsEvent.created_at <= signup_time + timedelta(days=8)
            ).first() is not None
            if has_d7_event:
                d7_num += 1

    retention_d1 = round((d1_num / d1_denom * 100.0) if d1_denom > 0 else 0.0, 1)
    retention_d3 = round((d3_num / d3_denom * 100.0) if d3_denom > 0 else 0.0, 1)
    retention_d7 = round((d7_num / d7_denom * 100.0) if d7_denom > 0 else 0.0, 1)

    # Sprint 18: Activation Funnel Calculations
    total_users_count = len(all_users)
    users_started_lesson = db.query(AnalyticsEvent.user_id).filter(AnalyticsEvent.event_type == "lesson_start").distinct().count()
    users_completed_lesson = db.query(AnalyticsEvent.user_id).filter(AnalyticsEvent.event_type == "lesson_complete").distinct().count()
    users_entered_training = db.query(AnalyticsEvent.user_id).filter(AnalyticsEvent.event_type == "training_ground_enter").distinct().count()
    users_boss = db.query(AnalyticsEvent.user_id).filter(AnalyticsEvent.event_type.in_(["boss_attempt", "boss_victory"])).distinct().count()

    activation_signup_to_lesson = round((users_started_lesson / total_users_count * 100.0) if total_users_count > 0 else 0.0, 1)
    activation_lesson_to_completion = round((users_completed_lesson / users_started_lesson * 100.0) if users_started_lesson > 0 else 0.0, 1)
    activation_completion_to_training = round((users_entered_training / users_completed_lesson * 100.0) if users_completed_lesson > 0 else 0.0, 1)
    activation_training_to_boss = round((users_boss / users_entered_training * 100.0) if users_entered_training > 0 else 0.0, 1)

    # Sprint 18: Engagement Calculations
    session_end_events = db.query(AnalyticsEvent.details).filter(AnalyticsEvent.event_type == "session_ended").all()
    session_durations = []
    for row in session_end_events:
        d = safe_parse_json(row[0])
        if "duration_seconds" in d:
            session_durations.append(d["duration_seconds"])
    avg_session_length = round((sum(session_durations) / len(session_durations)) if session_durations else 0.0, 1)

    total_lesson_completes = db.query(AnalyticsEvent).filter(AnalyticsEvent.event_type == "lesson_complete").count()
    lessons_per_user = round((total_lesson_completes / total_users_count) if total_users_count > 0 else 0.0, 1)

    total_mentor_requests = db.query(AnalyticsEvent).filter(AnalyticsEvent.event_type == "mentor_request").count()
    mentor_queries_per_user = round((total_mentor_requests / total_users_count) if total_users_count > 0 else 0.0, 1)

    total_vault_reviews = db.query(AnalyticsEvent).filter(AnalyticsEvent.event_type == "memory_vault_review").count()
    vault_reviews_per_user = round((total_vault_reviews / total_users_count) if total_users_count > 0 else 0.0, 1)

    # Sprint 18: Dropoff Calculations
    completed_region_no_return_count = 0
    region_completes = db.query(RegionProgress).filter(RegionProgress.status == "completed").all()
    for rc in region_completes:
        comp_time = rc.completed_at or now - timedelta(days=2)
        if comp_time.tzinfo is not None:
            comp_time = comp_time.replace(tzinfo=None)
        returned_event = db.query(AnalyticsEvent).filter(
            AnalyticsEvent.user_id == rc.user_id,
            AnalyticsEvent.created_at >= comp_time + timedelta(days=1)
        ).first()
        if not returned_event:
            completed_region_no_return_count += 1

    dropoffs = {
        "registered_no_lesson": max(0, total_users_count - users_started_lesson),
        "started_no_complete": max(0, users_started_lesson - users_completed_lesson),
        "completed_no_training": max(0, users_completed_lesson - users_entered_training),
        "completed_region_no_return": completed_region_no_return_count
    }

    # Sprint 18: Friction Calculations
    friction_lesson_exit_rates = []
    for l_id, starts in starts_by_lesson.items():
        completes = completes_by_lesson.get(l_id, 0)
        exits = max(0, starts - completes)
        rate = (exits / starts * 100.0) if starts > 0 else 0.0
        friction_lesson_exit_rates.append({
            "lesson_id": l_id,
            "starts": starts,
            "completes": completes,
            "exit_rate": round(rate, 1)
        })
    friction_lesson_exit_rates.sort(key=lambda x: x["exit_rate"], reverse=True)
    friction_lesson_exit_rates = friction_lesson_exit_rates[:10]

    from app.models.user import ChallengeProgress
    all_challenges = db.query(ChallengeProgress).all()
    challenge_stats = {}
    for cp in all_challenges:
        c_id = cp.challenge_id
        if c_id not in challenge_stats:
            challenge_stats[c_id] = {"attempts": 0, "failures": 0}
        challenge_stats[c_id]["attempts"] += cp.attempts or 0
        if cp.completed:
            challenge_stats[c_id]["failures"] += max(0, (cp.attempts or 1) - 1)
        else:
            challenge_stats[c_id]["failures"] += cp.attempts or 0

    friction_quiz_failure_rates = []
    for c_id, stats in challenge_stats.items():
        total = stats["attempts"]
        fails = stats["failures"]
        rate = (fails / total * 100.0) if total > 0 else 0.0
        friction_quiz_failure_rates.append({
            "challenge_id": c_id,
            "attempts": total,
            "failures": fails,
            "failure_rate": round(rate, 1)
        })
    friction_quiz_failure_rates.sort(key=lambda x: x["failure_rate"], reverse=True)
    friction_quiz_failure_rates = friction_quiz_failure_rates[:10]

    prompt_counts = {}
    mentor_events = db.query(AnalyticsEvent.details).filter(AnalyticsEvent.event_type == "mentor_request").all()
    for row in mentor_events:
        d = safe_parse_json(row[0])
        prompt = d.get("prompt") or d.get("message") or d.get("query") or "General Help"
        prompt_counts[prompt] = prompt_counts.get(prompt, 0) + 1

    friction_mentor_prompts = [
        {"prompt": prompt, "count": count}
        for prompt, count in prompt_counts.items()
    ]
    friction_mentor_prompts.sort(key=lambda x: x["count"], reverse=True)
    friction_mentor_prompts = friction_mentor_prompts[:10]

    concept_counts = {}
    concept_events = db.query(AnalyticsEvent.details).filter(AnalyticsEvent.event_type == "concept_view").all()
    for row in concept_events:
        d = safe_parse_json(row[0])
        c_id = d.get("concept_id")
        if c_id:
            concept_counts[c_id] = concept_counts.get(c_id, 0) + 1

    friction_revisited_concepts = [
        {"concept_id": c_id, "views": count}
        for c_id, count in concept_counts.items()
    ]
    friction_revisited_concepts.sort(key=lambda x: x["views"], reverse=True)
    friction_revisited_concepts = friction_revisited_concepts[:10]

    # Sprint 18: User Journeys Timeline
    recent_events = db.query(AnalyticsEvent).order_by(AnalyticsEvent.created_at.desc()).limit(150).all()
    user_journeys_map = {}
    for ev in recent_events:
        u_name = "Guest"
        if ev.user_id:
            u = db.query(User).filter(User.id == ev.user_id).first()
            if u:
                u_name = u.username
        if u_name not in user_journeys_map:
            user_journeys_map[u_name] = []
        
        d = safe_parse_json(ev.details)
        detail_summary = ""
        if ev.event_type == "lesson_start" or ev.event_type == "lesson_complete":
            detail_summary = d.get("lesson_id") or ""
        elif ev.event_type == "class_selected":
            detail_summary = d.get("class") or ""
        elif ev.event_type == "session_ended":
            detail_summary = f"{round((d.get('duration_seconds') or 0)/60, 1)}m"
        elif ev.event_type == "exit_survey_submitted":
            detail_summary = f"Survey: {d.get('reason')}"
        elif ev.event_type == "beta_feedback_submitted":
            detail_summary = f"Feedback: {d.get('feedback_type')}"
        
        if len(user_journeys_map[u_name]) < 8:
            user_journeys_map[u_name].append({
                "timestamp": ev.created_at.strftime("%H:%M"),
                "event": ev.event_type,
                "summary": detail_summary
            })
            
    user_journeys = [
        {"username": u_name, "timeline": list(reversed(timeline))}
        for u_name, timeline in user_journeys_map.items()
    ]

    return FounderDashboardResponse(
        total_users=total_users,
        active_users_today=active_users_today,
        xp_earned_today=xp_earned_today,
        most_failed_lesson=most_failed_lesson,
        most_failed_boss=most_failed_boss,
        most_viewed_concept=most_viewed_concept,
        mentor_requests_total=mentor_requests_total,
        retention_rate=round(retention_rate, 1),
        user_funnel=user_funnel,
        dropoff_report=dropoff_report,
        lesson_completion_modal_viewed_count=lesson_completion_modal_viewed_count,
        next_lesson_clicked_count=next_lesson_clicked_count,
        return_to_map_clicked_count=return_to_map_clicked_count,
        retention_d1=retention_d1,
        retention_d3=retention_d3,
        retention_d7=retention_d7,
        activation_signup_to_lesson=activation_signup_to_lesson,
        activation_lesson_to_completion=activation_lesson_to_completion,
        activation_completion_to_training=activation_completion_to_training,
        activation_training_to_boss=activation_training_to_boss,
        avg_session_length=avg_session_length,
        lessons_per_user=lessons_per_user,
        mentor_queries_per_user=mentor_queries_per_user,
        vault_reviews_per_user=vault_reviews_per_user,
        dropoffs=dropoffs,
        friction_lesson_exit_rates=friction_lesson_exit_rates,
        friction_quiz_failure_rates=friction_quiz_failure_rates,
        friction_mentor_prompts=friction_mentor_prompts,
        friction_revisited_concepts=friction_revisited_concepts,
        user_journeys=user_journeys
    )

@router.get("/admin-panel", response_model=BetaAdminPanelResponse)
def get_admin_panel(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    is_founder(current_user)

    three_days_ago = datetime.utcnow() - timedelta(days=3)

    # 1. Stuck Users: Registered but zero activity in the last 3 days
    # Let's fetch all users, check their latest event timestamp
    users = db.query(User).all()
    stuck_users = []
    for u in users:
        # Exclude founder / admin themselves
        if u.username in ("founder", "admin"):
            continue
        last_event = db.query(AnalyticsEvent)\
            .filter(AnalyticsEvent.user_id == u.id)\
            .order_by(AnalyticsEvent.created_at.desc()).first()
        
        last_active = last_event.created_at if last_event else u.created_at
        
        if last_active < three_days_ago:
            lvl = u.stats.current_level if u.stats else 1
            # Current region (first that is available or complete)
            cur_region = "variables-forest"
            if u.regions:
                # Find the highest order available region
                unlocked_regions = [r for r in u.regions if r.status in ("available", "active", "completed")]
                if unlocked_regions:
                    # Sort or pick last
                    cur_region = unlocked_regions[-1].region_id

            stuck_users.append(StuckUser(
                username=u.username,
                current_level=lvl,
                current_region=cur_region,
                last_active=last_active
            ))

    # 2. Difficult Concepts: viewed concepts and their AI mentor queries count
    concepts = ["variables", "data-types", "naming-rules", "loops", "generators", "iteration-protocol", "infinite-streams"]
    difficult_concepts = []
    for c_id in concepts:
        views = db.query(AnalyticsEvent)\
            .filter(AnalyticsEvent.event_type == "concept_view")\
            .filter(AnalyticsEvent.details.like(f'%"{c_id}"%')).count()
        mentor_chats = db.query(AnalyticsEvent)\
            .filter(AnalyticsEvent.event_type == "mentor_request")\
            .filter(AnalyticsEvent.details.like(f'%"{c_id}"%')).count()
        difficult_concepts.append(DifficultConcept(
            concept_id=c_id,
            views=views,
            mentor_chats=mentor_chats
        ))
    difficult_concepts.sort(key=lambda x: (x.mentor_chats, x.views), reverse=True)

    # 3. Difficult Regions: completion and boss fail rate
    regions = ["variables-forest", "loops-desert", "iterator-isles"]
    difficult_regions = []
    for r_id in regions:
        # completion rate: users completed / total users unlocked
        unlocked = db.query(RegionProgress).filter(RegionProgress.region_id == r_id).count()
        completed = db.query(RegionProgress).filter(and_(RegionProgress.region_id == r_id, RegionProgress.status == "completed")).count()
        completion_rate = (completed / unlocked * 100.0) if unlocked > 0 else 100.0

        # boss fail rate: boss attempts vs victories
        boss_attempts = db.query(AnalyticsEvent)\
            .filter(AnalyticsEvent.event_type == "boss_attempt")\
            .filter(AnalyticsEvent.details.like(f'%"{r_id}"%')).count()
        boss_vics = db.query(AnalyticsEvent)\
            .filter(AnalyticsEvent.event_type == "boss_victory")\
            .filter(AnalyticsEvent.details.like(f'%"{r_id}"%')).count()
        boss_fails = boss_attempts - boss_vics
        boss_fail_rate = (boss_fails / boss_attempts * 100.0) if boss_attempts > 0 else 0.0

        difficult_regions.append(DifficultRegion(
            region_id=r_id,
            completion_rate=round(completion_rate, 1),
            boss_fail_rate=round(boss_fail_rate, 1)
        ))

    # 4. Bug Reports list
    bug_records = db.query(BugReport).order_by(BugReport.created_at.desc()).all()
    bug_reports = []
    for br in bug_records:
        username = db.query(User.username).filter(User.id == br.user_id).scalar() or "Unknown"
        bug_reports.append(BugReportResponse(
            id=br.id,
            user_id=br.user_id,
            username=username,
            category=br.category,
            description=br.description,
            context_info=br.context_info,
            created_at=br.created_at
        ))

    return BetaAdminPanelResponse(
        stuck_users=stuck_users,
        difficult_concepts=difficult_concepts,
        difficult_regions=difficult_regions,
        bug_reports=bug_reports
    )
