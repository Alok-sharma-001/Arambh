import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(nextLng);
    localStorage.setItem('arambh_lng', nextLng);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 transition-all"
      title="Switch Language / भाषा बदलें"
    >
      <Globe size={14} className="text-[#c8a45e]" />
      <span>{i18n.language === 'en' ? 'English' : 'हिंदी'}</span>
    </button>
  );
}
