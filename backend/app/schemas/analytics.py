from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from datetime import datetime

class AnalyticsEventCreate(BaseModel):
    event_type: str
    details: Optional[Any] = None

class LessonFeedbackCreate(BaseModel):
    region_id: str
    lesson_id: str
    helpful: bool

class BugReportCreate(BaseModel):
    category: str  # 'lesson', 'content', 'ui'
    description: str
    context_info: Optional[str] = None

class BugReportResponse(BaseModel):
    id: int
    user_id: int
    username: str
    category: str
    description: str
    context_info: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class StuckUser(BaseModel):
    username: str
    current_level: int
    current_region: str
    last_active: datetime

class DifficultConcept(BaseModel):
    concept_id: str
    views: int
    mentor_chats: int

class DifficultRegion(BaseModel):
    region_id: str
    completion_rate: float
    boss_fail_rate: float

class BetaFeedbackCreate(BaseModel):
    feedback_type: str  # 'bug', 'feature_request', 'content', 'general'
    description: str
    context_info: Optional[str] = None

class BetaFeedbackResponse(BaseModel):
    id: int
    user_id: int
    username: str
    feedback_type: str
    description: str
    context_info: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ExitSurveyCreate(BaseModel):
    reason: str
    details: Optional[str] = None
    context: str

class ExitSurveyResponseSchema(BaseModel):
    id: int
    user_id: Optional[int]
    reason: str
    details: Optional[str]
    context: str
    created_at: datetime

    class Config:
        from_attributes = True

class BetaAdminPanelResponse(BaseModel):
    stuck_users: List[StuckUser]
    difficult_concepts: List[DifficultConcept]
    difficult_regions: List[DifficultRegion]
    bug_reports: List[BugReportResponse]

class FounderDashboardResponse(BaseModel):
    total_users: int
    active_users_today: int
    xp_earned_today: int
    most_failed_lesson: Optional[Dict[str, Any]] = None
    most_failed_boss: Optional[Dict[str, Any]] = None
    most_viewed_concept: Optional[Dict[str, Any]] = None
    mentor_requests_total: int
    retention_rate: float
    user_funnel: Dict[str, int]
    dropoff_report: List[Dict[str, Any]]
    lesson_completion_modal_viewed_count: int = 0
    next_lesson_clicked_count: int = 0
    return_to_map_clicked_count: int = 0

    # Retention Metrics
    retention_d1: float = 0.0
    retention_d3: float = 0.0
    retention_d7: float = 0.0

    # Activation Metrics
    activation_signup_to_lesson: float = 0.0
    activation_lesson_to_completion: float = 0.0
    activation_completion_to_training: float = 0.0
    activation_training_to_boss: float = 0.0

    # Engagement Metrics
    avg_session_length: float = 0.0
    lessons_per_user: float = 0.0
    mentor_queries_per_user: float = 0.0
    vault_reviews_per_user: float = 0.0

    # Dropoffs
    dropoffs: Dict[str, int] = {}

    # Friction Reports
    friction_lesson_exit_rates: List[Dict[str, Any]] = []
    friction_quiz_failure_rates: List[Dict[str, Any]] = []
    friction_mentor_prompts: List[Dict[str, Any]] = []
    friction_revisited_concepts: List[Dict[str, Any]] = []

    # User Journeys timeline
    user_journeys: List[Dict[str, Any]] = []
