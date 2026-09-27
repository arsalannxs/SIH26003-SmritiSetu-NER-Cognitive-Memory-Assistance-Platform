import React from 'react';
import { UserMode, Language, PatientProfile } from '../types';
import { translations } from '../translations';
import { 
  Heart, 
  User, 
  Users, 
  Stethoscope, 
  Wifi, 
  WifiOff, 
  PlayCircle, 
  Languages, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  activePatient: PatientProfile;
  isOffline: boolean;
  toggleSimulatedOffline: () => void;
  syncQueueCount: number;
  onOpenRunDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userMode,
  setUserMode,
  language,
  setLanguage,
  activePatient,
  isOffline,
  toggleSimulatedOffline,
  syncQueueCount,
  onOpenRunDemo,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      {/* Top Ministry & Prototype Status Bar */}
      <div className="bg-amber-900 text-amber-50 px-3 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="bg-amber-700/80 text-amber-200 px-1.5 py-0.5 rounded text-[10px] tracking-wide uppercase font-semibold">
            MDoNER • SIH26003
          </span>
          <span className="hidden sm:inline">Ministry of Development of North Eastern Region</span>
          <span className="text-amber-300 font-semibold">• SmritiSetu NER</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Demo Badge */}
          <span className="bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-300" />
            {t.demoBadge}
          </span>

          {/* Offline/Online toggle simulation */}
          <button
            onClick={toggleSimulatedOffline}
            title={isOffline ? 'Click to restore online connection' : 'Click to simulate offline mode'}
            className={`px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 transition-all ${
              isOffline
                ? 'bg-rose-800 text-rose-100 hover:bg-rose-700'
                : 'bg-emerald-800 text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3 h-3 text-rose-300 animate-pulse" />
                <span>OFFLINE ({syncQueueCount} queued)</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 text-emerald-300" />
                <span>ONLINE</span>
              </>
            )}
          </button>

          {/* SIH Presentation Demo Walkthrough button */}
          <button
            onClick={onOpenRunDemo}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-1 shadow-sm transition-transform active:scale-95"
          >
            <PlayCircle className="w-3.5 h-3.5 text-stone-950" />
            <span>RUN SIH DEMO</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Logo and Patient Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center shadow-xs text-white">
            <Heart className="w-6 h-6 fill-white text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-stone-900 tracking-tight leading-none">
                {t.appName}
              </h1>
              <span className="hidden md:inline-block text-xs text-stone-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {activePatient.city}, {activePatient.state}
              </span>
            </div>
            <p className="text-xs text-stone-500 line-clamp-1">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Controls: Mode Switcher & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="flex items-center bg-stone-100 rounded-xl p-0.5 border border-stone-200">
            <Languages className="w-3.5 h-3.5 text-stone-500 ml-2 hidden sm:block" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                language === 'en' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                language === 'hi' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage('as')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                language === 'as' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              অসমীয়া
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-amber-50 rounded-xl p-1 border border-amber-200">
            <button
              onClick={() => setUserMode('patient')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                userMode === 'patient'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-700 hover:text-amber-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.modes.patient}</span>
              <span className="sm:hidden">Elderly</span>
            </button>

            <button
              onClick={() => setUserMode('caregiver')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                userMode === 'caregiver'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-stone-700 hover:text-teal-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.modes.caregiver}</span>
              <span className="sm:hidden">Caregiver</span>
            </button>

            <button
              onClick={() => setUserMode('healthcare')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                userMode === 'healthcare'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'text-stone-700 hover:text-indigo-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.modes.healthcare}</span>
              <span className="sm:hidden">Field Worker</span>
            </button>
          </div>
        </div>
      </div>

      {/* Non-diagnostic Safety Disclaimer Bar */}
      <div className="bg-stone-50 border-t border-stone-200/80 px-4 py-1 text-center">
        <p className="text-[11px] text-stone-600 flex items-center justify-center gap-1.5 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{t.disclaimer}</span>
        </p>
      </div>
    </header>
  );
};
