import React, { useState, useEffect, useRef } from 'react';
import { MinigameSessionProps } from '../../types/minigames';
import { getSequenceRepeatDifficulty } from '../../data/minigamesConfig';
import { soundFx } from '../../utils/soundEffects';
import { Check, X, RefreshCw, Zap } from 'lucide-react';

export const SequenceRepeatGame: React.FC<MinigameSessionProps> = ({
  round,
  totalRounds,
  teamLives,
  maxTeamLives,
  combatWinChance,
  onRoundSuccess,
  onRoundFail
}) => {
  const config = getSequenceRepeatDifficulty(round, combatWinChance);
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [phase, setPhase] = useState<'showing' | 'playing' | 'success' | 'fail'>('showing');
  const [feedback, setFeedback] = useState<string>('¡Memoriza la secuencia de botones!');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate sequence when component mounts or round changes
  useEffect(() => {
    const buttons = config.available_buttons;
    const newSeq: string[] = [];
    for (let i = 0; i < config.sequence_length; i++) {
      const rand = buttons[Math.floor(Math.random() * buttons.length)];
      newSeq.push(rand);
    }
    setSequence(newSeq);
    setPlayerIndex(0);
    setPhase('showing');
    setFeedback(`¡Observa atentamente! Secuencia de ${config.sequence_length} botones...`);

    // Play sequence
    let step = 0;
    const interval = setInterval(() => {
      if (step < newSeq.length) {
        setActiveButton(newSeq[step]);
        soundFx.playBeep();
        setTimeout(() => setActiveButton(null), Math.max(150, config.display_speed_ms - 150));
        step++;
      } else {
        clearInterval(interval);
        setActiveButton(null);
        setPhase('playing');
        setFeedback('¡Es tu turno! Repite la secuencia tocando los botones.');
      }
    }, config.display_speed_ms);

    return () => clearInterval(interval);
  }, [round, config.sequence_length, config.display_speed_ms]);

  const handleButtonClick = (btn: string) => {
    if (phase !== 'playing') return;

    soundFx.playBeep();
    setActiveButton(btn);
    setTimeout(() => setActiveButton(null), 150);

    const expected = sequence[playerIndex];
    if (btn === expected) {
      const nextIndex = playerIndex + 1;
      setPlayerIndex(nextIndex);

      if (nextIndex === sequence.length) {
        // Complete!
        setPhase('success');
        setFeedback('¡Secuencia perfecta! ¡Ataque directo!');
        soundFx.playLevelUp();
        setTimeout(() => {
          onRoundSuccess();
        }, 800);
      }
    } else {
      // Wrong button!
      setPhase('fail');
      setFeedback(`¡Error! Pulsaste ${btn} pero era ${expected}.`);
      soundFx.playDefeat();
      setTimeout(() => {
        onRoundFail();
      }, 1000);
    }
  };

  const getButtonColor = (btn: string, isActive: boolean) => {
    switch (btn) {
      case 'A':
        return isActive 
          ? 'bg-red-500 text-white scale-105 ring-4 ring-red-300' 
          : 'bg-red-600 hover:bg-red-500 text-white border-red-800';
      case 'B':
        return isActive 
          ? 'bg-yellow-400 text-gray-950 scale-105 ring-4 ring-yellow-200' 
          : 'bg-yellow-500 hover:bg-yellow-400 text-gray-950 border-yellow-700';
      case 'X':
        return isActive 
          ? 'bg-sky-400 text-white scale-105 ring-4 ring-sky-200' 
          : 'bg-sky-600 hover:bg-sky-500 text-white border-sky-800';
      case 'Y':
        return isActive 
          ? 'bg-emerald-400 text-gray-950 scale-105 ring-4 ring-emerald-200' 
          : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-800';
      default:
        return 'bg-gray-700 text-white';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4 max-w-md mx-auto">
      {/* Game Header Status */}
      <div className="w-full bg-slate-900 border-2 border-gray-900 rounded-lg p-3 text-white text-center shadow">
        <div className="flex items-center justify-between text-xs font-black uppercase text-yellow-400 mb-1">
          <span>Rival #{round} de {totalRounds}</span>
          <span>Vidas Equipo: {teamLives}/{maxTeamLives}</span>
        </div>
        <div className="text-sm font-bold text-slate-200 flex items-center justify-center gap-1">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>{feedback}</span>
        </div>
      </div>

      {/* Sequence Progress Indicators */}
      <div className="flex items-center space-x-2">
        {sequence.map((btn, idx) => {
          let state = 'pending';
          if (idx < playerIndex) state = 'done';
          if (idx === playerIndex && phase === 'playing') state = 'current';

          return (
            <div
              key={idx}
              className={`w-9 h-9 rounded-full border-2 border-gray-900 flex items-center justify-center font-black text-sm transition-all ${
                state === 'done'
                  ? 'bg-emerald-500 text-white border-emerald-700'
                  : state === 'current'
                  ? 'bg-yellow-300 text-gray-950 border-yellow-600 animate-bounce'
                  : 'bg-slate-200 text-gray-500'
              }`}
            >
              {idx < playerIndex ? <Check className="w-5 h-5" /> : idx + 1}
            </div>
          );
        })}
      </div>

      {/* Button Pad */}
      <div className="grid grid-cols-2 gap-3 w-64 h-64 p-4 bg-slate-800 border-4 border-gray-900 rounded-3xl shadow-xl relative">
        {config.available_buttons.map(btn => {
          const isActive = activeButton === btn;
          return (
            <button
              key={btn}
              disabled={phase !== 'playing'}
              onClick={() => handleButtonClick(btn)}
              className={`w-full h-full rounded-2xl font-black text-2xl border-b-4 shadow-lg active:border-b-0 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center ${getButtonColor(
                btn,
                isActive
              )} ${phase !== 'playing' ? 'cursor-not-allowed opacity-90' : ''}`}
            >
              {btn}
            </button>
          );
        })}
      </div>

      <div className="text-xs text-gray-500 font-bold text-center">
        {phase === 'showing' && '⏳ Memoriza el orden de los colores...'}
        {phase === 'playing' && '👆 Toca los botones en el orden mostrado.'}
      </div>
    </div>
  );
};
