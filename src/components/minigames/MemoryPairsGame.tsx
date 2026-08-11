import React, { useState, useEffect } from 'react';
import { MinigameSessionProps } from '../../types/minigames';
import { getMemoryPairsDifficulty } from '../../data/minigamesConfig';
import { soundFx } from '../../utils/soundEffects';
import { Clock, Sparkles } from 'lucide-react';

const POKEMON_ICONS = [
  { id: 'pika', emoji: '⚡', name: 'Pikachu', color: 'bg-yellow-400' },
  { id: 'chari', emoji: '🔥', name: 'Charmander', color: 'bg-red-500' },
  { id: 'squir', emoji: '💧', name: 'Squirtle', color: 'bg-sky-400' },
  { id: 'bulba', emoji: '🍃', name: 'Bulbasaur', color: 'bg-emerald-500' },
  { id: 'eevee', emoji: '⭐', name: 'Eevee', color: 'bg-amber-300' },
  { id: 'mew', emoji: '✨', name: 'Mew', color: 'bg-pink-400' },
  { id: 'gengar', emoji: '👻', name: 'Gengar', color: 'bg-purple-600' },
  { id: 'snorlax', emoji: '💤', name: 'Snorlax', color: 'bg-blue-600' }
];

interface CardItem {
  id: string; // unique card id
  pairId: string;
  emoji: string;
  name: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryPairsGame: React.FC<MinigameSessionProps> = ({
  round,
  totalRounds,
  teamLives,
  maxTeamLives,
  combatWinChance,
  onRoundSuccess,
  onRoundFail
}) => {
  const config = getMemoryPairsDifficulty(round, combatWinChance);
  const totalCards = config.rows * config.cols;
  const numPairs = totalCards / 2;

  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(config.time_limit_seconds);
  const [isPreview, setIsPreview] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string>('¡Echa un vistazo a las parejas!');

  // Initialize Cards & Preview
  useEffect(() => {
    const selectedIcons = POKEMON_ICONS.slice(0, numPairs);
    const cardList: CardItem[] = [];

    selectedIcons.forEach((icon, idx) => {
      // Create pair
      cardList.push({
        id: `card-${idx}-a`,
        pairId: icon.id,
        emoji: icon.emoji,
        name: icon.name,
        color: icon.color,
        isFlipped: true,
        isMatched: false
      });
      cardList.push({
        id: `card-${idx}-b`,
        pairId: icon.id,
        emoji: icon.emoji,
        name: icon.name,
        color: icon.color,
        isFlipped: true,
        isMatched: false
      });
    });

    // Shuffle
    cardList.sort(() => Math.random() - 0.5);
    setCards(cardList);
    setIsPreview(true);
    setTimeLeft(config.time_limit_seconds);
    setFeedback(`Memoriza la ubicación (${config.preview_time_seconds}s preview)...`);

    // Preview timer -> face down after preview
    const previewTimer = setTimeout(() => {
      setCards(prev => prev.map(c => ({ ...c, isFlipped: false })));
      setIsPreview(false);
      setFeedback('¡Encuentra las parejas antes de que se agote el tiempo!');
    }, config.preview_time_seconds * 1000);

    return () => clearTimeout(previewTimer);
  }, [round, numPairs, config.preview_time_seconds, config.time_limit_seconds]);

  // Main Timer Countdown
  useEffect(() => {
    if (isPreview) return;

    if (timeLeft <= 0) {
      soundFx.playDefeat();
      setFeedback('¡Tiempo agotado!');
      onRoundFail();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPreview, timeLeft, onRoundFail]);

  const handleCardClick = (index: number) => {
    if (isPreview || cards[index].isFlipped || cards[index].isMatched || selectedCards.length >= 2) {
      return;
    }

    soundFx.playBeep();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [firstIdx, secondIdx] = newSelected;
      if (newCards[firstIdx].pairId === newCards[secondIdx].pairId) {
        // Match!
        soundFx.playLevelUp();
        newCards[firstIdx].isMatched = true;
        newCards[secondIdx].isMatched = true;
        setCards(newCards);
        setSelectedCards([]);

        // Check if all matched
        if (newCards.every(c => c.isMatched)) {
          soundFx.playLevelUp();
          setFeedback('¡Todas las parejas encontradas!');
          setTimeout(() => {
            onRoundSuccess();
          }, 600);
        }
      } else {
        // Not a match
        setTimeout(() => {
          setCards(prev => {
            const reset = [...prev];
            reset[firstIdx].isFlipped = false;
            reset[secondIdx].isFlipped = false;
            return reset;
          });
          setSelectedCards([]);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 space-y-3 max-w-md mx-auto">
      {/* Game Header */}
      <div className="w-full bg-slate-900 border-2 border-gray-900 rounded-lg p-3 text-white shadow">
        <div className="flex items-center justify-between text-xs font-black uppercase text-yellow-400 mb-1">
          <span>Rival #{round} de {totalRounds}</span>
          <span className="flex items-center gap-1 text-red-400 font-extrabold">
            <Clock className="w-3.5 h-3.5" />
            {timeLeft}s
          </span>
        </div>
        <div className="text-xs font-bold text-slate-200 text-center">
          {feedback}
        </div>
      </div>

      {/* Grid of Cards */}
      <div 
        className="grid gap-2 p-3 bg-slate-800 border-2 border-gray-900 rounded-xl shadow-inner w-full"
        style={{
          gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`
        }}
      >
        {cards.map((card, idx) => {
          const isOpen = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              disabled={isPreview || card.isMatched}
              onClick={() => handleCardClick(idx)}
              className={`h-20 rounded-lg border-2 border-gray-900 flex flex-col items-center justify-center font-black transition-all cursor-pointer shadow ${
                isOpen
                  ? `${card.color} text-gray-950 scale-100`
                  : 'bg-red-600 hover:bg-red-500 text-white active:scale-95'
              } ${card.isMatched ? 'opacity-60 ring-2 ring-emerald-400' : ''}`}
            >
              {isOpen ? (
                <>
                  <span className="text-2xl">{card.emoji}</span>
                  <span className="text-[10px] uppercase truncate max-w-full px-1">{card.name}</span>
                </>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-white/50 bg-white/20 flex items-center justify-center text-xs">
                   Poké
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
