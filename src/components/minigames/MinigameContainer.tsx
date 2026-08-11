import React, { useState } from 'react';
import { MinigameId } from '../../types/minigames';
import { SequenceRepeatGame } from './SequenceRepeatGame';
import { MemoryPairsGame } from './MemoryPairsGame';
import { TimingBarGame } from './TimingBarGame';
import { ShellGame } from './ShellGame';
import { TacticalStrikeGame } from './TacticalStrikeGame';
import { MINIGAMES_CONFIG } from '../../data/minigamesConfig';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, ShieldAlert, Heart, Trophy, Zap, RefreshCw, X, Sparkles } from 'lucide-react';

interface MinigameContainerProps {
  eventType: 'capture' | 'combat';
  eventTitle: string;
  enemyTeamCount: number;
  teamSize: number;
  combatWinChance: number;
  onSuccess: () => void;
  onDefeat: () => void;
  onCancel: () => void;
}

const ALL_MINIGAMES: MinigameId[] = [
  'sequence_repeat',
  'memory_pairs',
  'timing_bar',
  'shell_game',
  'pkmn_tactical_strike'
];

export const MinigameContainer: React.FC<MinigameContainerProps> = ({
  eventType,
  eventTitle,
  enemyTeamCount,
  teamSize,
  combatWinChance,
  onSuccess,
  onDefeat,
  onCancel
}) => {
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [teamLives, setTeamLives] = useState<number>(Math.max(1, teamSize));
  const [roundNotice, setRoundNotice] = useState<string | null>(null);

  // Pick random minigame for this event session
  const [activeMinigameId] = useState<MinigameId>(() => {
    return ALL_MINIGAMES[Math.floor(Math.random() * ALL_MINIGAMES.length)];
  });

  const minigameInfo = MINIGAMES_CONFIG[activeMinigameId];

  const handleRoundSuccess = () => {
    if (currentRound >= enemyTeamCount) {
      // Victory! All enemy Pokemons defeated!
      setRoundNotice('🏆 ¡VICTORIA TOTAL! Has superado el desafío.');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } else {
      // Next Enemy Pokemon
      const nextRound = currentRound + 1;
      setRoundNotice(`⚡ ¡Pokémon Rival #${currentRound} derrotado! Entra Pokémon Rival #${nextRound}...`);
      setTimeout(() => {
        setCurrentRound(nextRound);
        setRoundNotice(null);
      }, 1200);
    }
  };

  const handleRoundFail = () => {
    const nextLives = teamLives - 1;
    setTeamLives(nextLives);

    if (nextLives <= 0) {
      // Out of team lives -> Defeat!
      setRoundNotice('💀 ¡Tu equipo Pokémon ha caído en combate! Desafío fallido.');
      setTimeout(() => {
        onDefeat();
      }, 1200);
    } else {
      // Lives remaining -> Retry or next mon
      setRoundNotice(`⚠️ ¡Tu Pokémon ha caído! Te quedan ${nextLives} Pokémon en pie. ¡Siguiente intento!`);
      setTimeout(() => {
        setRoundNotice(null);
      }, 1400);
    }
  };

  const renderMinigameComponent = () => {
    const commonProps = {
      round: currentRound,
      totalRounds: enemyTeamCount,
      teamLives: teamLives,
      maxTeamLives: Math.max(1, teamSize),
      combatWinChance: combatWinChance,
      onRoundSuccess: handleRoundSuccess,
      onRoundFail: handleRoundFail
    };

    switch (activeMinigameId) {
      case 'sequence_repeat':
        return <SequenceRepeatGame {...commonProps} />;
      case 'memory_pairs':
        return <MemoryPairsGame {...commonProps} />;
      case 'timing_bar':
        return <TimingBarGame {...commonProps} />;
      case 'shell_game':
        return <ShellGame {...commonProps} />;
      case 'pkmn_tactical_strike':
        return <TacticalStrikeGame {...commonProps} />;
      default:
        return <TimingBarGame {...commonProps} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-slate-900 border-4 border-gray-900 rounded-3xl overflow-hidden shadow-2xl text-white font-mono flex flex-col my-auto"
      >
        {/* Modal Top Bar */}
        <div className="bg-red-600 text-white p-3.5 flex items-center justify-between border-b-4 border-gray-900">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="p-1.5 bg-yellow-400 rounded-lg text-gray-950 font-black border border-gray-900 shrink-0">
              {eventType === 'capture' ? <Sparkles className="w-5 h-5" /> : <Swords className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-black uppercase text-yellow-300 block">
                {eventType === 'capture' ? '¡EVENTO DE CAPTURA DE POKÉMON!' : '¡EVENTO DE COMBATE DE ENTRENADOR!'}
              </span>
              <h3 className="text-sm font-black truncate">{eventTitle}</h3>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border-2 border-gray-900 cursor-pointer"
            title="Rendirse / Salir"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Dashboard Banner */}
        <div className="p-3 bg-slate-950 border-b-2 border-gray-800 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-900 border border-gray-700 rounded-lg p-2 flex items-center space-x-2">
            <div className="p-1 bg-yellow-400 rounded text-gray-950 font-black">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-black">Pokémons Rivales</div>
              <div className="font-extrabold text-yellow-300">
                #{currentRound} de {enemyTeamCount}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-gray-700 rounded-lg p-2 flex items-center space-x-2">
            <div className="p-1 bg-red-500 rounded text-white font-black">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-black">Vidas de tu Equipo</div>
              <div className="font-extrabold text-emerald-400">
                {teamLives} / {Math.max(1, teamSize)}
              </div>
            </div>
          </div>
        </div>

        {/* Minigame Info Banner */}
        <div className="px-4 py-2 bg-slate-800/80 border-b border-gray-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-yellow-400 text-gray-950 font-black uppercase text-[10px]">
              Minijuego
            </span>
            <span className="font-bold text-yellow-300 uppercase">{minigameInfo.name}</span>
          </div>
          <span className="text-[10px] text-gray-400 font-sans italic">
            Dificultad Progresiva
          </span>
        </div>

        {/* Round Intermission Notice */}
        <AnimatePresence>
          {roundNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-amber-400 text-gray-950 font-black text-xs text-center border-b-2 border-gray-900 flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 text-gray-950 fill-current animate-bounce" />
              <span>{roundNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minigame Body */}
        <div className="p-2 flex-1 flex flex-col justify-center">
          {renderMinigameComponent()}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t-2 border-gray-800 text-center text-[10px] text-gray-400 font-sans">
          Derrota a los {enemyTeamCount} Pokémon para ganar el combate. Oportunidades según el tamaño de tu equipo ({teamSize}).
        </div>
      </motion.div>
    </div>
  );
};
