import api from './api';

export interface AnalyticsEventPayload {
  event_type: string;
  details?: any;
}

export interface LessonFeedbackPayload {
  region_id: string;
  lesson_id: string;
  helpful: boolean;
}

export interface BugReportPayload {
  category: string;
  description: string;
  context_info?: string;
}

export interface StuckUser {
  username: string;
  current_level: number;
  current_region: string;
  last_active: string;
}

export interface DifficultConcept {
  concept_id: string;
  views: number;
  mentor_chats: number;
}

export interface DifficultRegion {
  region_id: string;
  completion_rate: number;
  boss_fail_rate: number;
}

export interface BugReportResponse {
  id: number;
  user_id: number;
  username: string;
  category: string;
  description: string;
  context_info: string | null;
  created_at: string;
}

export interface BetaAdminPanelResponse {
  stuck_users: StuckUser[];
  difficult_concepts: DifficultConcept[];
  difficult_regions: DifficultRegion[];
  bug_reports: BugReportResponse[];
}

export interface BetaFeedbackPayload {
  feedback_type: string;  // 'bug', 'feature_request', 'content', 'general'
  description: string;
  context_info?: string;
}

export interface ExitSurveyPayload {
  reason: string;
  details?: string;
  context: string;
}

export interface FounderDashboardResponse {
  total_users: number;
  active_users_today: number;
  xp_earned_today: number;
  most_failed_lesson: { lesson_id: string; attempts: number; success_rate: number } | null;
  most_failed_boss: { boss_title: string; attempts: number; success_rate: number } | null;
  most_viewed_concept: { concept_id: string; views: number } | null;
  mentor_requests_total: number;
  retention_rate: number;
  user_funnel: Record<string, number>;
  dropoff_report: { lesson_id: string; attempts: number; success_rate: number; avg_duration: number }[];
  lesson_completion_modal_viewed_count: number;
  next_lesson_clicked_count: number;
  return_to_map_clicked_count: number;

  retention_d1: number;
  retention_d3: number;
  retention_d7: number;

  activation_signup_to_lesson: number;
  activation_lesson_to_completion: number;
  activation_completion_to_training: number;
  activation_training_to_boss: number;

  avg_session_length: number;
  lessons_per_user: number;
  mentor_queries_per_user: number;
  vault_reviews_per_user: number;

  dropoffs: Record<string, number>;

  friction_lesson_exit_rates: { lesson_id: string; starts: number; completes: number; exit_rate: number }[];
  friction_quiz_failure_rates: { challenge_id: string; attempts: number; failures: number; failure_rate: number }[];
  friction_mentor_prompts: { prompt: string; count: number }[];
  friction_revisited_concepts: { concept_id: string; views: number }[];

  user_journeys: { username: string; timeline: { timestamp: string; event: string; summary: string }[] }[];
}

export const analyticsApi = {
  logEvent: async (eventType: string, details?: any) => {
    try {
      await api.post('/analytics/event', { event_type: eventType, details });
    } catch (error) {
      console.error('Failed to log event:', eventType, error);
    }
  },

  submitFeedback: async (payload: LessonFeedbackPayload) => {
    const response = await api.post('/analytics/feedback', payload);
    return response.data;
  },

  submitBugReport: async (payload: BugReportPayload) => {
    const response = await api.post('/analytics/bug-report', payload);
    return response.data;
  },

  submitBetaFeedback: async (payload: BetaFeedbackPayload) => {
    const response = await api.post('/analytics/beta-feedback', payload);
    return response.data;
  },

  submitExitSurvey: async (payload: ExitSurveyPayload) => {
    const response = await api.post('/analytics/exit-survey', payload);
    return response.data;
  },

  getFounderDashboard: async (): Promise<FounderDashboardResponse> => {
    const response = await api.get('/analytics/founder-dashboard');
    return response.data;
  },

  getAdminPanel: async (): Promise<BetaAdminPanelResponse> => {
    const response = await api.get('/analytics/admin-panel');
    return response.data;
  },
};
