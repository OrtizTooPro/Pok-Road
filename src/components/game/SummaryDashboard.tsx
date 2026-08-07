import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Trophy, Swords, Calendar, Award, Sparkles, Compass, ShieldCheck, Heart, Zap, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { REGIONAL_BADGES } from '../../data/badges';
import { motion, AnimatePresence } from 'motion/react';

export const SummaryDashboard: React.FC = () => {
  const { state } = useGame();
  const { career, historyLog, specialization } = state;
  const [isExpanded, setIsExpanded] = useState(true);

  const victories = career.victories || 0;
  const defeats = career.defeats || 0;
  const totalBattles = victories + defeats;
  const winRate = totalBattles > 0 ? Math.round((victories / totalBattles) * 100) : 100;

  const pokemonCaught = career.pokemonCaught || 1;
  const daysSpent = career.daysSpent || 1;

  // Format days into approximate months and years in Kanto
  const monthsApprox = Math.floor(daysSpent / 30);
  const daysRemainder = daysSpent % 30;
  const daysFormattedSubtext = monthsApprox > 0
    ? `~${monthsApprox} mes${monthsApprox > 1 ? 'es' : ''} ${daysRemainder > 0 ? `y ${daysRemainder}d` : ''} en ruta`
    : `${daysSpent} día${daysSpent > 1 ? 's' : ''} de exploración`;

  const totalBadges = career.badgesWon ? career.badgesWon.length : 0;
  const earnedBadges = REGIONAL_BADGES.filter(b => career.badgesWon.includes(b.id));

  return (
    <div className="bg-white border-2 border-gray-800 rounded-md overflow-hidden shadow-md font-mono text-gray-800 transition-all">
      {/* Header Bar - Collapsible Trigger */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gray-900 hover:bg-gray-800 text-white font-bold flex items-center justify-between px-3 py-2 border-b-2 border-gray-900 shadow-sm cursor-pointer select-none transition-colors"
      >
        <div className="flex items-center space-x-2 text-xs uppercase tracking-wider">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span>PANEL DE RESUMEN Y REGISTRO DE CARRERA</span>
        </div>
        <div className="flex items-center space-x-2 text-[11px]">
          <div className="text-emerald-400 font-bold hidden sm:flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            <span>REGIÓN DE KANTO</span>
          </div>
          <span className="px-2 py-0.5 bg-gray-700 text-white font-extrabold border border-gray-600 rounded flex items-center gap-1 text-[10px] uppercase shadow-xs">
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-white" /> : <ChevronDown className="w-3.5 h-3.5 text-white" />}
            <span>{isExpanded ? 'PLEGAR' : 'DESPLEGAR'}</span>
          </span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
        {/* Top 3 Highlight Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 1. Total Victories */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-600 rounded-md p-3.5 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-amber-700 transition-all">
            <div className="absolute -right-3 -bottom-3 text-amber-200/50 pointer-events-none">
              <Swords className="w-20 h-20" />
            </div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <Swords className="w-3.5 h-3.5 text-amber-600" />
                  <span>VICTORIAS TOTALES</span>
                </span>
                <div className="text-3xl font-black text-amber-950 mt-1 tracking-tight">
                  {victories.toLocaleString('es-ES')}
                </div>
              </div>
              <span className="px-2 py-0.5 bg-amber-200 text-amber-900 border border-amber-600 rounded text-[10px] font-bold uppercase shadow-xs">
                COMBATE
              </span>
            </div>

            <div className="mt-3 pt-2 border-t border-amber-200 text-xs text-amber-900 font-bold flex items-center justify-between relative z-10">
              <span>EFECTIVIDAD: <span className="text-emerald-700 font-black">{winRate}%</span></span>
              <span className="text-[10px] text-gray-600">{defeats} DERROTAS</span>
            </div>
          </div>

          {/* 2. Total Pokémon Caught */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-600 rounded-md p-3.5 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-emerald-700 transition-all">
            <div className="absolute -right-3 -bottom-3 text-emerald-200/50 pointer-events-none">
              <Sparkles className="w-20 h-20" />
            </div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                  <span className="text-base leading-none">🔴</span>
                  <span>POKÉMON CAPTURADOS</span>
                </span>
                <div className="text-3xl font-black text-emerald-950 mt-1 tracking-tight">
                  {pokemonCaught.toLocaleString('es-ES')}
                </div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 border border-emerald-600 rounded text-[10px] font-bold uppercase shadow-xs">
                POKÉDEX
              </span>
            </div>

            <div className="mt-3 pt-2 border-t border-emerald-200 text-xs text-emerald-900 font-bold flex items-center justify-between relative z-10">
              <span>EQUIPO ACTIVO: <span className="text-emerald-800 font-black">{career.team.length}/6</span></span>
              <span className="text-[10px] text-gray-600">KANTO #151</span>
            </div>
          </div>

          {/* 3. Total Days Spent in Region */}
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-600 rounded-md p-3.5 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-sky-700 transition-all">
            <div className="absolute -right-3 -bottom-3 text-sky-200/50 pointer-events-none">
              <Calendar className="w-20 h-20" />
            </div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  <span>DÍAS EN LA REGIÓN</span>
                </span>
                <div className="text-3xl font-black text-sky-950 mt-1 tracking-tight">
                  {daysSpent.toLocaleString('es-ES')} <span className="text-sm font-extrabold text-sky-700">DÍAS</span>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-sky-200 text-sky-900 border border-sky-600 rounded text-[10px] font-bold uppercase shadow-xs">
                EXPEDICIÓN
              </span>
            </div>

            <div className="mt-3 pt-2 border-t border-sky-200 text-xs text-sky-900 font-bold flex items-center justify-between relative z-10">
              <span className="truncate">{daysFormattedSubtext}</span>
              <span className="text-[10px] text-sky-800 shrink-0 ml-1">{career.age} AÑOS</span>
            </div>
          </div>
        </div>

        {/* Secondary Detailed Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Badges Progress */}
          <div className="bg-gray-50 border-2 border-gray-800 rounded-md p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1 text-gray-900 uppercase text-[11px]">
                <Award className="w-3.5 h-3.5 text-red-600" />
                <span>MEDALLAS</span>
              </span>
              <span className="text-red-600 font-black">{totalBadges} / 8</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded border border-gray-800 overflow-hidden">
              <div 
                className="bg-red-600 h-full transition-all duration-500" 
                style={{ width: `${(totalBadges / 8) * 100}%` }}
              ></div>
            </div>
            {/* Mini badge sprites row */}
            <div className="flex items-center gap-1 overflow-x-auto pt-0.5">
              {REGIONAL_BADGES.slice(0, 8).map((b) => {
                const isEarned = career.badgesWon.includes(b.id);
                return (
                  <div key={b.id} title={b.name} className={`w-5 h-5 rounded border flex items-center justify-center p-0.5 shrink-0 ${isEarned ? 'bg-amber-200 border-amber-600' : 'bg-gray-200 border-gray-300 opacity-30 filter grayscale'}`}>
                    {b.spriteUrl ? (
                      <img src={b.spriteUrl} alt={b.name} className="w-4 h-4 object-contain [image-rendering:pixelated]" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-[8px] font-black">{b.name[0]}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Specialization Bonus */}
          <div className="bg-gray-50 border-2 border-gray-800 rounded-md p-3 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1 text-gray-900 uppercase text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>ESPECIALIDAD</span>
              </span>
            </div>
            <div className="text-sm font-black text-gray-900 uppercase truncate">
              {specialization}
            </div>
            <p className="text-[10px] text-gray-600 font-bold truncate">
              Bono pasivo activo en eventos
            </p>
          </div>

          {/* Events Completed */}
          <div className="bg-gray-50 border-2 border-gray-800 rounded-md p-3 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1 text-gray-900 uppercase text-[11px]">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                <span>EVENTOS RESUELTOS</span>
              </span>
            </div>
            <div className="text-sm font-black text-gray-900">
              {historyLog.length} <span className="text-xs font-bold text-gray-600">CAPÍTULOS</span>
            </div>
            <p className="text-[10px] text-gray-600 font-bold truncate">
              Decisiones registradas en tu diario
            </p>
          </div>

          {/* Unlocked Achievements */}
          <div className="bg-gray-50 border-2 border-gray-800 rounded-md p-3 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1 text-gray-900 uppercase text-[11px]">
                <Trophy className="w-3.5 h-3.5 text-yellow-600" />
                <span>LOGROS OBTENIDOS</span>
              </span>
            </div>
            <div className="text-sm font-black text-gray-900">
              {career.unlockedAchievements?.length || 0} <span className="text-xs font-bold text-gray-600">DESBLOQUEADOS</span>
            </div>
            <p className="text-[10px] text-gray-600 font-bold truncate">
              Hitos de carrera completados
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
</div>
  );
};
