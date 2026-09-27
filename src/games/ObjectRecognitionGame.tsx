import React, { useState, useEffect } from 'react';
import { GameResult, Language, PatientProfile } from '../types';
import { translations } from '../translations';
import { storageService } from '../services/storageService';
import { voiceService } from '../services/voiceService';
import { ArrowLeft, Mic, RotateCcw, Volume2, CheckCircle2, HelpCircle } from 'lucide-react';

interface ObjectItem {
  id: string;
  nameEn: string;
  nameHi: string;
  nameAs: string;
  icon: string;
  altHints: string[];
}

const OBJECT_POOL: ObjectItem[] = [
  { id: 'o-1', nameEn: 'Tea Cup', nameHi: 'चाय का कप', nameAs: 'চাহৰ কাপ', icon: '☕', altHints: ['cup', 'tea', 'चाय', 'कप', 'চাহ'] },
  { id: 'o-2', nameEn: 'Wall Clock', nameHi: 'दीवार घड़ी', nameAs: 'দেৱাল ঘড়ী', icon: '⏰', altHints: ['clock', 'time', 'घड़ी', 'ঘড়ী'] },
  { id: 'o-3', nameEn: 'Fresh Fruit', nameHi: 'ताजा फल', nameAs: 'সতেজ ফল', icon: '🍎', altHints: ['fruit', 'apple', 'फल', 'ফল', 'আপেল'] },
  { id: 'o-4', nameEn: 'Story Book', nameHi: 'किताब', nameAs: 'কিতাপ', icon: '📖', altHints: ['book', 'किताब', 'কিতাপ'] },
  { id: 'o-5', nameEn: 'Umbrella', nameHi: 'छाता', nameAs: 'ছাতি', icon: '☂️', altHints: ['umbrella', 'छाता', 'ছাতি'] },
  { id: 'o-6', nameEn: 'Radio', nameHi: 'रेडियो', nameAs: 'ৰেডিঅ’', icon: '📻', altHints: ['radio', 'रेडियो', 'ৰেডিঅ'] },
  { id: 'o-7', nameEn: 'Telephone', nameHi: 'फोन', nameAs: 'টেলিফোন', icon: '☎️', altHints: ['phone', 'telephone', 'फोन', 'টেলিফোন'] },
  { id: 'o-8', nameEn: 'Hand Fan', nameHi: 'हाथ का पंखा', nameAs: 'বিচনী', icon: '🪭', altHints: ['fan', 'पंखा', 'বিচনী'] },
];

interface ObjectRecognitionGameProps {
  patient: PatientProfile;
  language: Language;
  onBack: () => void;
  onGameComplete?: (result: GameResult) => void;
}

