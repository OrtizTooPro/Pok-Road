import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  GameState, 
  TrainerSpecialization, 
  GameEvent, 
  OptionChoice, 
  CareerLegacyTier,
  Badge,
  PokemonMember,
  PokemonIVs,
  TrainerStats,
  NavigationTab
} from '../types';
import { GAME_EVENTS, ALL_EVENTS } from '../data/eventsData';
import { generateRandomAdventure } from '../utils/adventureGenerator';
import { STARTER_OPTIONS } from '../data/starters';
import { REGIONAL_BADGES } from '../data/badges';
import { findPokemonByName } from '../data/kantoPokedex';
import { soundFx } from '../utils/soundEffects';
import { checkNewAchievements } from '../data/achievements';
import { 
  processTeamLevelingAndEvolution, 
  calculateMaxExpForLevel, 
  calculatePokemonStats, 
  getPokemonMoves,
  normalizePokemonReward,
  evolvePokemonWithStone,
  generateRandomIVs
} from '../utils/pokemonEvolution';
import { KANTO_ITEMS } from '../data/kantoItems';
import { evaluateLeaderMatchup } from '../utils/typeChart';
import { getItemById } from '../data/kantoItems';
import { attemptPokemonCapture } from '../utils/captureEngine';

const SAVE_KEY = 'POKEROAD_SAVEGAME_V1';

export function getSavedGameFromStorage(): GameState | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.trainerName) {
        if (!parsed.career) {
          parsed.career = {
            age: 10,
            victories: 0,
            defeats: 0,
            badgesWon: [],
            pokemonCaught: 1,
            daysSpent: 1,
            titlesWon: [],
            team: [],
            legendaryScore: 0,
            unlockedAchievements: []
          };
        }
        if (parsed.career.daysSpent === undefined) {
          parsed.career.daysSpent = Math.max(1, (parsed.historyLog?.length || 0) * 25);
        }
        if (!parsed.career.unlockedAchievements) {
          parsed.career.unlockedAchievements = [];
        }
        if (!parsed.activeEvents || parsed.activeEvents.length === 0) {
          parsed.activeEvents = GAME_EVENTS.filter(e => !e.isChainedOnly);
        }
        if (!parsed.unlockedChainedEventIds) {
          parsed.unlockedChainedEventIds = [];
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not parse save game:', e);
  }
  return null;
}

interface GameContextType {
  state: GameState;
  startGame: (name: string, spec: TrainerSpecialization, starterId: string, avatarId: string) => void;
  continueSavedGame: () => void;
  returnToMenu: () => void;
  deleteSavedGame: () => void;
  selectOption: (option: OptionChoice) => void;
  setTeamLeader: (memberId: string) => void;
  reorderTeam: (newTeam: PokemonMember[]) => void;
  depositToPC: (memberId: string) => void;
  withdrawFromPC: (pcMemberId: string) => void;
  swapTeamWithPC: (teamMemberId: string, pcMemberId: string) => void;
  reorderPCBox: (newPCBox: PokemonMember[]) => void;
  releasePokemonFromPC: (pcMemberId: string) => void;
  closeOutcomeModal: () => void;
  resetGame: () => void;
  openModal: (modal: GameState['activeModal']) => void;
  closeModal: () => void;
  setActiveTab: (tab: NavigationTab) => void;
  toggleSound: () => void;
  buyItem: (itemId: string, quantity: number) => void;
  useItem: (itemId: string, pokemonId?: string) => boolean;
  healTeamAtCenter: () => void;
  currentEvent: GameEvent | null;
  calculateLegacyTier: (score: number) => CareerLegacyTier;
  getEarnedBadges: () => Badge[];
  hasSavedGame: boolean;
  savedGameData: GameState | null;
}

const initialStats: TrainerStats = {
  skill: 25,
  reputation: 10,
  bond: 35,
  stamina: 75,
  money: 1000
};

const initialState: GameState = {
  trainerName: 'Red',
  avatarId: 'avatar-red',
  specialization: 'Combate',
  stats: { ...initialStats },
  teamFatigue: 0,
  career: {
    age: 10,
    victories: 0,
    defeats: 0,
    badgesWon: [],
    pokemonCaught: 1,
    daysSpent: 1,
    titlesWon: [],
    team: [],
    pcBox: [],
    legendaryScore: 0,
    unlockedAchievements: []
  },
  historyLog: [],
  activeEvents: GAME_EVENTS.filter(e => !e.isChainedOnly),
  unlockedChainedEventIds: [],
  currentEventIndex: 0,
  isGameStarted: false,
  isGameOver: false,
  lastOutcome: null,
  activeModal: 'none',
  activeTab: 'summary_badges',
  inventory: { 'potion': 2, 'poke-ball': 3 },
  soundEnabled: true
};

function loadSavedGame(): GameState {
  const saved = getSavedGameFromStorage();
  if (saved) {
    if (!saved.inventory) saved.inventory = { 'potion': 2, 'poke-ball': 3 };
    if (!saved.career.pcBox) saved.career.pcBox = [];
    if (saved.teamFatigue === undefined) saved.teamFatigue = 0;
    // Keep saved progress, but start on menu so player can choose to continue or start a new adventure
    return {
      ...saved,
      isGameStarted: false
    };
  }
  return initialState;
}

