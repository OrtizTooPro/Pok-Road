/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { HeaderNav } from './components/layout/HeaderNav';
import { Footer } from './components/layout/Footer';
import { InfoModals } from './components/layout/InfoModals';
import { CharacterSetup } from './components/game/CharacterSetup';
import { StatHeader } from './components/game/StatHeader';
import { EventCard } from './components/game/EventCard';
import { OutcomeModal } from './components/game/OutcomeModal';
import { BadgeCase } from './components/game/BadgeCase';
import { SummaryDashboard } from './components/game/SummaryDashboard';
import { TeamView } from './components/game/TeamView';
import { CareerTimeline } from './components/game/CareerTimeline';
import { FinalTrainerCard } from './components/game/FinalTrainerCard';
import { KantoPokedexView } from './components/game/KantoPokedexView';

const GameMainContent: React.FC = () => {
  const { state } = useGame();

  if (!state.isGameStarted) {
    return <CharacterSetup />;
  }

  if (state.isGameOver) {
    return <FinalTrainerCard />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in font-mono">
      {/* Resumen & Medallas View */}
      {state.activeTab === 'summary_badges' && (
        <div className="space-y-6 animate-fade-in">
          <StatHeader />
          <SummaryDashboard />
          <BadgeCase />
        </div>
      )}

      {/* Desafío en ruta & Línea temporal View */}
      {state.activeTab === 'challenge_timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          <div className="lg:col-span-7 space-y-6">
            <EventCard />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <CareerTimeline />
          </div>
        </div>
      )}

      {/* Equipo Pokémon View */}
      {state.activeTab === 'team' && (
        <div className="animate-fade-in">
          <TeamView />
        </div>
      )}

      {/* Pokédex Regional Kanto (151 Pokémons & Sprites 2D) */}
      {state.activeTab === 'pokedex' && (
        <div className="animate-fade-in">
          <KantoPokedexView />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <div className="min-h-screen flex flex-col justify-between bg-slate-200 text-gray-900 font-mono">
        <HeaderNav />
        <main className="flex-grow">
          <GameMainContent />
        </main>
        <OutcomeModal />
        <InfoModals />
        <Footer />
      </div>
    </GameProvider>
  );
}
