import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Sparkles, Sword, Zap, Shield, Heart, Gauge, Flame, X, Info, Crown, ShieldAlert, ShieldCheck } from 'lucide-react';
import { findPokemonByName } from '../../data/kantoPokedex';
import { calculateMaxExpForLevel, calculatePokemonStats, getPokemonMoves, EVOLUTION_RULES } from '../../utils/pokemonEvolution';
import { getWeaknessesAndResistances } from '../../utils/typeChart';
import { PokemonMember } from '../../types';

export const TeamView: React.FC = () => {
  const { state, setTeamLeader } = useGame();
  const { team } = state.career;
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonMember | null>(null);

  return (
    <div className="bg-white border-2 border-gray-800 rounded-md overflow-hidden shadow-md font-mono text-gray-800">
      {/* Header Bar */}
      <div className="bg-red-600 text-white flex items-center justify-between px-3 py-2 font-bold tracking-wide border-b-2 border-gray-900">
        <div className="flex items-center space-x-2">
          <Sword className="w-4 h-4 text-white" />
          <span className="text-xs uppercase">EQUIPO POKÉMON Y NIVEL DE EXPERIENCIA ({team.length}/6)</span>
        </div>
        <span className="text-[11px] font-bold bg-red-800 px-2 py-0.5 rounded border border-gray-900">
          PROMEDIO: NVL. {team.length > 0 ? Math.round(team.reduce((acc, m) => acc + (m.level || 5), 0) / team.length) : 5}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Info Banner about Team Leader & Type Advantage */}
        <div className="bg-amber-50 border-2 border-amber-600 rounded-md p-2.5 flex items-start space-x-2.5 text-xs text-amber-900 font-bold">
          <Crown className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="uppercase text-amber-950 font-black">LÍDER DE EQUIPO Y TABLA DE TIPOS:</span>
            <p className="text-[11px] leading-relaxed text-amber-900 font-medium">
              El Pokémon en la **Posición #1 (Líder)** encabeza los combates e influye directamente en las opciones de eventos, tiradas de habilidad y bonos de EXP por efectividad de tipo. Puedes designar a cualquier integrante como Líder.
            </p>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {team.map((pokemon, idx) => {
            const kantoMatch = findPokemonByName(pokemon.species || pokemon.name);
            const spriteUrl = pokemon.spriteUrl || kantoMatch?.sprite;
            const level = pokemon.level || 5;
            const maxExp = pokemon.maxExp || calculateMaxExpForLevel(level);
            const currentExp = pokemon.exp || 0;
            const expPercent = Math.min(100, Math.max(0, Math.round((currentExp / maxExp) * 100)));
            const stats = pokemon.stats || calculatePokemonStats(level, pokemon.stage || 1);
            const moves = pokemon.moves || getPokemonMoves(pokemon.species || pokemon.name, level, pokemon.type);
            const isLeader = idx === 0;

            // Type Chart
            const typeMatchupInfo = getWeaknessesAndResistances(pokemon.type);

            // Evolution preview
            const evoRule = EVOLUTION_RULES.find(r => r.fromSpecies.toLowerCase() === (pokemon.species || pokemon.name).toLowerCase());

            return (
              <div
                key={pokemon.id || idx}
                onClick={() => setSelectedPokemon(pokemon)}
                className={`p-3 bg-white border-2 rounded-md relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all cursor-pointer group ${
                  isLeader
                    ? 'border-amber-500 ring-2 ring-amber-400 bg-amber-50/20'
                    : 'border-gray-800 hover:border-red-600'
                }`}
              >
                {/* Pokédex Top Stripe */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${isLeader ? 'bg-amber-500' : pokemon.isStarter ? 'bg-orange-500' : pokemon.isLegendary ? 'bg-purple-600' : 'bg-red-600'}`}></div>

                {/* Slot Header */}
                <div className="w-full flex items-center justify-between text-[10px] text-gray-600 font-bold mb-1.5 pt-1">
                  <div className="flex items-center space-x-1">
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
                  <div className="w-full h-2.5 bg-gray-200 border border-gray-800 rounded-full overflow-hidden relative shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 transition-all duration-500"
                      style={{ width: `${expPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Quick Leader Button or Active Crown */}
                {!isLeader && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTeamLeader(pokemon.id);
                    }}
                    className="mt-2.5 w-full py-1 px-2 bg-amber-100 hover:bg-amber-200 border border-amber-600 text-amber-950 font-black text-[10px] uppercase rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Crown className="w-3 h-3 text-amber-700 fill-amber-400" />
                    DESIGNAR COMO LÍDER #1
                  </button>
                )}
              </div>
            );
          })}

          {/* Empty slots */}
          {Array.from({ length: Math.max(0, 6 - team.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="p-3 bg-gray-50 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center min-h-[160px] text-gray-400 font-bold"
            >
              <div className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center text-sm mb-1.5 bg-white">
                +
              </div>
              <span className="text-[10px] uppercase font-extrabold text-gray-500">SLOT DE EQUIPO VACÍO</span>
              <span className="text-[9px] font-medium text-gray-400 mt-1 text-center">Atrapa nuevos Pokémon en eventos</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Pokemon Detail Modal */}
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
                    src={selectedPokemon.spriteUrl || findPokemonByName(selectedPokemon.species || selectedPokemon.name)?.sprite}
                    alt={selectedPokemon.name}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-[10px] font-black uppercase text-red-600">
                    NVL. {selectedPokemon.level || 5} • {selectedPokemon.type}
                  </span>
                  <h3 className="text-lg font-black text-gray-900 truncate uppercase">{selectedPokemon.name}</h3>
                  <p className="text-[11px] font-bold text-gray-600">Especie: {selectedPokemon.species}</p>

                  {/* Leader action in modal */}
                  {team[0]?.id !== selectedPokemon.id ? (
                    <button
                      onClick={() => {
                        setTeamLeader(selectedPokemon.id);
                        setSelectedPokemon(null);
                      }}
                      className="mt-1 px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-gray-950 font-black text-[10px] uppercase rounded border border-gray-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Crown className="w-3.5 h-3.5 fill-gray-950" />
                      DESIGNAR COMO LÍDER #1
                    </button>
                  ) : (
                    <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-amber-200 border border-amber-600 text-amber-950 text-[10px] font-black rounded">
                      <Crown className="w-3 h-3 fill-amber-600" />
                      LÍDER ACTUAL DEL EQUIPO
                    </span>
                  )}
                </div>
              </div>

              {/* Type Chart Weaknesses & Resistances Breakdown */}
              {(() => {
                const matchInfo = getWeaknessesAndResistances(selectedPokemon.type);
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
                  <span>{selectedPokemon.exp || 0} / {selectedPokemon.maxExp || calculateMaxExpForLevel(selectedPokemon.level || 5)}</span>
                </div>
                <div className="w-full h-3 bg-cyan-200 border border-cyan-700 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.round(((selectedPokemon.exp || 0) / (selectedPokemon.maxExp || calculateMaxExpForLevel(selectedPokemon.level || 5))) * 100))}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats Breakdown */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-black uppercase text-gray-700">ESTADÍSTICAS BÁSICAS</h4>
                {(() => {
                  const st = selectedPokemon.stats || calculatePokemonStats(selectedPokemon.level || 5, selectedPokemon.stage || 1);
                  return (
                    <div className="grid grid-cols-2 gap-2 text-xs font-extrabold">
                      <div className="p-2 bg-emerald-50 border border-emerald-300 rounded flex justify-between items-center text-emerald-900">
                        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-emerald-600" /> Puntos Salud (PS):</span>
                        <span className="font-mono text-sm">{st.hp}</span>
                      </div>
                      <div className="p-2 bg-rose-50 border border-rose-300 rounded flex justify-between items-center text-rose-900">
                        <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-rose-600" /> Ataque:</span>
                        <span className="font-mono text-sm">{st.attack}</span>
                      </div>
                      <div className="p-2 bg-blue-50 border border-blue-300 rounded flex justify-between items-center text-blue-900">
                        <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-blue-600" /> Defensa:</span>
                        <span className="font-mono text-sm">{st.defense}</span>
                      </div>
                      <div className="p-2 bg-amber-50 border border-amber-300 rounded flex justify-between items-center text-amber-900">
                        <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5 text-amber-600" /> Velocidad:</span>
                        <span className="font-mono text-sm">{st.speed}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Moveset */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-black uppercase text-gray-700">SET DE MOVIMIENTOS APRENDIDOS</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedPokemon.moves || getPokemonMoves(selectedPokemon.species || selectedPokemon.name, selectedPokemon.level || 5, selectedPokemon.type)).map((move, i) => (
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
    </div>
  );
};