type GameAction =
  | { type: 'START_GAME'; payload: { name: string; spec: TrainerSpecialization; starterId: string; avatarId: string } }
  | { type: 'CONTINUE_SAVED_GAME' }
  | { type: 'RETURN_TO_MENU' }
  | { type: 'DELETE_SAVED_GAME' }
  | { type: 'SELECT_OPTION'; payload: { option: OptionChoice } }
  | { type: 'SET_TEAM_LEADER'; payload: { memberId: string } }
  | { type: 'REORDER_TEAM'; payload: { newTeam: PokemonMember[] } }
  | { type: 'DEPOSIT_TO_PC'; payload: { memberId: string } }
  | { type: 'WITHDRAW_FROM_PC'; payload: { pcMemberId: string } }
  | { type: 'SWAP_TEAM_WITH_PC'; payload: { teamMemberId: string; pcMemberId: string } }
  | { type: 'REORDER_PC_BOX'; payload: { newPCBox: PokemonMember[] } }
  | { type: 'RELEASE_PC_POKEMON'; payload: { pcMemberId: string } }
  | { type: 'CLOSE_OUTCOME_MODAL' }
  | { type: 'RESET_GAME' }
  | { type: 'OPEN_MODAL'; payload: GameState['activeModal'] }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_ACTIVE_TAB'; payload: NavigationTab }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'BUY_ITEM'; payload: { itemId: string; quantity: number } }
  | { type: 'USE_ITEM'; payload: { itemId: string; pokemonId?: string } }
  | { type: 'HEAL_POKEMON_CENTER' };

