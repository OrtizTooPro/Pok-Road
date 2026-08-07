import React, { useState, useMemo } from 'react';
import { KANTO_POKEDEX, KantoPokemon } from '../../data/kantoPokedex';
import { getEvolutionFamily } from '../../data/kantoEvolutionLines';
import { useGame } from '../../context/GameContext';
import { Search, Sparkles, Filter, X, Eye, EyeOff, CheckCircle, BookOpen, Lock, Shield, Sword, GitFork } from 'lucide-react';
import { TypeChartModal } from './TypeChartModal';

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Planta: { bg: 'bg-emerald-100', text: 'text-emerald-950', border: 'border-emerald-600' },
  Veneno: { bg: 'bg-purple-100', text: 'text-purple-950', border: 'border-purple-600' },
  Fuego: { bg: 'bg-amber-100', text: 'text-amber-950', border: 'border-amber-600' },
  Agua: { bg: 'bg-blue-100', text: 'text-blue-950', border: 'border-blue-600' },
  Volador: { bg: 'bg-indigo-100', text: 'text-indigo-950', border: 'border-indigo-600' },
  Bicho: { bg: 'bg-lime-100', text: 'text-lime-950', border: 'border-lime-600' },
  Normal: { bg: 'bg-stone-100', text: 'text-stone-900', border: 'border-stone-500' },
  Eléctrico: { bg: 'bg-yellow-100', text: 'text-yellow-950', border: 'border-yellow-600' },
  Tierra: { bg: 'bg-amber-200', text: 'text-amber-950', border: 'border-amber-800' },
  Roca: { bg: 'bg-stone-200', text: 'text-stone-950', border: 'border-stone-800' },
  Hada: { bg: 'bg-pink-100', text: 'text-pink-950', border: 'border-pink-600' },
  Lucha: { bg: 'bg-orange-100', text: 'text-orange-950', border: 'border-orange-600' },
  Psíquico: { bg: 'bg-rose-100', text: 'text-rose-950', border: 'border-rose-600' },
  Acero: { bg: 'bg-slate-200', text: 'text-slate-900', border: 'border-slate-600' },
  Hielo: { bg: 'bg-cyan-100', text: 'text-cyan-950', border: 'border-cyan-600' },
  Fantasma: { bg: 'bg-violet-200', text: 'text-violet-950', border: 'border-violet-700' },
  Dragón: { bg: 'bg-teal-200', text: 'text-teal-950', border: 'border-teal-700' }
};

