import React, { useState } from 'react';
import { X, Zap, Shield, Sword, HelpCircle, Check, Info } from 'lucide-react';
import { parseTypes, getTypeEffectivenessMultiplier } from '../../utils/typeChart';

interface TypeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KANTO_TYPES = [
  'Normal', 'Fuego', 'Agua', 'Planta', 'Eléctrico', 'Hielo', 
  'Lucha', 'Veneno', 'Tierra', 'Volador', 'Psíquico', 'Bicho', 
  'Roca', 'Fantasma', 'Dragón', 'Acero', 'Hada'
];

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  Normal: { bg: 'bg-stone-100', text: 'text-stone-900', border: 'border-stone-500', badge: 'bg-stone-500 text-white' },
  Fuego: { bg: 'bg-amber-100', text: 'text-amber-950', border: 'border-amber-600', badge: 'bg-amber-600 text-white' },
  Agua: { bg: 'bg-blue-100', text: 'text-blue-950', border: 'border-blue-600', badge: 'bg-blue-600 text-white' },
  Planta: { bg: 'bg-emerald-100', text: 'text-emerald-950', border: 'border-emerald-600', badge: 'bg-emerald-600 text-white' },
  Eléctrico: { bg: 'bg-yellow-100', text: 'text-yellow-950', border: 'border-yellow-600', badge: 'bg-yellow-500 text-gray-950 font-black' },
  Hielo: { bg: 'bg-cyan-100', text: 'text-cyan-950', border: 'border-cyan-600', badge: 'bg-cyan-600 text-white' },
  Lucha: { bg: 'bg-orange-100', text: 'text-orange-950', border: 'border-orange-600', badge: 'bg-orange-600 text-white' },
  Veneno: { bg: 'bg-purple-100', text: 'text-purple-950', border: 'border-purple-600', badge: 'bg-purple-600 text-white' },
  Tierra: { bg: 'bg-amber-200', text: 'text-amber-950', border: 'border-amber-800', badge: 'bg-amber-800 text-white' },
  Roca: { bg: 'bg-stone-300', text: 'text-stone-950', border: 'border-stone-800', badge: 'bg-stone-700 text-white' },
  Volador: { bg: 'bg-indigo-100', text: 'text-indigo-950', border: 'border-indigo-600', badge: 'bg-indigo-600 text-white' },
  Psíquico: { bg: 'bg-rose-100', text: 'text-rose-950', border: 'border-rose-600', badge: 'bg-rose-600 text-white' },
  Bicho: { bg: 'bg-lime-100', text: 'text-lime-950', border: 'border-lime-600', badge: 'bg-lime-600 text-white' },
  Fantasma: { bg: 'bg-violet-200', text: 'text-violet-950', border: 'border-violet-700', badge: 'bg-violet-800 text-white' },
  Dragón: { bg: 'bg-teal-200', text: 'text-teal-950', border: 'border-teal-700', badge: 'bg-teal-800 text-white' },
  Acero: { bg: 'bg-slate-200', text: 'text-slate-900', border: 'border-slate-600', badge: 'bg-slate-600 text-white' },
  Hada: { bg: 'bg-pink-100', text: 'text-pink-900', border: 'border-pink-600', badge: 'bg-pink-500 text-white' }
};