export const ObjectRecognitionGame: React.FC<ObjectRecognitionGameProps> = ({
  patient,
  language,
  onBack,
  onGameComplete,
}) => {
  const t = translations[language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<ObjectItem[]>([]);
  const [choices, setChoices] = useState<ObjectItem[]>([]);
  const [score, setScore] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [voiceHeard, setVoiceHeard] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const getName = (item: ObjectItem) => {
    return language === 'hi' ? item.nameHi : language === 'as' ? item.nameAs : item.nameEn;
  };

  const setupRound = (roundIdx: number, pool: ObjectItem[]) => {
    if (roundIdx >= pool.length) {
      handleFinish(pool.length);
      return;
    }
    const target = pool[roundIdx];
    const otherItems = OBJECT_POOL.filter((i) => i.id !== target.id);
    const shuffledOthers = [...otherItems].sort(() => 0.5 - Math.random()).slice(0, 2);
    const roundChoices = [target, ...shuffledOthers].sort(() => 0.5 - Math.random());
    setChoices(roundChoices);
    setFeedback(null);
    setVoiceHeard('');

    voiceService.speak(t.games.whatIsThis, language);
  };

  const initGame = () => {
    const pool = [...OBJECT_POOL].sort(() => 0.5 - Math.random()).slice(0, 4);
    setQuestions(pool);
    setCurrentIndex(0);
    setScore(0);
    setIsCompleted(false);
    setStartTime(Date.now());
    setupRound(0, pool);
  };

  useEffect(() => {
    initGame();
  }, [language]);

  const handleAnswer = (selected: ObjectItem) => {
    const target = questions[currentIndex];
    if (selected.id === target.id) {
      setFeedback('correct');
      setScore((prev) => prev + 1);
      voiceService.speak(
        language === 'hi' ? `सही! यह ${getName(target)} है।` : language === 'as' ? `সঠিক! এইটো ${getName(target)} হয়।` : `Correct! This is a ${getName(target)}.`,
        language
      );
    } else {
      setFeedback('wrong');
      voiceService.speak(
        language === 'hi' ? `यह ${getName(target)} है।` : language === 'as' ? `এইটো ${getName(target)} হয়।` : `This is a ${getName(target)}.`,
        language
      );
    }

    setTimeout(() => {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (nextIdx < questions.length) {
        setupRound(nextIdx, questions);
      } else {
        handleFinish(questions.length);
      }
    }, 1400);
  };

  const handleVoiceAnswer = () => {
    if (isListening) return;
    setIsListening(true);
    setVoiceHeard('');

    const target = questions[currentIndex];
    const rec = voiceService.createRecognizer(
      language,
      (transcript: string) => {
        setIsListening(false);
        setVoiceHeard(transcript);
        const lower = transcript.toLowerCase();
        const matches = target.altHints.some((h) => lower.includes(h.toLowerCase())) || lower.includes(getName(target).toLowerCase());
        if (matches) {
          handleAnswer(target);
        } else {
          // If transcript didn't match, give gentle encouragement
          voiceService.speak(`You said "${transcript}". Let us check together.`, language);
        }
      },
      () => {
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (rec) {
      try {
        rec.start();
      } catch {
        setIsListening(false);
      }
    } else {
      setIsListening(false);
    }
  };

  const handleFinish = (total: number) => {
    setIsCompleted(true);
    const duration = Math.max(10, Math.round((Date.now() - startTime) / 1000));
    const accuracy = Math.round((score / Math.max(1, total)) * 100);

    const res = storageService.saveGameResult({
      gameType: 'object_recognition',
      gameName: 'Everyday Object Recognition',
      score,
      maxScore: total,
      timeSeconds: duration,
      attempts: total,
      accuracy,
      difficulty: patient.currentDifficulty,
      timestamp: new Date().toISOString(),
      completed: true,
    });

    if (onGameComplete) {
      onGameComplete(res);
    }
  };

  const currentObj = questions[currentIndex];

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
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
          {t.games.objectRecognitionTitle}
        </h1>
        <p className="text-base font-bold text-amber-800 mt-1">
          {t.games.whatIsThis}
        </p>
      </div>

      {/* Target Big Object Card */}
      {!isCompleted && currentObj && (
        <div className="bg-amber-50 rounded-3xl p-8 border-4 border-amber-300 shadow-md flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-36 h-36 rounded-full bg-white flex items-center justify-center text-7xl shadow-inner border-4 border-amber-200 select-none">
            {currentObj.icon}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => voiceService.speak(t.games.whatIsThis, language)}
              className="p-2.5 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900"
              title="Repeat question"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            {/* Voice Answer button */}
            <button
              onClick={handleVoiceAnswer}
              className={`px-4 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all active:scale-95 shadow-xs ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
              }`}
            >
              <Mic className="w-5 h-5" />
              <span>{isListening ? 'Listening...' : 'Speak Answer'}</span>
            </button>
          </div>

          {voiceHeard && (
            <p className="text-xs font-bold text-stone-700">
              Heard: "{voiceHeard}"
            </p>
          )}
        </div>
      )}

      {/* Multiple Choice Options (Large Tap Buttons) */}
      {!isCompleted && (
        <div className="grid grid-cols-1 gap-3">
          {choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleAnswer(choice)}
              className="p-5 rounded-2xl bg-white hover:bg-amber-50 border-3 border-stone-200 hover:border-amber-400 font-black text-xl text-stone-900 shadow-md transition-all active:scale-98 flex items-center justify-between"
            >
              <span>{getName(choice)}</span>
              <span className="text-2xl">{choice.icon}</span>
            </button>
          ))}
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
            You recognized familiar objects with gentle focus!
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
