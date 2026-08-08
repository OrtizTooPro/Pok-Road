import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { 
  KANTO_ITEMS, 
  ShopItem, 
  ItemCategory,
  checkShopAvailability
} from '../../data/kantoItems';
import { 
  ShoppingBag, 
  ShoppingCart, 
  DollarSign, 
  Sparkles, 
  Info, 
  ShieldAlert, 
  Heart, 
  Zap, 
  Flame, 
  Award,
  Check,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BackpackView: React.FC = () => {
  const { state, openModal, useItem, currentEvent, healTeamAtCenter } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'ALL'>('ALL');
  const [useFeedback, setUseFeedback] = useState<string | null>(null);
  const [stoneEvoTargetItem, setStoneEvoTargetItem] = useState<ShopItem | null>(null);

  const ownedInventory = state.inventory || {};
  const totalOwnedItemsCount = Object.values(ownedInventory).reduce((acc: number, qty: number) => acc + (qty || 0), 0);

  const location = currentEvent?.location || 'Kanto';
  const shopAvailability = checkShopAvailability(location, currentEvent?.title, currentEvent?.description);

  const categoryLabels: { id: ItemCategory | 'ALL'; label: string; icon: string }[] = [
    { id: 'ALL', label: 'Todos', icon: '🎒' },
    { id: 'POKEBALL', label: 'Poké Balls', icon: '🔴' },
    { id: 'MEDICINE', label: 'Medicinas', icon: '🧪' },
    { id: 'STONE', label: 'Piedras Evolutivas', icon: '💎' },
    { id: 'VITAMIN', label: 'Vitaminas', icon: '💊' },
    { id: 'UTILITY', label: 'Utensilios', icon: '🪢' }
  ];

  const filteredItems = KANTO_ITEMS.filter((item) => {
    const qty = ownedInventory[item.id] || 0;
    if (qty <= 0) return false;
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  const handleUseItem = (item: ShopItem, pokemonId?: string) => {
    // If stone needs target selection
    if (item.category === 'STONE' && !pokemonId) {
      setStoneEvoTargetItem(item);
      return;
    }

    const success = useItem(item.id, pokemonId);
    if (success) {
      setUseFeedback(`¡Usaste 1x ${item.name}! Efecto aplicado correctamente.`);
      setStoneEvoTargetItem(null);
    } else {
      setUseFeedback(`No se pudo usar ${item.name}. Revisa las condiciones de uso.`);
    }
    setTimeout(() => setUseFeedback(null), 3500);
  };

  return (
    <div className="space-y-6 font-mono animate-fade-in">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 border-4 border-gray-900 rounded-xl p-4 sm:p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-yellow-400 border-4 border-gray-900 rounded-xl flex items-center justify-center text-gray-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0">
              <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] bg-red-900 border border-red-400 px-2 py-0.5 rounded text-red-100 font-bold uppercase">
                  INVENTARIO DE CAMPO
                </span>
                <span className="text-xs text-yellow-300 font-bold">
                  {totalOwnedItemsCount} Objetos en total
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-yellow-300 uppercase tracking-wide drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                Mochila del Entrenador
              </h2>
              <p className="text-xs text-red-100 font-sans mt-0.5 max-w-xl">
                Almacena medicinas, Poké Balls y objetos clave. Ten siempre suficientes Poké Balls para capturar a los Pokémon salvajes que encuentres en tu viaje.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Money Badge */}
            <div className="px-3.5 py-2 rounded-lg bg-emerald-950 border-2 border-emerald-400 text-emerald-300 font-black text-xs sm:text-sm flex items-center space-x-1.5 shadow">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>${state.stats.money.toLocaleString()} Pokécupones</span>
            </div>

            {/* Visit Shop Button */}
            <button
              onClick={() => openModal('shop')}
              className={`px-4 py-2 rounded-lg border-2 border-gray-900 font-black text-xs uppercase transition-all flex items-center space-x-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-y-0.5 ${
                shopAvailability.isAvailable
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-gray-950 animate-bounce'
                  : 'bg-white hover:bg-gray-100 text-gray-900'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{shopAvailability.isAvailable ? 'Pokétienda Abierta' : 'Ver Pokétienda'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Team Fatigue Status Card */}
      <div className={`p-4 rounded-xl border-4 border-gray-900 font-mono shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        (state.teamFatigue || 0) >= 75
          ? 'bg-red-950 text-red-100 border-red-500'
          : (state.teamFatigue || 0) >= 40
          ? 'bg-amber-950 text-amber-100 border-amber-500'
          : 'bg-emerald-950 text-emerald-100 border-emerald-500'
      }`}>
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className={`w-12 h-12 rounded-xl border-2 border-gray-900 flex items-center justify-center shrink-0 shadow-md ${
            (state.teamFatigue || 0) >= 75
              ? 'bg-red-500 text-white animate-pulse'
              : (state.teamFatigue || 0) >= 40
              ? 'bg-amber-400 text-gray-950'
              : 'bg-emerald-400 text-gray-950'
          }`}>
            <Zap className="w-7 h-7 fill-current" />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase text-white tracking-wide">FATIGA DEL EQUIPO</span>
              <span className="text-xs font-black px-2 py-0.5 rounded bg-gray-900 border border-gray-700 text-yellow-300">
                {state.teamFatigue || 0}%
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full sm:w-64 h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
              <div 
                className={`h-full transition-all duration-500 ${
                  (state.teamFatigue || 0) >= 75 ? 'bg-red-500' : (state.teamFatigue || 0) >= 40 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, state.teamFatigue || 0)}%` }}
              />
            </div>
            <div className="text-xs font-sans font-bold">
              {(state.teamFatigue || 0) >= 75 ? (
                <span className="text-red-300">⚠️ ¡Agotamiento Severo! Usa medicinas o visita un Centro Pokémon para recuperar la energía.</span>
              ) : (state.teamFatigue || 0) >= 40 ? (
                <span className="text-amber-200">⚡ Fatiga Moderada (-10 Habilidad en Combate). Las pociones reducirán la fatiga acumulada.</span>
              ) : (
                <span className="text-emerald-200">✨ Tu equipo está lleno de energía y listo para combatir.</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            healTeamAtCenter();
            setUseFeedback('🏥 ¡Centro Pokémon utilizado! Salud del equipo restaurada y fatiga reducida al 0%.');
            setTimeout(() => setUseFeedback(null), 4000);
          }}
          className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-gray-950 font-black text-xs uppercase rounded-lg border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 cursor-pointer flex items-center justify-center space-x-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-gray-950 shrink-0" />
          <span>Curar en Centro Pokémon</span>
        </button>
      </div>

      {/* Usage Feedback Toast */}
      <AnimatePresence>
        {useFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-amber-400 border-2 border-gray-900 rounded-lg p-3 text-gray-950 text-xs font-black flex items-center space-x-2 shadow-lg"
          >
            <Sparkles className="w-5 h-5 shrink-0 text-gray-950 animate-spin" />
            <span>{useFeedback}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stone Evolution Target Selection Sub-Modal */}
      {stoneEvoTargetItem && (
        <div className="bg-indigo-950 border-4 border-indigo-400 rounded-xl p-4 space-y-3 shadow-2xl">
          <div className="flex items-center justify-between text-indigo-300 font-bold text-xs">
            <span className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>SELECCIONA POKÉMON PARA EVOLUCIONAR CON {stoneEvoTargetItem.name.toUpperCase()}</span>
            </span>
            <button
              onClick={() => setStoneEvoTargetItem(null)}
              className="px-2 py-0.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded text-xs border border-indigo-500 font-bold cursor-pointer"
            >
              Cancelar
            </button>
          </div>
          <p className="text-xs text-indigo-200 font-sans">
            Especies compatibles con {stoneEvoTargetItem.name}: {stoneEvoTargetItem.eligibleSpecies?.join(', ')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
            {state.career.team.map((member) => {
              const isEligible = stoneEvoTargetItem.eligibleSpecies?.includes(member.species || member.name);

              return (
                <div
                  key={member.id}
                  className={`p-3 rounded-lg border-2 flex items-center justify-between text-xs font-bold transition-all ${
                    isEligible
                      ? 'bg-indigo-900/90 border-indigo-400 text-white shadow-md'
                      : 'bg-gray-800/60 border-gray-700 text-gray-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-9 h-9 rounded bg-white border border-gray-900 flex items-center justify-center shrink-0">
                      {member.spriteUrl ? (
                        <img src={member.spriteUrl} alt={member.name} className="w-7 h-7 object-contain [image-rendering:pixelated]" />
                      ) : (
                        <span>{member.iconEmoji || '🐲'}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-yellow-300 font-black">{member.name}</div>
                      <div className="text-[10px] text-indigo-200 font-sans">Nivel {member.level} • {member.species}</div>
                    </div>
                  </div>

                  {isEligible ? (
                    <button
                      onClick={() => handleUseItem(stoneEvoTargetItem, member.id)}
                      className="ml-2 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-gray-950 rounded text-xs font-black uppercase border border-gray-900 shadow cursor-pointer shrink-0 active:translate-y-0.5"
                    >
                      Evolucionar
                    </button>
                  ) : (
                    <span className="text-[9px] text-gray-400 italic shrink-0">No elegible</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Backpack Content & Category Filters */}
      <div className="bg-white border-4 border-gray-900 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto touch-scroll no-scrollbar pb-1">
          {categoryLabels.map((cat) => {
            const countInCat = KANTO_ITEMS.filter(
              i => (cat.id === 'ALL' || i.category === cat.id) && (ownedInventory[i.id] || 0) > 0
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black border-2 transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCategory === cat.id ? 'bg-red-800 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {countInCat}
                </span>
              </button>
            );
          })}
        </div>

        {/* Item Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-10 text-center space-y-3 font-sans">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="text-base font-bold text-gray-700 uppercase font-mono">
              No tienes objetos en esta categoría
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Puedes adquirir medicamentos, Poké Balls y suplementos en las Pokétiendas situadas en las ciudades de Kanto.
            </p>
            <button
              onClick={() => openModal('shop')}
              className="mt-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-mono font-black text-xs uppercase rounded-lg border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              Visitar Pokétienda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredItems.map((item) => {
              const qty = ownedInventory[item.id] || 0;
              const isBall = item.category === 'POKEBALL';
              const isStone = item.category === 'STONE';

              return (
                <div
                  key={item.id}
                  className="bg-gray-50 border-2 border-gray-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-red-500 transition-colors shadow-sm relative overflow-hidden"
                >
                  <div className="flex items-start space-x-3">
                    {/* Item Icon */}
                    <div className="w-12 h-12 rounded-lg bg-white border-2 border-gray-800 p-1 flex items-center justify-center shrink-0 shadow-inner">
                      <img 
                        src={item.spriteUrl} 
                        alt={item.name} 
                        className="w-8 h-8 object-contain [image-rendering:pixelated]"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-black text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <span className="text-xs font-black px-2 py-0.5 rounded bg-red-600 text-white border border-gray-900 shadow-xs shrink-0">
                          x{qty}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 font-sans leading-tight mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-gray-200 flex items-center justify-between gap-2">
                    {/* Extra Info Tag */}
                    <div className="text-[10px] font-bold text-gray-500 font-sans truncate">
                      {isBall ? (
                        <span className="text-red-700 font-mono font-black">
                          {item.id === 'master-ball' 
                            ? '⭐ 100% Captura' 
                            : item.id === 'quick-ball'
                            ? '⚡ Ratio 5.0x (Turno 1)'
                            : `🎯 Ratio ${item.catchRatio || 1.0}x`}
                        </span>
                      ) : isStone ? (
                        <span className="text-purple-700 font-bold">
                          Evoluciona Pokémon
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold">
                          Valor: ${item.price}
                        </span>
                      )}
                    </div>

                    {/* Use Button */}
                    {isBall ? (
                      <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-400 font-bold px-2 py-1 rounded">
                        Uso automático en captura
                      </span>
                    ) : (
                      <button
                        onClick={() => handleUseItem(item)}
                        className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-gray-950 rounded-lg text-xs font-black uppercase border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0 cursor-pointer active:translate-y-0.5 transition-all"
                      >
                        {isStone ? 'Evolucionar' : 'Usar Objeto'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Poké Ball Information Callout Card */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-400 rounded-xl p-4 text-amber-950 font-sans space-y-2 shadow-sm">
        <div className="flex items-center space-x-2 font-mono font-black text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span className="uppercase">SISTEMA DE CAPTURA POKÉMON EN EVENTOS</span>
        </div>
        <p className="text-xs leading-relaxed">
          Para poder añadir Pokémon a tu equipo o enviar al almacenamiento PC durante las aventuras y eventos de Kanto, <strong>es obligatorio que portes al menos una Poké Ball en tu Mochila</strong>. En cada encuentro salvaje, el juego utilizará la mejor Poké Ball que poseas y calculará las probabilidades de captura según el ratio oficial de la cápsula, la rareza del Pokémon y tu habilidad de entrenador.
        </p>
      </div>
    </div>
  );
};
