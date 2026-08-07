import React, { useState, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Trophy, Lock, Zap, HelpCircle, X, Info, Crown, ShieldAlert, ShieldCheck, ShoppingCart } from 'lucide-react';
import { evaluateLeaderMatchup } from '../../utils/typeChart';
import { normalizePokemonReward } from '../../utils/pokemonEvolution';
import { findPokemonByName } from '../../data/kantoPokedex';
import { checkShopAvailability } from '../../data/kantoItems';
import { getBadgeById } from '../../data/badges';
import { BadgeIcon } from './BadgeIcon';

interface RewardExplanation {
  title: string;
  icon: string;
  categoryName: string;
  description: string;
  impactText: string;
  badgeSpriteUrl?: string;
  badgeId?: string;
}

export const EventCard: React.FC = () => {
  const { currentEvent, selectOption, state, openModal } = useGame();
  const [activeExplanation, setActiveExplanation] = useState<RewardExplanation | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  if (!currentEvent) return null;

  const shopInfo = checkShopAvailability(currentEvent.location, currentEvent.title, currentEvent.description);

  const handlePointerDownReward = (
    e: React.PointerEvent | React.MouseEvent | React.TouchEvent,
    explanation: RewardExplanation
  ) => {
    e.stopPropagation();
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);

    // Trigger timer for long-press (300ms)
    longPressTimerRef.current = setTimeout(() => {
      setActiveExplanation(explanation);
    }, 300);
  };

  const handlePointerUpReward = (
    e: React.PointerEvent | React.MouseEvent | React.TouchEvent
  ) => {
    e.stopPropagation();
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleClickReward = (
    e: React.MouseEvent,
    explanation: RewardExplanation
  ) => {
    e.stopPropagation();
    setActiveExplanation(explanation);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'GYM_BATTLE':
        return { label: 'COMBATE GIMNASIO', color: 'bg-amber-100 border-amber-600 text-amber-900' };
      case 'RIVAL_MATCH':
        return { label: 'ENFRENTAMIENTO RIVAL', color: 'bg-red-100 border-red-600 text-red-900' };
      case 'VILLAIN_TEAM':
        return { label: 'AMENAZA VILLANA', color: 'bg-purple-100 border-purple-600 text-purple-900' };
      case 'WILD_ENCOUNTER':
        return { label: 'ENCUENTRO SALVAJE', color: 'bg-emerald-100 border-emerald-600 text-emerald-900' };
      case 'LEAGUE_TOURNAMENT':
        return { label: 'TORNEO DE LIGA', color: 'bg-sky-100 border-sky-600 text-sky-900' };
      default:
        return { label: 'EVENTO CARRERA', color: 'bg-gray-100 border-gray-600 text-gray-900' };
    }
  };

  const cat = getCategoryBadge(currentEvent.category);

  return (
    <div className="w-full [perspective:1200px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentEvent.id}
          initial={{ rotateY: -70, opacity: 0, scale: 0.92, y: 15 }}
          animate={{ rotateY: 0, opacity: 1, scale: 1, y: 0 }}
          exit={{ rotateY: 70, opacity: 0, scale: 0.92, y: -15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border-2 border-gray-800 rounded-md overflow-hidden shadow-md font-mono text-gray-800 [transform-style:preserve-3d]"
        >
      {/* Pokédex Card Header */}
      <div className="bg-red-600 text-white flex items-center justify-between px-3 py-1.5 font-bold tracking-wide border-b-2 border-gray-900">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-300 border border-gray-900"></div>
          <span className="text-xs uppercase">DESAFÍO EN RUTA • POKÉDEX</span>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-white">
          <MapPin className="w-3.5 h-3.5" />
          <span className="uppercase">{currentEvent.location}</span>
        </div>
      </div>

      {/* Chained Event Header Banner */}
      {currentEvent.isChainedOnly && (
        <div className="bg-indigo-900 text-indigo-100 px-3 py-1.5 flex items-center justify-between text-xs font-bold border-b-2 border-gray-900">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-300 animate-pulse shrink-0" />
            <span className="uppercase tracking-wider">⚡ EVENTO CONSECUENCIAL ENCADENADO</span>
          </div>
          {currentEvent.parentEventTitle && (
            <span className="text-[10px] bg-indigo-800 text-indigo-200 px-2 py-0.5 rounded border border-indigo-700 truncate max-w-[200px]">
              ORIGEN: {currentEvent.parentEventTitle}
            </span>
          )}
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Category & Age badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-dotted border-gray-300 pb-2.5">
          <span className={`px-2.5 py-0.5 border-2 rounded text-xs font-bold shadow-inner ${cat.color}`}>
            {cat.label}
          </span>
          <span className="px-2.5 py-0.5 bg-gray-200 border-2 border-gray-600 rounded text-xs font-bold text-gray-800 shadow-inner">
            EDAD: {currentEvent.age} AÑOS
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
          {currentEvent.title}
        </h3>

        {/* Description Box with Pokédex Side Stripes */}
        <div className="w-full bg-white border-2 border-gray-800 rounded-md relative p-3.5 text-sm text-gray-800 overflow-hidden leading-relaxed shadow-inner">
          <div className="absolute top-0 bottom-0 left-0 w-2 bg-red-600"></div>
          <p className="pl-2 font-medium">
            {currentEvent.description}
          </p>
        </div>

        {/* Shop Availability Banner */}
        {shopInfo.isAvailable && (
          <div className="bg-emerald-950/90 border-2 border-emerald-500 rounded-md p-2.5 flex items-center justify-between gap-2 text-white shadow">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="p-1 bg-emerald-400 rounded text-gray-950 font-black border border-gray-900 shrink-0">
                <ShoppingCart className="w-4 h-4 text-gray-950" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-emerald-300 uppercase truncate">
                  {shopInfo.shopName}
                </div>
                <div className="text-[10px] text-emerald-100 font-sans truncate">
                  ¡Servicio de Pokétienda disponible aquí!
                </div>
              </div>
            </div>
            <button
              onClick={() => openModal('shop')}
              className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs uppercase rounded border-2 border-gray-900 shadow shrink-0 cursor-pointer active:translate-y-0.5 flex items-center space-x-1"
            >
              <span>Entrar</span>
            </button>
          </div>
        )}

        {/* Team Leader & Type Advantage Banner */}
        {(() => {
          const leaderMon = state.career.team[0];
          if (!leaderMon) return null;
          const matchup = evaluateLeaderMatchup(leaderMon, currentEvent);

          return (
            <div className={`p-3 rounded-md border-2 font-bold text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-sm ${matchup.badgeBg} ${matchup.badgeText}`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded bg-white border-2 border-gray-900 flex items-center justify-center shrink-0 relative overflow-hidden shadow-xs">
                  {(() => {
                    const sprite = leaderMon.spriteUrl || findPokemonByName(leaderMon.species || leaderMon.name)?.sprite;
                    return sprite ? (
                      <img src={sprite} alt={leaderMon.name} className="w-8 h-8 object-contain [image-rendering:pixelated]" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-xs font-black text-gray-800">{leaderMon.name.slice(0, 3)}</span>
                    );
                  })()}
                  <div className="absolute -top-1 -right-1 bg-amber-400 p-0.5 rounded-full border border-gray-900">
                    <Crown className="w-2.5 h-2.5 text-gray-950 fill-amber-300" />
                  </div>
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xs uppercase text-gray-900">{leaderMon.name}</span>
                    <span className="text-[9px] bg-gray-900 text-white px-1.5 py-0.2 rounded font-mono">
                      NVL. {leaderMon.level || 5} • {leaderMon.type}
                    </span>
                  </div>
                  <div className="text-[11px] font-extrabold flex items-center gap-1">
                    <span>LÍDER EN COMBATE:</span>
                    <span className="underline decoration-2">{matchup.label}</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-gray-800 font-extrabold bg-white/80 p-1.5 rounded border border-gray-400 max-w-xs leading-tight">
                {matchup.effectDescription}
              </div>
            </div>
          );
        })()}

        {/* Options Section */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h4 className="text-xs font-black uppercase text-gray-600 tracking-wider">
              SELECCIONA TU DECISIÓN ESTRATÉGICA:
            </h4>
            <div className="flex items-center gap-1 text-[11px] text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-400 font-bold shrink-0">
              <HelpCircle className="w-3 h-3 text-amber-700" />
              <span>Mantén pulsado o haz clic en cualquier recompensa para su explicación</span>
            </div>
          </div>

          {currentEvent.options.map((option, index) => {
            let isLocked = false;
            let lockReason = '';

            if (option.specializationRequirement && state.specialization !== option.specializationRequirement) {
              isLocked = true;
              lockReason = `Exclusivo de ${option.specializationRequirement}`;
            }

            if (option.statRequirements) {
              const reqs = option.statRequirements;
              if (reqs.skill && state.stats.skill < reqs.skill) {
                isLocked = true;
                lockReason = `Requiere Habilidad ≥ ${reqs.skill}`;
              } else if (reqs.bond && state.stats.bond < reqs.bond) {
                isLocked = true;
                lockReason = `Requiere Vínculo ≥ ${reqs.bond}`;
              } else if (reqs.reputation && state.stats.reputation < reqs.reputation) {
                isLocked = true;
                lockReason = `Requiere Popularidad ≥ ${reqs.reputation}`;
              } else if (reqs.stamina && state.stats.stamina < reqs.stamina) {
                isLocked = true;
                lockReason = `Requiere Resistencia ≥ ${reqs.stamina}`;
              } else if (reqs.money && state.stats.money < reqs.money) {
                isLocked = true;
                lockReason = `Requiere Pokécupones ≥ $${reqs.money.toLocaleString()}`;
              }
            }

            return (
              <button
                key={option.id}
                disabled={isLocked}
                onClick={() => selectOption(option)}
                className={`w-full text-left border-2 rounded-md p-3 font-bold transition-all relative flex flex-col justify-between ${
                  isLocked
                    ? 'bg-gray-100 border-gray-400 text-gray-500 cursor-not-allowed opacity-70'
                    : 'bg-white hover:bg-red-50 border-gray-800 text-gray-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start space-x-2.5">
                    <span className={`w-6 h-6 rounded border border-gray-900 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                      isLocked ? 'bg-gray-300 text-gray-600' : 'bg-red-600 text-white'
                    }`}>
                      {index + 1}
                    </span>
                    <p className={`text-xs font-bold leading-snug ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
                      {option.text}
                    </p>
                  </div>

                  {isLocked ? (
                    <span className="flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 border border-red-500 text-red-800 shrink-0">
                      <Lock className="w-3 h-3" />
                      <span>{lockReason}</span>
                    </span>
                  ) : (
                    <span className="hidden sm:inline-block text-xs text-red-600 font-black uppercase">
                      ELEGIR →
                    </span>
                  )}
                </div>

                {/* Consequence Effects Tags (with Long-Press & Click Explanations) */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t-2 border-dotted border-gray-300 text-[11px]">
                  {option.specializationBonusText && (
                    <span
                      onPointerDown={(e) => handlePointerDownReward(e, {
                        title: 'Bonus de Especialidad',
                        icon: '⭐',
                        categoryName: 'VENTAJA DE RAMA',
                        description: `Bonus exclusivo activado por tu especialización como Entrenador en ${state.specialization}.`,
                        impactText: 'Permite tomar elecciones avanzadas, reducir requisitos de nivel y maximizar los frutos de la aventura.'
                      })}
                      onPointerUp={(e) => handlePointerUpReward(e)}
                      onClick={(e) => handleClickReward(e, {
                        title: 'Bonus de Especialidad',
                        icon: '⭐',
                        categoryName: 'VENTAJA DE RAMA',
                        description: `Bonus exclusivo activado por tu especialización como Entrenador en ${state.specialization}.`,
                        impactText: 'Permite tomar elecciones avanzadas, reducir requisitos de nivel y maximizar los frutos de la aventura.'
                      })}
                      className="px-2 py-0.5 rounded bg-indigo-100 border border-indigo-600 text-indigo-900 font-extrabold flex items-center gap-1 cursor-help hover:bg-indigo-200 transition-colors"
                      title="Mantén pulsado o haz clic para ver explicación"
                    >
                      ⭐ {option.specializationBonusText} <Info className="w-2.5 h-2.5 text-indigo-600 opacity-70" />
                    </span>
                  )}

                  {option.insertEventIdsOnSelect && option.insertEventIdsOnSelect.length > 0 && (
                    <span
                      onPointerDown={(e) => handlePointerDownReward(e, {
                        title: 'Bifurcación de Ruta Especial',
                        icon: '🗺️',
                        categoryName: 'EXPLORACIÓN REGIONAL',
                        description: 'Esta elección altera la geografía de tu itinerario insertando zonas especiales en Kanto.',
                        impactText: 'Desbloquea eventos adicionales como el Bosque Verde, la Cueva Diglett o la Central Eléctrica.'
                      })}
                      onPointerUp={(e) => handlePointerUpReward(e)}
                      onClick={(e) => handleClickReward(e, {
                        title: 'Bifurcación de Ruta Especial',
                        icon: '🗺️',
                        categoryName: 'EXPLORACIÓN REGIONAL',
                        description: 'Esta elección altera la geografía de tu itinerario insertando zonas especiales en Kanto.',
                        impactText: 'Desbloquea eventos adicionales como el Bosque Verde, la Cueva Diglett o la Central Eléctrica.'
                      })}
                      className="px-2 py-0.5 rounded bg-blue-100 border border-blue-600 text-blue-900 font-extrabold flex items-center gap-1 cursor-help hover:bg-blue-200 transition-colors"
                      title="Mantén pulsado o haz clic para ver explicación"
                    >
                      🗺️ RUTA ESPECIAL <Info className="w-2.5 h-2.5 text-blue-600 opacity-70" />
                    </span>
                  )}

                  {option.awardBadgeId && (() => {
                    const badgeObj = getBadgeById(option.awardBadgeId);
                    const badgeNameStr = badgeObj ? badgeObj.name.toUpperCase() : 'MEDALLA';
                    return (
                      <span
                        onPointerDown={(e) => handlePointerDownReward(e, {
                          title: badgeObj ? badgeObj.name : 'Medalla Oficial Kanto',
                          icon: '🏆',
                          categoryName: 'RECONOCIMIENTO DE LIGA',
                          description: badgeObj ? `${badgeObj.description} (${badgeObj.gymLeader} • ${badgeObj.city})` : 'Premio acreditativo concedido por vencer en un Gimnasio o Torneo Oficial regional.',
                          impactText: 'Otorga +5,000 Puntos a tu Puntuación Final y es requisito fundamental para desafiar al Alto Mando.',
                          badgeSpriteUrl: badgeObj?.spriteUrl,
                          badgeId: badgeObj?.id || option.awardBadgeId
                        })}
                        onPointerUp={(e) => handlePointerUpReward(e)}
                        onClick={(e) => handleClickReward(e, {
                          title: badgeObj ? badgeObj.name : 'Medalla Oficial Kanto',
                          icon: '🏆',
                          categoryName: 'RECONOCIMIENTO DE LIGA',
                          description: badgeObj ? `${badgeObj.description} (${badgeObj.gymLeader} • ${badgeObj.city})` : 'Premio acreditativo concedido por vencer en un Gimnasio o Torneo Oficial regional.',
                          impactText: 'Otorga +5,000 Puntos a tu Puntuación Final y es requisito fundamental para desafiar al Alto Mando.',
                          badgeSpriteUrl: badgeObj?.spriteUrl,
                          badgeId: badgeObj?.id || option.awardBadgeId
                        })}
                        className="px-2 py-0.5 rounded bg-amber-200 border border-gray-800 text-gray-900 flex items-center gap-1.5 font-extrabold shadow-xs cursor-help hover:bg-amber-300 transition-colors"
                        title="Mantén pulsado o haz clic para ver explicación"
                      >
                        <BadgeIcon
                          badgeId={badgeObj?.id || option.awardBadgeId}
                          badgeName={badgeNameStr}
                          spriteUrl={badgeObj?.spriteUrl}
                          earned={true}
                          size="xs"
                        />
                        <span>{badgeNameStr}</span>
                        <Info className="w-2.5 h-2.5 text-amber-800 opacity-70" />
                      </span>
                    );
                  })()}

                  {option.statEffects.legendaryScoreDelta !== undefined && option.statEffects.legendaryScoreDelta !== 0 && (
                    <span
                      onPointerDown={(e) => handlePointerDownReward(e, {
                        title: 'Progreso de Estatua Leyenda',
                        icon: '🗿',
                        categoryName: 'REPUTACIÓN HISTÓRICA',
                        description: 'Avanza la talla de tu monumento de bronce en la plaza central de Pueblo Paleta.',
                        impactText: 'Cada 1% equivale a +500 Pts en tu evaluación final. Alcanzar 100% otorga el título de Leyenda Viviente.'
                      })}
                      onPointerUp={(e) => handlePointerUpReward(e)}
                      onClick={(e) => handleClickReward(e, {
                        title: 'Progreso de Estatua Leyenda',
                        icon: '🗿',
                        categoryName: 'REPUTACIÓN HISTÓRICA',
                        description: 'Avanza la talla de tu monumento de bronce en la plaza central de Pueblo Paleta.',
                        impactText: 'Cada 1% equivale a +500 Pts en tu evaluación final. Alcanzar 100% otorga el título de Leyenda Viviente.'
                      })}
                      className={`px-2 py-0.5 rounded font-bold border cursor-help flex items-center gap-1 ${option.statEffects.legendaryScoreDelta > 0 ? 'bg-amber-100 border-amber-600 text-amber-900 hover:bg-amber-200' : 'bg-red-100 border-red-600 text-red-900 hover:bg-red-200'}`}
                      title="Mantén pulsado o haz clic para ver explicación"
                    >
                      {option.statEffects.legendaryScoreDelta > 0 ? '+' : ''}{option.statEffects.legendaryScoreDelta}% ESTATUA <Info className="w-2.5 h-2.5 opacity-70" />
                    </span>
                  )}

                  {option.statEffects.skill !== undefined && option.statEffects.skill !== 0 && (
                    <span
                      onPointerDown={(e) => handlePointerDownReward(e, {
                        title: 'Atributo: Habilidad Táctica',
                        icon: '⚔️',
                        categoryName: 'ESTADÍSTICA DE ENTRENADOR',
                        description: 'Tu nivel de conocimiento en movimientos, efectividad de tipos y comandos en combate.',
                        impactText: 'Necesaria para superar los gimnasios más avanzados y responder a situaciones complejas.'
                      })}
                      onPointerUp={(e) => handlePointerUpReward(e)}
                      onClick={(e) => handleClickReward(e, {
                        title: 'Atributo: Habilidad Táctica',
                        icon: '⚔️',
                        categoryName: 'ESTADÍSTICA DE ENTRENADOR',
                        description: 'Tu nivel de conocimiento en movimientos, efectividad de tipos y comandos en combate.',
                        impactText: 'Necesaria para superar los gimnasios más avanzados y responder a situaciones complejas.'
                      })}
                      className={`px-2 py-0.5 rounded font-bold border cursor-help flex items-center gap-1 ${option.statEffects.skill > 0 ? 'bg-amber-50 border-amber-500 text-amber-900 hover:bg-amber-100' : 'bg-red-50 border-red-500 text-red-900 hover:bg-red-100'}`}
                      title="Mantén pulsado o haz clic para ver explicación"
                    >
                      {option.statEffects.skill > 0 ? '+' : ''}{option.statEffects.skill} HABILIDAD <Info className="w-2.5 h-2.5 opacity-70" />
                    </span>
                  )}

                  {option.statEffects.reputation !== undefined && option.statEffects.reputation !== 0 && (
                    <span
                      onPointerDown={(e) => handlePointerDownReward(e, {
                        title: 'Atributo: Popularidad / Fama',
                        icon: '📣',
                        categoryName: 'ESTADÍSTICA DE ENTRENADOR',
                        description: 'Refleja tu impacto social, prestigio y reconocimiento como figura pública en Kanto.',
                        impactText: 'Te abre las puertas a eventos exclusivos y aporta un peso significativo a tu puntuación de rango.'
                      })}
                      onPointerUp={(e) => handlePointerUpReward(e)}
                      onClick={(e) => handleClickReward(e, {
                        title: 'Atributo: Popularidad / Fama',
                        icon: '📣',
                        categoryName: 'ESTADÍSTICA DE ENTRENADOR',
                        description: 'Refleja tu impacto social, prestigio y reconocimiento como figura pública en Kanto.',
                        impactText: 'Te abre las puertas a eventos exclusivos y aporta un peso significativo a tu puntuación de rango.'
                      })}
                      className={`px-2 py-0.5 rounded font-bold border cursor-help flex items-center gap-1 ${option.statEffects.reputation > 0 ? 'bg-sky-50 border-sky-500 text-sky-900 hover:bg-sky-100' : 'bg-red-50 border-red-500 text-red-900 hover:bg-red-100'}`}
                      title="Mantén pulsado o haz clic para ver explicación"
                    >
                      {option.statEffects.reputation > 0 ? '+' : ''}{option.statEffects.reputation} POPULARIDAD <Info className="w-2.5 h-2.5 opacity-70" />
                    </span>
                  )}

                  {option.statEffects.bond !== undefined && option.statEffects.bond !== 0 && (
                    <span
                      onPointerDown={(e) => handlePointerDownReward(e, {
                        title: 'Atributo: Vínculo Afectivo',
                        icon: '❤️',
                        categoryName: 'ESTADÍSTICA DE ENTRENADOR',
                        description: 'Representa el nivel de confianza, cariño y sintonía mutua entre tú y tus Pokémon.',
                        impactText: 'Favorece las evoluciones por afecto, incrementa el rendimiento en combates ajustados y desbloquea eventos de crianza.'
                      })}
                      onPointerUp={(e) => handlePointerUpReward(e)}
                      onClick={(e) => handleClickReward(e, {
                        title: 'Atributo: Vínculo Afectivo',
                        icon: '❤️',
                        categoryName: 'ESTADÍSTICA DE ENTRENADOR',
                        description: 'Representa el nivel de confianza, cariño y sintonía mutua entre tú y tus Pokémon.',
                        impactText: 'Favorece las evoluciones por afecto, incrementa el rendimiento en combates ajustados y desbloquea eventos de crianza.'
                      })}
                      className={`px-2 py-0.5 rounded font-bold border cursor-help flex items-center gap-1 ${option.statEffects.bond > 0 ? 'bg-rose-50 border-rose-500 text-rose-900 hover:bg-rose-100' : 'bg-red-50 border-red-500 text-red-900 hover:bg-red-100'}`}
                      title="Mantén pulsado o haz clic para ver explicación"
                    >
                      {option.statEffects.bond > 0 ? '+' : ''}{option.statEffects.bond} VÍNCULO <Info className="w-2.5 h-2.5 opacity-70" />
                    </span>
                  )}

                  {option.statEffects.stamina !== undefined && option.statEffects.stamina !== 0 && (
                    <span
                      onPointerDown={(e) => handlePointerDownReward(e, {
                        title: 'Atributo: Resistencia',
                        icon: '🛡️',
                        categoryName: 'ESTADÍSTICA DE ENTRENADOR',
                        description: 'Mide la vitalidad física de tu equipo para afrontar largos recorridos y climas adversos.',
                        impactText: 'Garantiza la solidez defensiva del equipo ante travesías de montaña y maratones de liga.'
                      })}
                      onPointerUp={(e) => handlePointerUpReward(e)}
                      onClick={(e) => handleClickReward(e, {
                        title: 'Atributo: Resistencia',
                        icon: '🛡️',
                        categoryName: 'ESTADÍSTICA DE ENTRENADOR',
                        description: 'Mide la vitalidad física de tu equipo para afrontar largos recorridos y climas adversos.',
                        impactText: 'Garantiza la solidez defensiva del equipo ante travesías de montaña y maratones de liga.'
                      })}
                      className={`px-2 py-0.5 rounded font-bold border cursor-help flex items-center gap-1 ${option.statEffects.stamina > 0 ? 'bg-emerald-50 border-emerald-500 text-emerald-900 hover:bg-emerald-100' : 'bg-red-50 border-red-500 text-red-900 hover:bg-red-100'}`}
                      title="Mantén pulsado o haz clic para ver explicación"
                    >
                      {option.statEffects.stamina > 0 ? '+' : ''}{option.statEffects.stamina} RESISTENCIA <Info className="w-2.5 h-2.5 opacity-70" />
                    </span>
                  )}

                  {option.statEffects.money !== undefined && option.statEffects.money !== 0 && (
                    <span
                      onPointerDown={(e) => handlePointerDownReward(e, {
                        title: 'Capital Económico ($)',
                        icon: '💰',
                        categoryName: 'RECURSO MONETARIO',
                        description: 'Pokécupones ganados o invertidos durante tus decisiones en las ciudades y tiendas.',
                        impactText: 'Aumentan tu puntuación patrimonial final y financian viajes en barco, fósiles y objetos clave.'
                      })}
                      onPointerUp={(e) => handlePointerUpReward(e)}
                      onClick={(e) => handleClickReward(e, {
                        title: 'Capital Económico ($)',
                        icon: '💰',
                        categoryName: 'RECURSO MONETARIO',
                        description: 'Pokécupones ganados o invertidos durante tus decisiones en las ciudades y tiendas.',
                        impactText: 'Aumentan tu puntuación patrimonial final y financian viajes en barco, fósiles y objetos clave.'
                      })}
                      className={`px-2 py-0.5 rounded font-bold border cursor-help flex items-center gap-1 ${option.statEffects.money > 0 ? 'bg-emerald-50 border-emerald-500 text-emerald-900 hover:bg-emerald-100' : 'bg-red-50 border-red-500 text-red-900 hover:bg-red-100'}`}
                      title="Mantén pulsado o haz clic para ver explicación"
                    >
                      {option.statEffects.money > 0 ? '+' : ''}${Math.abs(option.statEffects.money).toLocaleString()} <Info className="w-2.5 h-2.5 opacity-70" />
                    </span>
                  )}

                  {option.addPokemon && (() => {
                    const teamAvgLvl = state.career.team.length > 0
                      ? Math.round(state.career.team.reduce((acc, m) => acc + (m.level || 5), 0) / state.career.team.length)
                      : 8;
                    const displayMon = normalizePokemonReward(option.addPokemon, teamAvgLvl);

                    return (
                      <span
                        onPointerDown={(e) => handlePointerDownReward(e, {
                          title: `Captura de ${displayMon.name}`,
                          icon: '🐾',
                          categoryName: 'INCORPORACIÓN AL EQUIPO',
                          description: `Un ${displayMon.name} (${displayMon.type}) de Nivel ${displayMon.level} se une a tu formación.`,
                          impactText: 'Suma variedad elemental a tu equipo de 6 miembros e incrementa el registro de la Pokédex de Kanto.'
                        })}
                        onPointerUp={(e) => handlePointerUpReward(e)}
                        onClick={(e) => handleClickReward(e, {
                          title: `Captura de ${displayMon.name}`,
                          icon: '🐾',
                          categoryName: 'INCORPORACIÓN AL EQUIPO',
                          description: `Un ${displayMon.name} (${displayMon.type}) de Nivel ${displayMon.level} se une a tu formación.`,
                          impactText: 'Suma variedad elemental a tu equipo de 6 miembros e incrementa el registro de la Pokédex de Kanto.'
                        })}
                        className="px-2 py-0.5 rounded bg-purple-100 border border-purple-500 text-purple-900 font-extrabold cursor-help hover:bg-purple-200 transition-colors flex items-center gap-1"
                        title="Mantén pulsado o haz clic para ver explicación"
                      >
                        +POKÉMON: {displayMon.name.toUpperCase()} (Nv. {displayMon.level}) <Info className="w-2.5 h-2.5 text-purple-700 opacity-70" />
                      </span>
                    );
                  })()}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  </AnimatePresence>

  {/* Reward Explanation Popover Modal */}
  <AnimatePresence>
    {activeExplanation && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white border-4 border-gray-900 rounded-md max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl text-gray-900 relative"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-3.5 flex items-center justify-between border-b-2 border-gray-900 shrink-0">
            <div className="flex items-center space-x-2.5">
              {activeExplanation.badgeSpriteUrl || activeExplanation.badgeId ? (
                <div className="w-10 h-10 bg-amber-300 rounded border-2 border-gray-900 flex items-center justify-center shrink-0 shadow">
                  <BadgeIcon
                    badgeId={activeExplanation.badgeId}
                    badgeName={activeExplanation.title}
                    spriteUrl={activeExplanation.badgeSpriteUrl}
                    earned={true}
                    size="md"
                  />
                </div>
              ) : (
                <span className="text-2xl p-1 bg-white/20 rounded border border-white/30">{activeExplanation.icon}</span>
              )}
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-yellow-300 block">
                  {activeExplanation.categoryName}
                </span>
                <h4 className="text-base font-black tracking-tight leading-tight uppercase">
                  {activeExplanation.title}
                </h4>
              </div>
            </div>
            <button
              onClick={() => setActiveExplanation(null)}
              className="p-1.5 bg-red-800 hover:bg-red-900 text-white rounded border border-red-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3.5 bg-gray-50 overflow-y-auto touch-scroll flex-1">
            <div className="bg-white p-3 rounded border-2 border-gray-300 text-xs leading-relaxed space-y-1 shadow-inner">
              <p className="font-extrabold text-gray-600 uppercase text-[10px] tracking-wider">¿QUÉ SIGNIFICA ESTA RECOMPENSA?</p>
              <p className="font-medium text-gray-800 text-xs">{activeExplanation.description}</p>
            </div>

            <div className="bg-amber-50 p-3 rounded border-2 border-amber-300 text-xs leading-relaxed space-y-1">
              <p className="font-extrabold text-amber-900 uppercase text-[10px] tracking-wider flex items-center gap-1">
                <span>⚡ IMPACTO EN TU CARRERA & SCORE</span>
              </p>
              <p className="font-bold text-amber-950 text-xs">{activeExplanation.impactText}</p>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setActiveExplanation(null)}
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded font-black text-xs uppercase border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              >
                ENTENDIDO, VOLVER AL COMBATE
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
</div>
  );
};
