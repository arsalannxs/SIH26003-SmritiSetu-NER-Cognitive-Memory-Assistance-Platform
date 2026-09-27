import React, { useState, useEffect } from 'react';
import { GameResult, Language, PatientProfile } from '../types';
import { translations } from '../translations';
import { storageService } from '../services/storageService';
import { voiceService } from '../services/voiceService';
import { ArrowLeft, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';

interface PatternItem {
  id: string;
  pattern: string[];
  options: string[];
  correct: string;
  label: string;
}

const PATTERNS: PatternItem[] = [
  { id: 'p-1', pattern: ['🔴', '🔵', '🔴', '🔵'], options: ['🔴', '🟢', '⭐'], correct: '🔴', label: 'Color Pattern' },
  { id: 'p-2', pattern: ['🍃', '🌸', '🍃', '🌸'], options: ['🍃', '🪨', '🌧️'], correct: '🍃', label: 'Assam Flora' },
  { id: 'p-3', pattern: ['☀️', '🌙', '☀️', '🌙'], options: ['⭐', '☀️', '☁️'], correct: '☀️', label: 'Day and Night' },
  { id: 'p-4', pattern: ['🔺', '🔷', '🔺', '🔷'], options: ['🔺', '🟡', '🟣'], correct: '🔺', label: 'Geometric shapes' },
];

interface PatternGameProps {
  patient: PatientProfile;
  language: Language;
  onBack: () => void;
  onGameComplete?: (result: GameResult) => void;
}

export const PatternGame: React.FC<PatternGameProps> = ({
  patient,
  language,
  onBack,
  onGameComplete,
}) => {
  const t = translations[language];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [startTime, setStartTime] = useState(Date.now());

  const currentPattern = PATTERNS[currentIdx];

  const handleChoice = (opt: string) => {
    setAttempts((prev) => prev + 1);
    if (opt === currentPattern.correct) {
      setFeedback('correct');
      setScore((prev) => prev + 1);
      voiceService.speak(language === 'hi' ? 'बिल्कुल सही!' : language === 'as' ? 'সুন্দৰ!' : 'Very good!', language);
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      const next = currentIdx + 1;
      setFeedback(null);
      if (next < PATTERNS.length) {
        setCurrentIdx(next);
      } else {
        handleFinish();
      }
    }, 1000);
  };

  const handleFinish = () => {
    setIsCompleted(true);
    const duration = Math.max(10, Math.round((Date.now() - startTime) / 1000));
    const accuracy = Math.round((score / PATTERNS.length) * 100);

    const res = storageService.saveGameResult({
      gameType: 'pattern',
      gameName: 'Gentle Pattern Recall',
      score,
      maxScore: PATTERNS.length,
      timeSeconds: duration,
      attempts,
      accuracy,
      difficulty: patient.currentDifficulty,
      timestamp: new Date().toISOString(),
      completed: true,
    });

    if (onGameComplete) {
      onGameComplete(res);
    }
  };

  const initGame = () => {
    setCurrentIdx(0);
    setScore(0);
    setAttempts(0);
    setIsCompleted(false);
    setFeedback(null);
    setStartTime(Date.now());
  };

  useEffect(() => {
    initGame();
  }, []);

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

        <span className="text-sm font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-xl">
          {currentIdx + 1} / {PATTERNS.length}
        </span>
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
          {t.games.patternTitle}
        </h1>
        <p className="text-sm font-semibold text-stone-600 mt-1">
          {t.games.patternDesc}
        </p>
      </div>

      {/* Pattern Display Box */}
      {!isCompleted && currentPattern && (
        <div className="bg-amber-50 rounded-3xl p-6 border-4 border-amber-300 shadow-md text-center space-y-6">
          <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
            What completes the pattern?
          </span>

          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {currentPattern.pattern.map((sym, idx) => (
              <div
                key={idx}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-stone-200 flex items-center justify-center text-3xl sm:text-4xl shadow-xs select-none"
              >
                {sym}
              </div>
            ))}

            {/* Target Missing Question Box */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-200 border-3 border-dashed border-amber-500 flex items-center justify-center text-2xl sm:text-3xl font-black text-amber-950 animate-pulse">
              ?
            </div>
          </div>
        </div>
      )}

      {/* Options Selection */}
      {!isCompleted && currentPattern && (
        <div className="space-y-3">
          <span className="text-xs font-black uppercase text-stone-500 tracking-wider block text-center">
            Pick the matching symbol:
          </span>
          <div className="grid grid-cols-3 gap-3">
            {currentPattern.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleChoice(opt)}
                className="p-6 rounded-3xl bg-white hover:bg-amber-100 border-3 border-stone-200 hover:border-amber-400 text-4xl sm:text-5xl shadow-md transition-all active:scale-95 flex items-center justify-center"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Completion */}
      {isCompleted && (
        <div className="bg-emerald-50 border-3 border-emerald-400 rounded-3xl p-6 shadow-xl text-center space-y-4 animate-scale-up">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-emerald-950">
            {t.games.wellDone}
          </h2>
          <p className="text-sm font-bold text-emerald-800">
            {t.games.greatJob}
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
