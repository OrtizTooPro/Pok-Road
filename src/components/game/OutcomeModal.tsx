import React from 'react';
import { useGame } from '../../context/GameContext';
import { Trophy, Sparkles, CheckCircle2, ArrowRight, Zap, Crown, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ACHIEVEMENTS } from '../../data/achievements';
import { findPokemonByName } from '../../data/kantoPokedex';
import { BadgeIcon } from './BadgeIcon';

export const OutcomeModal: React.FC = () => {
  const { state, closeOutcomeModal } = useGame();

  if (!state.lastOutcome) return null;

  const { title, description, statChanges, badgeAwarded, pokemonAwarded, evolvedPokemon, newAchievements } = state.lastOutcome;

  const unlockedAchObjs = newAchievements ? ACHIEVEMENTS.filter(a => newAchievements.includes(a.id)) : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm font-mono">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white border-4 border-gray-900 rounded-md max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-gray-800 relative"
        >
          {/* Pokédex Header Bar */}
          <div className="bg-red-600 text-white font-bold flex items-center justify-between px-4 py-2 border-b-2 border-gray-900 shrink-0">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span className="text-xs uppercase">RESULTADO DE DECISIÓN</span>
            </div>
            <span className="text-[10px] bg-red-800 px-2 py-0.5 rounded border border-gray-900 font-bold">
              REGISTRO POKÉDEX
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-4 overflow-y-auto touch-scroll flex-1">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
              {title}
            </h3>

            {/* Text Box with Pokédex Side Stripes */}
            <div className="w-full bg-white border-2 border-gray-800 rounded-md relative p-3.5 text-xs font-bold text-gray-800 overflow-hidden leading-relaxed shadow-inner">
              <div className="absolute top-0 bottom-0 left-0 w-2 bg-red-600"></div>
              <p className="pl-2">
                {description}
              </p>
            </div>

            {/* Badge Unlock Alert */}
            {badgeAwarded && (
              <div className="p-3 rounded-md bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 border-2 border-amber-600 flex items-center space-x-3 shadow-md">
                <div className="w-12 h-12 rounded-md bg-amber-400 border-2 border-gray-900 text-gray-900 flex items-center justify-center shrink-0 p-1 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/40 animate-pulse pointer-events-none"></div>
                  <BadgeIcon
                    badgeId={badgeAwarded.id}
                    badgeName={badgeAwarded.name}
                    spriteUrl={badgeAwarded.spriteUrl}
                    earned={true}
                    size="lg"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-amber-950 block">¡NUEVA MEDALLA OFICIAL OBTENIDA!</span>
                  <h4 className="font-black text-sm text-amber-950">{badgeAwarded.name} ({badgeAwarded.type})</h4>
                  <p className="text-[11px] text-amber-900 font-bold">{badgeAwarded.gymLeader} • {badgeAwarded.city}</p>
                </div>
              </div>
            )}

            {/* Evolution Alert */}
            {evolvedPokemon && (
              <div className="p-3 rounded-md bg-purple-50 border-2 border-purple-600 flex items-center space-x-3 shadow-sm">
                <div className="w-10 h-10 rounded bg-purple-200 border-2 border-gray-900 text-purple-900 flex items-center justify-center text-xl shrink-0">
                  <Sparkles className="w-6 h-6 text-purple-800 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-purple-900">¡EVOLUCIÓN EN EQUIPO!</span>
                  <h4 className="font-extrabold text-xs text-gray-900">¡Tu Pokémon inicial evolucionó a {evolvedPokemon}!</h4>
                </div>
              </div>
            )}

            {pokemonAwarded && (
              <div className={`p-3 rounded-md border-2 flex items-center space-x-3 shadow-sm ${
                state.lastOutcome.sentToPC 
                  ? 'bg-blue-50 border-blue-600' 
                  : 'bg-emerald-50 border-emerald-600'
              }`}>
                <div className="w-10 h-10 rounded bg-white border-2 border-gray-900 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                  {(() => {
                    const sprite = pokemonAwarded.spriteUrl || findPokemonByName(pokemonAwarded.species || pokemonAwarded.name)?.sprite;
                    return sprite ? (
                      <img
                        src={sprite}
                        alt={pokemonAwarded.name}
                        className="w-8 h-8 object-contain [image-rendering:pixelated]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-xs font-black text-gray-900">{pokemonAwarded.name.slice(0, 3)}</span>
                    );
                  })()}
                </div>
                <div>
                  <span className={`text-[10px] uppercase font-black ${state.lastOutcome.sentToPC ? 'text-blue-900' : 'text-emerald-900'}`}>
                    {state.lastOutcome.sentToPC ? '💻 ¡ENVIADO AL SISTEMA PC!' : '¡NUEVO POKÉMON EN EQUIPO!'}
                  </span>
                  <h4 className="font-extrabold text-xs text-gray-900">{pokemonAwarded.name} ({pokemonAwarded.type})</h4>
                  {state.lastOutcome.sentToPC && (
                    <p className="text-[10px] text-blue-800 font-bold mt-0.5">
                      Tu equipo de 6 estaba lleno. Fue guardado en el PC y puedes equiparlo cuando quieras.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Chained Event Unlocked Alert */}
            {state.lastOutcome.chainedEventUnlockedTitle && (
              <div className="p-3 rounded-md bg-indigo-50 border-2 border-indigo-600 flex items-center space-x-3 shadow-sm">
                <div className="w-10 h-10 rounded bg-indigo-200 border-2 border-gray-900 text-indigo-900 flex items-center justify-center text-xl shrink-0">
                  <Zap className="w-6 h-6 text-indigo-800 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-indigo-900">🔗 ¡EVENTO CONSECUENCIAL DESBLOQUEADO!</span>
                  <h4 className="font-extrabold text-xs text-gray-900">{state.lastOutcome.chainedEventUnlockedTitle}</h4>
                  <p className="text-[10px] text-indigo-800 font-bold">Aparecerá como tu siguiente desafío inmediato en la carrera.</p>
                </div>
              </div>
            )}

            {/* Achievement Unlocked Alert */}
            {unlockedAchObjs.length > 0 && (
              <div className="space-y-1.5">
                {unlockedAchObjs.map((ach) => (
                  <div key={ach.id} className="p-3 rounded-md bg-amber-100 border-2 border-amber-600 flex items-center space-x-3 shadow-sm animate-bounce">
                    <div className="w-10 h-10 rounded bg-amber-400 border-2 border-gray-900 flex items-center justify-center text-2xl shrink-0">
                      {ach.icon}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black text-amber-950">¡LOGRO DESBLOQUEADO!</span>
                      <h4 className="font-black text-xs text-amber-950">{ach.title}</h4>
                      <p className="text-[10px] text-amber-900 font-bold">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Type Matchup Notice Banner */}
            {state.lastOutcome.typeMatchupNotice && (
              <div className={`p-3 rounded-md border-2 font-bold text-xs flex items-center justify-between shadow-sm ${state.lastOutcome.typeMatchupNotice.badgeBg} ${state.lastOutcome.typeMatchupNotice.badgeText}`}>
                <div className="flex items-center space-x-2.5">
                  <Crown className="w-5 h-5 text-amber-600 fill-amber-300 shrink-0" />
                  <div>
                    <span className="font-black uppercase text-[10px] tracking-wide block">TIPO DE LÍDER Y EFECTIVIDAD:</span>
                    <span className="font-black text-xs">{state.lastOutcome.typeMatchupNotice.label}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-right max-w-[190px] leading-tight">
                  {state.lastOutcome.typeMatchupNotice.description}
                </span>
              </div>
            )}

            {/* Team EXP Breakdown */}
            {state.lastOutcome.expSummary && (
              <div className="p-3 rounded-md bg-cyan-50 border-2 border-cyan-600 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-cyan-900 font-extrabold text-xs">
                    <Zap className="w-4 h-4 text-cyan-600 fill-cyan-400" />
                    <span className="uppercase">EXPERIENCIA GANADA EN EVENTO</span>
                  </div>
                  <span className="text-xs font-mono font-black text-white bg-cyan-700 px-2 py-0.5 rounded border border-gray-900">
                    +{state.lastOutcome.expSummary.baseExp} EXP / POKÉMON
                  </span>
                </div>

                {state.lastOutcome.expSummary.levelUps.length > 0 && (
                  <div className="bg-emerald-100 border border-emerald-500 p-2 rounded text-[11px] font-black text-emerald-950 space-y-0.5">
                    {state.lastOutcome.expSummary.levelUps.map((lvlMsg, idx) => (
                      <div key={idx} className="flex items-center space-x-1">
                        <span>⭐</span>
                        <span>{lvlMsg}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
                  {state.lastOutcome.expSummary.memberGains.map((member) => (
                    <div key={member.id} className="bg-white border border-cyan-300 p-1.5 rounded flex items-center space-x-2 text-[10px]">
                      {member.spriteUrl && (
                        <img src={member.spriteUrl} alt={member.name} className="w-7 h-7 object-contain shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between font-bold text-gray-900 truncate">
                          <span className="truncate">{member.name}</span>
                          <span className="text-red-600 font-black">Nvl.{member.newLevel}</span>
                        </div>
                        <div className="text-[9px] text-cyan-700 font-bold font-mono">
                          +{member.expGained} EXP
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-600">
                IMPACTO EN TUS ESTADÍSTICAS:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {statChanges.map((sc, i) => (
                  <span
                    key={i}
                    className={`text-xs font-extrabold px-2 py-0.5 rounded border ${
                      sc.delta > 0
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-600'
                        : 'bg-red-100 text-red-900 border-red-600'
                    }`}
                  >
                    {sc.delta > 0 ? '+' : ''}{sc.delta} {sc.label.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={closeOutcomeModal}
              className="w-full py-3 px-4 rounded-md font-black text-white bg-red-600 hover:bg-red-700 border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center space-x-2 transition-all uppercase tracking-wider text-xs"
            >
              <span>CONTINUAR CARRERA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
