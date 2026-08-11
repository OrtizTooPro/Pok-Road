import React, { useState, useEffect } from 'react';
import { MinigameSessionProps } from '../../types/minigames';
import { getShellGameDifficulty } from '../../data/minigamesConfig';
import { soundFx } from '../../utils/soundEffects';
import { HelpCircle, Sparkles } from 'lucide-react';

export const ShellGame: React.FC<MinigameSessionProps> = ({
  round,
  totalRounds,
  teamLives,
  maxTeamLives,
  combatWinChance,
  onRoundSuccess,
  onRoundFail
}) => {
  const config = getShellGameDifficulty(round, combatWinChance);
  const count = config.shell_count;

  // Track positions of items
  const [targetIndex, setTargetIndex] = useState<number>(0);
  const [positions, setPositions] = useState<number[]>([]); // positions[shellId] = currentIndex
  const [revealedIndex, setRevealedIndex] = useState<number | null>(0); // Initially reveal shell 0
  const [phase, setPhase] = useState<'preview' | 'shuffling' | 'guessing' | 'result'>('preview');
  const [feedback, setFeedback] = useState<string>('¡Sigue con la mirada el contenedor correcto!');

  useEffect(() => {
    // Initial positions: [0, 1, 2, ...]
    const initialPos = Array.from({ length: count }, (_, i) => i);
    setPositions(initialPos);
    setTargetIndex(0);
    setRevealedIndex(0);
    setPhase('preview');
    setFeedback('¡Atento! El objetivo está debajo de la primera Pokéball...');

    // Preview timer -> close and shuffle
    const previewTimer = setTimeout(() => {
      setRevealedIndex(null);
      setPhase('shuffling');
      setFeedback('¡Mezclando contenedores! Sigue el movimiento...');

      let currentPos = [...initialPos];
      let swapsLeft = config.shuffle_swaps;
      const swapIntervalTime = Math.max(250, Math.round(600 / config.shuffle_speed));

      const interval = setInterval(() => {
        if (swapsLeft > 0) {
          // Swap two random positions
          const idx1 = Math.floor(Math.random() * count);
          let idx2 = Math.floor(Math.random() * count);
          while (idx2 === idx1) {
            idx2 = Math.floor(Math.random() * count);
          }

          const temp = currentPos[idx1];
          currentPos[idx1] = currentPos[idx2];
          currentPos[idx2] = temp;

          setPositions([...currentPos]);
          soundFx.playBeep();
          swapsLeft--;
        } else {
          clearInterval(interval);
          setPhase('guessing');
          setFeedback('¿En qué Pokéball se oculta el objetivo?');
        }
      }, swapIntervalTime);

    }, 1800);

    return () => clearTimeout(previewTimer);
  }, [round, count, config.shuffle_speed, config.shuffle_swaps]);

  const handleShellClick = (shellId: number) => {
    if (phase !== 'guessing') return;

    setRevealedIndex(shellId);
    setPhase('result');

    if (shellId === targetIndex) {
      soundFx.playLevelUp();
      setFeedback('🎉 ¡CORRECTO! Encontraste el contenedor objetivo.');
      setTimeout(() => {
        onRoundSuccess();
      }, 800);
    } else {
      soundFx.playDefeat();
      setFeedback('❌ ¡Incorrecto! Estaba en otro contenedor.');
      setTimeout(() => {
        onRoundFail();
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 space-y-4 max-w-md mx-auto">
      {/* Header */}
      <div className="w-full bg-slate-900 border-2 border-gray-900 rounded-lg p-3 text-white text-center shadow">
        <div className="flex items-center justify-between text-xs font-black uppercase text-yellow-400 mb-1">
          <span>Rival #{round} de {totalRounds}</span>
          <span>Vidas: {teamLives}/{maxTeamLives}</span>
        </div>
        <div className="text-xs font-bold text-slate-200">
          {feedback}
        </div>
      </div>

      {/* Shell Container */}
      <div className="w-full p-6 bg-slate-800 border-4 border-gray-900 rounded-2xl shadow-xl flex items-center justify-center gap-3">
        {Array.from({ length: count }, (_, shellId) => {
          const currentVisualSlot = positions[shellId];
          const isTarget = shellId === targetIndex;
          const isRevealed = revealedIndex === shellId || phase === 'result';

          return (
            <button
              key={shellId}
              disabled={phase !== 'guessing'}
              onClick={() => handleShellClick(shellId)}
              className={`w-20 h-24 rounded-2xl border-4 border-gray-900 flex flex-col items-center justify-center transition-all duration-300 shadow-lg cursor-pointer ${
                isRevealed && isTarget
                  ? 'bg-yellow-400 border-yellow-600 scale-105'
                  : isRevealed && !isTarget
                  ? 'bg-gray-400 border-gray-600'
                  : 'bg-red-600 hover:bg-red-500 border-red-900'
              } ${phase === 'guessing' ? 'hover:scale-105 active:scale-95' : ''}`}
            >
              {isRevealed ? (
                isTarget ? (
                  <div className="flex flex-col items-center animate-bounce">
                    <span className="text-3xl">⚡</span>
                    <span className="text-[10px] font-black text-gray-950 uppercase">¡AQUÍ!</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center opacity-60">
                    <span className="text-2xl">💨</span>
                    <span className="text-[9px] font-bold text-gray-800 uppercase">VACÍO</span>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center text-white font-black">
                  <div className="w-8 h-8 rounded-full border-2 border-white/60 bg-white/30 flex items-center justify-center text-xs">
                    ?
                  </div>
                  <span className="text-[10px] text-yellow-300 mt-1 uppercase">PokéBall</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
