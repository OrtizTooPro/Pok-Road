import React, { useState, useEffect } from 'react';
import { MinigameSessionProps } from '../../types/minigames';
import { getTacticalStrikeDifficulty } from '../../data/minigamesConfig';
import { soundFx } from '../../utils/soundEffects';
import { Shield, ShieldAlert, Sparkles, Sword, Crosshair } from 'lucide-react';

const GRID_ZONES = [
  { id: 'top_left', label: 'Cabeza Izq' },
  { id: 'top_center', label: 'Cabeza Centro' },
  { id: 'top_right', label: 'Cabeza Der' },
  { id: 'bottom_left', label: 'Cuerpo Izq' },
  { id: 'bottom_center', label: 'Cuerpo Centro' },
  { id: 'bottom_right', label: 'Cuerpo Der' }
];

export const TacticalStrikeGame: React.FC<MinigameSessionProps> = ({
  round,
  totalRounds,
  teamLives,
  maxTeamLives,
  combatWinChance,
  onRoundSuccess,
  onRoundFail
}) => {
  const config = getTacticalStrikeDifficulty(round, combatWinChance);

  const [attemptsLeft, setAttemptsLeft] = useState<number>(config.max_attempts);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [usedZones, setUsedZones] = useState<string[]>([]);
  const [blockedZones, setBlockedZones] = useState<string[]>(['top_center', 'bottom_right']);
  const [feedback, setFeedback] = useState<string>('¡Encuentra las brechas en la guardia del rival!');

  // Defender shifts guard interval
  useEffect(() => {
    if (attemptsLeft <= 0 || currentScore >= config.target_score_to_win) return;

    const interval = setInterval(() => {
      // Pick random zones to block
      const allZoneIds = GRID_ZONES.map(z => z.id);
      const shuffled = [...allZoneIds].sort(() => Math.random() - 0.5);
      const newBlocked = shuffled.slice(0, config.blocked_zones_count_simultaneous);
      setBlockedZones(newBlocked);
    }, config.defender_switch_interval_ms);

    return () => clearInterval(interval);
  }, [attemptsLeft, currentScore, config]);

  const handleZoneStrike = (zoneId: string, label: string) => {
    if (attemptsLeft <= 0 || currentScore >= config.target_score_to_win) return;

    if (usedZones.includes(zoneId)) {
      setFeedback('⚠️ Esa zona ya no se puede volver a atacar.');
      return;
    }

    const nextAttempts = attemptsLeft - 1;
    setAttemptsLeft(nextAttempts);

    if (blockedZones.includes(zoneId)) {
      // Blocked!
      soundFx.playDefeat();
      setFeedback(`🛡️ ¡El rival ha bloqueado tu ataque en ${label}!`);

      if (nextAttempts === 0 && currentScore < config.target_score_to_win) {
        setTimeout(() => {
          onRoundFail();
        }, 900);
      }
    } else {
      // Direct Hit!
      soundFx.playLevelUp();
      const nextScore = currentScore + 1;
      setCurrentScore(nextScore);
      setUsedZones(prev => [...prev, zoneId]);
      setFeedback(`💥 ¡Golpe directo al punto débil en ${label}! (${nextScore}/${config.target_score_to_win})`);

      if (nextScore >= config.target_score_to_win) {
        setTimeout(() => {
          onRoundSuccess();
        }, 800);
      } else if (nextAttempts === 0 && nextScore < config.target_score_to_win) {
        setTimeout(() => {
          onRoundFail();
        }, 900);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 space-y-3 max-w-md mx-auto">
      {/* Header */}
      <div className="w-full bg-slate-900 border-2 border-gray-900 rounded-lg p-3 text-white shadow">
        <div className="flex items-center justify-between text-xs font-black uppercase text-yellow-400 mb-1">
          <span>Rival #{round} de {totalRounds}</span>
          <div className="flex items-center gap-2">
            <span>Score: {currentScore}/{config.target_score_to_win}</span>
            <span>Intentos: {attemptsLeft}/{config.max_attempts}</span>
          </div>
        </div>
        <div className="text-xs font-bold text-slate-200 text-center flex items-center justify-center gap-1">
          <Crosshair className="w-4 h-4 text-red-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      </div>

      {/* 3x2 Tactical Strike Grid */}
      <div className="grid grid-cols-3 gap-2.5 p-4 bg-slate-800 border-4 border-gray-900 rounded-2xl shadow-xl w-full">
        {GRID_ZONES.map(zone => {
          const isUsed = usedZones.includes(zone.id);
          const isBlocked = blockedZones.includes(zone.id);

          return (
            <button
              key={zone.id}
              disabled={isUsed || attemptsLeft <= 0}
              onClick={() => handleZoneStrike(zone.id, zone.label)}
              className={`h-24 rounded-xl border-2 border-gray-900 flex flex-col items-center justify-center p-2 font-black transition-all cursor-pointer relative shadow ${
                isUsed
                  ? 'bg-emerald-500 text-gray-950 opacity-80 border-emerald-700'
                  : isBlocked
                  ? 'bg-purple-900/90 text-purple-200 border-purple-500 ring-2 ring-purple-400'
                  : 'bg-amber-400 hover:bg-amber-300 text-gray-950 border-amber-600 hover:scale-105 active:scale-95'
              }`}
            >
              {isUsed ? (
                <div className="flex flex-col items-center">
                  <span className="text-2xl">💥</span>
                  <span className="text-[10px] font-black uppercase text-gray-950">IMPACTO</span>
                </div>
              ) : isBlocked ? (
                <div className="flex flex-col items-center">
                  <ShieldAlert className="w-7 h-7 text-yellow-300 animate-pulse" />
                  <span className="text-[9px] font-black uppercase text-purple-200 mt-1">ESCUDO RIVAL</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Sword className="w-6 h-6 text-gray-950" />
                  <span className="text-[10px] font-black uppercase text-gray-950 mt-1">{zone.label}</span>
                  <span className="text-[8px] text-gray-800 uppercase font-sans">¡ATACAR!</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