export const TypeChartModal: React.FC<TypeChartModalProps> = ({ isOpen, onClose }) => {
  const [selectedAttacker, setSelectedAttacker] = useState<string>('Fuego');
  const [selectedDefender1, setSelectedDefender1] = useState<string>('Planta');
  const [selectedDefender2, setSelectedDefender2] = useState<string>('Ninguno');
  const [activeTab, setActiveTab] = useState<'CALCULATOR' | 'MATRIX'>('CALCULATOR');

  if (!isOpen) return null;

  const defenderCombinedStr = selectedDefender2 !== 'Ninguno' && selectedDefender2 !== selectedDefender1
    ? `${selectedDefender1} / ${selectedDefender2}`
    : selectedDefender1;

  const multiplier = getTypeEffectivenessMultiplier(selectedAttacker, defenderCombinedStr);

  const getMultiplierBadge = (val: number) => {
    if (val >= 4.0) return { label: '4x SÚPER EFICAZ (CRÍTICO)', bg: 'bg-emerald-500 text-gray-950 font-black border-2 border-gray-900' };
    if (val >= 2.0) return { label: '2x SÚPER EFICAZ', bg: 'bg-emerald-400 text-gray-950 font-black border-2 border-gray-900' };
    if (val === 1.0) return { label: '1x DAÑO NORMAL', bg: 'bg-gray-200 text-gray-900 font-bold border border-gray-500' };
    if (val === 0.5) return { label: '0.5x POCO EFICAZ', bg: 'bg-amber-300 text-gray-950 font-bold border border-gray-800' };
    if (val === 0.25) return { label: '0.25x MUY POCO EFICAZ', bg: 'bg-amber-400 text-gray-950 font-bold border border-gray-900' };
    return { label: '0x INMUNE / SIN EFECTO', bg: 'bg-red-600 text-white font-black border-2 border-gray-900' };
  };

  const badgeInfo = getMultiplierBadge(multiplier);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in font-mono">
      <div className="bg-white border-4 border-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-gray-900 relative">
        {/* Header */}
        <div className="bg-red-600 text-white font-bold flex items-center justify-between px-4 py-3 border-b-4 border-gray-900 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-yellow-400 text-gray-950 rounded border-2 border-gray-900 shadow">
              <Sword className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                TABLA OFICIAL DE TIPOS POKÉMON (KANTO)
              </h2>
              <p className="text-[10px] text-red-100 font-sans font-semibold">
                Efectividades, multiplicadores y debilidades de combate
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded bg-red-800 text-white hover:bg-red-950 border-2 border-gray-900 cursor-pointer transition-colors shadow"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Tabs */}
        <div className="bg-gray-100 border-b-2 border-gray-800 px-4 py-2 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('CALCULATOR')}
              className={`px-3 py-1.5 rounded text-xs font-black uppercase border-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'CALCULATOR'
                  ? 'bg-yellow-400 text-gray-950 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-700" />
              <span>Calculadora de Combate</span>
            </button>
            <button
              onClick={() => setActiveTab('MATRIX')}
              className={`px-3 py-1.5 rounded text-xs font-black uppercase border-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'MATRIX'
                  ? 'bg-yellow-400 text-gray-950 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-blue-700" />
              <span>Matriz Resumen</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto touch-scroll flex-1 space-y-4">
          {activeTab === 'CALCULATOR' ? (
            <div className="space-y-4">
              {/* Calculator Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-3.5 border-2 border-gray-800 rounded-md">
                {/* Attacker Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-800 flex items-center space-x-1">
                    <Sword className="w-3.5 h-3.5 text-red-600" />
                    <span>TIPO DEL ATAQUE (ATACANTE):</span>
                  </label>
                  <select
                    value={selectedAttacker}
                    onChange={(e) => setSelectedAttacker(e.target.value)}
                    className="w-full p-2 bg-white border-2 border-gray-800 rounded text-xs font-bold uppercase focus:outline-none focus:border-red-600 shadow-sm cursor-pointer"
                  >
                    {KANTO_TYPES.map(t => (
                      <option key={t} value={t}>{t.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                {/* Defender Types */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-800 flex items-center space-x-1">
                    <Shield className="w-3.5 h-3.5 text-blue-600" />
                    <span>TIPO DEL POKÉMON RIVAL (DEFENSOR):</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={selectedDefender1}
                      onChange={(e) => setSelectedDefender1(e.target.value)}
                      className="w-full p-2 bg-white border-2 border-gray-800 rounded text-xs font-bold uppercase focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer"
                    >
                      {KANTO_TYPES.map(t => (
                        <option key={t} value={t}>{t.toUpperCase()}</option>
                      ))}
                    </select>

                    <select
                      value={selectedDefender2}
                      onChange={(e) => setSelectedDefender2(e.target.value)}
                      className="w-full p-2 bg-white border-2 border-gray-800 rounded text-xs font-bold uppercase focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer"
                    >
                      <option value="Ninguno">-- TIPO 2 (OPC) --</option>
                      {KANTO_TYPES.map(t => (
                        <option key={t} value={t}>{t.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Multiplier Result Banner */}
              <div className="bg-gray-900 text-white p-4 border-2 border-gray-900 rounded-md shadow-lg text-center space-y-2">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest block">
                  RESULTADO DE EFECTIVIDAD EN COMBATE
                </span>
                
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-black uppercase ${TYPE_COLORS[selectedAttacker]?.badge || 'bg-gray-600 text-white'}`}>
                    {selectedAttacker}
                  </span>
                  <span className="text-xs text-yellow-400 font-black">VS</span>
                  <span className={`px-2.5 py-1 rounded text-xs font-black uppercase ${TYPE_COLORS[selectedDefender1]?.badge || 'bg-gray-600 text-white'}`}>
                    {defenderCombinedStr}
                  </span>
                </div>

                <div className="pt-2">
                  <span className={`inline-block px-4 py-2 rounded-md text-sm sm:text-base font-black tracking-wide shadow ${badgeInfo.bg}`}>
                    {badgeInfo.label}
                  </span>
                </div>

                <p className="text-xs font-sans text-gray-300 font-medium max-w-md mx-auto pt-1">
                  {multiplier >= 2.0 && '¡Atacar con este tipo otorgará una ventaja decisiva multiplicando el daño infligido!'}
                  {multiplier === 1.0 && 'El ataque causa el daño estándar calculado por las estadísticas base.'}
                  {multiplier < 1.0 && multiplier > 0 && 'El tipo rival resiste este movimiento, reduciendo notablemente el impacto.'}
                  {multiplier === 0 && '¡Inmunidad total! Este ataque no causará ningún daño al objetivo.'}
                </p>
              </div>

              {/* Type Weaknesses Overview for Attacker */}
              <div className="bg-amber-50 border-2 border-amber-600 rounded-md p-3 text-xs space-y-2">
                <h3 className="font-black text-amber-950 uppercase flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-700" />
                  <span>EFECTIVIDADES CLAVE DE {selectedAttacker.toUpperCase()}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-bold text-gray-800 text-[11px]">
                  <div className="bg-white p-2 border border-amber-300 rounded">
                    <span className="text-emerald-700 font-black block mb-1">
                      VENTAJA OFENSIVA (2x) CONTRA:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {KANTO_TYPES.filter(t => getTypeEffectivenessMultiplier(selectedAttacker, t) >= 2.0).map(t => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-500 uppercase text-[10px]">
                          {t}
                        </span>
                      ))}
                      {KANTO_TYPES.filter(t => getTypeEffectivenessMultiplier(selectedAttacker, t) >= 2.0).length === 0 && (
                        <span className="text-gray-500 italic">Ninguno</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-2 border border-amber-300 rounded">
                    <span className="text-amber-800 font-black block mb-1">
                      DEBILIDAD OFENSIVA / RESISTIDO CONTRA:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {KANTO_TYPES.filter(t => getTypeEffectivenessMultiplier(selectedAttacker, t) < 1.0).map(t => {
                        const mult = getTypeEffectivenessMultiplier(selectedAttacker, t);
                        return (
                          <span key={t} className={`px-1.5 py-0.5 rounded border uppercase text-[10px] ${mult === 0 ? 'bg-red-100 text-red-950 border-red-500 font-black' : 'bg-amber-100 text-amber-950 border-amber-500'}`}>
                            {t} ({mult === 0 ? '0x No Afecta' : `${mult}x`})
                          </span>
                        );
                      })}
                      {KANTO_TYPES.filter(t => getTypeEffectivenessMultiplier(selectedAttacker, t) < 1.0).length === 0 && (
                        <span className="text-gray-500 italic">Ninguno</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Matrix View */
            <div className="space-y-3">
              <p className="text-xs font-sans text-gray-600 font-bold">
                Selecciona un tipo para ver su desglose ofensivo y defensivo en la Pokedex de Kanto:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {KANTO_TYPES.map(type => {
                  const superEffectiveTypes = KANTO_TYPES.filter(t => getTypeEffectivenessMultiplier(type, t) >= 2.0);
                  const noEffectTypes = KANTO_TYPES.filter(t => getTypeEffectivenessMultiplier(type, t) === 0);
                  const weakTypes = KANTO_TYPES.filter(t => getTypeEffectivenessMultiplier(t, type) >= 2.0);
                  const style = TYPE_COLORS[type] || { bg: 'bg-gray-100', text: 'text-gray-900', border: 'border-gray-600', badge: 'bg-gray-600 text-white' };

                  return (
                    <div
                      key={type}
                      onClick={() => {
                        setSelectedAttacker(type);
                        setActiveTab('CALCULATOR');
                      }}
                      className={`p-2.5 rounded border-2 ${style.bg} ${style.border} cursor-pointer hover:shadow-md transition-all`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${style.badge}`}>
                          {type}
                        </span>
                      </div>

                      <div className="space-y-1 text-[10px] font-sans">
                        <div>
                          <strong className="text-emerald-800 font-black">VENTAJA OFENSIVA (2x):</strong>
                          <div className="text-gray-800 font-bold truncate">
                            {superEffectiveTypes.join(', ') || 'Ninguno'}
                          </div>
                        </div>

                        {noEffectTypes.length > 0 && (
                          <div>
                            <strong className="text-amber-900 font-black">DEBILIDAD OFENSIVA (0x):</strong>
                            <div className="text-red-900 font-extrabold truncate">
                              {noEffectTypes.join(', ')}
                            </div>
                          </div>
                        )}

                        <div>
                          <strong className="text-red-700 font-black">DEBILIDAD DEFENSIVA (Recibe 2x):</strong>
                          <div className="text-gray-800 font-bold truncate">
                            {weakTypes.join(', ') || 'Ninguno'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-100 border-t-2 border-gray-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 text-white font-black text-xs uppercase rounded border-2 border-black hover:bg-gray-800 transition-colors shadow cursor-pointer"
          >
            CERRAR TABLA
          </button>
        </div>
      </div>
    </div>
  );
};
