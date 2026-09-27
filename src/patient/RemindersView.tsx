import React, { useState } from 'react';
import { ReminderItem, Language, PatientProfile } from '../types';
import { translations } from '../translations';
import { voiceService } from '../services/voiceService';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Droplet, 
  Calendar, 
  Pill, 
  Footprints, 
  HeartHandshake,
  ShieldAlert,
  Volume2
} from 'lucide-react';

interface RemindersViewProps {
  patient: PatientProfile;
  reminders: ReminderItem[];
  language: Language;
  onBack: () => void;
  onToggleReminder: (id: string, taken: boolean) => void;
  onSkipReminder: (id: string) => void;
  onDrinkWater: () => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  patient,
  reminders,
  language,
  onBack,
  onToggleReminder,
  onSkipReminder,
  onDrinkWater,
}) => {
  const t = translations[language];
  const [filterType, setFilterType] = useState<'all' | 'medicine' | 'water' | 'appointment'>('all');

  const filteredReminders = reminders.filter((r) => {
    if (filterType === 'all') return true;
    if (filterType === 'medicine') return r.type === 'medicine';
    if (filterType === 'water') return r.type === 'water';
    if (filterType === 'appointment') return r.type === 'appointment' || r.type === 'family';
    return true;
  });

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'medicine':
        return <Pill className="w-7 h-7 text-rose-600" />;
      case 'water':
        return <Droplet className="w-7 h-7 text-sky-600" />;
      case 'walk':
        return <Footprints className="w-7 h-7 text-emerald-600" />;
      case 'appointment':
        return <Calendar className="w-7 h-7 text-indigo-600" />;
      case 'family':
        return <HeartHandshake className="w-7 h-7 text-amber-600" />;
      default:
        return <Clock className="w-7 h-7 text-stone-600" />;
    }
  };

  const handleReadReminder = (r: ReminderItem) => {
    voiceService.speak(
      `${r.title} at ${r.time}. ${r.dosageInstruction || ''} ${r.taken ? 'Already completed.' : ''}`,
      language
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-32 animate-fade-in">
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
          {t.reminders.title}
        </h1>
      </div>

      {/* Safety Disclaimer Banner */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs font-semibold text-amber-950">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <span>{t.reminders.safetyDosageDisclaimer}</span>
      </div>

      {/* Hydration Quick Counter Card */}
      <div className="bg-linear-to-r from-sky-50 to-blue-100 rounded-3xl p-6 border-3 border-sky-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Droplet className="w-9 h-9 fill-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-sky-950">
              {t.reminders.waterTitle}
            </h3>
            <p className="text-sm font-bold text-sky-800">
              {patient.waterDrunkToday} / {patient.waterGoalGlasses} glasses drunk today
            </p>
          </div>
        </div>

        <button
          onClick={onDrinkWater}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-base shadow-md transition-all active:scale-95"
        >
          {t.home.quickWaterButton}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
            filterType === 'all'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          All Reminders
        </button>
        <button
          onClick={() => setFilterType('medicine')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
            filterType === 'medicine'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          💊 Medicines
        </button>
        <button
          onClick={() => setFilterType('water')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
            filterType === 'water'
              ? 'bg-sky-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          💧 Water
        </button>
        <button
          onClick={() => setFilterType('appointment')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
            filterType === 'appointment'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          📅 Appointments
        </button>
      </div>

      {/* Reminders List with Large Buttons */}
      <div className="space-y-4">
        {filteredReminders.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-3xl border-3 transition-all shadow-md space-y-4 ${
              item.taken
                ? 'bg-emerald-50/80 border-emerald-300'
                : item.skipped
                ? 'bg-stone-100 border-stone-300 opacity-60'
                : 'bg-white border-stone-200 hover:border-amber-400'
            }`}
          >
            {/* Top row: Icon, Time, Title, Audio */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200">
                  {getItemIcon(item.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-200">
                      {item.time}
                    </span>
                    <span className="text-xs font-bold text-stone-500">
                      {item.frequency}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-stone-900 mt-1">
                    {item.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => handleReadReminder(item)}
                className="p-2.5 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 transition-colors"
                title="Listen aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Dosage Instruction & Notes */}
            {(item.dosageInstruction || item.location || item.notes) && (
              <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 space-y-1 text-sm font-semibold text-stone-700">
                {item.dosageInstruction && (
                  <p className="text-stone-900 font-bold">
                    📝 {item.dosageInstruction}
                  </p>
                )}
                {item.location && (
                  <p className="text-indigo-900 font-bold">
                    📍 Location: {item.location}
                  </p>
                )}
                {item.notes && (
                  <p className="text-xs text-stone-500 italic">
                    Note: {item.notes}
                  </p>
                )}
                {item.lastUpdated && (
                  <p className="text-xs text-emerald-700 font-bold">
                    ✓ {item.lastUpdated}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons: TAKEN, SKIP, REMIND LATER (Req 15) */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => onToggleReminder(item.id, !item.taken)}
                className={`flex-1 min-w-[130px] py-3 px-4 rounded-2xl font-black text-base transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xs ${
                  item.taken
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{item.taken ? t.reminders.taken : t.reminders.taken}</span>
              </button>

              <button
                onClick={() => onSkipReminder(item.id)}
                className="py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-black text-sm transition-all active:scale-95 flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4 text-stone-500" />
                <span>{t.reminders.skip}</span>
              </button>

              <button
                onClick={() => {
                  voiceService.speak(
                    language === 'hi' ? 'हम आपको 15 मिनट बाद फिर याद दिलाएंगे।' : language === 'as' ? 'আমি ১৫ মিনিটৰ পাছত পুনৰ সোঁৱৰাই দিম।' : 'We will remind you again in 15 minutes.',
                    language
                  );
                }}
                className="py-3 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-sm transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Clock className="w-4 h-4 text-amber-700" />
                <span>{t.reminders.remindLater}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
