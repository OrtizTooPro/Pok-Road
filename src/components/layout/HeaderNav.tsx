import React from 'react';
import { useGame } from '../../context/GameContext';
import { Volume2, VolumeX, Award, Sword, BookOpen, UserCheck, Home, ShoppingCart } from 'lucide-react';
import { NavigationTab } from '../../types';
import { checkShopAvailability } from '../../data/kantoItems';

export const HeaderNav: React.FC = () => {
  const { state, returnToMenu, setActiveTab, toggleSound, openModal, currentEvent } = useGame();

  const shopInfo = checkShopAvailability(
    currentEvent?.location,
    currentEvent?.title,
    currentEvent?.description
  );

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'summary_badges', label: 'Resumen y Medallas', icon: <UserCheck className="w-3.5 h-3.5" /> },
    { id: 'challenge_timeline', label: 'Desafío y Decisión', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'team', label: 'Equipo Pokémon', icon: <Sword className="w-3.5 h-3.5" /> },
    { id: 'pokedex', label: 'Pokédex Kanto (151)', icon: <BookOpen className="w-3.5 h-3.5" /> }
  ];

  return (
    <header className="bg-red-600 border-b-4 border-gray-900 sticky top-0 z-40 text-white font-mono shadow-lg">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between relative gap-2">
        {/* Left: Original Pokédex Glass Lens Detail */}
        <div 
          className="flex items-center space-x-2 shrink-0 cursor-pointer group z-10"
          onClick={() => setActiveTab('summary_badges')}
          title="PokéRoad - Inicio"
        >
          {/* Main Pokédex Blue Glass Lens */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_10px_rgba(34,211,238,0.9)] flex items-center justify-center relative overflow-hidden ring-2 ring-gray-900 group-hover:scale-105 transition-transform">
            <div className="w-2.5 h-2.5 rounded-full bg-white absolute top-0.5 left-0.5 opacity-90 blur-[0.2px]"></div>
            <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-300 via-blue-500 to-indigo-800 opacity-90"></div>
          </div>
          {/* 3 Indicator LEDs */}
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 border border-gray-900 shadow-[0_0_4px_rgba(239,68,68,0.8)]"></div>
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-400 border border-gray-900 shadow-[0_0_4px_rgba(250,204,21,0.8)]"></div>
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500 border border-gray-900 shadow-[0_0_4px_rgba(34,197,94,0.8)]"></div>
          </div>
        </div>

        {/* Center: App Title "PokéRoad" */}
        <div 
          className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 flex items-center space-x-1.5 sm:space-x-2 cursor-pointer group z-10 px-1"
          onClick={() => setActiveTab('summary_badges')}
        >
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white border-2 border-gray-900 flex items-center justify-center p-0.5 shadow group-hover:rotate-12 transition-transform shrink-0">
            <div className="w-full h-full bg-red-600 rounded-full flex flex-col justify-between overflow-hidden border border-gray-900">
              <div className="h-1/2 bg-red-600 w-full flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-white border border-gray-900"></div>
              </div>
              <div className="h-0.5 bg-gray-900 w-full"></div>
              <div className="h-1/2 bg-white w-full"></div>
            </div>
          </div>
          <h1 className="text-base sm:text-2xl font-black tracking-wider sm:tracking-widest text-yellow-300 uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] whitespace-nowrap">
            PokéRoad
          </h1>
        </div>

        {/* Right: Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 z-10">
          {state.isGameStarted && (
            <button
              onClick={() => openModal('shop')}
              title={shopInfo.isAvailable ? `Tienda abierta: ${shopInfo.shopName}` : 'Mochila y Pokétienda'}
              className={`px-2 sm:px-2.5 py-1 text-xs font-bold rounded-md border-2 border-gray-900 transition-all flex items-center space-x-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer shrink-0 relative ${
                shopInfo.isAvailable
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-gray-950 font-black animate-pulse'
                  : 'bg-white hover:bg-yellow-300 text-gray-900'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="uppercase text-[10px] sm:text-[11px] font-black hidden xs:inline">
                {shopInfo.isAvailable ? 'Tienda' : 'Mochila'}
              </span>
              {shopInfo.isAvailable && (
                <span className="w-2 h-2 rounded-full bg-emerald-900 absolute -top-1 -right-1 border border-white animate-ping"></span>
              )}
            </button>
          )}

          <button
            onClick={toggleSound}
            title={state.soundEnabled ? 'Silenciar audio' : 'Activar audio'}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-md bg-white text-gray-900 border-2 border-gray-900 hover:bg-yellow-300 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center space-x-1"
          >
            {state.soundEnabled ? <Volume2 className="w-4 h-4 text-gray-900 shrink-0" /> : <VolumeX className="w-4 h-4 text-gray-500 shrink-0" />}
            <span className="hidden lg:inline text-[10px] font-black uppercase">
              {state.soundEnabled ? 'Sonido ON' : 'Sonido OFF'}
            </span>
          </button>

          {state.isGameStarted && (
            <button
              onClick={() => returnToMenu()}
              title="Volver al menú inicial"
              className="px-2 sm:px-2.5 py-1 text-xs font-bold rounded-md bg-yellow-400 text-gray-900 border-2 border-gray-900 hover:bg-yellow-300 transition-all flex items-center space-x-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer shrink-0"
            >
              <Home className="w-3.5 h-3.5 text-gray-900" />
              <span className="uppercase text-[10px] sm:text-[11px] font-black">Menú</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-red-700 border-t-2 border-gray-900 py-1 px-2">
        <div className="max-w-7xl mx-auto flex items-center justify-start md:justify-center space-x-1.5 sm:space-x-2 overflow-x-auto touch-scroll no-scrollbar py-0.5">
          {navItems.map((item) => {
            const isActive = state.activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1 rounded-md border-2 border-gray-900 transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                  isActive 
                    ? 'bg-yellow-400 text-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-105' 
                    : 'bg-red-800 hover:bg-red-900 text-white'
                }`}
              >
                {item.icon}
                <span className="uppercase text-[10px] sm:text-[11px] font-black tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

