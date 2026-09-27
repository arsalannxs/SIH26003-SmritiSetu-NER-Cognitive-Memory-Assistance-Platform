import React, { useState, useEffect } from 'react';
import { GameResult, Language, PatientProfile } from '../types';
import { translations } from '../translations';
import { storageService } from '../services/storageService';
import { voiceService } from '../services/voiceService';
import { ArrowLeft, CheckCircle2, RotateCcw, Volume2, Sparkles, HelpCircle } from 'lucide-react';

interface RoutineStep {
  id: string;
  order: number;
  nameEn: string;
  nameHi: string;
  nameAs: string;
  icon: string;
  timeHint: string;
}

const ROUTINE_POOL: RoutineStep[] = [
  { id: 'r-1', order: 1, nameEn: 'Wake Up & Smile', nameHi: 'जागना व प्रणाम', nameAs: 'পুৱা সাৰ পোৱা', icon: '☀️', timeHint: '06:30 AM' },
  { id: 'r-2', order: 2, nameEn: 'Brush Teeth & Wash Face', nameHi: 'मुंह-हाथ धोना', nameAs: 'মুখ-হাত ধোৱা', icon: '🪥', timeHint: '07:00 AM' },
  { id: 'r-3', order: 3, nameEn: 'Morning Assam Tea & Roti', nameHi: 'सुबह की चाय व नाश्ता', nameAs: 'পুৱাৰ চাহ আৰু জলপান', icon: '🍵', timeHint: '08:00 AM' },
  { id: 'r-4', order: 4, nameEn: 'Morning Medicine with Water', nameHi: 'पानी के साथ दवाई लेना', nameAs: 'পানীৰে পুৱাৰ দৰব খোৱা', icon: '💊', timeHint: '08:30 AM' },
  { id: 'r-5', order: 5, nameEn: 'Gentle Walk in Garden', nameHi: 'बगीचे में टहलना', nameAs: 'বাৰীত ফুৰিবলৈ যোৱা', icon: '🌿', timeHint: '09:30 AM' },
];

interface RoutineSequenceGameProps {
  patient: PatientProfile;
  language: Language;
  onBack: () => void;
  onGameComplete?: (result: GameResult) => void;
}

