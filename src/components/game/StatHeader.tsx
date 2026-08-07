import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Trophy, Zap, Heart, Shield, DollarSign, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { getAvatarById } from '../../data/avatars';
import { motion, AnimatePresence } from 'motion/react';

export const StatHeader: React.FC = () => {
  const { state } = useGame();
  const { trainerName, avatarId, specialization, stats, career } = state;
  const currentAvatar = getAvatarById(avatarId);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white border-2 border-gray-800 rounded-md overflow-hidden shadow-md font-mono text-gray-800 transition-all">
      {/* Pokédex Header Bar - Collapsible Trigger */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-between px-3 py-2 border-b-2 border-gray-900 shadow-sm cursor-pointer select-none transition-colors"
      >
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-300 border border-gray-900 shadow-inner animate-pulse"></div>
          <span className="text-xs uppercase tracking-wider">RESUMEN DE ENTRENADOR • INFO</span>
        </div>
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="px-2 py-0.5 bg-emerald-700 text-white border border-gray-900 rounded font-bold hidden sm:inline-flex items-center gap-1">
            <span>💾</span> GUARDADO AUTO
          </span>
          <span className="px-2 py-0.5 bg-red-800 text-white border border-gray-900 rounded font-bold">
            EDAD: {career.age} AÑOS
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
            <div className="p-4 space-y-4">
        {/* Profile Info Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b-2 border-dotted border-gray-400">
          <div className="flex items-center space-x-3">
            {/* Sprite Box Container */}
            <div className="w-14 h-14 bg-gray-50 border-2 border-gray-800 rounded-md relative overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>
              <img
                src={currentAvatar.spriteUrl}
                alt={currentAvatar.name}
                className="w-12 h-12 object-contain filter drop-shadow pt-1 [image-rendering:pixelated]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = 'none';
                  const fb = e.currentTarget.parentElement?.querySelector('.avatar-fallback');
                  if (fb) (fb as HTMLElement).style.display = 'flex';
                }}
              />
              <span className="avatar-fallback hidden text-2xl items-center justify-center font-bold">
                {currentAvatar.iconEmoji || '🧢'}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">{trainerName}</h2>
                <span className="px-2 py-0.5 bg-gray-200 border-2 border-gray-600 rounded text-[10px] font-bold text-gray-800 shadow-inner tracking-wider">
                  {specialization.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-600 font-bold mt-0.5">
                AVATAR: <span className="text-red-600">{currentAvatar.name}</span> • MEDALLAS: <span className="text-red-600">{career.badgesWon.length}/8</span>
              </p>
            </div>
          </div>

          {/* Age & Status Pills */}
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <div className="px-3 py-1 bg-gray-100 border-2 border-gray-800 rounded-md text-right text-xs font-bold shadow-sm">
              <span className="text-[9px] uppercase text-gray-500 block -mb-0.5">ESTADO</span>
              <span className="text-emerald-700 uppercase">EN ACTIVO</span>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {/* Skill */}
          <div 
            title="HABILIDAD: Mejora la eficacia en combates de Gimnasio, torneos y captura de Pokémon avanzados."
            className="relative group bg-white border-2 border-gray-800 rounded-md p-2 flex flex-col justify-between text-gray-800 font-bold shadow-sm hover:border-amber-600 transition-colors cursor-help"
          >
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="flex items-center space-x-1 text-amber-700 uppercase">
                <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>HABILIDAD</span>
              </span>
              <span className="text-gray-900">{stats.skill}</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded border border-gray-800 overflow-hidden">
              <div className="bg-amber-500 h-full border-r border-gray-900 transition-all duration-300" style={{ width: `${Math.min(100, stats.skill)}%` }}></div>
            </div>

            {/* Tooltip Card */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 p-2.5 bg-gray-900 text-white text-[11px] rounded-md shadow-2xl border-2 border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30 font-sans">
              <div className="flex items-center space-x-1.5 text-amber-400 font-black mb-1 border-b border-gray-700 pb-1">
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span className="uppercase text-[10px]">Efecto de Habilidad</span>
              </div>
              <p className="text-gray-300 font-medium leading-tight">
                Mejora la eficacia táctica en combates de Gimnasio y aumenta las probabilidades de victoria contra rivales y líderes.
              </p>
            </div>
          </div>

          {/* Reputation */}
          <div 
            title="POPULARIDAD: Incrementa el prestigio y desbloquea patrocinios e invitaciones a eventos especiales."
            className="relative group bg-white border-2 border-gray-800 rounded-md p-2 flex flex-col justify-between text-gray-800 font-bold shadow-sm hover:border-sky-600 transition-colors cursor-help"
          >
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="flex items-center space-x-1 text-sky-700 uppercase">
                <Star className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>POPULARIDAD</span>
              </span>
              <span className="text-gray-900">{stats.reputation}</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded border border-gray-800 overflow-hidden">
              <div className="bg-sky-500 h-full border-r border-gray-900 transition-all duration-300" style={{ width: `${Math.min(100, stats.reputation)}%` }}></div>
            </div>

            {/* Tooltip Card */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 p-2.5 bg-gray-900 text-white text-[11px] rounded-md shadow-2xl border-2 border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30 font-sans">
              <div className="flex items-center space-x-1.5 text-sky-400 font-black mb-1 border-b border-gray-700 pb-1">
                <Star className="w-3.5 h-3.5 shrink-0" />
                <span className="uppercase text-[10px]">Efecto de Popularidad</span>
              </div>
              <p className="text-gray-300 font-medium leading-tight">
                Aumenta tu renombre en Kanto, desbloqueando patrocinios con ganancias económicas y atención de los medios.
              </p>
            </div>
          </div>

          {/* Bond */}
          <div 
            title="VÍNCULO: Refuerza la lealtad de tu equipo Pokémon y facilita las evoluciones."
            className="relative group bg-white border-2 border-gray-800 rounded-md p-2 flex flex-col justify-between text-gray-800 font-bold shadow-sm hover:border-rose-600 transition-colors cursor-help"
          >
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="flex items-center space-x-1 text-rose-700 uppercase">
                <Heart className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>VÍNCULO</span>
              </span>
              <span className="text-gray-900">{stats.bond}</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded border border-gray-800 overflow-hidden">
              <div className="bg-rose-500 h-full border-r border-gray-900 transition-all duration-300" style={{ width: `${Math.min(100, stats.bond)}%` }}></div>
            </div>

            {/* Tooltip Card */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 p-2.5 bg-gray-900 text-white text-[11px] rounded-md shadow-2xl border-2 border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30 font-sans">
              <div className="flex items-center space-x-1.5 text-rose-400 font-black mb-1 border-b border-gray-700 pb-1">
                <Heart className="w-3.5 h-3.5 shrink-0" />
                <span className="uppercase text-[10px]">Efecto de Vínculo</span>
              </div>
              <p className="text-gray-300 font-medium leading-tight">
                Fortalece la lealtad de tu equipo, facilita la captura de especies raras y acelera las evoluciones.
              </p>
            </div>
          </div>

          {/* Stamina */}
          <div 
            title="RESISTENCIA: Mantiene el aguante físico del entrenador ante viajes y desafíos largos."
            className="relative group bg-white border-2 border-gray-800 rounded-md p-2 flex flex-col justify-between text-gray-800 font-bold shadow-sm hover:border-emerald-600 transition-colors cursor-help"
          >
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="flex items-center space-x-1 text-emerald-700 uppercase">
                <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>RESISTENCIA</span>
              </span>
              <span className="text-gray-900">{stats.stamina}</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded border border-gray-800 overflow-hidden">
              <div className="bg-emerald-500 h-full border-r border-gray-900 transition-all duration-300" style={{ width: `${Math.min(100, stats.stamina)}%` }}></div>
            </div>

            {/* Tooltip Card */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 p-2.5 bg-gray-900 text-white text-[11px] rounded-md shadow-2xl border-2 border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30 font-sans">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-black mb-1 border-b border-gray-700 pb-1">
                <Shield className="w-3.5 h-3.5 shrink-0" />
                <span className="uppercase text-[10px]">Efecto de Resistencia</span>
              </div>
              <p className="text-gray-300 font-medium leading-tight">
                Mantiene la energía física del equipo frente a viajes agotadores y desafíos consecutivos de gimnasios.
              </p>
            </div>
          </div>

          {/* Money */}
          <div 
            title="POKÉCUPONES: Fondos acumulados para comprar objetos, medicinas y financiar equipamiento."
            className="relative group bg-white border-2 border-gray-800 rounded-md p-2 flex flex-col justify-between text-gray-800 font-bold shadow-sm hover:border-emerald-700 transition-colors cursor-help col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="flex items-center space-x-1 text-emerald-800 uppercase">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>POKÉCUPONES</span>
              </span>
            </div>
            <div className="text-sm font-black text-emerald-700">
              ${stats.money.toLocaleString('es-ES')}
            </div>

            {/* Tooltip Card */}
            <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 w-52 p-2.5 bg-gray-900 text-white text-[11px] rounded-md shadow-2xl border-2 border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30 font-sans">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-black mb-1 border-b border-gray-700 pb-1">
                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                <span>Uso de Pokécupones</span>
              </div>
              <p className="text-gray-300 font-medium leading-tight">
                Moneda oficial usada para adquirir objetos clave, medicinas, Pokéballs y financiar expediciones.
              </p>
            </div>
          </div>
        </div>

        {/* Hall of Fame Statue Progress Meter */}
        <div 
          title="MEDIDOR DE ESTATUA DE LEYENDA: El colofón supremo de tu viaje. Se completa en la etapa final (Años 28-30)."
          className="relative group pt-2 border-t-2 border-dotted border-gray-400 cursor-help"
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <div className="flex items-center space-x-1.5 text-gray-800 uppercase">
              <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
              <span>ESTATUA EN SALÓN DE LA FAMA (COLOFÓN DE LEYENDA)</span>
            </div>
            <span className="text-amber-700 font-black">
              {career.legendaryScore}% / 100%
            </span>
          </div>
          <div className="w-full bg-gray-200 h-3.5 rounded-md border-2 border-gray-800 p-0.5 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-amber-500 to-yellow-300 border border-gray-900 h-full rounded-sm transition-all duration-500"
              style={{ width: `${career.legendaryScore}%` }}
            ></div>
          </div>

          {/* Tooltip Card */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 p-2.5 bg-gray-900 text-white text-[11px] rounded-md shadow-2xl border-2 border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30 font-sans">
            <div className="flex items-center space-x-1.5 text-amber-400 font-black mb-1 border-b border-gray-700 pb-1">
              <Trophy className="w-3.5 h-3.5 shrink-0 text-yellow-400" />
              <span>Estatua de Oro Inmortal (Gran Logro Final)</span>
            </div>
            <p className="text-gray-300 font-medium leading-tight">
              La Estatua es el logro difícil y definitivo de tu aventura. Se adquiere en la etapa final (Años 28-30). Al alcanzar el 100% completando tu camino (Combate, Pokédex o Mentoría), erigirás tu Estatua de Oro en la entrada del Salón de la Fama de Kanto.
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
