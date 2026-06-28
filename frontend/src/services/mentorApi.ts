import api from './api';

export interface MentorMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  code_snapshot?: string;
  created_at: string;
}

export interface ConversationResponse {
  id: number;
  concept_id?: string;
  lesson_id?: string;
  created_at: string;
  messages: MentorMessage[];
}

export const mentorApi = {
  createConversation: async (conceptId?: string, lessonId?: string): Promise<ConversationResponse> => {
    const response = await api.post('/v1/mentor/conversation', {
      concept_id: conceptId,
      lesson_id: lessonId,
    });
    return response.data;
  },

  getConversation: async (conversationId: number): Promise<ConversationResponse> => {
    const response = await api.get(`/v1/mentor/conversation/${conversationId}`);
    return response.data;
  },

  sendMessage: async (
    conversationId: number,
    message: string,
    codeContext?: string
  ): Promise<MentorMessage> => {
    const response = await api.post('/v1/mentor/chat', {
      conversation_id: conversationId,
      message,
      code_context: codeContext,
    });
    return response.data;
  },
};