export const RoutineSequenceGame: React.FC<RoutineSequenceGameProps> = ({
  patient,
  language,
  onBack,
  onGameComplete,
}) => {
  const t = translations[language];
  const [currentStepIndex, setCurrentStepIndex] = useState(1); // user needs to guess step 2, 3, etc.
  const [completedSteps, setCompletedSteps] = useState<RoutineStep[]>([ROUTINE_POOL[0]]);
  const [options, setOptions] = useState<RoutineStep[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(Date.now());

  const getStepName = (step: RoutineStep) => {
    return language === 'hi' ? step.nameHi : language === 'as' ? step.nameAs : step.nameEn;
  };

  const setupQuestion = (targetIndex: number) => {
    if (targetIndex >= ROUTINE_POOL.length) {
      handleFinished();
      return;
    }

    const correctStep = ROUTINE_POOL[targetIndex];
    // Gather incorrect options
    const otherSteps = ROUTINE_POOL.filter((s) => s.id !== correctStep.id && s.order > targetIndex);
    const pool = [correctStep, ...otherSteps.slice(0, 2)].sort(() => 0.5 - Math.random());
    setOptions(pool);
    setFeedback(null);

    // Speak prompt
    voiceService.speak(
      `${getStepName(completedSteps[completedSteps.length - 1])}. ${t.games.whatComesNext}`,
      language
    );
  };

  const initGame = () => {
    setCurrentStepIndex(1);
    setCompletedSteps([ROUTINE_POOL[0]]);
    setAttempts(0);
    setMistakes(0);
    setIsCompleted(false);
    setFeedback(null);
    setStartTime(Date.now());
    setupQuestion(1);
  };

  useEffect(() => {
    initGame();
  }, [language]);

  const handleSelectOption = (selected: RoutineStep) => {
    setAttempts((prev) => prev + 1);
    const expected = ROUTINE_POOL[currentStepIndex];

    if (selected.id === expected.id) {
      // Correct!
      setFeedback('correct');
      voiceService.speak(
        language === 'hi' ? 'बिल्कुल सही!' : language === 'as' ? 'একদম সঠিক!' : 'That is exactly right!',
        language
      );

      const nextSteps = [...completedSteps, expected];
      setCompletedSteps(nextSteps);

      setTimeout(() => {
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);
        if (nextIndex < ROUTINE_POOL.length) {
          setupQuestion(nextIndex);
        } else {
          handleFinished();
        }
      }, 1000);
    } else {
      // Incorrect -> Gentle feedback without shame
      setMistakes((prev) => prev + 1);
      setFeedback('try_again');
      voiceService.speak(
        language === 'hi' ? 'कोई बात नहीं, फिर से सोचें।' : language === 'as' ? 'একো কথা নাই, আকৌ ভাবক।' : 'Let us try again gently.',
        language
      );
    }
  };

  const handleFinished = () => {
    setIsCompleted(true);
    const duration = Math.max(10, Math.round((Date.now() - startTime) / 1000));
    const accuracy = Math.max(50, Math.round(((ROUTINE_POOL.length - 1) / Math.max(ROUTINE_POOL.length - 1, attempts)) * 100));

    const result = storageService.saveGameResult({
      gameType: 'routine_sequence',
      gameName: 'Daily Routine Recall',
      score: ROUTINE_POOL.length,
      maxScore: ROUTINE_POOL.length,
      timeSeconds: duration,
      attempts,
      accuracy,
      difficulty: patient.currentDifficulty,
      timestamp: new Date().toISOString(),
      completed: true,
    });

    if (onGameComplete) {
      onGameComplete(result);
    }
  };

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

        <button
          onClick={initGame}
          className="p-2.5 rounded-2xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 transition-colors shadow-xs"
          title="Restart"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
          {t.games.routineSequenceTitle}
        </h1>
        <p className="text-sm font-semibold text-stone-600 mt-1">
          {t.games.whatComesNext}
        </p>
      </div>

      {/* Routine Chain so far */}
      <div className="bg-amber-50/60 border-2 border-amber-200 rounded-3xl p-5 space-y-3">
        <span className="text-xs font-black uppercase text-amber-900 tracking-wider block">
          Our Morning Steps:
        </span>
        <div className="flex flex-col gap-2.5">
          {completedSteps.map((step, idx) => (
            <div
              key={step.id}
              className="p-3.5 bg-white rounded-2xl border-2 border-emerald-300 shadow-xs flex items-center justify-between animate-fade-in"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl select-none">{step.icon}</span>
                <div>
                  <h4 className="text-base font-extrabold text-stone-900">
                    {idx + 1}. {getStepName(step)}
                  </h4>
                  <span className="text-xs font-semibold text-stone-500">
                    {step.timeHint}
                  </span>
                </div>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
          ))}

          {/* Target Question Step */}
          {!isCompleted && (
            <div className="p-4 bg-amber-100/90 border-3 border-dashed border-amber-400 rounded-2xl flex items-center justify-center gap-2 text-amber-950 font-black text-lg animate-pulse">
              <HelpCircle className="w-6 h-6 text-amber-700" />
              <span>{t.games.whatComesNext}</span>
            </div>
          )}
        </div>
      </div>

      {/* Options Selection */}
      {!isCompleted && (
        <div className="space-y-3">
          <span className="text-xs font-black uppercase text-stone-500 tracking-wider block text-center">
            Tap the Next Activity:
          </span>
          <div className="grid grid-cols-1 gap-3">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt)}
                className="w-full p-4 rounded-3xl bg-white hover:bg-amber-50 border-3 border-stone-200 hover:border-amber-400 shadow-md transition-all active:scale-98 flex items-center gap-4 text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shadow-inner shrink-0">
                  {opt.icon}
                </div>
                <div>
                  <h4 className="text-lg font-black text-stone-900">
                    {getStepName(opt)}
                  </h4>
                  <p className="text-xs font-semibold text-stone-500">
                    {opt.timeHint}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Feedback message */}
      {feedback === 'try_again' && (
        <div className="p-3 bg-amber-100 rounded-2xl text-center text-amber-900 font-bold text-sm">
          Gentle reminder: think about what you do right after this!
        </div>
      )}

      {/* Finished Celebration */}
      {isCompleted && (
        <div className="bg-emerald-50 border-3 border-emerald-400 rounded-3xl p-6 shadow-xl text-center space-y-4 animate-scale-up">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-emerald-950">
            {t.games.wellDone}
          </h2>
          <p className="text-sm font-bold text-emerald-800">
            You remembered your full daily routine beautifully!
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={initGame}
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-md transition-all active:scale-95"
            >
              {t.games.playAgain}
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3.5 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-900 font-extrabold text-base transition-all active:scale-95"
            >
              {t.games.finishActivity}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