export const KantoPokedexView: React.FC = () => {
  const { state } = useGame();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('TODOS');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'VISTOS' | 'NO_VISTOS'>('TODOS');
  const [selectedPokemon, setSelectedPokemon] = useState<KantoPokemon | null>(null);
  const [isTypeChartOpen, setIsTypeChartOpen] = useState(false);

  const teamNames = useMemo(() => {
    return state.career.team.map(m => m.name.toLowerCase());
  }, [state.career.team]);

  const isMasterProtocolUnlocked = useMemo(() => {
    return state.historyLog.some(h => 
      h.summary.includes('PROTOCOLO 100%') || 
      h.summary.includes('Escáner Cuántico') || 
      h.summary.includes('Sincronización Total')
    ) || state.career.badgesWon.includes('badge-master-100');
  }, [state.historyLog, state.career.badgesWon]);

  // Determine all seen Pokémon names based on team, history log, and experienced events
  const seenPokemonSet = useMemo(() => {
    const set = new Set<string>();

    if (isMasterProtocolUnlocked) {
      KANTO_POKEDEX.forEach(p => set.add(p.name.toLowerCase()));
      return set;
    }

    // 1. Team members
    state.career.team.forEach(m => {
      if (m.name) set.add(m.name.toLowerCase());
      if (m.species) set.add(m.species.toLowerCase());
    });

    // 2. History Log entries
    state.historyLog.forEach(log => {
      if (log.pokemonAdded) {
        set.add(log.pokemonAdded.toLowerCase());
      }
    });

    // 3. Scan Kanto Pokédex against events active up to current event index + history
    const allText = [
      ...state.historyLog.map(h => `${h.eventTitle} ${h.chosenOption} ${h.summary}`),
      ...state.activeEvents.slice(0, state.currentEventIndex + 1).map(e => `${e.title} ${e.description} ${e.location} ${e.options.map(o => `${o.text} ${o.outcomeText} ${o.addPokemon?.name || ''}`).join(' ')}`)
    ].join(' ').toLowerCase();

    KANTO_POKEDEX.forEach(p => {
      const pName = p.name.toLowerCase();
      if (allText.includes(pName)) {
        set.add(pName);
      }
    });

    return set;
  }, [state.career.team, state.historyLog, state.activeEvents, state.currentEventIndex, isMasterProtocolUnlocked]);

  const seenCount = useMemo(() => {
    return KANTO_POKEDEX.filter(p => seenPokemonSet.has(p.name.toLowerCase())).length;
  }, [seenPokemonSet]);

  const allTypes = useMemo(() => {
    const typesSet = new Set<string>();
    KANTO_POKEDEX.forEach(p => p.types.forEach(t => typesSet.add(t)));
    return ['TODOS', ...Array.from(typesSet).sort()];
  }, []);

  const filteredList = useMemo(() => {
    return KANTO_POKEDEX.filter(p => {
      const isSeen = seenPokemonSet.has(p.name.toLowerCase());

      const matchStatus = 
        statusFilter === 'TODOS' ||
        (statusFilter === 'VISTOS' && isSeen) ||
        (statusFilter === 'NO_VISTOS' && !isSeen);

      const matchSearch = 
        (isSeen && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        `#${p.id}`.includes(searchTerm) ||
        p.id.toString() === searchTerm.trim();

      const matchType = 
        selectedType === 'TODOS' || 
        p.types.includes(selectedType);

      return matchStatus && matchSearch && matchType;
    });
  }, [searchTerm, selectedType, statusFilter, seenPokemonSet]);

  return (
    <div className="bg-white border-4 border-gray-900 rounded-md overflow-hidden shadow-2xl font-mono text-gray-800">
      {/* Pokédex Top Header Bar */}
      <div className="bg-red-600 text-white p-4 border-b-4 border-gray-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-cyan-400 border-4 border-white shadow-lg flex items-center justify-center shrink-0 relative">
            <div className="w-3 h-3 rounded-full bg-white absolute top-1 left-1 opacity-80 animate-ping"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-white absolute top-1 left-1 opacity-90"></div>
          </div>
          <div>
            <h2 className="text-lg font-black tracking-wide uppercase drop-shadow flex items-center gap-2">
              <span>POKÉDEX REGIONAL DE KANTO</span>
              {seenCount === 151 && (
                <span className="bg-amber-400 text-gray-900 text-[10px] px-2 py-0.5 rounded border border-gray-900 shadow font-extrabold animate-bounce">
                  ★ 100% COMPLETADO
                </span>
              )}
            </h2>
            <p className="text-xs text-red-100 font-bold">
              AVISTADOS Y REGISTRADOS EN TU CARRERA
            </p>
          </div>
        </div>

        <div className="bg-red-800 px-3 py-1.5 rounded-md border-2 border-gray-900 text-xs font-bold flex items-center space-x-2 self-stretch sm:self-auto justify-center">
          <BookOpen className="w-4 h-4 text-yellow-300 shrink-0" />
          <span>VISTOS: <strong className="text-yellow-300 font-black">{seenCount}</strong> / 151 ({Math.round((seenCount / 151) * 100)}%)</span>
        </div>
      </div>

      {/* 100% Completion Golden Certificate Banner */}
      {seenCount === 151 && (
        <div className="p-4 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 border-b-4 border-amber-600 text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center space-x-3">
            <div className="text-3xl p-2 bg-amber-400 border-2 border-amber-800 rounded-full shadow">
              🏆
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>CERTIFICADO OFICIAL: GRAN MAESTRO 100% KANTO</span>
              </h3>
              <p className="text-xs font-bold text-amber-900">
                Has registrado las 151 especies de Kanto completando el Protocolo Cuántico de Investigación.
              </p>
            </div>
          </div>
          <div className="bg-amber-400 border-2 border-amber-800 text-amber-950 text-xs font-black px-3 py-1.5 rounded shadow flex items-center gap-1 shrink-0">
            <span>SELLO DE EXCELENCIA 100%</span>
          </div>
        </div>
      )}

      {/* Controls & Filter Section */}
      <div className="p-3 sm:p-4 bg-gray-50 border-b-2 border-gray-800 space-y-3">
        {/* Status Tabs & Type Chart Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-gray-200 pb-2">
          <div className="flex items-center space-x-2 overflow-x-auto touch-scroll no-scrollbar shrink-0">
            <button
              onClick={() => setStatusFilter('TODOS')}
              className={`px-2.5 py-1 rounded text-xs font-black uppercase transition-all border-2 shrink-0 ${
                statusFilter === 'TODOS'
                  ? 'bg-gray-900 text-white border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-800'
              }`}
            >
              Todos (151)
            </button>
            <button
              onClick={() => setStatusFilter('VISTOS')}
              className={`px-2.5 py-1 rounded text-xs font-black uppercase transition-all border-2 flex items-center space-x-1 shrink-0 ${
                statusFilter === 'VISTOS'
                  ? 'bg-emerald-600 text-white border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-emerald-800 border-gray-300 hover:border-emerald-600'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Vistos ({seenCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('NO_VISTOS')}
              className={`px-2.5 py-1 rounded text-xs font-black uppercase transition-all border-2 flex items-center space-x-1 shrink-0 ${
                statusFilter === 'NO_VISTOS'
                  ? 'bg-gray-700 text-white border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-700'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>No Vistos ({151 - seenCount})</span>
            </button>
          </div>

          <button
            onClick={() => setIsTypeChartOpen(true)}
            className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs uppercase rounded border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center space-x-1.5 cursor-pointer shrink-0 active:translate-x-[1px] active:translate-y-[1px]"
          >
            <Sword className="w-3.5 h-3.5 text-gray-950" />
            <span>Tabla de Tipos</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por número (#001)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border-2 border-gray-800 rounded-md text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-red-600"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Filter Select */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-700 shrink-0" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="py-2 px-3 bg-white border-2 border-gray-800 rounded-md text-xs font-bold text-gray-900 focus:outline-none focus:border-red-600 uppercase w-full sm:w-auto"
            >
              {allTypes.map(t => (
                <option key={t} value={t}>{t === 'TODOS' ? 'TODOS LOS TIPOS' : t.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of 151 Kanto Pokémon with Scrollable Container */}
      <div className="p-3 sm:p-4 max-h-[58vh] sm:max-h-[66vh] overflow-y-auto touch-scroll border-b-2 border-gray-300">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {filteredList.map((pokemon) => {
            const formattedId = `#${pokemon.id.toString().padStart(3, '0')}`;
            const isSeen = seenPokemonSet.has(pokemon.name.toLowerCase());
            const isInTeam = teamNames.includes(pokemon.name.toLowerCase());

            return (
              <div
                key={pokemon.id}
                onClick={() => setSelectedPokemon(pokemon)}
                className={`p-3 border-2 rounded-md relative overflow-hidden cursor-pointer transition-all flex flex-col items-center justify-between text-center group ${
                  isSeen
                    ? isInTeam 
                      ? 'bg-emerald-50/40 border-emerald-600 ring-2 ring-emerald-500 hover:shadow-lg' 
                      : 'bg-white border-gray-800 hover:border-red-600 hover:shadow-lg'
                    : 'bg-gray-100 border-gray-300 opacity-80 hover:border-gray-600'
                }`}
              >
                {/* Pokédex Top Bar */}
                <div className="w-full flex items-center justify-between text-[10px] font-black text-gray-600 mb-1">
                  <span className={isSeen ? 'text-red-600' : 'text-gray-400'}>{formattedId}</span>
                  {isSeen ? (
                    isInTeam && (
                      <span className="flex items-center gap-0.5 text-[8px] bg-emerald-100 text-emerald-900 px-1 py-0.2 rounded border border-emerald-600 font-extrabold">
                        <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                        EQUIPO
                      </span>
                    )
                  ) : (
                    <span className="flex items-center gap-0.5 text-[8px] bg-gray-200 text-gray-600 px-1 py-0.2 rounded border border-gray-400 font-bold">
                      <Lock className="w-2.5 h-2.5 text-gray-500" />
                      NO VISTO
                    </span>
                  )}
                </div>

                {/* 2D Sprite or Silhouette */}
                <div className={`my-1 relative w-16 h-16 rounded-md flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden shadow-inner border-2 ${
                  isSeen ? 'bg-gray-50 border-gray-200' : 'bg-gray-300/80 border-gray-400'
                }`}>
                  <img
                    src={pokemon.sprite}
                    alt={isSeen ? pokemon.name : 'Pokémon Silueta'}
                    style={!isSeen ? { filter: 'brightness(0)' } : undefined}
                    className={`w-14 h-14 object-contain ${isSeen ? 'drop-shadow' : 'opacity-85'}`}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>

                {/* Name or Masked Name */}
                <h3 className={`font-black text-xs uppercase tracking-tight my-1 truncate max-w-full ${
                  isSeen ? 'text-gray-900' : 'text-gray-500 italic'
                }`}>
                  {isSeen ? pokemon.name : '???'}
                </h3>

                {/* Type Badges or Masked Badges */}
                <div className="flex flex-wrap gap-1 justify-center w-full mt-1">
                  {isSeen ? (
                    pokemon.types.map(t => {
                      const style = TYPE_COLORS[t] || { bg: 'bg-gray-100', text: 'text-gray-900', border: 'border-gray-500' };
                      return (
                        <span
                          key={t}
                          className={`text-[8px] font-black px-1.5 py-0.2 rounded border ${style.bg} ${style.text} ${style.border} uppercase`}
                        >
                          {t}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-[8px] font-black px-2 py-0.2 rounded border bg-gray-200 text-gray-500 border-gray-400 uppercase">
                      ???
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pokemon Detail Modal */}
      {selectedPokemon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in font-mono">
          <div className="bg-white border-4 border-gray-900 rounded-md max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl text-gray-800 relative">
            {seenPokemonSet.has(selectedPokemon.name.toLowerCase()) ? (
              /* UNLOCKED / SEEN POKEMON MODAL */
              <>
                <div className="bg-red-600 text-white font-bold flex items-center justify-between px-4 py-2 border-b-2 border-gray-900 shrink-0">
                  <span className="text-xs uppercase font-extrabold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    FICHA POKÉDEX #{selectedPokemon.id.toString().padStart(3, '0')}
                  </span>
                  <button
                    onClick={() => setSelectedPokemon(null)}
                    className="p-1 rounded bg-red-800 text-white hover:bg-red-900 border border-gray-900 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 sm:p-5 space-y-4 overflow-y-auto touch-scroll flex-1">
                  <div className="flex items-center space-x-4 border-b-2 border-gray-200 pb-4">
                    <div className="w-20 h-20 bg-gray-100 border-2 border-gray-900 rounded-md flex items-center justify-center shrink-0 shadow-md">
                      <img
                        src={selectedPokemon.sprite}
                        alt={selectedPokemon.name}
                        className="w-18 h-18 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-black text-red-600 uppercase">
                        POKÉMON {selectedPokemon.category.toUpperCase()}
                      </span>
                      <h3 className="text-xl font-black text-gray-900 uppercase">
                        {selectedPokemon.name}
                      </h3>
                      <div className="flex gap-1.5 mt-1">
                        {selectedPokemon.types.map(t => {
                          const style = TYPE_COLORS[t] || { bg: 'bg-gray-100', text: 'text-gray-900', border: 'border-gray-600' };
                          return (
                            <span
                              key={t}
                              className={`text-[10px] font-black px-2 py-0.5 rounded border ${style.bg} ${style.text} ${style.border} uppercase shadow-sm`}
                            >
                              {t}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <div className="p-2 bg-gray-50 border border-gray-300 rounded">
                      <span className="text-[9px] text-gray-500 uppercase block">ALTURA</span>
                      <span>{selectedPokemon.height}</span>
                    </div>
                    <div className="p-2 bg-gray-50 border border-gray-300 rounded">
                      <span className="text-[9px] text-gray-500 uppercase block">PESO</span>
                      <span>{selectedPokemon.weight}</span>
                    </div>
                  </div>

                  {/* Official Base Stats (Pokédex Kanto) */}
                  <div className="bg-slate-50 border-2 border-gray-900 rounded-md p-3 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between border-b border-gray-300 pb-1.5">
                      <span className="text-xs font-black uppercase text-gray-900 flex items-center gap-1.5">
                        <Sword className="w-4 h-4 text-red-600" />
                        ESTADÍSTICAS BASE OFICIALES (GEN 1)
                      </span>
                      <span className="text-[10px] font-black bg-gray-900 text-yellow-300 px-2 py-0.5 rounded">
                        BST: {selectedPokemon.baseStats.hp + selectedPokemon.baseStats.attack + selectedPokemon.baseStats.defense + selectedPokemon.baseStats.speed + selectedPokemon.baseStats.special}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span className="w-22 text-[10px] uppercase text-emerald-900 shrink-0 font-black">PS: {selectedPokemon.baseStats.hp}</span>
                        <div className="flex-1 bg-gray-200 h-2.5 rounded-full overflow-hidden border border-gray-300">
                          <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (selectedPokemon.baseStats.hp / 160) * 100)}%` }}></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-22 text-[10px] uppercase text-rose-900 shrink-0 font-black">Ataque: {selectedPokemon.baseStats.attack}</span>
                        <div className="flex-1 bg-gray-200 h-2.5 rounded-full overflow-hidden border border-gray-300">
                          <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (selectedPokemon.baseStats.attack / 160) * 100)}%` }}></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-22 text-[10px] uppercase text-blue-900 shrink-0 font-black">Defensa: {selectedPokemon.baseStats.defense}</span>
                        <div className="flex-1 bg-gray-200 h-2.5 rounded-full overflow-hidden border border-gray-300">
                          <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (selectedPokemon.baseStats.defense / 160) * 100)}%` }}></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-22 text-[10px] uppercase text-amber-900 shrink-0 font-black">Velocidad: {selectedPokemon.baseStats.speed}</span>
                        <div className="flex-1 bg-gray-200 h-2.5 rounded-full overflow-hidden border border-gray-300">
                          <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (selectedPokemon.baseStats.speed / 160) * 100)}%` }}></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-22 text-[10px] uppercase text-purple-900 shrink-0 font-black">Especial: {selectedPokemon.baseStats.special}</span>
                        <div className="flex-1 bg-gray-200 h-2.5 rounded-full overflow-hidden border border-gray-300">
                          <div className="bg-purple-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (selectedPokemon.baseStats.special / 160) * 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Evolutionary Chain Section */}
                  {(() => {
                    const evoFamily = getEvolutionFamily(selectedPokemon.id);
                    if (!evoFamily) return null;

                    return (
                      <div className="bg-slate-900 text-white border-2 border-gray-900 rounded-md p-3 space-y-2.5 shadow">
                        <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                          <span className="text-xs font-black uppercase text-yellow-400 flex items-center gap-1.5">
                            <GitFork className="w-4 h-4 text-amber-400" />
                            LÍNEA EVOLUTIVA Y MÉTODOS (KANTO)
                          </span>
                          <span className="text-[10px] text-gray-400 font-sans font-bold">
                            Toca para ver
                          </span>
                        </div>

                        {/* Linear Chain */}
                        {evoFamily.steps && evoFamily.steps.length > 0 && (
                          <div className="flex flex-wrap items-center justify-center gap-1.5 py-1">
                            {evoFamily.steps.map((step, idx) => {
                              const stepMon = KANTO_POKEDEX.find(p => p.id === step.id);
                              const isStepSeen = stepMon ? seenPokemonSet.has(stepMon.name.toLowerCase()) : false;

                              return (
                                <React.Fragment key={step.id}>
                                  {idx > 0 && (
                                    <div className="flex flex-col items-center justify-center text-center px-1">
                                      <span className="text-[9px] font-black text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-600 shadow-sm uppercase">
                                        {step.methodToReach || 'Evolución'}
                                      </span>
                                      <span className="text-amber-400 font-black text-xs">➔</span>
                                    </div>
                                  )}

                                  <button
                                    onClick={() => {
                                      if (stepMon) setSelectedPokemon(stepMon);
                                    }}
                                    className={`p-1.5 rounded-md border-2 flex flex-col items-center justify-center transition-all cursor-pointer min-w-[72px] ${
                                      step.id === selectedPokemon.id
                                        ? 'bg-yellow-400 text-gray-950 border-white ring-2 ring-yellow-300 shadow-lg scale-105'
                                        : isStepSeen
                                        ? 'bg-gray-800 text-gray-100 border-gray-600 hover:border-yellow-400 hover:bg-gray-700'
                                        : 'bg-gray-950 text-gray-400 border-gray-800 hover:border-gray-600'
                                    }`}
                                  >
                                    <img
                                      src={step.sprite}
                                      alt={step.name}
                                      style={!isStepSeen ? { filter: 'brightness(0)' } : undefined}
                                      className="w-10 h-10 object-contain"
                                      referrerPolicy="no-referrer"
                                    />
                                    <span className="text-[10px] font-black uppercase mt-1 truncate max-w-[75px]">
                                      {isStepSeen ? step.name : `#${step.id}`}
                                    </span>
                                    <span className="text-[8px] text-gray-400 font-mono">
                                      #{step.id.toString().padStart(3, '0')}
                                    </span>
                                  </button>
                                </React.Fragment>
                              );
                            })}
                          </div>
                        )}

                        {/* Branching Chain (Eevee) */}
                        {evoFamily.branches && (
                          <div className="space-y-1.5 pt-2 border-t border-gray-800">
                            <span className="text-[10px] text-amber-300 font-black block text-center uppercase tracking-wide">
                              EVOLUCIONES DISPONIBLES CON PIEDRAS:
                            </span>
                            <div className="grid grid-cols-3 gap-1.5">
                              {evoFamily.branches.map(branch => {
                                const branchMon = KANTO_POKEDEX.find(p => p.id === branch.id);
                                const isBranchSeen = branchMon ? seenPokemonSet.has(branchMon.name.toLowerCase()) : false;

                                return (
                                  <button
                                    key={branch.id}
                                    onClick={() => {
                                      if (branchMon) setSelectedPokemon(branchMon);
                                    }}
                                    className={`p-1.5 rounded border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                                      branch.id === selectedPokemon.id
                                        ? 'bg-yellow-400 text-gray-950 border-white ring-2 ring-yellow-300 shadow-lg scale-105'
                                        : isBranchSeen
                                        ? 'bg-gray-800 text-gray-100 border-gray-600 hover:border-yellow-400'
                                        : 'bg-gray-950 text-gray-400 border-gray-800 hover:border-gray-600'
                                    }`}
                                  >
                                    <img
                                      src={branch.sprite}
                                      alt={branch.name}
                                      style={!isBranchSeen ? { filter: 'brightness(0)' } : undefined}
                                      className="w-9 h-9 object-contain"
                                      referrerPolicy="no-referrer"
                                    />
                                    <span className="text-[9px] font-black uppercase mt-0.5 truncate max-w-[70px]">
                                      {isBranchSeen ? branch.name : `#${branch.id}`}
                                    </span>
                                    <span className="text-[8px] bg-amber-950 text-amber-300 px-1 py-0.2 rounded border border-amber-700 mt-1 uppercase font-black">
                                      {branch.methodToReach}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="bg-amber-50 border-2 border-amber-600 rounded p-3 text-xs leading-relaxed font-bold text-amber-950">
                    <p>"{selectedPokemon.description}"</p>
                  </div>

                  <button
                    onClick={() => setSelectedPokemon(null)}
                    className="w-full py-2.5 bg-gray-900 text-white font-black text-xs uppercase rounded border-2 border-black hover:bg-gray-800 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                  >
                    CERRAR FICHA POKÉDEX
                  </button>
                </div>
              </>
            ) : (
              /* LOCKED / UNSEEN POKEMON MODAL */
              <>
                <div className="bg-gray-800 text-gray-200 font-bold flex items-center justify-between px-4 py-2 border-b-2 border-gray-900 shrink-0">
                  <span className="text-xs uppercase font-extrabold flex items-center gap-1.5 text-gray-300">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    REGISTRO BLOQUEADO #{selectedPokemon.id.toString().padStart(3, '0')}
                  </span>
                  <button
                    onClick={() => setSelectedPokemon(null)}
                    className="p-1 rounded bg-gray-700 text-white hover:bg-gray-900 border border-gray-900 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 sm:p-5 space-y-4 text-center overflow-y-auto touch-scroll flex-1">
                  <div className="w-24 h-24 mx-auto bg-gray-200 border-2 border-gray-800 rounded-md flex items-center justify-center shadow-inner relative">
                    <img
                      src={selectedPokemon.sprite}
                      alt="Pokémon Silueta"
                      style={{ filter: 'brightness(0)' }}
                      className="w-20 h-20 object-contain opacity-80"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-gray-900 uppercase">
                      POKÉMON NO AVISTADO AÚN
                    </h3>
                    <p className="text-xs text-gray-600 font-bold mt-1">
                      Número de Registro: #{selectedPokemon.id.toString().padStart(3, '0')}
                    </p>
                  </div>

                  <div className="bg-gray-100 border-2 border-dashed border-gray-400 rounded p-3 text-xs leading-relaxed font-bold text-gray-700">
                    Explora las rutas de Kanto, desafía líderes de Gimnasio o avanza en tu carrera de entrenador para avistar este Pokémon y registrar sus datos completos.
                  </div>

                  <button
                    onClick={() => setSelectedPokemon(null)}
                    className="w-full py-2.5 bg-gray-900 text-white font-black text-xs uppercase rounded border-2 border-black hover:bg-gray-800 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                  >
                    ENTENDIDO
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Official Type Chart Modal */}
      <TypeChartModal
        isOpen={isTypeChartOpen}
        onClose={() => setIsTypeChartOpen(false)}
      />
    </div>
  );
};
