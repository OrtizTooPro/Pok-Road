import React from 'react';
import { useGame } from '../../context/GameContext';
import { REGIONAL_BADGES } from '../../data/badges';
import { X, Award, Calendar, Info, Shield, FileText } from 'lucide-react';

export const InfoModals: React.FC = () => {
  const { state, closeModal } = useGame();

  if (state.activeModal === 'none') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in font-mono">
      <div className="bg-white border-4 border-gray-900 rounded-md max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl text-gray-800 relative">
        {/* Pokédex Header Bar */}
        <div className="bg-red-600 text-white font-bold flex items-center justify-between px-4 py-2 border-b-2 border-gray-900 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-300 border border-gray-900"></div>
            <span className="text-xs uppercase">GUÍA POKÉDEX • INFORMACIÓN</span>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded bg-red-800 text-white hover:bg-red-900 border border-gray-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto touch-scroll flex-1">
          {/* Modal Content Switch */}
          {state.activeModal === 'league' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 border-b-2 border-dotted border-gray-400 pb-3">
                <Award className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="text-base font-black text-gray-900 uppercase">LIGA REGIONAL Y CUADRO DE GIMNASIOS</h3>
                  <p className="text-xs text-gray-600 font-bold">Las 8 Medallas necesarias para clasificar al Salón de la Fama</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {REGIONAL_BADGES.map((badge, idx) => {
                  const isEarned = state.career.badgesWon.includes(badge.id);
                  return (
                    <div 
                      key={badge.id}
                      className={`p-3 rounded-md border-2 flex items-center space-x-3 transition-all ${
                        isEarned 
                          ? 'bg-amber-50 border-amber-600 shadow-sm' 
                          : 'bg-gray-50 border-gray-300 opacity-70'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded border-2 border-gray-900 flex items-center justify-center text-sm font-black ${
                        isEarned ? 'bg-amber-400 text-gray-900' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-xs text-gray-900 truncate uppercase">{badge.name}</h4>
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-gray-200 text-gray-800 border border-gray-600">
                            {badge.type}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-gray-600 truncate">{badge.gymLeader} • {badge.city}</p>
                        <p className="text-[10px] text-gray-500 italic truncate mt-0.5">{badge.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {state.activeModal === 'tournaments' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 border-b-2 border-dotted border-gray-400 pb-3">
                <Calendar className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="text-base font-black text-gray-900 uppercase">CALENDARIO DE TORNEOS REGIONALES</h3>
                  <p className="text-xs text-gray-600 font-bold">Eventos oficiales de la temporada de Entrenadores</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-md bg-white border-2 border-gray-800 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-red-600 uppercase">Torneo de Primavera de Exhibición</span>
                    <span className="text-gray-500 font-bold">EDAD: 17 AÑOS</span>
                  </div>
                  <p className="text-gray-700 font-medium">Competencia de patrocinio en Ciudad Azafrán patrocinada por Silph Co.</p>
                </div>

                <div className="p-3 rounded-md bg-white border-2 border-gray-800 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-purple-700 uppercase">Desafío Internacional Frente de Batalla</span>
                    <span className="text-gray-500 font-bold">EDAD: 23 AÑOS</span>
                  </div>
                  <p className="text-gray-700 font-medium">Torneo de alta estrategia táctica contra los 7 Ases del Frente.</p>
                </div>

                <div className="p-3 rounded-md bg-amber-50 border-2 border-amber-600 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-amber-900 uppercase">Gran Torneo de la Liga Pokémon (Meseta Añil)</span>
                    <span className="text-amber-800 font-bold">EDAD: 26 - 28 AÑOS</span>
                  </div>
                  <p className="text-amber-900 font-medium">Rondas eliminatorias directas, guantelete del Alto Mando y combate de título contra el Campeón.</p>
                </div>
              </div>
            </div>
          )}

          {state.activeModal === 'about' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 border-b-2 border-dotted border-gray-400 pb-3">
                <Info className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="text-base font-black text-gray-900 uppercase">ACERCA DE POKÉROAD</h3>
                  <p className="text-xs text-gray-600 font-bold">Camino a la Leyenda — Modo Carrera en 5 Minutos</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-gray-800 leading-relaxed font-medium">
                <p>
                  <strong>PokéRoad</strong> es una simulación de carrera interactiva inspirada en la mística de los juegos de rol clásicos de Pokémon.
                </p>
                <p>
                  A lo largo de 20 eventos clave entre los 10 y los 30 años, deberás equilibrar tu <strong>Habilidad de combate</strong>, tu <strong>Popularidad</strong> con los fans, el <strong>Vínculo</strong> emocional con tu equipo, tu <strong>Resistencia</strong> física y tu capital en <strong>Pokécupones ($)</strong>.
                </p>
                <p>
                  Alcanzar el 100% en el <em>Medidor de Leyenda</em> desbloquea la deseada <strong>Estatua de Oro en el Salón de la Fama</strong>.
                </p>
              </div>
            </div>
          )}

          {state.activeModal === 'privacy' && (
            <div className="space-y-3 text-xs text-gray-800">
              <div className="flex items-center space-x-3 border-b-2 border-dotted border-gray-400 pb-3">
                <Shield className="w-6 h-6 text-red-600" />
                <h3 className="text-base font-black text-gray-900 uppercase">POLÍTICA DE PRIVACIDAD</h3>
              </div>
              <p className="font-medium">
                En PokéRoad valoramos tu privacidad. Esta aplicación funciona completamente de forma local en tu navegador web. No recopilamos, almacenamos ni vendemos datos personales.
              </p>
              <p className="font-medium">
                Tus avances de juego, nombre de entrenador e historial de carrera permanecen exclusivamente en el estado temporal de tu sesión de navegación.
              </p>
            </div>
          )}

          {state.activeModal === 'terms' && (
            <div className="space-y-3 text-xs text-gray-800">
              <div className="flex items-center space-x-3 border-b-2 border-dotted border-gray-400 pb-3">
                <FileText className="w-6 h-6 text-red-600" />
                <h3 className="text-base font-black text-gray-900 uppercase">TÉRMINOS DE SERVICIO</h3>
              </div>
              <p className="font-medium">
                Al utilizar PokéRoad, aceptas jugar de manera justa y respetar las pautas de contenido. PokéRoad es un proyecto no comercial para la comunidad de entusiastas de Pokémon.
              </p>
              <p className="font-medium">
                Todas las marcas, criaturas y nombres pertenecen a sus respectivos dueños de derechos de autor.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
