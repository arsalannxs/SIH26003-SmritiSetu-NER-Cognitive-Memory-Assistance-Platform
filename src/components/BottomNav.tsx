import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { Home, Brain, Pill, Heart, Mic } from 'lucide-react';

export type PatientTab = 'home' | 'play' | 'reminders' | 'progress' | 'talk';

interface BottomNavProps {
  currentTab: PatientTab;
  setTab: (tab: PatientTab) => void;
  language: Language;
  onOpenVoice: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setTab,
  language,
  onOpenVoice,
}) => {
  const t = translations[language];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-amber-200 shadow-lg px-2 py-2 safe-area-pb">
      <div className="max-w-xl mx-auto flex items-center justify-around gap-1">
        {/* Home */}
        <button
          onClick={() => setTab('home')}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all active:scale-95 ${
            currentTab === 'home'
              ? 'bg-amber-100 text-amber-900 font-extrabold shadow-inner'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <Home className={`w-7 h-7 mb-1 ${currentTab === 'home' ? 'text-amber-700 stroke-[2.5]' : 'stroke-[2]'}`} />
          <span className="text-sm font-bold tracking-tight leading-none">
            {t.nav.home}
          </span>
        </button>

        {/* Play (Games) */}
        <button
          onClick={() => setTab('play')}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all active:scale-95 ${
            currentTab === 'play'
              ? 'bg-emerald-100 text-emerald-950 font-extrabold shadow-inner'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <Brain className={`w-7 h-7 mb-1 ${currentTab === 'play' ? 'text-emerald-700 stroke-[2.5]' : 'stroke-[2]'}`} />
          <span className="text-sm font-bold tracking-tight leading-none">
            {t.nav.play}
          </span>
        </button>

        {/* Big Center Talk Button */}
        <button
          onClick={onOpenVoice}
          className="flex-1 flex flex-col items-center justify-center -mt-5 py-2 px-1 rounded-3xl bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md border-4 border-white transition-all active:scale-95"
          aria-label={t.nav.talk}
        >
          <div className="w-10 h-10 rounded-full bg-stone-950 flex items-center justify-center text-amber-300">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-xs font-black uppercase mt-1 tracking-wider text-stone-950">
            {t.nav.talk}
          </span>
        </button>

        {/* Reminders / Medicines */}
        <button
          onClick={() => setTab('reminders')}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all active:scale-95 ${
            currentTab === 'reminders'
              ? 'bg-rose-100 text-rose-950 font-extrabold shadow-inner'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <Pill className={`w-7 h-7 mb-1 ${currentTab === 'reminders' ? 'text-rose-700 stroke-[2.5]' : 'stroke-[2]'}`} />
          <span className="text-sm font-bold tracking-tight leading-none">
            {t.nav.reminders}
          </span>
        </button>

        {/* Progress */}
        <button
          onClick={() => setTab('progress')}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all active:scale-95 ${
            currentTab === 'progress'
              ? 'bg-sky-100 text-sky-950 font-extrabold shadow-inner'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <Heart className={`w-7 h-7 mb-1 ${currentTab === 'progress' ? 'text-sky-700 stroke-[2.5]' : 'stroke-[2]'}`} />
          <span className="text-sm font-bold tracking-tight leading-none">
            {t.nav.progress}
          </span>
        </button>
      </div>
    </nav>
  );
};
