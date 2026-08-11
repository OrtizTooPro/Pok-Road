import React, { useState, useEffect, useRef } from 'react';
import { MinigameSessionProps } from '../../types/minigames';
import { getTimingBarDifficulty } from '../../data/minigamesConfig';
import { soundFx } from '../../utils/soundEffects';
import { Target, Zap } from 'lucide-react';

export const TimingBarGame: React.FC<MinigameSessionProps> = ({
  round,
  totalRounds,
  teamLives,
  maxTeamLives,
  combatWinChance,
  onRoundSuccess,
  onRoundFail
}) => {
  const config = getTimingBarDifficulty(round, combatWinChance);

  const [indicatorPos, setIndicatorPos] = useState<number>(0); // 0 to 100
  const [targetPos, setTargetPos] = useState<number>(35); // Left boundary of target zone
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  const [targetDir, setTargetDir] = useState<'right' | 'left'>('right');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [resultStatus, setResultStatus] = useState<'none' | 'success' | 'fail'>('none');
  const [feedback, setFeedback] = useState<string>('¡Pulsa cuando el puntero esté en la zona verde!');

  const requestRef = useRef<number | null>(null);

  // Animation Loop for Indicator & Moving Target
  useEffect(() => {
    if (isLocked) return;

    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Update Indicator Position
      setIndicatorPos(prev => {
        const step = delta * 80 * config.indicator_speed;
        if (direction === 'right') {
          const next = prev + step;
          if (next >= 100) {
            setDirection('left');
            return 100;
          }
          return next;
        } else {
          const next = prev - step;
          if (next <= 0) {
            setDirection('right');
            return 0;
          }
          return next;
        }
      });

      // Update Target Position if Movement Enabled
      if (config.target_zone_movement) {
        setTargetPos(prev => {
          const targetStep = delta * 20;
          const maxLeft = 100 - config.target_zone_size_percent;
          if (targetDir === 'right') {
            const next = prev + targetStep;
            if (next >= maxLeft) {
              setTargetDir('left');
              return maxLeft;
            }
            return next;
          } else {
            const next = prev - targetStep;
            if (next <= 0) {
              setTargetDir('right');
              return 0;
            }
            return next;
          }
        });
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [direction, targetDir, config, isLocked]);

  const handleStrike = () => {
    if (isLocked) return;

    setIsLocked(true);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    const targetStart = targetPos;
    const targetEnd = targetPos + config.target_zone_size_percent;

    if (indicatorPos >= targetStart && indicatorPos <= targetEnd) {
      // Direct Hit!
      setResultStatus('success');
      setFeedback('🎯 ¡GOLPE DIRECTO EN LA ZONA DE IMPACTO!');
      soundFx.playLevelUp();
      setTimeout(() => {
        onRoundSuccess();
      }, 700);
    } else {
      // Missed!
      setResultStatus('fail');
      setFeedback('❌ ¡Ataque fallido! Fuera de la zona objetivo.');
      soundFx.playDefeat();
      setTimeout(() => {
        onRoundFail();
      }, 900);
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

      {/* Timing Bar Container */}
      <div className="w-full p-4 bg-slate-800 border-4 border-gray-900 rounded-2xl shadow-xl space-y-4">
        <div className="flex justify-between items-center text-xs font-black text-amber-300 uppercase">
          <span>0%</span>
          <span className="flex items-center gap-1">
            <Target className="w-4 h-4 text-emerald-400" />
            Zona Objetivo: {Math.round(config.target_zone_size_percent)}%
          </span>
          <span>100%</span>
        </div>

        {/* The Track */}
        <div className="relative w-full h-12 bg-slate-950 rounded-xl border-2 border-gray-700 overflow-hidden shadow-inner">
          {/* Target Zone */}
          <div
            className={`absolute top-0 bottom-0 transition-colors ${
              resultStatus === 'success'
                ? 'bg-emerald-400 border-2 border-emerald-200 animate-pulse'
                : 'bg-emerald-500/80 border-x-2 border-emerald-300'
            }`}
            style={{
              left: `${targetPos}%`,
              width: `${config.target_zone_size_percent}%`
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-gray-950 uppercase opacity-75">
              OBJETIVO
            </div>
          </div>

          {/* Indicator Pointer */}
          <div
            className={`absolute top-0 bottom-0 w-3 -ml-1.5 rounded-full border-2 border-white shadow-lg transition-transform ${
              resultStatus === 'success'
                ? 'bg-yellow-300 scale-125 z-20'
                : resultStatus === 'fail'
                ? 'bg-red-500 z-20'
                : 'bg-yellow-400 z-10'
            }`}
            style={{ left: `${indicatorPos}%` }}
          />
        </div>

        {/* Action Button */}
        <button
          disabled={isLocked}
          onClick={handleStrike}
          className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-wider border-b-4 shadow-lg active:border-b-0 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2 ${
            isLocked
              ? 'bg-gray-600 text-gray-400 border-gray-800'
              : 'bg-yellow-400 hover:bg-yellow-300 text-gray-950 border-yellow-700'
          }`}
        >
          <Zap className="w-6 h-6 fill-current" />
          <span>¡Lanzar Ataque Táctico!</span>
        </button>
      </div>
    </div>
  );
};
