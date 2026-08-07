import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { 
  Sparkles, Sword, Zap, Shield, Heart, Gauge, Flame, X, Info, Crown, 
  ShieldAlert, ShieldCheck, GripVertical, Laptop, Inbox, Search, 
  ArrowLeftRight, Download, Upload, Trash2, ArrowUp, ArrowDown, ChevronLeft, ChevronRight,
  AlertTriangle, RefreshCw
} from 'lucide-react';
import { findPokemonByName } from '../../data/kantoPokedex';
import { calculateMaxExpForLevel, calculatePokemonStats, getPokemonMoves, EVOLUTION_RULES, getPokemonPotentialJudgement } from '../../utils/pokemonEvolution';
import { getWeaknessesAndResistances } from '../../utils/typeChart';
import { PokemonMember } from '../../types';

type DragItemSource = 
  | { type: 'TEAM'; index: number; pokemon: PokemonMember }
  | { type: 'PC'; index: number; pokemon: PokemonMember };

export const TeamView: React.FC = () => {
  const { 
    state, 
    setTeamLeader, 
    reorderTeam, 
    depositToPC, 
    withdrawFromPC, 
    swapTeamWithPC, 
    reorderPCBox, 
    releasePokemonFromPC 
  } = useGame();

  const { team, pcBox = [] } = state.career;

  const [selectedPokemon, setSelectedPokemon] = useState<{ pokemon: PokemonMember; isPC: boolean } | null>(null);
  const [swapTargetPC, setSwapTargetPC] = useState<PokemonMember | null>(null);
  const [releaseTargetPC, setReleaseTargetPC] = useState<PokemonMember | null>(null);
  const [pcSearchQuery, setPcSearchQuery] = useState('');

  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState<DragItemSource | null>(null);
  const [dropTarget, setDropTarget] = useState<{ type: 'TEAM' | 'PC' | 'PC_CONTAINER'; index?: number } | null>(null);

  // Active PC Box tab (Box 1, Box 2, etc.)
  const [currentBoxNumber, setCurrentBoxNumber] = useState(1);
  const BOX_CAPACITY = 30;

  // Filter PC Box by search query
  const filteredPCBox = pcBox.filter(p => {
    if (!pcSearchQuery.trim()) return true;
    const query = pcSearchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      (p.species && p.species.toLowerCase().includes(query)) ||
      p.type.toLowerCase().includes(query)
    );
  });

  // Reorder Team helper for mobile / button actions
  const moveTeamMember = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= team.length) return;
    const newTeam = [...team];
    const [moved] = newTeam.splice(fromIndex, 1);
    newTeam.splice(toIndex, 0, moved);
    reorderTeam(newTeam);
  };

  // Drag and Drop Event Handlers
  const handleDragStart = (e: React.DragEvent, source: DragItemSource) => {
    setDraggedItem(source);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', source.pokemon.id);
  };

  const handleDragOver = (e: React.DragEvent, target: { type: 'TEAM' | 'PC' | 'PC_CONTAINER'; index?: number }) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget(target);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent, target: { type: 'TEAM' | 'PC' | 'PC_CONTAINER'; index?: number }) => {
    e.preventDefault();
    setDropTarget(null);

    if (!draggedItem) return;

    // Case 1: Drag Team Member -> Drop on Team Slot (Reorder Team)
    if (draggedItem.type === 'TEAM' && target.type === 'TEAM' && typeof target.index === 'number') {
      if (draggedItem.index !== target.index) {
        moveTeamMember(draggedItem.index, target.index);
      }
    }

    // Case 2: Drag Team Member -> Drop on PC (Deposit to PC)
    else if (draggedItem.type === 'TEAM' && (target.type === 'PC' || target.type === 'PC_CONTAINER')) {
      if (team.length > 1) {
        depositToPC(draggedItem.pokemon.id);
      }
    }

    // Case 3: Drag PC Member -> Drop on Team Slot
    else if (draggedItem.type === 'PC' && target.type === 'TEAM' && typeof target.index === 'number') {
      const targetTeamMon = team[target.index];
      if (targetTeamMon) {
        // Swap PC member with targeted team member
        swapTeamWithPC(targetTeamMon.id, draggedItem.pokemon.id);
      } else if (team.length < 6) {
        // Withdraw to empty slot
        withdrawFromPC(draggedItem.pokemon.id);
      }
    }

    // Case 4: Drag PC Member -> Drop on PC Slot (Reorder PC Box)
    else if (draggedItem.type === 'PC' && target.type === 'PC' && typeof target.index === 'number') {
      if (draggedItem.index !== target.index) {
        const newPC = [...pcBox];
        const [moved] = newPC.splice(draggedItem.index, 1);
        newPC.splice(target.index, 0, moved);
        reorderPCBox(newPC);
      }
    }

    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropTarget(null);
  };

  return (
    <div className="space-y-6 font-mono text-gray-800">
      {/* ACTIVE TEAM SECTION */}
      <div className="bg-white border-2 border-gray-800 rounded-md overflow-hidden shadow-md">
        {/* Team Header Bar */}
        <div className="bg-red-600 text-white flex flex-wrap items-center justify-between px-3.5 py-2.5 font-bold tracking-wide border-b-2 border-gray-900 gap-2">
          <div className="flex items-center space-x-2">
            <Sword className="w-4 h-4 text-white" />
            <span className="text-xs uppercase">EQUIPO POKÉMON EN COMBATE ({team.length}/6)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold bg-red-800 text-white px-2 py-0.5 rounded border border-gray-900">
              ARRATRA Y SUELTA PARA REORDENAR
            </span>
            <span className="text-[11px] font-bold bg-amber-400 text-gray-950 px-2 py-0.5 rounded border border-gray-900">
              PROMEDIO: NVL. {team.length > 0 ? Math.round(team.reduce((acc, m) => acc + (m.level || 5), 0) / team.length) : 5}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Info Banner about Leader & Reordering */}
          <div className="bg-amber-50 border-2 border-amber-600 rounded-md p-3 flex items-start space-x-3 text-xs text-amber-950 font-bold shadow-xs">
            <Crown className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="uppercase text-amber-950 font-black flex items-center gap-1.5 text-xs">
                SISTEMA DE LÍDER Y ORDENACIÓN DE EQUIPO:
              </span>
              <p className="text-[11px] leading-relaxed text-amber-900 font-medium">
                • El Pokémon en el <strong className="text-amber-950">Slot #1 (Líder)</strong> encabeza los combates, eventos y bonos de efectividad.<br/>
                • <strong>Arrastra y suelta</strong> las tarjetas de tu equipo para modificar su posición o depositar en el PC.<br/>
                • También puedes presionar las flechas de posición para cambiar el orden fácilmente.
              </p>
            </div>
          </div>

          {/* Active Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {team.map((pokemon, idx) => {
              const kantoMatch = findPokemonByName(pokemon.species || pokemon.name);
              const spriteUrl = pokemon.spriteUrl || kantoMatch?.sprite;
              const level = pokemon.level || 5;
              const maxExp = pokemon.maxExp || calculateMaxExpForLevel(level);
              const currentExp = pokemon.exp || 0;
              const expPercent = Math.min(100, Math.max(0, Math.round((currentExp / maxExp) * 100)));
              const stats = pokemon.stats || calculatePokemonStats(level, pokemon.stage || 1);
              const isLeader = idx === 0;

              const isDropTarget = dropTarget?.type === 'TEAM' && dropTarget?.index === idx;
              const isBeingDragged = draggedItem?.type === 'TEAM' && draggedItem?.index === idx;

              const typeMatchupInfo = getWeaknessesAndResistances(pokemon.type);
              const evoRule = EVOLUTION_RULES.find(r => r.fromSpecies.toLowerCase() === (pokemon.species || pokemon.name).toLowerCase());

              return (
                <div
                  key={pokemon.id || idx}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, { type: 'TEAM', index: idx, pokemon })}
                  onDragOver={(e) => handleDragOver(e, { type: 'TEAM', index: idx })}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, { type: 'TEAM', index: idx })}
                  onDragEnd={handleDragEnd}
                  onClick={() => setSelectedPokemon({ pokemon, isPC: false })}
                  className={`p-3 bg-white border-2 rounded-md relative flex flex-col justify-between shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group select-none ${
                    isLeader
                      ? 'border-amber-500 ring-2 ring-amber-400 bg-amber-50/20'
                      : 'border-gray-800 hover:border-red-600'
                  } ${
                    isDropTarget ? 'border-blue-600 ring-4 ring-blue-400 bg-blue-50 scale-[1.02]' : ''
                  } ${
                    isBeingDragged ? 'opacity-40 border-dashed border-gray-400' : ''
                  }`}
                >
                  {/* Pokédex Top Stripe */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${isLeader ? 'bg-amber-500' : pokemon.isStarter ? 'bg-orange-500' : pokemon.isLegendary ? 'bg-purple-600' : 'bg-red-600'}`}></div>

                  {/* Slot Header */}
                  <div className="w-full flex items-center justify-between text-[10px] text-gray-600 font-bold mb-1.5 pt-1">
                    <div className="flex items-center space-x-1">
                      <GripVertical className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 shrink-0" />
                      {isLeader ? (
                        <span className="bg-amber-500 text-gray-950 px-2 py-0.5 rounded border border-gray-900 font-black flex items-center gap-1 shadow-xs animate-pulse">
                          <Crown className="w-3 h-3 text-gray-950 fill-amber-300" />
                          LÍDER #1
                        </span>
                      ) : (
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-400">
                          SLOT #{idx + 1}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      {pokemon.isStarter && (
                        <span className="text-[8px] uppercase tracking-wider font-extrabold text-amber-900 px-1 py-0.2 bg-amber-200 rounded border border-amber-600">
                          INICIAL
                        </span>
                      )}
                      <span className="text-red-600 font-black text-xs bg-red-50 px-1.5 py-0.5 rounded border border-red-300">
                        NVL. {level}
                      </span>
                    </div>
                  </div>

                  {/* Main Body */}
                  <div className="flex items-center space-x-3 my-1">
                    <div className="w-16 h-16 rounded bg-gray-50 border-2 border-gray-800 flex items-center justify-center shadow-inner relative overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                      {spriteUrl ? (
                        <img
                          src={spriteUrl}
                          alt={pokemon.name}
                          className="w-14 h-14 object-contain filter drop-shadow [image-rendering:pixelated]"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-xs font-black text-gray-800">{pokemon.name.slice(0, 3)}</span>
                      )}
                      {pokemon.isShiny && (
                        <div className="absolute top-0.5 right-0.5 bg-amber-400 text-gray-900 border border-gray-900 p-0.5 rounded shadow">
                          <Sparkles className="w-2.5 h-2.5 fill-amber-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-extrabold text-sm text-gray-900 truncate uppercase tracking-tight flex items-center gap-1">
                        {pokemon.name}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <span className="inline-block px-1.5 py-0.5 bg-gray-200 border border-gray-600 rounded text-[9px] font-bold text-gray-800 tracking-wider truncate">
                          {pokemon.type.toUpperCase()}
                        </span>
                        {(() => {
                          const judge = getPokemonPotentialJudgement(pokemon.ivs);
                          return (
                            <span className={`text-[8px] font-black px-1 py-0.5 rounded border truncate ${judge.tierClass}`} title={judge.summaryText}>
                              {judge.overallLabel}
                            </span>
                          );
                        })()}
                        {evoRule && (
                          <span className="text-[8px] font-bold text-purple-700 bg-purple-50 px-1 py-0.5 rounded border border-purple-300 truncate" title={`Evoluciona en ${evoRule.toSpecies} a Nvl. ${evoRule.minLevel}`}>
                            Evo Nvl.{evoRule.minLevel}
                          </span>
                        )}
                      </div>

                      {/* Stats Summary Badges */}
                      <div className="grid grid-cols-3 gap-1 pt-0.5 text-[9px] font-extrabold">
                        <span className="text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200 truncate">PS:{stats.hp}</span>
                        <span className="text-rose-700 bg-rose-50 px-1 py-0.2 rounded border border-rose-200 truncate">ATK:{stats.attack}</span>
                        <span className="text-blue-700 bg-blue-50 px-1 py-0.2 rounded border border-blue-200 truncate">DEF:{stats.defense}</span>
                      </div>
                    </div>
                  </div>

                  {/* Type Matchup / Weaknesses Summary */}
                  <div className="mt-1.5 pt-1.5 border-t border-dashed border-gray-300 text-[9px] space-y-1">
                    <div className="flex items-center gap-1 text-red-800 font-bold truncate">
                      <ShieldAlert className="w-3 h-3 text-red-600 shrink-0" />
                      <span className="font-black text-gray-700">DEBILIDAD:</span>
                      <span className="truncate">{typeMatchupInfo.weaknesses.slice(0, 3).join(', ') || 'Ninguna'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-800 font-bold truncate">
                      <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="font-black text-gray-700">FORTALEZA:</span>
                      <span className="truncate">{typeMatchupInfo.resistances.slice(0, 3).join(', ') || 'Ninguna'}</span>
                    </div>
                  </div>

                  {/* EXP Bar Component */}
                  <div className="w-full mt-2 pt-1 border-t border-gray-200">
                    <div className="flex items-center justify-between text-[9px] font-bold text-gray-600 mb-0.5">
                      <span className="flex items-center gap-1 text-cyan-800 uppercase font-extrabold">
                        <Zap className="w-3 h-3 text-cyan-600 fill-cyan-400" />
                        EXP
                      </span>
                      <span className="font-mono text-gray-700">{currentExp} / {maxExp} ({expPercent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 border border-gray-800 rounded-full overflow-hidden relative shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 transition-all duration-500"
                        style={{ width: `${expPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Controls: Leader Button, Quick Reorder Arrows, PC Deposit */}
                  <div className="mt-2.5 pt-2 border-t border-gray-200 flex flex-wrap items-center justify-between gap-1">
                    {/* Quick Shift Arrows */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveTeamMember(idx, idx - 1);
                        }}
                        disabled={idx === 0}
                        title="Mover a la izquierda"
                        className="p-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 border border-gray-800 rounded text-xs cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveTeamMember(idx, idx + 1);
                        }}
                        disabled={idx === team.length - 1}
                        title="Mover a la derecha"
                        className="p-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 border border-gray-800 rounded text-xs cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-1">
                      {!isLeader && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTeamLeader(pokemon.id);
                          }}
                          className="px-2 py-1 bg-amber-100 hover:bg-amber-200 border border-amber-600 text-amber-950 font-black text-[9px] uppercase rounded flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Crown className="w-3 h-3 text-amber-700 fill-amber-400" />
                          LÍDER
                        </button>
                      )}

                      {team.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            depositToPC(pokemon.id);
                          }}
                          className="px-2 py-1 bg-blue-100 hover:bg-blue-200 border border-blue-600 text-blue-950 font-black text-[9px] uppercase rounded flex items-center gap-1 transition-colors cursor-pointer"
                          title="Depositar en el Sistema PC"
                        >
                          <Download className="w-3 h-3 text-blue-800" />
                          PC
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty Team Slots */}
            {Array.from({ length: Math.max(0, 6 - team.length) }).map((_, i) => {
              const emptySlotIndex = team.length + i;
              const isDropTarget = dropTarget?.type === 'TEAM' && dropTarget?.index === emptySlotIndex;

              return (
                <div
                  key={`empty-${i}`}
                  onDragOver={(e) => handleDragOver(e, { type: 'TEAM', index: emptySlotIndex })}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, { type: 'TEAM', index: emptySlotIndex })}
                  className={`p-3 bg-gray-50 border-2 border-dashed rounded-md flex flex-col items-center justify-center min-h-[180px] text-gray-400 font-bold transition-all ${
                    isDropTarget 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 scale-[1.02] ring-4 ring-emerald-300' 
                      : 'border-gray-400'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center text-sm mb-1.5 bg-white">
                    +
                  </div>
                  <span className="text-[10px] uppercase font-extrabold text-gray-500">SLOT DE EQUIPO VACÍO</span>
                  <span className="text-[9px] font-medium text-gray-400 mt-1 text-center">
                    {isDropTarget ? '¡Suelta aquí para sacar del PC!' : 'Arrastra un Pokémon del PC o atrapa uno en eventos'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* POKÉMON PC STORAGE SYSTEM SECTION */}
      <div 
        onDragOver={(e) => handleDragOver(e, { type: 'PC_CONTAINER' })}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, { type: 'PC_CONTAINER' })}
        className={`bg-white border-2 border-gray-800 rounded-md overflow-hidden shadow-md transition-all ${
          dropTarget?.type === 'PC_CONTAINER' ? 'ring-4 ring-blue-400 border-blue-600 bg-blue-50/30' : ''
        }`}
      >
        {/* PC System Header */}
        <div className="bg-slate-900 text-white flex flex-wrap items-center justify-between px-3.5 py-2.5 font-bold tracking-wide border-b-2 border-gray-900 gap-2">
          <div className="flex items-center space-x-2">
            <Laptop className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs uppercase tracking-wide">
              SISTEMA DE ALMACENAMIENTO DE POKÉMON (PC DE BILL)
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[10px]">
            <span className="bg-slate-800 text-cyan-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
              ALMACENADOS: {pcBox.length} POKÉMON
            </span>
            <span className="bg-cyan-900 text-cyan-200 px-2 py-0.5 rounded border border-cyan-700 font-bold uppercase">
              DEPS. DISPONIBLES: {BOX_CAPACITY * 10 - pcBox.length}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* PC Toolbar: Search & Box Selection */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-100 p-3 rounded-md border-2 border-gray-800">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={pcSearchQuery}
                onChange={(e) => setPcSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, especie o tipo..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 font-sans"
              />
              {pcSearchQuery && (
                <button
                  onClick={() => setPcSearchQuery('')}
                  className="absolute right-2 top-2 text-xs text-gray-500 hover:text-gray-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* PC Box Controls */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1">
                <Inbox className="w-4 h-4 text-slate-600" />
                CAJA:
              </span>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4].map((boxNum) => (
                  <button
                    key={boxNum}
                    onClick={() => setCurrentBoxNumber(boxNum)}
                    className={`px-2.5 py-1 text-xs font-black rounded border transition-all cursor-pointer ${
                      currentBoxNumber === boxNum
                        ? 'bg-cyan-600 text-white border-cyan-800 shadow'
                        : 'bg-white text-gray-700 border-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    #{boxNum}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Drag & Drop PC Notice */}
          <div className="text-[11px] bg-cyan-50 border border-cyan-400 rounded p-2 text-cyan-900 font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-cyan-600 shrink-0" />
              Arrastra cualquier Pokémon de tu equipo aquí para guardarlo, o arrastra un Pokémon almacenado a tu equipo de arriba.
            </span>
            {team.length < 6 && (
              <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] uppercase font-black shrink-0">
                ¡Tienes espacio en el equipo!
              </span>
            )}
          </div>

          {/* PC Storage Grid */}
          {filteredPCBox.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-md text-center space-y-2 bg-gray-50">
              <Inbox className="w-10 h-10 text-gray-400 mx-auto" />
              <h4 className="font-extrabold text-sm text-gray-600 uppercase">
                {pcSearchQuery ? 'No se encontraron Pokémon con esa búsqueda' : 'El PC de Almacenamiento está vacío'}
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {pcSearchQuery 
                  ? 'Intenta borrar la búsqueda para ver todos tus Pokémon guardados.' 
                  : 'Cuando obtengas más de 6 Pokémon en tus aventuras, se enviarán automáticamente a este PC sin perder tus capturas.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {filteredPCBox.map((pokemon, pcIdx) => {
                const kantoMatch = findPokemonByName(pokemon.species || pokemon.name);
                const spriteUrl = pokemon.spriteUrl || kantoMatch?.sprite;
                const level = pokemon.level || 5;

                const isDropTarget = dropTarget?.type === 'PC' && dropTarget?.index === pcIdx;
                const isBeingDragged = draggedItem?.type === 'PC' && draggedItem?.index === pcIdx;

                return (
                  <div
                    key={pokemon.id || pcIdx}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, { type: 'PC', index: pcIdx, pokemon })}
                    onDragOver={(e) => handleDragOver(e, { type: 'PC', index: pcIdx })}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, { type: 'PC', index: pcIdx })}
                    onDragEnd={handleDragEnd}
                    className={`bg-white border-2 border-gray-800 rounded p-2 flex flex-col justify-between hover:border-cyan-600 transition-all cursor-grab active:cursor-grabbing shadow-xs hover:shadow relative group select-none ${
                      isDropTarget ? 'border-cyan-500 ring-4 ring-cyan-300 bg-cyan-50 scale-105' : ''
                    } ${
                      isBeingDragged ? 'opacity-30 border-dashed border-gray-400' : ''
                    }`}
                  >
                    {/* Top Level & Type */}
                    <div className="flex items-center justify-between text-[9px] font-black">
                      <span className="text-gray-500 uppercase">#PC-{pcIdx + 1}</span>
                      <span className="text-red-600 font-bold bg-red-50 px-1 rounded border border-red-200">
                        Nvl.{level}
                      </span>
                    </div>

                    {/* Sprite & Name */}
                    <div 
                      onClick={() => setSelectedPokemon({ pokemon, isPC: true })}
                      className="my-1.5 flex flex-col items-center cursor-pointer group-hover:scale-105 transition-transform"
                    >
                      <div className="w-12 h-12 rounded bg-slate-50 border border-gray-300 flex items-center justify-center relative overflow-hidden shadow-inner">
                        {spriteUrl ? (
                          <img
                            src={spriteUrl}
                            alt={pokemon.name}
                            className="w-10 h-10 object-contain [image-rendering:pixelated]"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-[10px] font-black text-gray-700">{pokemon.name.slice(0, 3)}</span>
                        )}
                        {pokemon.isShiny && (
                          <Sparkles className="w-2.5 h-2.5 text-amber-500 absolute top-0.5 right-0.5" />
                        )}
                      </div>
                      <span className="font-extrabold text-xs text-gray-900 truncate max-w-full uppercase mt-1">
                        {pokemon.name}
                      </span>
                      <span className="text-[8px] bg-gray-100 text-gray-700 px-1 py-0.2 rounded border border-gray-300 font-bold uppercase tracking-wider">
                        {pokemon.type}
                      </span>
                    </div>

                    {/* Quick PC Actions */}
                    <div className="pt-1.5 border-t border-gray-200 space-y-1">
                      {team.length < 6 ? (
                        <button
                          onClick={() => withdrawFromPC(pokemon.id)}
                          className="w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] uppercase rounded flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                        >
                          <Upload className="w-3 h-3" />
                          SACAR AL EQUIPO
                        </button>
                      ) : (
                        <button
                          onClick={() => setSwapTargetPC(pokemon)}
                          className="w-full py-1 bg-cyan-600 hover:bg-cyan-700 text-white font-black text-[9px] uppercase rounded flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                        >
                          <ArrowLeftRight className="w-3 h-3" />
                          CAMBIAR
                        </button>
                      )}

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setSelectedPokemon({ pokemon, isPC: true })}
                          className="flex-1 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[8px] uppercase rounded border border-gray-400 text-center cursor-pointer"
                        >
                          FICHA
                        </button>
                        <button
                          onClick={() => setReleaseTargetPC(pokemon)}
                          className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded cursor-pointer"
                          title="Liberar Pokémon"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: SELECTED POKEMON DETAIL MODAL */}
      {selectedPokemon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 font-mono text-gray-800">
          <div className="bg-white border-4 border-gray-900 rounded-lg max-w-md w-full p-5 space-y-4 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-red-600 -mx-5 -mt-5 px-5 py-3 border-b-2 border-gray-900 flex items-center justify-between text-white font-bold sticky top-0 z-10">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-white" />
                <span className="text-xs uppercase">FICHA TÉCNICA DE ENTRENAMIENTO</span>
              </div>
              <button
                onClick={() => setSelectedPokemon(null)}
                className="p-1 rounded bg-red-800 hover:bg-red-900 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-md border-2 border-gray-800">
                <div className="w-20 h-20 rounded bg-white border-2 border-gray-900 flex items-center justify-center shadow relative overflow-hidden shrink-0">
                  <img
                    src={selectedPokemon.pokemon.spriteUrl || findPokemonByName(selectedPokemon.pokemon.species || selectedPokemon.pokemon.name)?.sprite}
                    alt={selectedPokemon.pokemon.name}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-red-600">
                      NVL. {selectedPokemon.pokemon.level || 5} • {selectedPokemon.pokemon.type}
                    </span>
                    {selectedPokemon.isPC ? (
                      <span className="text-[9px] bg-slate-800 text-cyan-300 font-bold px-1.5 py-0.5 rounded border border-slate-900">
                        EN PC
                      </span>
                    ) : (
                      <span className="text-[9px] bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.5 rounded border border-emerald-500">
                        EN EQUIPO
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-gray-900 truncate uppercase">{selectedPokemon.pokemon.name}</h3>
                  <p className="text-[11px] font-bold text-gray-600">Especie: {selectedPokemon.pokemon.species}</p>

                  {/* Contextual Actions inside modal */}
                  <div className="pt-1">
                    {!selectedPokemon.isPC && team[0]?.id !== selectedPokemon.pokemon.id && (
                      <button
                        onClick={() => {
                          setTeamLeader(selectedPokemon.pokemon.id);
                          setSelectedPokemon(null);
                        }}
                        className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-gray-950 font-black text-[10px] uppercase rounded border border-gray-900 flex items-center gap-1 cursor-pointer"
                      >
                        <Crown className="w-3.5 h-3.5 fill-gray-950" />
                        DESIGNAR COMO LÍDER #1
                      </button>
                    )}

                    {!selectedPokemon.isPC && team.length > 1 && (
                      <button
                        onClick={() => {
                          depositToPC(selectedPokemon.pokemon.id);
                          setSelectedPokemon(null);
                        }}
                        className="mt-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase rounded border border-gray-900 flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        DEPOSITAR EN EL PC
                      </button>
                    )}

                    {selectedPokemon.isPC && team.length < 6 && (
                      <button
                        onClick={() => {
                          withdrawFromPC(selectedPokemon.pokemon.id);
                          setSelectedPokemon(null);
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase rounded border border-gray-900 flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        SACAR AL EQUIPO ACTIVO
                      </button>
                    )}

                    {selectedPokemon.isPC && team.length >= 6 && (
                      <button
                        onClick={() => {
                          const pMon = selectedPokemon.pokemon;
                          setSelectedPokemon(null);
                          setSwapTargetPC(pMon);
                        }}
                        className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white font-black text-[10px] uppercase rounded border border-gray-900 flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                        CAMBIAR POR MIEMBRO DE EQUIPO
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Type Chart Weaknesses & Resistances Breakdown */}
              {(() => {
                const matchInfo = getWeaknessesAndResistances(selectedPokemon.pokemon.type);
                return (
                  <div className="bg-slate-50 border-2 border-gray-800 rounded-md p-3 space-y-2 text-xs font-bold">
                    <h4 className="text-xs font-black uppercase text-gray-900 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-gray-700" />
                      TABLA DE EFECTIVIDAD Y TIPOS:
                    </h4>
                    
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-start gap-1.5 bg-red-50 p-2 rounded border border-red-200">
                        <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-extrabold text-red-900 block">DEBILIDADES (Recibe daño Súper Efectivo):</span>
                          <span className="text-red-800 font-medium">
                            {matchInfo.weaknesses.join(', ') || 'Ninguna'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-1.5 bg-emerald-50 p-2 rounded border border-emerald-200">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-extrabold text-emerald-900 block">FORTALEZAS / RESISTENCIAS (Reduce daño recibido):</span>
                          <span className="text-emerald-800 font-medium">
                            {matchInfo.resistances.join(', ') || 'Ninguna'}
                          </span>
                        </div>
                      </div>

                      {matchInfo.immunities.length > 0 && (
                        <div className="flex items-start gap-1.5 bg-purple-50 p-2 rounded border border-purple-200">
                          <Zap className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-extrabold text-purple-900 block">INMUNIDADES (Sin daño):</span>
                            <span className="text-purple-800 font-medium">
                              {matchInfo.immunities.join(', ')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* EXP Detail */}
              <div className="bg-cyan-50 border-2 border-cyan-500 rounded-md p-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black text-cyan-900">
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-cyan-600 fill-cyan-400" />
                    PUNTOS DE EXPERIENCIA (EXP)
                  </span>
                  <span>{selectedPokemon.pokemon.exp || 0} / {selectedPokemon.pokemon.maxExp || calculateMaxExpForLevel(selectedPokemon.pokemon.level || 5)}</span>
                </div>
                <div className="w-full h-3 bg-cyan-200 border border-cyan-700 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.round(((selectedPokemon.pokemon.exp || 0) / (selectedPokemon.pokemon.maxExp || calculateMaxExpForLevel(selectedPokemon.pokemon.level || 5))) * 100))}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats Breakdown */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-black uppercase text-gray-700">ESTADÍSTICAS Y EVALUADOR DE POTENCIAL (IVs)</h4>
                {(() => {
                  const speciesName = selectedPokemon.pokemon.species || selectedPokemon.pokemon.name;
                  const kantoMatch = findPokemonByName(speciesName);
                  const st = selectedPokemon.pokemon.stats || calculatePokemonStats(selectedPokemon.pokemon.level || 5, selectedPokemon.pokemon.stage || 1, speciesName, selectedPokemon.pokemon.ivs);
                  const judge = getPokemonPotentialJudgement(selectedPokemon.pokemon.ivs);
                  const b = kantoMatch?.baseStats;
                  const bst = b ? b.hp + b.attack + b.defense + b.speed + b.special : null;

                  return (
                    <div className="space-y-2">
                      {/* Potential Judgement (Evaluador de Potencial) */}
                      <div className={`p-2.5 rounded-md border-2 ${judge.tierClass} text-xs space-y-1 shadow-xs`}>
                        <div className="flex items-center justify-between font-black">
                          <span className="flex items-center gap-1.5 uppercase tracking-wide">
                            <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                            {judge.overallLabel}
                          </span>
                          <span className="text-amber-500 font-extrabold text-xs bg-black/80 px-1.5 py-0.5 rounded text-white">{judge.stars}</span>
                        </div>
                        <p className="text-[11px] leading-snug font-medium border-t border-black/10 pt-1">
                          {judge.summaryText}
                        </p>
                      </div>

                      {b && (
                        <div className="flex items-center justify-between text-[10px] font-black bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-300">
                          <span>ESPECIE {speciesName.toUpperCase()} (STATS BASE OFICIALES)</span>
                          <span className="bg-slate-900 text-yellow-300 px-1.5 py-0.2 rounded font-mono">BST: {bst}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-xs font-extrabold">
                        <div className="p-2 bg-emerald-50 border border-emerald-300 rounded flex justify-between items-center text-emerald-900">
                          <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-emerald-600" /> PS:</span>
                          <div className="text-right">
                            <span className="font-mono text-sm block">{st.hp}</span>
                            {b && <span className="text-[9px] text-emerald-700 font-semibold block">Base: {b.hp}</span>}
                          </div>
                        </div>
                        <div className="p-2 bg-rose-50 border border-rose-300 rounded flex justify-between items-center text-rose-900">
                          <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-rose-600" /> Ataque:</span>
                          <div className="text-right">
                            <span className="font-mono text-sm block">{st.attack}</span>
                            {b && <span className="text-[9px] text-rose-700 font-semibold block">Base: {b.attack}</span>}
                          </div>
                        </div>
                        <div className="p-2 bg-blue-50 border border-blue-300 rounded flex justify-between items-center text-blue-900">
                          <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-blue-600" /> Defensa:</span>
                          <div className="text-right">
                            <span className="font-mono text-sm block">{st.defense}</span>
                            {b && <span className="text-[9px] text-blue-700 font-semibold block">Base: {b.defense}</span>}
                          </div>
                        </div>
                        <div className="p-2 bg-amber-50 border border-amber-300 rounded flex justify-between items-center text-amber-900">
                          <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5 text-amber-600" /> Velocidad:</span>
                          <div className="text-right">
                            <span className="font-mono text-sm block">{st.speed}</span>
                            {b && <span className="text-[9px] text-amber-700 font-semibold block">Base: {b.speed}</span>}
                          </div>
                        </div>
                        <div className="p-2 bg-purple-50 border border-purple-300 rounded flex justify-between items-center text-purple-900 col-span-2">
                          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-purple-600" /> Especial:</span>
                          <div className="text-right">
                            <span className="font-mono text-sm block">{st.special}</span>
                            {b && <span className="text-[9px] text-purple-700 font-semibold block">Base: {b.special}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Moveset */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-black uppercase text-gray-700">SET DE MOVIMIENTOS APRENDIDOS</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedPokemon.pokemon.moves || getPokemonMoves(selectedPokemon.pokemon.species || selectedPokemon.pokemon.name, selectedPokemon.pokemon.level || 5, selectedPokemon.pokemon.type)).map((move, i) => (
                    <span key={i} className="px-2.5 py-1 bg-gray-900 text-white rounded text-xs font-bold border border-gray-700">
                      ⚔️ {move}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedPokemon(null)}
              className="w-full py-2.5 bg-gray-900 text-white font-black text-xs uppercase rounded border-2 border-black hover:bg-gray-800 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]"
            >
              Cerrar Ficha
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: SWAP POKEMON MODAL (PC -> TEAM) */}
      {swapTargetPC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 font-mono text-gray-800">
          <div className="bg-white border-4 border-gray-900 rounded-lg max-w-md w-full p-5 space-y-4 shadow-2xl relative">
            <div className="bg-cyan-600 -mx-5 -mt-5 px-5 py-3 border-b-2 border-gray-900 flex items-center justify-between text-white font-bold">
              <div className="flex items-center space-x-2">
                <ArrowLeftRight className="w-5 h-5 text-white" />
                <span className="text-xs uppercase">INTERCAMBIO DE POKÉMON (PC ⇄ EQUIPO)</span>
              </div>
              <button
                onClick={() => setSwapTargetPC(null)}
                className="p-1 rounded bg-cyan-800 hover:bg-cyan-900 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-bold text-gray-700">
              Selecciona el miembro de tu equipo actual que deseas enviar al PC para incorporar a{' '}
              <strong className="text-cyan-800 uppercase">{swapTargetPC.name} (Nvl.{swapTargetPC.level})</strong>:
            </p>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {team.map((teamMon, idx) => {
                const sprite = teamMon.spriteUrl || findPokemonByName(teamMon.species || teamMon.name)?.sprite;
                return (
                  <button
                    key={teamMon.id}
                    onClick={() => {
                      swapTeamWithPC(teamMon.id, swapTargetPC.id);
                      setSwapTargetPC(null);
                    }}
                    className="w-full p-2.5 bg-gray-50 hover:bg-cyan-50 border-2 border-gray-800 hover:border-cyan-600 rounded flex items-center justify-between cursor-pointer transition-all text-left group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-10 h-10 bg-white border border-gray-400 rounded flex items-center justify-center shrink-0">
                        <img src={sprite} alt={teamMon.name} className="w-8 h-8 object-contain" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black text-gray-500">SLOT #{idx + 1}</span>
                          <span className="text-xs font-black text-gray-900 uppercase truncate">{teamMon.name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-red-600">Nvl.{teamMon.level || 5} • {teamMon.type}</span>
                      </div>
                    </div>

                    <span className="text-[10px] bg-cyan-600 text-white font-black px-2 py-1 rounded border border-cyan-800 group-hover:bg-cyan-700 shrink-0">
                      REEMPLAZAR
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setSwapTargetPC(null)}
              className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs uppercase rounded border border-gray-600 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: RELEASE POKEMON CONFIRMATION */}
      {releaseTargetPC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 font-mono text-gray-800">
          <div className="bg-white border-4 border-gray-900 rounded-lg max-w-sm w-full p-5 space-y-4 shadow-2xl relative text-center">
            <div className="w-12 h-12 bg-rose-100 border-2 border-rose-600 rounded-full flex items-center justify-center mx-auto text-rose-600">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-sm font-black text-gray-900 uppercase">
              ¿LIBERAR A {releaseTargetPC.name}?
            </h3>

            <p className="text-xs font-medium text-gray-600 leading-relaxed">
              Esta acción devolverá a <strong className="text-gray-900">{releaseTargetPC.name} (Nvl.{releaseTargetPC.level})</strong> a su hábitat natural. Esta acción no se puede deshacer.
            </p>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setReleaseTargetPC(null)}
                className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-extrabold text-xs uppercase rounded border border-gray-600 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  releasePokemonFromPC(releaseTargetPC.id);
                  setReleaseTargetPC(null);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase rounded border border-rose-900 cursor-pointer shadow-sm"
              >
                Sí, Liberar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
