import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { 
  KANTO_ITEMS, 
  ShopItem, 
  ItemCategory, 
  checkShopAvailability, 
  getShopStockForEvent 
} from '../../data/kantoItems';
import { 
  ShoppingCart, 
  ShoppingBag, 
  DollarSign, 
  X, 
  Check, 
  Sparkles, 
  ChevronRight, 
  Info,
  ShieldAlert,
  ArrowUpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ShopModal: React.FC = () => {
  const { state, closeModal, buyItem, useItem, currentEvent } = useGame();
  const [activeSubTab, setActiveSubTab] = useState<'shop' | 'backpack'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'ALL'>('ALL');
  const [buyFeedback, setBuyFeedback] = useState<string | null>(null);
  const [useFeedback, setUseFeedback] = useState<string | null>(null);
  const [stoneEvoTargetItem, setStoneEvoTargetItem] = useState<ShopItem | null>(null);

  if (state.activeModal !== 'shop' && state.activeModal !== 'inventory') {
    return null;
  }

  const location = currentEvent?.location || 'Kanto';
  const eventTitle = currentEvent?.title || '';
  const eventDesc = currentEvent?.description || '';
  const eventId = currentEvent?.id;

  const shopAvailability = checkShopAvailability(location, eventTitle, eventDesc);
  const currentAge = state.career.age || 10;
  const availableItems = getShopStockForEvent(currentAge, location, eventTitle, eventDesc, eventId);

  const filteredShopItems = availableItems.filter(item => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  // Calculate owned inventory count
  const ownedInventory = state.inventory || {};
  const totalOwnedItemsCount = Object.values(ownedInventory).reduce((acc: number, qty: number) => acc + (qty || 0), 0);

  const handleBuy = (item: ShopItem) => {
    if (state.stats.money < item.price) {
      setBuyFeedback(`No tienes suficientes Pokécupones para comprar ${item.name}.`);
      setTimeout(() => setBuyFeedback(null), 3000);
      return;
    }

    buyItem(item.id, 1);
    setBuyFeedback(`¡Compraste 1x ${item.name}! Se ha añadido a tu Mochila.`);
    setTimeout(() => setBuyFeedback(null), 2500);
  };

  const handleUseItem = (item: ShopItem, pokemonId?: string) => {
    // If stone needs target selection
    if (item.category === 'STONE' && !pokemonId) {
      setStoneEvoTargetItem(item);
      return;
    }

    const success = useItem(item.id, pokemonId);
    if (success) {
      setUseFeedback(`¡Usaste 1x ${item.name}! Efecto aplicado con éxito.`);
      setStoneEvoTargetItem(null);
    } else {
      setUseFeedback(`No se pudo usar ${item.name}. Verifica que tu equipo o estadísticas lo requieran.`);
    }
    setTimeout(() => setUseFeedback(null), 3000);
  };

  const categoryLabels: { id: ItemCategory | 'ALL'; label: string; icon: string }[] = [
    { id: 'ALL', label: 'Todos', icon: '🏪' },
    { id: 'POKEBALL', label: 'Poké Balls', icon: '🔴' },
    { id: 'MEDICINE', label: 'Medicinas', icon: '🧪' },
    { id: 'STONE', label: 'Piedras', icon: '💎' },
    { id: 'VITAMIN', label: 'Vitaminas', icon: '💊' },
    { id: 'UTILITY', label: 'Utensilios', icon: '🪢' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-900 border-4 border-gray-800 rounded-xl max-w-3xl w-full text-white shadow-2xl overflow-hidden font-mono flex flex-col max-h-[90vh]"
      >
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 border-b-4 border-gray-900 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-yellow-400 rounded border-2 border-gray-900 text-gray-900 shadow">
              {activeSubTab === 'shop' ? <ShoppingCart className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-yellow-300 uppercase drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                {activeSubTab === 'shop' ? shopAvailability.shopName : 'Mochila del Entrenador'}
              </h2>
              <p className="text-[10px] text-red-100 font-sans">
                {activeSubTab === 'shop' ? `Ubicación: ${location} • Edad: ${currentAge} años` : `${totalOwnedItemsCount} objetos guardados`}
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded border-2 border-gray-900 shadow transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar & Balance */}
        <div className="bg-gray-800 border-b-2 border-gray-900 px-3 py-2 flex items-center justify-between shrink-0 gap-2 flex-wrap">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => { setActiveSubTab('shop'); setStoneEvoTargetItem(null); }}
              className={`px-3 py-1.5 rounded-lg border-2 border-gray-900 text-xs font-black uppercase transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeSubTab === 'shop'
                  ? 'bg-yellow-400 text-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Tienda</span>
            </button>

            <button
              onClick={() => { setActiveSubTab('backpack'); setStoneEvoTargetItem(null); }}
              className={`px-3 py-1.5 rounded-lg border-2 border-gray-900 text-xs font-black uppercase transition-all flex items-center space-x-1.5 cursor-pointer relative ${
                activeSubTab === 'backpack'
                  ? 'bg-yellow-400 text-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Mochila ({totalOwnedItemsCount})</span>
            </button>
          </div>

          {/* Money Balance Badge */}
          <div className="px-3 py-1 rounded bg-emerald-950 border-2 border-emerald-500 text-emerald-400 font-black text-xs sm:text-sm flex items-center space-x-1 shadow">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>${state.stats.money.toLocaleString()} Pokécupones</span>
          </div>
        </div>

        {/* Feedback Message Alert */}
        {(buyFeedback || useFeedback) && (
          <div className="bg-amber-400 text-gray-950 text-xs font-bold px-4 py-2 flex items-center space-x-2 border-b-2 border-gray-900 shrink-0">
            <Sparkles className="w-4 h-4 shrink-0 text-gray-950" />
            <span>{buyFeedback || useFeedback}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: SHOPPING */}
          {activeSubTab === 'shop' && (
            <div>
              {!shopAvailability.isAvailable ? (
                <div className="bg-gray-800/80 border-2 border-amber-500/50 rounded-xl p-6 text-center space-y-3 font-sans">
                  <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto" />
                  <h3 className="text-sm font-bold text-amber-300 uppercase font-mono">
                    Pokétienda no disponible en esta zona
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
                    Las tiendas oficiales de Kanto operan únicamente en ciudades, pueblos, centros comerciales o mediante mercaderes itinerantes.
                  </p>
                  <button
                    onClick={() => setActiveSubTab('backpack')}
                    className="mt-2 px-4 py-2 bg-yellow-400 text-gray-900 font-mono font-black text-xs uppercase rounded border-2 border-gray-900 shadow hover:bg-yellow-300 cursor-pointer"
                  >
                    Ver mi Mochila de Objetos
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Restock Announcement Banner */}
                  <div className="bg-emerald-950/80 border border-emerald-500/60 rounded-lg px-3 py-2 text-xs text-emerald-200 flex items-center justify-between font-sans">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-yellow-400 shrink-0 animate-pulse" />
                      <span>
                        <strong>Stock renovado para este evento:</strong> Suministros equilibrados para {shopAvailability.shopName}.
                      </span>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-900 border border-emerald-600 px-2 py-0.5 rounded text-yellow-300 shrink-0 font-bold">
                      {availableItems.length} Objetos en Estante
                    </span>
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto touch-scroll no-scrollbar pb-1">
                    {categoryLabels.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-1 ${
                          selectedCategory === cat.id
                            ? 'bg-red-600 text-white border-white shadow'
                            : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Stock Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {filteredShopItems.length === 0 ? (
                      <div className="col-span-2 text-center py-8 text-gray-400 text-xs font-sans">
                        No hay objetos disponibles en esta categoría para tu nivel actual.
                      </div>
                    ) : (
                      filteredShopItems.map((item) => {
                        const canAfford = state.stats.money >= item.price;
                        const ownedQty = ownedInventory[item.id] || 0;

                        return (
                          <div
                            key={item.id}
                            className={`bg-gray-800/90 border-2 rounded-lg p-3 flex flex-col justify-between hover:border-gray-500 transition-colors shadow-sm relative overflow-hidden ${
                              item.isFeatured ? 'border-amber-400/80 bg-gray-800' : 'border-gray-700'
                            }`}
                          >
                            {item.eventNote && (
                              <div className="bg-amber-400 text-gray-950 font-black text-[9px] px-2 py-0.5 uppercase tracking-wide border-b border-gray-900 flex items-center space-x-1 -mx-3 -mt-3 mb-2">
                                <Sparkles className="w-3 h-3 text-gray-950 shrink-0" />
                                <span>{item.eventNote}</span>
                              </div>
                            )}

                            <div className="flex items-start space-x-2.5">
                              {/* Item Sprite */}
                              <div className="w-10 h-10 rounded bg-gray-900 border border-gray-700 p-1 flex items-center justify-center shrink-0">
                                <img 
                                  src={item.spriteUrl} 
                                  alt={item.name} 
                                  className="w-7 h-7 object-contain [image-rendering:pixelated]"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <h4 className="text-xs font-black text-yellow-300 truncate">
                                    {item.name}
                                  </h4>
                                  {ownedQty > 0 && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-gray-700 text-emerald-400 border border-gray-600 shrink-0">
                                      En posesión: {ownedQty}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-gray-300 font-sans leading-tight mt-1 line-clamp-2">
                                  {item.description}
                                </p>
                              </div>
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-gray-700 flex items-center justify-between">
                              <div className="text-xs font-black text-emerald-400 flex items-center space-x-1.5">
                                <span>${item.price.toLocaleString()}</span>
                                {item.originalPrice && (
                                  <span className="text-[10px] text-gray-400 line-through font-normal">
                                    ${item.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => handleBuy(item)}
                                disabled={!canAfford}
                                className={`px-3 py-1 rounded text-xs font-black uppercase border-2 transition-all flex items-center space-x-1 cursor-pointer ${
                                  canAfford
                                    ? 'bg-emerald-500 hover:bg-emerald-400 text-gray-950 border-gray-900 shadow active:translate-y-0.5'
                                    : 'bg-gray-700 text-gray-500 border-gray-800 cursor-not-allowed opacity-60'
                                }`}
                              >
                                <ShoppingCart className="w-3 h-3" />
                                <span>{canAfford ? 'Comprar' : 'Sin Fondos'}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BACKPACK / INVENTORY */}
          {activeSubTab === 'backpack' && (
            <div className="space-y-4">
              {/* Stone Target Selection Sub-Modal */}
              {stoneEvoTargetItem && (
                <div className="bg-indigo-950/90 border-2 border-indigo-400 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-indigo-300 font-bold text-xs">
                    <span>SELECCIONA UN POKÉMON PARA APLICAR {stoneEvoTargetItem.name.toUpperCase()}</span>
                    <button
                      onClick={() => setStoneEvoTargetItem(null)}
                      className="text-gray-400 hover:text-white text-xs font-bold"
                    >
                      Cancelar
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-300 font-sans">
                    Especies elegibles: {stoneEvoTargetItem.eligibleSpecies?.join(', ')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {state.career.team.map((member) => {
                      const isEligible = stoneEvoTargetItem.eligibleSpecies?.includes(member.species || member.name);

                      return (
                        <div
                          key={member.id}
                          className={`p-2 rounded border flex items-center justify-between text-xs font-bold ${
                            isEligible
                              ? 'bg-indigo-900/80 border-indigo-400 text-white'
                              : 'bg-gray-800 border-gray-700 text-gray-500 opacity-60'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span>{member.iconEmoji || '🐲'}</span>
                            <div>
                              <div>{member.name}</div>
                              <div className="text-[10px] text-indigo-300 font-sans">Nivel {member.level} • {member.species}</div>
                            </div>
                          </div>

                          {isEligible ? (
                            <button
                              onClick={() => handleUseItem(stoneEvoTargetItem, member.id)}
                              className="px-2 py-1 bg-yellow-400 text-gray-950 rounded text-[10px] font-black uppercase hover:bg-yellow-300 shadow cursor-pointer"
                            >
                              Evolucionar
                            </button>
                          ) : (
                            <span className="text-[9px] text-gray-400 italic">Incompatible</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {Object.keys(ownedInventory).filter(id => ownedInventory[id] > 0).length === 0 ? (
                <div className="bg-gray-800/80 border-2 border-gray-700 rounded-xl p-8 text-center space-y-3 font-sans">
                  <ShoppingBag className="w-12 h-12 text-gray-500 mx-auto" />
                  <h3 className="text-sm font-bold text-gray-300 uppercase font-mono">
                    Tu Mochila está vacía
                  </h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Visita la Pokétienda durante tu viaje en ciudades y eventos de mercaderes para comprar pociones, Poké Balls y piedras evolutivas.
                  </p>
                  <button
                    onClick={() => setActiveSubTab('shop')}
                    className="px-4 py-2 bg-yellow-400 text-gray-950 font-mono font-black text-xs uppercase rounded border-2 border-gray-900 shadow hover:bg-yellow-300 cursor-pointer"
                  >
                    Ir a la Pokétienda
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {KANTO_ITEMS.filter(item => (ownedInventory[item.id] || 0) > 0).map((item) => {
                    const qty = ownedInventory[item.id];

                    return (
                      <div
                        key={item.id}
                        className="bg-gray-800 border-2 border-gray-700 rounded-lg p-3 flex items-start justify-between gap-2 hover:border-gray-500 transition-colors"
                      >
                        <div className="flex items-start space-x-2.5 min-w-0">
                          <div className="w-10 h-10 rounded bg-gray-900 border border-gray-700 p-1 flex items-center justify-center shrink-0">
                            <img 
                              src={item.spriteUrl} 
                              alt={item.name} 
                              className="w-7 h-7 object-contain [image-rendering:pixelated]"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <h4 className="text-xs font-black text-yellow-300 truncate">
                                {item.name}
                              </h4>
                              <span className="text-xs font-black text-emerald-400">
                                x{qty}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-300 font-sans leading-tight mt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleUseItem(item)}
                          className="px-2.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-gray-950 rounded text-xs font-black uppercase border-2 border-gray-900 shadow shrink-0 cursor-pointer active:translate-y-0.5"
                        >
                          Usar
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="bg-gray-950 border-t-2 border-gray-800 px-4 py-2 text-[10px] text-gray-400 font-sans flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Info className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span>Objetos clásicos de Kanto adaptados al viaje del entrenador.</span>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-300 hover:text-white font-mono font-bold uppercase underline cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
