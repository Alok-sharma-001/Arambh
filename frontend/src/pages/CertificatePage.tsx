import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, ShieldCheck, Printer, Share2, Sparkles, ArrowLeft } from 'lucide-react';
import { certificatesApi, CertificateData } from '../services/certificatesApi';

export default function CertificatePage() {
  const { certId } = useParams<{ certId?: string }>();
  const navigate = useNavigate();
  const [cert, setCert] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    fetchCert();
  }, [certId]);

  const fetchCert = async () => {
    try {
      setLoading(true);
      if (certId) {
        const data = await certificatesApi.verifyCertificate(certId);
        setCert(data);
      } else {
        const data = await certificatesApi.generateCertificate();
        setCert(data);
      }
    } catch (err) {
      console.error('Failed to load certificate:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (cert) {
      const shareUrl = `${window.location.origin}/certificate/verify/${cert.certificate_id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6">
        <div className="animate-spin w-8 h-8 border-2 border-[#c8a45e] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6 text-slate-300">
        <div className="text-center space-y-4">
          <p>Certificate not found or invalid ID.</p>
          <button onClick={() => navigate('/world-map')} className="px-4 py-2 bg-slate-800 rounded-lg text-xs font-semibold">
            Return to World Map
          </button>
        </div>
      </div>
    );
  }

  const issueDateStr = new Date(cert.issued_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 p-4 md:p-12 relative print:bg-white print:text-black print:p-0">
      {/* Action Header (Hidden in Print) */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-8 print:hidden">
        <button
          onClick={() => navigate('/world-map')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Realm
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            <Share2 size={14} />
            {copied ? 'Link Copied!' : 'Share Certificate'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c8a45e] hover:bg-[#b8944e] text-[#0a0a0c] text-xs font-bold transition-all shadow-lg shadow-[#c8a45e]/20"
          >
            <Printer size={14} />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Certificate Frame */}
      <div className="max-w-4xl mx-auto bg-[#12131a] border-4 border-[#c8a45e] rounded-3xl p-8 md:p-16 relative shadow-2xl overflow-hidden print:border-8 print:border-[#c8a45e] print:shadow-none print:bg-white">
        {/* Background Emblem */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none print:opacity-10">
          <Award className="w-[500px] h-[500px] text-[#c8a45e]" />
        </div>

        {/* Outer Border Decor */}
        <div className="border-2 border-[#c8a45e]/40 p-6 md:p-12 rounded-2xl relative z-10 space-y-8 text-center print:border-black">
          {/* Header Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c8a45e]/15 border border-[#c8a45e]/40 text-[#c8a45e] text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles size={14} /> Official Certificate of Mastery
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#fcfbf7] font-serif tracking-tight print:text-black">
              ARAMBH PYTHON ACADEMY
            </h1>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#c8a45e]">
              Dark Fantasy Realm of Code
            </p>
          </div>

          <p className="text-slate-400 text-sm italic font-serif print:text-gray-600">
            This certificate is proudly awarded to
          </p>

          {/* Student Name */}
          <div className="py-2 border-b-2 border-[#c8a45e]/50 max-w-lg mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#c8a45e] font-serif tracking-wide print:text-black">
              {cert.username}
            </h2>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl mx-auto print:text-black">
            For successfully demonstrating complete computational thinking and line-by-line memory debugging mastery across all 12 regions of the Python Realm.
          </p>

          {/* Course Name */}
          <div className="text-lg font-bold text-[#fcfbf7] font-serif tracking-wide print:text-black">
            {cert.course_name}
          </div>

          {/* Footer Grid */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 print:border-gray-300">
            <div className="text-left space-y-1">
              <div className="text-xs text-slate-400 print:text-gray-600">Certificate ID</div>
              <div className="font-mono text-sm font-bold text-[#c8a45e]">{cert.certificate_id}</div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck size={16} /> Verified Authentic
            </div>

            <div className="text-right space-y-1">
              <div className="text-xs text-slate-400 print:text-gray-600">Date Issued</div>
              <div className="text-sm font-semibold text-slate-200 print:text-black">{issueDateStr}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
