import React, { useState, useEffect } from 'react';
import { GameResult, Language, PatientProfile } from '../types';
import { translations } from '../translations';
import { storageService } from '../services/storageService';
import { voiceService } from '../services/voiceService';
import { ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react';

interface GridItem {
  id: string;
  symbol: string;
  isTarget: boolean;
  selected: boolean;
}

interface AttentionGameProps {
  patient: PatientProfile;
  language: Language;
  onBack: () => void;
  onGameComplete?: (result: GameResult) => void;
}

export const AttentionGame: React.FC<AttentionGameProps> = ({
  patient,
  language,
  onBack,
  onGameComplete,
}) => {
  const t = translations[language];
  const targetSymbol = '🍃';
  const targetLabel = language === 'hi' ? 'चाय की पत्तियाँ' : language === 'as' ? 'চাহ পাতবোৰ' : 'Assam Tea Leaves';
  const distractors = ['🌸', '🍎', '🦏', '☕', '🍊', '⭐'];

  const [items, setItems] = useState<GridItem[]>([]);
  const [targetsTotal, setTargetsTotal] = useState(0);
  const [targetsFound, setTargetsFound] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const initGame = () => {
    // 12 items total, 4 targets
    const count = 12;
    const targetCount = 4;
    setTargetsTotal(targetCount);
    setTargetsFound(0);
    setMistakes(0);
    setIsCompleted(false);
    setStartTime(Date.now());

    const newItems: GridItem[] = [];
    for (let i = 0; i < targetCount; i++) {
      newItems.push({ id: `target-${i}`, symbol: targetSymbol, isTarget: true, selected: false });
    }
    for (let i = 0; i < count - targetCount; i++) {
      const sym = distractors[Math.floor(Math.random() * distractors.length)];
      newItems.push({ id: `dist-${i}`, symbol: sym, isTarget: false, selected: false });
    }

    newItems.sort(() => 0.5 - Math.random());
    setItems(newItems);

    voiceService.speak(
      language === 'hi' ? `सभी ${targetLabel} को छुएं।` : language === 'as' ? `সকলো ${targetLabel} স্পৰ্শ কৰক।` : `Tap all the ${targetLabel}.`,
      language
    );
  };

  useEffect(() => {
    initGame();
  }, [language]);

  const handleTap = (index: number) => {
    const item = items[index];
    if (item.selected) return;

    const updated = [...items];
    updated[index].selected = true;
    setItems(updated);

    if (item.isTarget) {
      const newFound = targetsFound + 1;
      setTargetsFound(newFound);
      voiceService.speak(language === 'hi' ? 'अच्छा!' : language === 'as' ? 'ভাল!' : 'Found one!', language);

      if (newFound >= targetsTotal) {
        handleFinish(newFound, mistakes);
      }
    } else {
      setMistakes((prev) => prev + 1);
    }
  };

  const handleFinish = (found: number, errorCount: number) => {
    setIsCompleted(true);
    const duration = Math.max(10, Math.round((Date.now() - startTime) / 1000));
    const accuracy = Math.max(60, Math.round((found / (found + errorCount)) * 100));

    const res = storageService.saveGameResult({
      gameType: 'attention',
      gameName: 'Tea Leaf Attention Focus',
      score: found,
      maxScore: targetsTotal,
      timeSeconds: duration,
      attempts: found + errorCount,
      accuracy,
      difficulty: patient.currentDifficulty,
      timestamp: new Date().toISOString(),
      completed: true,
    });

    if (onGameComplete) {
      onGameComplete(res);
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

        <span className="text-sm font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-xl">
          {targetsFound} / {targetsTotal}
        </span>
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
          {t.games.attentionTitle}
        </h1>
        <p className="text-lg font-bold text-emerald-800 mt-1 flex items-center justify-center gap-2">
          <span>Tap all the:</span>
          <span className="text-3xl">{targetSymbol}</span>
          <span className="underline decoration-emerald-400 font-black">{targetLabel}</span>
        </p>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
        {items.map((it, idx) => (
          <button
            key={it.id}
            onClick={() => handleTap(idx)}
            disabled={it.selected}
            className={`aspect-square rounded-3xl p-4 flex items-center justify-center text-5xl transition-all duration-200 shadow-md active:scale-95 ${
              it.selected && it.isTarget
                ? 'bg-emerald-100 border-4 border-emerald-500 scale-98 ring-4 ring-emerald-200'
                : it.selected && !it.isTarget
                ? 'bg-stone-200 border-2 border-stone-300 opacity-40'
                : 'bg-white hover:bg-amber-50 border-3 border-stone-200 hover:border-amber-400 hover:scale-102 cursor-pointer'
            }`}
          >
            <span className="select-none">{it.symbol}</span>
          </button>
        ))}
      </div>

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
            You found all the {targetLabel} with wonderful focus!
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
