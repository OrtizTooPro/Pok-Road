import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../../context/GameContext';
import { REGIONAL_BADGES } from '../../data/badges';
import { Badge } from '../../types';
import { ACHIEVEMENTS } from '../../data/achievements';
import { Award, CheckCircle2, Sparkles, Lock, X, ChevronDown, ChevronUp } from 'lucide-react';

export const BadgeCase: React.FC = () => {
  const { state } = useGame();
  const earnedBadgeIds = state.career.badgesWon;
  const unlockedAchievementIds = state.career.unlockedAchievements || [];
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAchievementsExpanded, setIsAchievementsExpanded] = useState(true);

  return (
    <div className="badge-case bg-white border-2 border-gray-800 rounded-md overflow-hidden shadow-md font-mono text-gray-800 transition-all">
      {/* Header Bar - Collapsible Trigger */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-between px-3 py-2 font-bold tracking-wide border-b-2 border-gray-900 cursor-pointer select-none transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-white" />
          <span className="text-xs uppercase">ESTUCHE OFICIAL DE MEDALLAS Y TROFEOS</span>
        </div>
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="text-[11px] font-bold bg-red-800 px-2 py-0.5 rounded border border-gray-900">
            {earnedBadgeIds.length} / {REGIONAL_BADGES.length} CONSEGUIDAS
          </span>
          <span className="px-2 py-0.5 bg-white text-gray-900 font-extrabold border border-gray-900 rounded flex items-center gap-1 text-[10px] uppercase shadow-xs">
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-gray-900" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-900" />}
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
            <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {REGIONAL_BADGES.map((badge, idx) => {
            const isEarned = earnedBadgeIds.includes(badge.id);
            return (
              <motion.div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                initial={isEarned ? { scale: 0.1, opacity: 0, y: 20 } : { scale: 1, opacity: 0.4 }}
                animate={{
                  scale: 1,
                  opacity: isEarned ? 1 : 0.4,
                  y: 0
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 20,
                  delay: isEarned ? idx * 0.06 : 0
                }}
                whileHover={{ scale: 1.08, y: -3 }}
                className={`relative group rounded-md p-2.5 flex flex-col items-center justify-center text-center transition-all border-2 cursor-pointer ${
                  isEarned
                    ? 'bg-gradient-to-br from-amber-100 via-yellow-200 to-amber-300 border-amber-600 shadow-[0_0_14px_rgba(245,158,11,0.5)] ring-2 ring-amber-400/50'
                    : 'bg-gray-100 border-dashed border-gray-300 filter grayscale opacity-40'
                }`}
              >
                {/* Badge Number Symbol with Glow */}
                <motion.div
                  initial={isEarned ? { scale: 0, rotate: -45 } : false}
                  animate={isEarned ? { scale: [0, 1.3, 1], rotate: 0 } : {}}
                  transition={{ delay: idx * 0.06 + 0.15, duration: 0.35, type: 'spring' }}
                  className={`w-8 h-8 sm:w-7 sm:h-7 rounded border-2 border-gray-900 flex items-center justify-center mb-1 text-xs font-black relative overflow-hidden ${
                    isEarned 
                      ? 'bg-amber-400 text-gray-900 shadow-[0_0_10px_rgba(251,191,36,0.8)]' 
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  {isEarned && (
                    <div className="absolute inset-0 bg-white/40 animate-pulse pointer-events-none"></div>
                  )}
                  <span className="relative z-10">{idx + 1}</span>
                </motion.div>

                <span className={`text-[10px] sm:text-[9px] font-black leading-tight truncate max-w-full uppercase ${isEarned ? 'text-amber-950' : 'text-gray-400'}`}>
                  {badge.name.replace('Medalla ', '')}
                </span>
                <span className="text-[9px] sm:text-[8px] font-bold text-gray-500 uppercase truncate max-w-full">
                  {badge.type}
                </span>

                {isEarned && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.06 + 0.3, type: 'spring' }}
                    className="absolute -top-1.5 -right-1.5 bg-amber-400 border border-gray-900 text-gray-900 rounded-full p-0.5 shadow-md"
                  >
                    <CheckCircle2 className="w-3 h-3 text-gray-900" />
                  </motion.div>
                )}

                {/* Floating Hover Tooltip Panel */}
                <div className={`hidden sm:block absolute bottom-full mb-2 ${idx % 2 === 0 ? 'left-0' : 'right-0'} sm:left-1/2 sm:-translate-x-1/2 w-56 p-3 bg-gray-900 text-white rounded-md shadow-2xl border-2 border-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 font-sans text-left`}>
                  <div className="flex items-center justify-between border-b border-gray-700 pb-1.5 mb-1.5">
                    <span className="font-extrabold text-xs text-amber-400 uppercase flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      {badge.name}
                    </span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                      isEarned ? 'bg-amber-400 text-gray-900' : 'bg-gray-700 text-gray-300'
                    }`}>
                      {isEarned ? 'Obtenida' : 'Pendiente'}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] font-medium text-gray-300">
                    <p className="text-gray-100 font-bold">
                      🏛️ {badge.gymLeader} • {badge.city}
                    </p>
                    <p className="text-amber-200/90 text-[10px]">
                      ⚡ Tipo: <span className="font-bold text-white">{badge.type}</span>
                    </p>
                    <div className="pt-1 border-t border-gray-800 text-[10px] text-emerald-400 font-semibold leading-tight">
                      <span className="block text-gray-400 text-[9px] font-bold uppercase mb-0.5">Efecto en Estadísticas:</span>
                      {badge.statBonus || badge.description}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Badge Tap Modal for Mobile */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm font-mono">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-4 border-gray-900 rounded-md max-w-sm w-full overflow-hidden shadow-2xl text-gray-800 relative"
            >
              <div className="bg-amber-500 text-gray-900 p-3 flex items-center justify-between border-b-2 border-gray-900">
                <span className="font-black text-xs uppercase flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  {selectedBadge.name}
                </span>
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="p-1 rounded bg-amber-700 text-white hover:bg-amber-800 border border-gray-900 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-3 bg-amber-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-900">LÍDER: {selectedBadge.gymLeader}</span>
                  <span className="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded border border-amber-600 font-extrabold uppercase">
                    TIPO {selectedBadge.type}
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-700">🏛️ {selectedBadge.city}</p>
                <div className="p-3 bg-white border-2 border-amber-300 rounded text-xs font-medium text-gray-800 leading-relaxed shadow-inner">
                  <p className="font-bold text-emerald-800 mb-1">EFECTO / BONIFICACIÓN:</p>
                  <p>{selectedBadge.statBonus || selectedBadge.description}</p>
                </div>
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="w-full py-2 bg-gray-900 text-white font-black text-xs uppercase rounded border-2 border-black hover:bg-gray-800 cursor-pointer"
                >
                  CERRAR
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Special Achievements Section */}
      <div className="border-t-2 border-gray-800 bg-gray-50 p-4">
        <div 
          onClick={() => setIsAchievementsExpanded(!isAchievementsExpanded)}
          className="flex items-center justify-between cursor-pointer select-none py-1 group"
        >
          <h4 className="text-xs font-black uppercase text-gray-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>LOGROS Y TROFEOS ESPECIALES DE CARRERA</span>
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold bg-amber-200 text-amber-950 px-2 py-0.5 rounded border border-amber-600">
              {unlockedAchievementIds.length} / {ACHIEVEMENTS.length} LOGROS
            </span>
            <span className="p-1 bg-gray-200 text-gray-800 rounded border border-gray-600 text-[10px] font-black group-hover:bg-gray-300">
              {isAchievementsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </span>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isAchievementsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden pt-3"
            >
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {ACHIEVEMENTS.map((ach) => {
                  const isUnlocked = unlockedAchievementIds.includes(ach.id);
                  return (
                    <div
                      key={ach.id}
                      title={`${ach.title}: ${ach.description}`}
                      className={`p-2 rounded-md border-2 flex flex-col items-center text-center justify-between transition-all ${
                        isUnlocked
                          ? `${ach.badgeColor} shadow-sm`
                          : 'bg-gray-100 border-gray-300 opacity-50 text-gray-400'
                      }`}
                    >
                      <div className="text-xl my-0.5">
                        {isUnlocked ? ach.icon : <Lock className="w-4 h-4 text-gray-400 mx-auto" />}
                      </div>
                      <h5 className="font-extrabold text-[10px] uppercase truncate max-w-full leading-tight">
                        {ach.title}
                      </h5>
                      <span className="text-[8px] font-medium opacity-80 block truncate max-w-full">
                        {isUnlocked ? 'DESBLOQUEADO' : 'BLOQUEADO'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )}
</AnimatePresence>
</div>
  );
};