function calculateLegacyTier(score: number): CareerLegacyTier {
  if (score >= 90) return '¡LEYENDA DEL SALÓN DE LA FAMA!';
  if (score >= 71) return 'Campeón Regional';
  if (score >= 46) return 'Miembro del Alto Mando';
  if (score >= 21) return 'Líder de Gimnasio Local';
  return 'Entrenador Novato';
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      try {
        localStorage.removeItem(SAVE_KEY);
      } catch (e) {
        console.warn('Could not remove saved game on START_GAME:', e);
      }
      const { name, spec, starterId, avatarId } = action.payload;
      const starterChoice = STARTER_OPTIONS.find(s => s.id === starterId) || STARTER_OPTIONS[0];

      // Base stats
      let newStats: TrainerStats = { ...initialStats };
      let initialVictories = 0;

      // Specialization adjustments
      if (spec === 'Combate') {
        newStats.skill += 10;
      } else if (spec === 'Captura') {
        newStats.stamina += 10;
        newStats.bond += 5;
      } else if (spec === 'Crianza') {
        newStats.bond += 15;
        newStats.stamina += 5;
      } else if (spec === 'Estrategia') {
        newStats.money += 1000;
        newStats.reputation += 10;
      }

      // Starter specific adjustments
      if (starterChoice.category === 'Fuego') newStats.skill += 5;
      if (starterChoice.category === 'Agua') newStats.stamina += 5;
      if (starterChoice.category === 'Planta') newStats.bond += 5;

      const initialLvl = starterChoice.initialPokemon.level || 5;
      const initialStg = starterChoice.initialPokemon.stage || 1;
      const starterIVs: PokemonIVs = starterChoice.initialPokemon.ivs || { hp: 15, attack: 15, defense: 15, speed: 15, special: 15 };
      const initialMon: PokemonMember = {
        ...starterChoice.initialPokemon,
        ivs: starterIVs,
        isStarter: true,
        exp: 0,
        maxExp: calculateMaxExpForLevel(initialLvl),
        stats: calculatePokemonStats(initialLvl, initialStg, starterChoice.initialPokemon.species, starterIVs),
        moves: getPokemonMoves(starterChoice.initialPokemon.species, initialLvl, starterChoice.initialPokemon.type)
      };
      const initialTeam: PokemonMember[] = [initialMon];

      return {
        ...initialState,
        soundEnabled: state.soundEnabled,
        trainerName: name.trim() || 'Red',
        avatarId,
        specialization: spec,
        stats: newStats,
        career: {
          age: 10,
          victories: initialVictories,
          defeats: 0,
          badgesWon: [],
          pokemonCaught: 1,
          daysSpent: 1,
          titlesWon: [`Iniciando camino como Entrenador en ${starterChoice.category}`],
          team: initialTeam,
          legendaryScore: 0,
          unlockedAchievements: []
        },
        historyLog: [{
          age: 10,
          eventTitle: 'Inicio del Viaje',
          chosenOption: `Elegir a ${starterChoice.name} como compañero inicial.`,
          summary: `Comienzas tu aventura a los 10 años en el Pueblo Natal especializándote en ${spec}.`,
          statChanges: [`+${starterChoice.name} añadido al equipo`]
        }],
        activeEvents: generateRandomAdventure(spec, starterChoice.id),
        unlockedChainedEventIds: [],
        inventory: { 'poke-ball': 5, 'potion': 2 },
        currentEventIndex: 0,
        isGameStarted: true,
        isGameOver: false,
        lastOutcome: null,
        activeModal: 'none',
        activeTab: 'summary_badges'
      };
    }

    case 'SELECT_OPTION': {
      const { option } = action.payload;
      const activeEventsList = state.activeEvents && state.activeEvents.length > 0
        ? state.activeEvents
        : GAME_EVENTS.filter(e => !e.isChainedOnly);
      const currentEvent = activeEventsList[state.currentEventIndex];
      if (!currentEvent) return state;

      const effects = option.statEffects;
      const newStats: TrainerStats = {
        skill: Math.min(100, Math.max(0, state.stats.skill + (effects.skill || 0))),
        reputation: Math.min(100, Math.max(0, state.stats.reputation + (effects.reputation || 0))),
        bond: Math.min(100, Math.max(0, state.stats.bond + (effects.bond || 0))),
        stamina: Math.min(100, Math.max(0, state.stats.stamina + (effects.stamina || 0))),
        money: Math.max(0, state.stats.money + (effects.money || 0))
      };

      const deltaLegendary = effects.legendaryScoreDelta || 0;
      const newLegendaryScore = Math.min(100, Math.max(0, state.career.legendaryScore + deltaLegendary));

      let newBadges = [...state.career.badgesWon];
      let awardedBadge: Badge | undefined = undefined;
      if (option.awardBadgeId && !newBadges.includes(option.awardBadgeId)) {
        newBadges.push(option.awardBadgeId);
        awardedBadge = REGIONAL_BADGES.find(b => b.id === option.awardBadgeId);
      }

      let newTeam = [...state.career.team];
      let newPCBox = [...(state.career.pcBox || [])];
      let newInventory = { ...(state.inventory || {}) };
      let pokemonAwarded: PokemonMember | undefined = undefined;
      let wasSentToPC = false;
      let evolvedName: string | undefined = undefined;
      let catchNoticeObj: any = undefined;
      let actualOutcomeText = option.outcomeText;

      // Type matchup evaluation based on Team Leader (Slot #1)
      const leaderMon = newTeam[0];
      const typeMatchup = evaluateLeaderMatchup(leaderMon, currentEvent);

      // Add new Pokemon if provided - requires Poké Ball in inventory & uses capture engine
      if (option.addPokemon) {
        const captureResult = attemptPokemonCapture(
          option.addPokemon,
          newInventory,
          state.specialization,
          newStats.skill,
          currentEvent.location
        );

        catchNoticeObj = captureResult.catchNotice;

        if (captureResult.consumedBallId) {
          const ballQty = newInventory[captureResult.consumedBallId] || 0;
          newInventory[captureResult.consumedBallId] = Math.max(0, ballQty - 1);
        }

        // Determine capture success:
        let captured = false;
        if (option.forceDefeat) {
          // Failed capture minigame -> Pokemon escapes!
          captured = false;
          catchNoticeObj = {
            hasBall: true,
            captured: false,
            usedBallName: captureResult.chosenBall?.name,
            usedBallIcon: captureResult.chosenBall?.iconEmoji || '🔴',
            message: `💨 ¡El ${option.addPokemon.species || option.addPokemon.name} rompió la Poké Ball y huyó hacia la maleza! No pudiste capturarlo.`
          };
          actualOutcomeText = `💨 ¡CAPTURA FALLIDA! El ${option.addPokemon.species || option.addPokemon.name} rompió la Poké Ball y huyó rápidamente hacia la maleza.`;
        } else if (option.forceVictory) {
          // Won capture minigame -> Captured!
          captured = true;
          if (catchNoticeObj) {
            catchNoticeObj.captured = true;
          }
        } else {
          // Standard capture attempt based on Pokeball formula
          captured = captureResult.captured;
          if (!captured) {
            actualOutcomeText = `💨 ¡CAPTURA FALLIDA! El ${option.addPokemon.species || option.addPokemon.name} rompió la Poké Ball y huyó hacia la maleza.`;
          }
        }

        if (captured) {
          const teamAvgLvl = newTeam.length > 0
            ? Math.round(newTeam.reduce((acc, m) => acc + (m.level || 5), 0) / newTeam.length)
            : 8;

          const normalizedReward = normalizePokemonReward(option.addPokemon, teamAvgLvl);
          const kantoMatch = findPokemonByName(normalizedReward.species || normalizedReward.name);
          const monIVs = normalizedReward.ivs || generateRandomIVs();

          const newMon: PokemonMember = {
            ...normalizedReward,
            id: `mon-${Date.now()}-${Math.random()}`,
            ivs: monIVs,
            exp: normalizedReward.exp || 0,
            maxExp: calculateMaxExpForLevel(normalizedReward.level),
            stats: calculatePokemonStats(normalizedReward.level, normalizedReward.stage || 1, normalizedReward.species, monIVs),
            moves: getPokemonMoves(normalizedReward.species, normalizedReward.level, normalizedReward.type),
            spriteUrl: normalizedReward.spriteUrl || (kantoMatch ? kantoMatch.sprite : undefined)
          };
          if (newTeam.length < 6) {
            newTeam.push(newMon);
          } else {
            // Team is full (6) -> Send directly to PC Box!
            newPCBox.push(newMon);
            wasSentToPC = true;
          }
          pokemonAwarded = newMon;
        }
      }

      // Handle starter evolution if triggered
      if (option.evolveStarter && newTeam.length > 0) {
        const starterIndex = newTeam.findIndex(m => m.isStarter);
        if (starterIndex !== -1) {
          const starterMon = newTeam[starterIndex];
          const starterData = STARTER_OPTIONS.find(s => s.initialPokemon.species === starterMon.species || s.evolutionStages.some(e => e.species === starterMon.species));
          if (starterData) {
            const currentStage = starterMon.stage || 1;
            const nextStageObj = starterData.evolutionStages.find(e => e.stage === currentStage + 1);
            if (nextStageObj) {
              const kantoEvolveMatch = findPokemonByName(nextStageObj.species);
              const starterIVs = starterMon.ivs || generateRandomIVs();
              newTeam[starterIndex] = {
                ...starterMon,
                ivs: starterIVs,
                name: nextStageObj.name,
                species: nextStageObj.species,
                type: nextStageObj.type,
                stage: nextStageObj.stage,
                level: nextStageObj.level,
                stats: calculatePokemonStats(nextStageObj.level, nextStageObj.stage, nextStageObj.species, starterIVs),
                spriteUrl: kantoEvolveMatch ? kantoEvolveMatch.sprite : starterMon.spriteUrl
              };
              evolvedName = nextStageObj.name;
            }
          }
        }
      }

      // Handle item reward if option awards an item
      let awardedItemName: string | undefined = undefined;
      if (option.addItemId) {
        const itemQty = option.addItemQty || 1;
        const currentQty = newInventory[option.addItemId] || 0;
        newInventory[option.addItemId] = currentQty + itemQty;

        const foundItem = KANTO_ITEMS.find(i => i.id === option.addItemId);
        if (foundItem) {
          awardedItemName = `${itemQty}x ${foundItem.name}`;
        }
      }

      // Team Fatigue accumulation per event choice
      let baseFatigueGain = 15;
      if (currentEvent.category === 'GYM_BATTLE' || currentEvent.category === 'LEAGUE_TOURNAMENT' || currentEvent.category === 'VILLAIN_TEAM') {
        baseFatigueGain = 20;
      } else if (currentEvent.category === 'LIFESTYLE') {
        baseFatigueGain = 8;
      }

      if (state.specialization === 'Combate' || state.specialization === 'Estrategia') {
        baseFatigueGain = Math.max(5, baseFatigueGain - 3);
      }

      const prevFatigue = state.teamFatigue ?? 0;
      const newFatigue = Math.min(100, prevFatigue + baseFatigueGain);
      const fatigueDelta = newFatigue - prevFatigue;

      // Dynamic Combat & Option Resolution
      let isActualVictory = !!option.isVictory;
      let isActualDefeat = !!option.isDefeat;
      let actualAwardedBadge = awardedBadge;

      if (option.forceVictory) {
        isActualVictory = true;
        isActualDefeat = false;
      } else if (option.forceDefeat) {
        isActualVictory = false;
        isActualDefeat = true;
        actualAwardedBadge = undefined;
        if (option.awardBadgeId) {
          newBadges = newBadges.filter(b => b !== option.awardBadgeId);
        }
        if (!actualOutcomeText || actualOutcomeText === option.outcomeText) {
          if (option.addPokemon) {
            actualOutcomeText = `💨 ¡CAPTURA FALLIDA! El ${option.addPokemon.species || option.addPokemon.name} rompió la Poké Ball y huyó rápidamente del lugar.`;
          } else {
            actualOutcomeText = option.outcomeText || `¡DERROTA EN COMBATE! Tu equipo Pokémon fue derrotado en ${currentEvent.location} tras agotar todas las oportunidades.`;
          }
        }
      }

      const isCombatCat = currentEvent.category === 'GYM_BATTLE' || currentEvent.category === 'RIVAL_MATCH' || currentEvent.category === 'VILLAIN_TEAM' || currentEvent.category === 'LEAGUE_TOURNAMENT';

      if (isCombatCat && option.isVictory && !option.forceVictory) {
        const teamAvgLvl = newTeam.length > 0
          ? Math.round(newTeam.reduce((acc, m) => acc + (m.level || 5), 0) / newTeam.length)
          : 8;
        const expectedLvl = Math.floor(currentEvent.age * 2.3);

        let combatPower = newStats.skill + typeMatchup.skillBonus;

        // Stamina effects on combat
        if (newStats.stamina < 25) combatPower -= 20;
        else if (newStats.stamina < 45) combatPower -= 10;
        else if (newStats.stamina >= 80) combatPower += 5;

        // Team Fatigue effects on combat power
        if (prevFatigue >= 75) {
          combatPower -= 20; // Severe fatigue penalty
        } else if (prevFatigue >= 40) {
          combatPower -= 10; // Moderate fatigue penalty
        }

        // Level gap penalty/bonus
        const levelGap = teamAvgLvl - expectedLvl;
        if (levelGap < 0) combatPower += levelGap * 5;
        else combatPower += Math.min(10, levelGap * 2);

        // Required difficulty scaling
        let requiredPower = Math.floor(currentEvent.age * 3.2 + 8);
        if (currentEvent.category === 'GYM_BATTLE') requiredPower += 8;
        if (currentEvent.category === 'LEAGUE_TOURNAMENT') requiredPower += 15;

        if (combatPower < requiredPower) {
          isActualVictory = false;
          isActualDefeat = true;
          actualAwardedBadge = undefined;
          if (option.awardBadgeId) {
            newBadges = newBadges.filter(b => b !== option.awardBadgeId);
          }
          newStats.reputation = Math.max(0, newStats.reputation - 6);
          newStats.stamina = Math.max(0, newStats.stamina - 15);
          actualOutcomeText = `¡DERROTA EN COMBATE! Tu nivel de combate (${Math.max(0, combatPower)} Pts) fue superado por la potencia del rival (${requiredPower} Pts) en ${currentEvent.location}. El cansancio acumulado, la desventaja elemental o la falta de nivel provocaron la caída de tu equipo.`;
        }
      }

      // Process automatic leveling, EXP distribution and evolution for all Pokémon in team
      const { updatedTeam, evolutionNotices, expSummary } = processTeamLevelingAndEvolution(
        newTeam,
        isActualVictory,
        state.specialization,
        currentEvent.category,
        newStats.bond,
        typeMatchup.expBonusPercent
      );
      newTeam = updatedTeam;

      if (evolutionNotices.length > 0 && !evolvedName) {
        evolvedName = evolutionNotices.join(' | ');
      }

      const statChangesList: { stat: string; delta: number; label: string }[] = [];
      if (effects.skill) statChangesList.push({ stat: 'skill', delta: effects.skill, label: 'Habilidad' });
      if (effects.reputation) statChangesList.push({ stat: 'reputation', delta: effects.reputation, label: 'Popularidad' });
      if (effects.bond) statChangesList.push({ stat: 'bond', delta: effects.bond, label: 'Vínculo' });
      if (effects.stamina) statChangesList.push({ stat: 'stamina', delta: effects.stamina, label: 'Resistencia' });
      if (effects.money) statChangesList.push({ stat: 'money', delta: effects.money, label: 'Pokécupones ($)' });
      if (deltaLegendary) statChangesList.push({ stat: 'legendaryScore', delta: deltaLegendary, label: 'Estatua Leyenda' });

      const victs = state.career.victories + (isActualVictory ? 1 : 0);
      const defs = state.career.defeats + (isActualDefeat ? 1 : 0);
      const caughtCount = state.career.pokemonCaught + (pokemonAwarded ? 1 : 0);
      const daysAdded = option.daysDelta || 25;
      const newDaysSpent = (state.career.daysSpent || 1) + daysAdded;

      // Chained Event trigger logic with chronological scheduling
      let nextActiveEvents = [...activeEventsList];
      let newUnlockedChainedIds = [...(state.unlockedChainedEventIds || [])];
      let unlockedChainedTitle: string | undefined = undefined;

      if (option.triggerNextEventId && !newUnlockedChainedIds.includes(option.triggerNextEventId)) {
        const chainedEventToInsert = ALL_EVENTS.find(e => e.id === option.triggerNextEventId);
        if (chainedEventToInsert) {
          // Schedule target age (at least 2 years after current event if predefined age is smaller)
          const targetAge = chainedEventToInsert.age > currentEvent.age
            ? chainedEventToInsert.age
            : currentEvent.age + 2;

          const eventInstance: GameEvent = {
            ...chainedEventToInsert,
            age: targetAge,
            parentEventTitle: currentEvent.title
          };

          // Find chronological insertion index in remaining deck
          let insertIndex = nextActiveEvents.length;
          for (let i = state.currentEventIndex + 1; i < nextActiveEvents.length; i++) {
            if (nextActiveEvents[i].age >= targetAge) {
              insertIndex = i;
              break;
            }
          }

          nextActiveEvents.splice(insertIndex, 0, eventInstance);

          // Keep remaining active events sorted chronologically by age
          const completedEvents = nextActiveEvents.slice(0, state.currentEventIndex + 1);
          const remainingEvents = nextActiveEvents.slice(state.currentEventIndex + 1);
          remainingEvents.sort((a, b) => a.age - b.age);
          nextActiveEvents = [...completedEvents, ...remainingEvents];

          newUnlockedChainedIds.push(option.triggerNextEventId);
          unlockedChainedTitle = `${chainedEventToInsert.title} (se desarrollará a los ${targetAge} años)`;
        }
      }

      // Dynamic Route Branch insertion
      if (option.insertEventIdsOnSelect && option.insertEventIdsOnSelect.length > 0) {
        for (const evId of option.insertEventIdsOnSelect) {
          const branchEvent = ALL_EVENTS.find(e => e.id === evId);
          if (branchEvent && !nextActiveEvents.some(e => e.id === branchEvent.id)) {
            const eventInstance: GameEvent = {
              ...branchEvent,
              age: currentEvent.age,
              parentEventTitle: currentEvent.title
            };
            nextActiveEvents.splice(state.currentEventIndex + 1, 0, eventInstance);
          }
        }
      }

      const logEntry = {
        age: currentEvent.age,
        eventTitle: currentEvent.title,
        chosenOption: option.text,
        summary: actualOutcomeText,
        statChanges: statChangesList.map(s => `${s.delta > 0 ? '+' : ''}${s.delta} ${s.label}`),
        badgeEarned: actualAwardedBadge?.name,
        pokemonAdded: pokemonAwarded?.name,
        chainedEventUnlocked: unlockedChainedTitle
      };

      const nextEventIdx = state.currentEventIndex + 1;
      const isOver = nextEventIdx >= nextActiveEvents.length || currentEvent.age >= 30;

      // Check achievements
      const newlyUnlocked = checkNewAchievements(
        state.career.unlockedAchievements || [],
        newStats,
        {
          victories: victs,
          badgesWon: newBadges,
          team: newTeam,
          legendaryScore: newLegendaryScore
        }
      );

      const allUnlocked = [
        ...(state.career.unlockedAchievements || []),
        ...newlyUnlocked
      ];

      return {
        ...state,
        stats: newStats,
        teamFatigue: newFatigue,
        inventory: newInventory,
        activeEvents: nextActiveEvents,
        unlockedChainedEventIds: newUnlockedChainedIds,
        career: {
          ...state.career,
          age: currentEvent.age,
          victories: victs,
          defeats: defs,
          badgesWon: newBadges,
          pokemonCaught: caughtCount,
          daysSpent: newDaysSpent,
          team: newTeam,
          pcBox: newPCBox,
          legendaryScore: newLegendaryScore,
          unlockedAchievements: allUnlocked
        },
        historyLog: [...state.historyLog, logEntry],
        currentEventIndex: nextEventIdx,
        isGameOver: isOver,
        lastOutcome: {
          title: currentEvent.title,
          description: actualOutcomeText,
          statChanges: statChangesList,
          fatigueDelta,
          newFatigue,
          badgeAwarded: actualAwardedBadge,
          pokemonAwarded: pokemonAwarded,
          sentToPC: wasSentToPC,
          evolvedPokemon: evolvedName,
          newAchievements: newlyUnlocked.length > 0 ? newlyUnlocked : undefined,
          chainedEventUnlockedTitle: unlockedChainedTitle,
          expSummary,
          catchNotice: catchNoticeObj,
          typeMatchupNotice: {
            label: typeMatchup.label,
            description: typeMatchup.effectDescription,
            badgeBg: typeMatchup.badgeBg,
            badgeText: typeMatchup.badgeText
          }
        }
      };
    }

    case 'SET_TEAM_LEADER': {
      const { memberId } = action.payload;
      const currentTeam = [...state.career.team];
      const index = currentTeam.findIndex(m => m.id === memberId);
      if (index <= 0) return state; // Already leader or not found

      const leaderMon = currentTeam[index];
      const updatedTeam = [leaderMon, ...currentTeam.filter((_, i) => i !== index)];

      return {
        ...state,
        career: {
          ...state.career,
          team: updatedTeam
        }
      };
    }

    case 'REORDER_TEAM': {
      return {
        ...state,
        career: {
          ...state.career,
          team: action.payload.newTeam
        }
      };
    }

    case 'DEPOSIT_TO_PC': {
      const { memberId } = action.payload;
      const currentTeam = [...state.career.team];
      if (currentTeam.length <= 1) return state; // Keep at least 1
      const targetMon = currentTeam.find(m => m.id === memberId);
      if (!targetMon) return state;

      const newTeam = currentTeam.filter(m => m.id !== memberId);
      const newPCBox = [...(state.career.pcBox || []), targetMon];

      return {
        ...state,
        career: {
          ...state.career,
          team: newTeam,
          pcBox: newPCBox
        }
      };
    }

    case 'WITHDRAW_FROM_PC': {
      const { pcMemberId } = action.payload;
      const currentTeam = [...state.career.team];
      if (currentTeam.length >= 6) return state; // Team full
      const currentPC = [...(state.career.pcBox || [])];
      const targetMon = currentPC.find(m => m.id === pcMemberId);
      if (!targetMon) return state;

      const newPCBox = currentPC.filter(m => m.id !== pcMemberId);
      const newTeam = [...currentTeam, targetMon];

      return {
        ...state,
        career: {
          ...state.career,
          team: newTeam,
          pcBox: newPCBox
        }
      };
    }

    case 'SWAP_TEAM_WITH_PC': {
      const { teamMemberId, pcMemberId } = action.payload;
      const currentTeam = [...state.career.team];
      const currentPC = [...(state.career.pcBox || [])];
      const teamIdx = currentTeam.findIndex(m => m.id === teamMemberId);
      const pcIdx = currentPC.findIndex(m => m.id === pcMemberId);
      if (teamIdx === -1 || pcIdx === -1) return state;

      const teamMon = currentTeam[teamIdx];
      const pcMon = currentPC[pcIdx];

      currentTeam[teamIdx] = pcMon;
      currentPC[pcIdx] = teamMon;

      return {
        ...state,
        career: {
          ...state.career,
          team: currentTeam,
          pcBox: currentPC
        }
      };
    }

    case 'REORDER_PC_BOX': {
      return {
        ...state,
        career: {
          ...state.career,
          pcBox: action.payload.newPCBox
        }
      };
    }

    case 'RELEASE_PC_POKEMON': {
      const { pcMemberId } = action.payload;
      const currentPC = [...(state.career.pcBox || [])];
      const newPCBox = currentPC.filter(m => m.id !== pcMemberId);

      return {
        ...state,
        career: {
          ...state.career,
          pcBox: newPCBox
        }
      };
    }

    case 'RETURN_TO_MENU': {
      try {
        const savedState = { ...state, isGameStarted: true };
        localStorage.setItem(SAVE_KEY, JSON.stringify(savedState));
      } catch (e) {
        console.warn('Could not save game state before returning to menu:', e);
      }
      return {
        ...state,
        isGameStarted: false
      };
    }

    case 'CONTINUE_SAVED_GAME': {
      const saved = getSavedGameFromStorage();
      if (saved) {
        return {
          ...saved,
          isGameStarted: true
        };
      }
      return {
        ...state,
        isGameStarted: true
      };
    }

    case 'DELETE_SAVED_GAME': {
      try {
        localStorage.removeItem(SAVE_KEY);
      } catch (e) {
        console.warn('Could not remove save game from storage:', e);
      }
      return {
        ...initialState,
        soundEnabled: state.soundEnabled,
        isGameStarted: false
      };
    }

    case 'CLOSE_OUTCOME_MODAL':
      return {
        ...state,
        lastOutcome: null
      };

    case 'RESET_GAME':
      try {
        localStorage.removeItem(SAVE_KEY);
      } catch (e) {
        console.warn('Could not remove save game:', e);
      }
      return {
        ...initialState,
        soundEnabled: state.soundEnabled,
        isGameStarted: false
      };

    case 'OPEN_MODAL':
      return {
        ...state,
        activeModal: action.payload
      };

    case 'CLOSE_MODAL':
      return {
        ...state,
        activeModal: 'none'
      };

    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload,
        activeModal: 'none'
      };

    case 'TOGGLE_SOUND':
      return {
        ...state,
        soundEnabled: !state.soundEnabled
      };

    case 'BUY_ITEM': {
      const { itemId, quantity } = action.payload;
      const item = getItemById(itemId);
      if (!item) return state;

      const totalCost = item.price * quantity;
      if (state.stats.money < totalCost) return state;

      const currentInv = state.inventory || {};
      const currentQty = currentInv[itemId] || 0;

      return {
        ...state,
        stats: {
          ...state.stats,
          money: state.stats.money - totalCost
        },
        inventory: {
          ...currentInv,
          [itemId]: currentQty + quantity
        }
      };
    }

    case 'USE_ITEM': {
      const { itemId, pokemonId } = action.payload;
      const item = getItemById(itemId);
      const currentInv = state.inventory || {};
      const currentQty = currentInv[itemId] || 0;
      if (!item || currentQty <= 0) return state;

      let newStats = { ...state.stats };
      let newTeam = [...state.career.team];

      let fatigueReduction = 0;
      if (item.id === 'potion') fatigueReduction = 30;
      else if (item.id === 'super-potion') fatigueReduction = 60;
      else if (item.id === 'hyper-potion') fatigueReduction = 90;
      else if (item.id === 'max-potion' || item.id === 'full-restore') fatigueReduction = 100;
      else if (item.id === 'revive') fatigueReduction = 50;
      else if (item.id === 'full-heal') fatigueReduction = 25;
      else if (item.id === 'antidote') fatigueReduction = 15;

      const currentFatigue = state.teamFatigue ?? 0;
      const newFatigue = Math.max(0, currentFatigue - fatigueReduction);

      if (item.category === 'STONE') {
        if (newTeam.length > 0) {
          const targetIndex = pokemonId
            ? newTeam.findIndex(m => m.id === pokemonId)
            : newTeam.findIndex(m => item.eligibleSpecies?.includes(m.species || m.name));

          if (targetIndex !== -1) {
            newTeam[targetIndex] = evolvePokemonWithStone(newTeam[targetIndex], itemId);
          }
        }
      } else if (item.effectType === 'RESTORE_STAMINA' || item.effectType === 'HEAL_FULL') {
        const val = item.effectType === 'HEAL_FULL' ? 100 : item.effectValue;
        newStats.stamina = Math.min(100, newStats.stamina + val);
      } else if (item.effectType === 'STAT_BOOST' && item.statTarget) {
        newStats[item.statTarget] = Math.min(100, (newStats[item.statTarget] || 0) + item.effectValue);
      } else if (item.effectType === 'TEAM_BOND') {
        newStats.bond = Math.min(100, newStats.bond + item.effectValue);
      } else if (item.effectType === 'CAPTURE_BONUS') {
        newStats.skill = Math.min(100, newStats.skill + Math.round(item.effectValue / 3));
      }

      return {
        ...state,
        stats: newStats,
        teamFatigue: newFatigue,
        inventory: {
          ...currentInv,
          [itemId]: Math.max(0, currentQty - 1)
        },
        career: {
          ...state.career,
          team: newTeam
        }
      };
    }

    case 'HEAL_POKEMON_CENTER': {
      return {
        ...state,
        teamFatigue: 0,
        stats: {
          ...state.stats,
          stamina: 100
        },
        career: {
          ...state.career,
          daysSpent: state.career.daysSpent + 1
        }
      };
    }

    default:
      return state;
  }
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState, loadSavedGame);

  useEffect(() => {
    try {
      if (state.isGameStarted) {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      }
    } catch (e) {
      console.warn('Failed auto-saving to localStorage:', e);
    }
  }, [state]);

  const startGame = (name: string, spec: TrainerSpecialization, starterId: string, avatarId: string) => {
    if (state.soundEnabled) soundFx.playSelect();
    dispatch({ type: 'START_GAME', payload: { name, spec, starterId, avatarId } });
  };

  const continueSavedGame = () => {
    if (state.soundEnabled) soundFx.playSelect();
    dispatch({ type: 'CONTINUE_SAVED_GAME' });
  };

  const returnToMenu = () => {
    if (state.soundEnabled) soundFx.playClick();
    dispatch({ type: 'RETURN_TO_MENU' });
  };

  const deleteSavedGame = () => {
    if (state.soundEnabled) soundFx.playClick();
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      console.warn('Could not remove save game:', e);
    }
    dispatch({ type: 'DELETE_SAVED_GAME' });
  };

  const selectOption = (option: OptionChoice) => {
    if (state.soundEnabled) {
      if (option.awardBadgeId) {
        soundFx.playBadgeFanfare();
      } else if (option.isVictory) {
        soundFx.playVictoryFanfare();
      } else {
        soundFx.playStatUp();
      }
    }
    dispatch({ type: 'SELECT_OPTION', payload: { option } });
  };

  const setTeamLeader = (memberId: string) => {
    if (state.soundEnabled) soundFx.playStatUp();
    dispatch({ type: 'SET_TEAM_LEADER', payload: { memberId } });
  };

  const reorderTeam = (newTeam: PokemonMember[]) => {
    if (state.soundEnabled) soundFx.playClick();
    dispatch({ type: 'REORDER_TEAM', payload: { newTeam } });
  };

  const depositToPC = (memberId: string) => {
    if (state.soundEnabled) soundFx.playClick();
    dispatch({ type: 'DEPOSIT_TO_PC', payload: { memberId } });
  };

  const withdrawFromPC = (pcMemberId: string) => {
    if (state.soundEnabled) soundFx.playStatUp();
    dispatch({ type: 'WITHDRAW_FROM_PC', payload: { pcMemberId } });
  };

  const swapTeamWithPC = (teamMemberId: string, pcMemberId: string) => {
    if (state.soundEnabled) soundFx.playStatUp();
    dispatch({ type: 'SWAP_TEAM_WITH_PC', payload: { teamMemberId, pcMemberId } });
  };

  const reorderPCBox = (newPCBox: PokemonMember[]) => {
    if (state.soundEnabled) soundFx.playClick();
    dispatch({ type: 'REORDER_PC_BOX', payload: { newPCBox } });
  };

  const releasePokemonFromPC = (pcMemberId: string) => {
    if (state.soundEnabled) soundFx.playClick();
    dispatch({ type: 'RELEASE_PC_POKEMON', payload: { pcMemberId } });
  };

  const closeOutcomeModal = () => {
    if (state.soundEnabled) soundFx.playClick();
    dispatch({ type: 'CLOSE_OUTCOME_MODAL' });
  };

  const resetGame = () => {
    if (state.soundEnabled) soundFx.playClick();
    dispatch({ type: 'RESET_GAME' });
  };

  const openModal = (modal: GameState['activeModal']) => {
    if (state.soundEnabled) soundFx.playClick();
    dispatch({ type: 'OPEN_MODAL', payload: modal });
  };

  const closeModal = () => {
    if (state.soundEnabled) soundFx.playClick();
    dispatch({ type: 'CLOSE_MODAL' });
  };

  const setActiveTab = (tab: NavigationTab) => {
    if (state.soundEnabled) soundFx.playClick();
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  };

  const toggleSound = () => {
    dispatch({ type: 'TOGGLE_SOUND' });
  };

  const buyItem = (itemId: string, quantity: number) => {
    if (state.soundEnabled) soundFx.playStatUp();
    dispatch({ type: 'BUY_ITEM', payload: { itemId, quantity } });
  };

  const useItem = (itemId: string, pokemonId?: string): boolean => {
    const qty = (state.inventory || {})[itemId] || 0;
    if (qty <= 0) return false;

    if (state.soundEnabled) soundFx.playStatUp();
    dispatch({ type: 'USE_ITEM', payload: { itemId, pokemonId } });
    return true;
  };

  const healTeamAtCenter = () => {
    if (state.soundEnabled) soundFx.playBadgeFanfare();
    dispatch({ type: 'HEAL_POKEMON_CENTER' });
  };

  const activeEventsList = state.activeEvents && state.activeEvents.length > 0
    ? state.activeEvents
    : GAME_EVENTS.filter(e => !e.isChainedOnly);

  const currentEvent = state.isGameStarted && !state.isGameOver && state.currentEventIndex < activeEventsList.length 
    ? activeEventsList[state.currentEventIndex] 
    : null;

  const getEarnedBadges = (): Badge[] => {
    return REGIONAL_BADGES.filter(b => state.career.badgesWon.includes(b.id));
  };

  const savedGameData = getSavedGameFromStorage();
  const hasSavedGame = savedGameData !== null;

  return (
    <GameContext.Provider
      value={{
        state,
        startGame,
        continueSavedGame,
        returnToMenu,
        deleteSavedGame,
        selectOption,
        setTeamLeader,
        reorderTeam,
        depositToPC,
        withdrawFromPC,
        swapTeamWithPC,
        reorderPCBox,
        releasePokemonFromPC,
        closeOutcomeModal,
        resetGame,
        openModal,
        closeModal,
        setActiveTab,
        toggleSound,
        buyItem,
        useItem,
        healTeamAtCenter,
        currentEvent,
        calculateLegacyTier,
        getEarnedBadges,
        hasSavedGame,
        savedGameData
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
