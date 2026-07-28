import api from './api';

export interface CertificateData {
  certificate_id: string;
  username: string;
  course_name: string;
  issued_at: string;
  verified: boolean;
}

export const certificatesApi = {
  generateCertificate: async (): Promise<CertificateData> => {
    const res = await api.post<CertificateData>('/certificates/generate');
    return res.data;
  },

  verifyCertificate: async (certId: string): Promise<CertificateData> => {
    const res = await api.get<CertificateData>(`/certificates/verify/${certId}`);
    return res.data;
  }
};
