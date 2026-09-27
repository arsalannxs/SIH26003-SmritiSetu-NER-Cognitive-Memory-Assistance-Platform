import React, { useState, useEffect } from 'react';
import { PatientProfile, ReminderItem, Language } from '../types';
import { translations } from '../translations';
import { aiService } from '../services/aiService';
import { voiceService } from '../services/voiceService';
import { 
  Brain, 
  Pill, 
  Droplet, 
  Calendar, 
  Heart, 
  Mic, 
  CheckCircle2, 
  Sparkles, 
  Volume2,
  Clock,
  ChevronRight,
  Sun,
  Smile
} from 'lucide-react';

interface PatientHomeProps {
  patient: PatientProfile;
  reminders: ReminderItem[];
  language: Language;
  onNavigateTab: (tab: 'home' | 'play' | 'reminders' | 'progress') => void;
  onOpenVoice: () => void;
  onDrinkWater: () => void;
  onToggleReminder: (id: string, taken: boolean) => void;
}

export const PatientHome: React.FC<PatientHomeProps> = ({
  patient,
  reminders,
  language,
  onNavigateTab,
  onOpenVoice,
  onDrinkWater,
  onToggleReminder,
}) => {
  const t = translations[language];
  const [greeting, setGreeting] = useState('');
  const [aiGreetingMessage, setAiGreetingMessage] = useState('');
  const [waterCelebration, setWaterCelebration] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting(t.home.greetingMorning);
    } else if (hour < 17) {
      setGreeting(t.home.greetingAfternoon);
    } else {
      setGreeting(t.home.greetingEvening);
    }

    // Fetch encouraging AI supportive message
    aiService.getEncouragingMessage(patient.name, language, 'Assam Flora Activity').then((res) => {
      setAiGreetingMessage(res.message);
    });
  }, [language, patient.name, t]);

  const handleWaterClick = () => {
    onDrinkWater();
    setWaterCelebration(true);
    voiceService.speak(
      language === 'hi' 
        ? 'शाबाश! आपने एक गिलास ताजा पानी पिया।' 
        : language === 'as' 
        ? 'বঢ়িয়া! আপুনি এগিলাচ সতেজ পানী খালে।' 
        : 'Wonderful! You drank a refreshing glass of water.',
      language
    );
    setTimeout(() => setWaterCelebration(false), 3000);
  };

  const handleSpeakEncouragement = () => {
    if (aiGreetingMessage) {
      voiceService.speak(aiGreetingMessage, language);
    }
  };

  // 4 simple routine items to show
  const routineItems = reminders.slice(0, 4);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-8 pb-32 animate-fade-in">
      {/* Warm Elderly Greeting Banner */}
      <div className="bg-linear-to-br from-amber-100 via-amber-50 to-orange-50 rounded-3xl p-6 border-2 border-amber-200/80 shadow-md">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Sun className="w-5 h-5 text-amber-600 animate-spin-slow" />
              <span>{greeting},</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              {patient.name}
            </h1>
            <p className="text-sm font-semibold text-stone-600">
              {patient.city}, {patient.state}
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-2xl shadow-inner border-2 border-white">
            <Smile className="w-10 h-10" />
          </div>
        </div>

        {/* AI Supportive Message */}
        {aiGreetingMessage && (
          <div className="mt-4 bg-white/90 rounded-2xl p-4 border border-amber-200 flex items-start gap-3 shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm sm:text-base font-semibold text-stone-800 leading-snug">
                "{aiGreetingMessage}"
              </p>
            </div>
            <button
              onClick={handleSpeakEncouragement}
              className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors shrink-0"
              title="Listen aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Primary Action Cards Grid (Very Large Buttons) */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5">
        {/* 🧠 Play */}
        <button
          onClick={() => onNavigateTab('play')}
          className="flex flex-col items-center justify-center p-6 rounded-3xl bg-linear-to-b from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 border-3 border-emerald-300 shadow-md transition-all duration-200 active:scale-95 group text-center min-h-[140px]"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform">
            <Brain className="w-9 h-9" />
          </div>
          <span className="text-2xl font-black text-emerald-950">
            {t.home.cardPlay}
          </span>
          <span className="text-xs font-bold text-emerald-800 mt-1">
            {t.home.cardPlayDesc}
          </span>
        </button>

        {/* 💊 Medicines */}
        <button
          onClick={() => onNavigateTab('reminders')}
          className="flex flex-col items-center justify-center p-6 rounded-3xl bg-linear-to-b from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 border-3 border-rose-300 shadow-md transition-all duration-200 active:scale-95 group text-center min-h-[140px]"
        >
          <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform">
            <Pill className="w-9 h-9" />
          </div>
          <span className="text-2xl font-black text-rose-950">
            {t.home.cardMedicines}
          </span>
          <span className="text-xs font-bold text-rose-800 mt-1">
            {t.home.cardMedicinesDesc}
          </span>
        </button>

        {/* 💧 Drink Water */}
        <button
          onClick={handleWaterClick}
          className={`flex flex-col items-center justify-center p-6 rounded-3xl border-3 shadow-md transition-all duration-200 active:scale-95 group text-center min-h-[140px] relative overflow-hidden ${
            waterCelebration
              ? 'bg-blue-200 border-blue-500 scale-102 ring-4 ring-blue-300'
              : 'bg-linear-to-b from-sky-50 to-sky-100 hover:from-sky-100 hover:to-sky-200 border-sky-300'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform">
            <Droplet className={`w-9 h-9 ${waterCelebration ? 'animate-bounce' : ''}`} />
          </div>
          <span className="text-2xl font-black text-sky-950">
            {t.home.cardWater}
          </span>
          <span className="text-xs font-bold text-sky-800 mt-1">
            {patient.waterDrunkToday} / {patient.waterGoalGlasses} {t.home.glassesDrunk}
          </span>
        </button>

        {/* 📅 Today's Plan */}
        <button
          onClick={() => onNavigateTab('reminders')}
          className="flex flex-col items-center justify-center p-6 rounded-3xl bg-linear-to-b from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 border-3 border-indigo-300 shadow-md transition-all duration-200 active:scale-95 group text-center min-h-[140px]"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform">
            <Calendar className="w-9 h-9" />
          </div>
          <span className="text-2xl font-black text-indigo-950">
            {t.home.cardPlan}
          </span>
          <span className="text-xs font-bold text-indigo-800 mt-1">
            {t.home.cardPlanDesc}
          </span>
        </button>
      </div>

      {/* Big One-Tap Hydration Button ("I DRANK WATER") */}
      <div className="bg-sky-50 border-3 border-sky-300 rounded-3xl p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Droplet className="w-8 h-8 fill-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-sky-950">
              {patient.waterDrunkToday} {t.home.glassesDrunk}
            </h3>
            <p className="text-xs font-semibold text-sky-800">
              Target: {patient.waterGoalGlasses} glasses today
            </p>
          </div>
        </div>

        <button
          onClick={handleWaterClick}
          className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>{t.home.quickWaterButton}</span>
        </button>
      </div>

      {/* Large Microphone Talk Card */}
      <div className="bg-linear-to-r from-amber-500 to-amber-400 rounded-3xl p-6 shadow-lg border-3 border-amber-300 text-stone-950 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-stone-950 text-amber-300 flex items-center justify-center shrink-0 shadow-md">
            <Mic className="w-9 h-9 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              {t.home.cardTalk}
            </h2>
            <p className="text-sm font-bold text-amber-950">
              {t.home.talkPrompt}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenVoice}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-stone-950 hover:bg-stone-800 text-amber-300 font-black text-lg tracking-wide shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Mic className="w-6 h-6" />
          <span>Speak to Me</span>
        </button>
      </div>

      {/* Today's Simple Routine (Requirement 4) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-black text-stone-900">
              {t.home.todaysRoutine}
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('reminders')}
            className="text-sm font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {routineItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                item.taken
                  ? 'bg-emerald-50 border-emerald-300'
                  : 'bg-stone-50 border-stone-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-base font-extrabold text-stone-700 bg-white px-2.5 py-1 rounded-xl border border-stone-200">
                  {item.time}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">
                    {item.title}
                  </h3>
                  {item.dosageInstruction && (
                    <p className="text-xs font-semibold text-stone-600">
                      {item.dosageInstruction}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => onToggleReminder(item.id, !item.taken)}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                  item.taken
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-200 hover:bg-emerald-500 hover:text-white text-stone-800'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{item.taken ? t.reminders.taken : 'Mark Done'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
