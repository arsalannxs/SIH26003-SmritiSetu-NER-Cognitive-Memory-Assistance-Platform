import React, { useState, useEffect } from 'react';
import { GameResult, Language, PatientProfile } from '../types';
import { translations } from '../translations';
import { CULTURAL_ITEMS } from '../data/mockData';
import { storageService } from '../services/storageService';
import { voiceService } from '../services/voiceService';
import { aiService } from '../services/aiService';
import { ArrowLeft, RotateCcw, Sparkles, CheckCircle2, Volume2 } from 'lucide-react';

interface CardItem {
  uid: string;
  itemId: string;
  name: string;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchGameProps {
  patient: PatientProfile;
  language: Language;
  onBack: () => void;
  onGameComplete?: (result: GameResult) => void;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  patient,
  language,
  onBack,
  onGameComplete,
}) => {
  const t = translations[language];
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [matches, setMatches] = useState(0);
  const [targetPairs, setTargetPairs] = useState(3);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [encouragement, setEncouragement] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  // Initialize cards based on adaptive difficulty
  const initGame = () => {
    let pairCount = 3;
    if (patient.currentDifficulty === 'easy_plus') pairCount = 4;
    else if (patient.currentDifficulty === 'medium') pairCount = 6;
    else if (patient.currentDifficulty === 'hard') pairCount = 8;
    setTargetPairs(pairCount);

    // Pick cultural items based on count
    const pool = [...CULTURAL_ITEMS].sort(() => 0.5 - Math.random()).slice(0, pairCount);
    const cardDeck: CardItem[] = [];

    pool.forEach((item, index) => {
      const name = language === 'hi' ? item.nameHi : language === 'as' ? item.nameAs : item.nameEn;
      // Pair card A
      cardDeck.push({
        uid: `${item.id}-a-${index}`,
        itemId: item.id,
        name,
        icon: item.icon,
        isFlipped: false,
        isMatched: false,
      });
      // Pair card B
      cardDeck.push({
        uid: `${item.id}-b-${index}`,
        itemId: item.id,
        name,
        icon: item.icon,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    cardDeck.sort(() => 0.5 - Math.random());
    setCards(cardDeck);
    setSelectedCards([]);
    setAttempts(0);
    setMatches(0);
    setIsCompleted(false);
    setStartTime(Date.now());
    setEncouragement('');
    setIsBusy(false);
  };

  useEffect(() => {
    initGame();
  }, [patient.currentDifficulty, language]);

  const handleCardClick = (index: number) => {
    if (isBusy) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (selectedCards.length === 2) return;

    // Flip the clicked card
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    // If 2 cards are now selected, check match
    if (newSelected.length === 2) {
      setAttempts((prev) => prev + 1);
      const [firstIdx, secondIdx] = newSelected;
      const firstCard = updatedCards[firstIdx];
      const secondCard = updatedCards[secondIdx];

      if (firstCard.itemId === secondCard.itemId) {
        // MATCH!
        firstCard.isMatched = true;
        secondCard.isMatched = true;
        const newMatches = matches + 1;
        setMatches(newMatches);
        setSelectedCards([]);

        // Speak the name gently
        voiceService.speak(firstCard.name, language);

        // Check completion
        if (newMatches >= targetPairs) {
          handleWin(newMatches, attempts + 1);
        }
      } else {
        // NO MATCH -> Flip back gently after delay
        setIsBusy(true);
        setTimeout(() => {
          firstCard.isFlipped = false;
          secondCard.isFlipped = false;
          setCards([...updatedCards]);
          setSelectedCards([]);
          setIsBusy(false);
        }, 1100);
      }
    }
  };

  const handleWin = (finalMatches: number, totalAttempts: number) => {
    setIsCompleted(true);
    const durationSeconds = Math.max(10, Math.round((Date.now() - startTime) / 1000));
    const accuracy = Math.min(100, Math.round((finalMatches / Math.max(1, totalAttempts)) * 100));

    // Save game result
    const result = storageService.saveGameResult({
      gameType: 'memory_match',
      gameName: 'Assam Flora & Culture Match',
      score: finalMatches,
      maxScore: targetPairs,
      timeSeconds: durationSeconds,
      attempts: totalAttempts,
      accuracy,
      difficulty: patient.currentDifficulty,
      timestamp: new Date().toISOString(),
      completed: true,
    });

    if (onGameComplete) {
      onGameComplete(result);
    }

    // AI encouraging message
    aiService.getEncouragingMessage(patient.name, language, 'Assam Flora Memory Match').then((res) => {
      setEncouragement(res.message);
      voiceService.speak(res.message, language);
    });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-32 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-extrabold text-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.nav.back}</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              {t.games.matchesFound}
            </span>
            <span className="text-xl font-black text-amber-700">
              {matches} / {targetPairs}
            </span>
          </div>

          <button
            onClick={initGame}
            className="p-2.5 rounded-2xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 transition-colors shadow-xs"
            title="Restart"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Game Title */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
          {t.games.memoryMatchTitle}
        </h1>
        <p className="text-sm font-semibold text-stone-600 mt-1">
          {t.games.tapToMatch}
        </p>
      </div>

      {/* Cards Grid (Dynamic columns based on pair count) */}
      <div
        className={`grid gap-3 sm:gap-4 ${
          targetPairs <= 3
            ? 'grid-cols-2 sm:grid-cols-3'
            : targetPairs <= 4
            ? 'grid-cols-2 sm:grid-cols-4'
            : 'grid-cols-3 sm:grid-cols-4'
        }`}
      >
        {cards.map((card, idx) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.uid}
              onClick={() => handleCardClick(idx)}
              disabled={isRevealed || isBusy}
              className={`aspect-square rounded-3xl p-3 flex flex-col items-center justify-center transition-all duration-300 shadow-md active:scale-95 ${
                card.isMatched
                  ? 'bg-emerald-100 border-4 border-emerald-400 text-emerald-950 scale-98 ring-4 ring-emerald-200/50'
                  : isRevealed
                  ? 'bg-amber-100 border-4 border-amber-400 text-amber-950'
                  : 'bg-linear-to-br from-amber-500 to-amber-600 border-4 border-amber-400 text-white hover:scale-102 cursor-pointer shadow-lg'
              }`}
            >
              {isRevealed ? (
                <div className="text-center animate-scale-up">
                  <span className="text-4xl sm:text-5xl block select-none">
                    {card.icon}
                  </span>
                  <span className="text-xs font-black mt-1 block truncate max-w-[90px]">
                    {card.name}
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-3xl opacity-80">🌸</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Completion Modal / Banner */}
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

          {encouragement && (
            <div className="bg-white rounded-2xl p-4 border border-emerald-200 text-stone-800 font-semibold text-sm flex items-center justify-between gap-3 text-left">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="flex-1">"{encouragement}"</p>
              <button
                onClick={() => voiceService.speak(encouragement, language)}
                className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          )}

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
