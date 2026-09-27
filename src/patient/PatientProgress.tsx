import React, { useEffect, useState } from 'react';
import { GameResult, Language, PatientProfile, ReminderItem } from '../types';
import { translations } from '../translations';
import { aiService } from '../services/aiService';
import { voiceService } from '../services/voiceService';
import { ArrowLeft, Brain, Sparkles, Heart, CheckCircle2, Volume2, Star, Trophy, Award } from 'lucide-react';

interface PatientProgressProps {
  patient: PatientProfile;
  gameResults: GameResult[];
  reminders: ReminderItem[];
  language: Language;
  onBack: () => void;
}

export const PatientProgress: React.FC<PatientProgressProps> = ({
  patient,
  gameResults,
  reminders,
  language,
  onBack,
}) => {
  const t = translations[language];
  const [encouragement, setEncouragement] = useState('');

  const completedGamesCount = gameResults.filter((r) => r.completed).length;
  const takenRemindersCount = reminders.filter((r) => r.taken).length;
  const totalRemindersCount = reminders.length || 1;
  const routinePercentage = Math.round((takenRemindersCount / totalRemindersCount) * 100);

  useEffect(() => {
    aiService.getEncouragingMessage(patient.name, language, 'Your Active Week').then((res) => {
      setEncouragement(res.message);
    });
  }, [language, patient.name]);

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-32 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-extrabold text-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.nav.back}</span>
        </button>

        <h1 className="text-2xl font-black text-stone-900">
          {t.progress.title}
        </h1>
      </div>

      {/* Warm Encouragement Card */}
      <div className="bg-linear-to-br from-amber-100 via-amber-50 to-orange-50 rounded-3xl p-6 border-3 border-amber-300 shadow-md space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-xs">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-stone-900">
              {t.progress.thisWeek}
            </h2>
            <p className="text-xs font-bold text-amber-900">
              You are keeping your daily mind and routine refreshed
            </p>
          </div>
        </div>

        {encouragement && (
          <div className="bg-white/95 rounded-2xl p-4 border border-amber-200 flex items-start gap-3 shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-base font-bold text-stone-800 leading-snug flex-1">
              "{encouragement}"
            </p>
            <button
              onClick={() => voiceService.speak(encouragement, language)}
              className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900"
              title="Listen aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Simple, Non-Shaming Big Progress Tiles (Req 26) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Activities Completed */}
        <div className="p-5 rounded-3xl bg-emerald-50 border-3 border-emerald-300 shadow-md text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xs">
            <Brain className="w-7 h-7" />
          </div>
          <span className="text-4xl font-black text-emerald-950 block">
            {completedGamesCount + takenRemindersCount}
          </span>
          <span className="text-xs font-extrabold text-emerald-900 block leading-tight">
            {t.progress.activitiesCompleted}
          </span>
        </div>

        {/* Mind Games Played */}
        <div className="p-5 rounded-3xl bg-amber-50 border-3 border-amber-300 shadow-md text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center mx-auto shadow-xs">
            <Star className="w-7 h-7" />
          </div>
          <span className="text-4xl font-black text-amber-950 block">
            {completedGamesCount}
          </span>
          <span className="text-xs font-extrabold text-amber-900 block leading-tight">
            {t.progress.gamesPlayed}
          </span>
        </div>

        {/* Routine Percentage */}
        <div className="p-5 rounded-3xl bg-rose-50 border-3 border-rose-300 shadow-md text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <span className="text-4xl font-black text-rose-950 block">
            {routinePercentage}%
          </span>
          <span className="text-xs font-extrabold text-rose-900 block leading-tight">
            {t.progress.reminderRate}
          </span>
        </div>

        {/* Active Days */}
        <div className="p-5 rounded-3xl bg-sky-50 border-3 border-sky-300 shadow-md text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center mx-auto shadow-xs">
            <Heart className="w-7 h-7 fill-white" />
          </div>
          <span className="text-4xl font-black text-sky-950 block">
            6
          </span>
          <span className="text-xs font-extrabold text-sky-900 block leading-tight">
            {t.progress.activeDays}
          </span>
        </div>
      </div>

      {/* Gentle Positive Closing Card */}
      <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-sm flex items-center gap-4">
        <Award className="w-12 h-12 text-amber-500 shrink-0" />
        <div>
          <h3 className="text-lg font-black text-stone-900">
            Every Step Matters
          </h3>
          <p className="text-xs font-semibold text-stone-600 mt-0.5">
            {t.progress.encouragingNote}
          </p>
        </div>
      </div>
    </div>
  );
};
