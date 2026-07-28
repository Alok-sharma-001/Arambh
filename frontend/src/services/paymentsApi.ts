import api from './api';

export interface SubscriptionStatus {
  plan: string;
  status: string;
  is_premium: boolean;
  expires_at?: string | null;
}

export interface CreateOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  plan: string;
}

export const paymentsApi = {
  getStatus: async (): Promise<SubscriptionStatus> => {
    const res = await api.get<SubscriptionStatus>('/payments/status');
    return res.data;
  },

  createOrder: async (plan: 'monthly' | 'yearly'): Promise<CreateOrderResponse> => {
    const res = await api.post<CreateOrderResponse>('/payments/create-order', { plan });
    return res.data;
  },

  verifyPayment: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    plan: string;
  }): Promise<SubscriptionStatus> => {
    const res = await api.post<SubscriptionStatus>('/payments/verify', data);
    return res.data;
  }
};
