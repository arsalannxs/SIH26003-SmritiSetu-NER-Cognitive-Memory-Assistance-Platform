import React from 'react';
import { GameType, Language, PatientProfile } from '../types';
import { translations } from '../translations';
import { adaptiveDifficultyEngine } from '../services/adaptiveDifficulty';
import { 
  Sparkles, 
  Layers, 
  CalendarClock, 
  Eye, 
  Grid, 
  Target, 
  Camera, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface GamesMenuProps {
  patient: PatientProfile;
  language: Language;
  onSelectGame: (game: GameType) => void;
  onBack: () => void;
}

export const GamesMenu: React.FC<GamesMenuProps> = ({
  patient,
  language,
  onSelectGame,
  onBack,
}) => {
  const t = translations[language];
  const difficultyLabel = adaptiveDifficultyEngine.getDifficultyLabel(patient.currentDifficulty);

  const games = [
    {
      type: 'memory_match' as GameType,
      title: t.games.memoryMatchTitle,
      desc: t.games.memoryMatchDesc,
      icon: Layers,
      bg: 'from-amber-500 to-amber-600',
      badge: 'NER Culture & Nature',
    },
    {
      type: 'routine_sequence' as GameType,
      title: t.games.routineSequenceTitle,
      desc: t.games.routineSequenceDesc,
      icon: CalendarClock,
      bg: 'from-emerald-500 to-emerald-600',
      badge: 'Daily Recall',
    },
    {
      type: 'object_recognition' as GameType,
      title: t.games.objectRecognitionTitle,
      desc: t.games.objectRecognitionDesc,
      icon: Eye,
      bg: 'from-sky-500 to-sky-600',
      badge: 'Familiar Items',
    },
    {
      type: 'pattern' as GameType,
      title: t.games.patternTitle,
      desc: t.games.patternDesc,
      icon: Grid,
      bg: 'from-indigo-500 to-indigo-600',
      badge: 'Gentle Logic',
    },
    {
      type: 'attention' as GameType,
      title: t.games.attentionTitle,
      desc: t.games.attentionDesc,
      icon: Target,
      bg: 'from-teal-500 to-teal-600',
      badge: 'Visual Focus',
    },
    {
      type: 'family_photo' as GameType,
      title: t.games.familyPhotoTitle,
      desc: t.games.familyPhotoDesc,
      icon: Camera,
      bg: 'from-rose-500 to-rose-600',
      badge: 'Loving Reminiscence',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-32 animate-fade-in">
      {/* Top Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-extrabold text-sm transition-all active:scale-95 shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.nav.back}</span>
        </button>

        {/* Adaptive Difficulty Badge */}
        <div className="flex items-center gap-1.5 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl text-amber-950 text-xs font-bold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>{t.games.level}: {difficultyLabel}</span>
        </div>
      </div>

      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">
          {t.games.title}
        </h1>
        <p className="text-sm font-semibold text-stone-600 mt-1">
          {t.games.subtitle}
        </p>
      </div>

      {/* Adaptive difficulty note */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-2 text-xs font-semibold text-emerald-900">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>{t.games.adaptiveDifficultyNotice}</span>
      </div>

      {/* Game Cards List (Ultra Large Touch Targets) */}
      <div className="grid grid-cols-1 gap-4">
        {games.map((g) => {
          const Icon = g.icon;
          return (
            <button
              key={g.type}
              onClick={() => onSelectGame(g.type)}
              className="w-full text-left p-5 rounded-3xl bg-white hover:bg-amber-50/50 border-3 border-stone-200 hover:border-amber-400 shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${g.bg} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-9 h-9" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    {g.badge}
                  </span>
                  <h3 className="text-xl font-black text-stone-900 mt-1">
                    {g.title}
                  </h3>
                  <p className="text-xs font-bold text-stone-500 line-clamp-1">
                    {g.desc}
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-stone-100 group-hover:bg-amber-500 group-hover:text-stone-950 flex items-center justify-center text-stone-500 shrink-0 transition-colors">
                <ChevronRight className="w-6 h-6" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
