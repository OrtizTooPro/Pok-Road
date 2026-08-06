import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  GameState, 
  TrainerSpecialization, 
  GameEvent, 
  OptionChoice, 
  CareerLegacyTier,
  Badge,
  PokemonMember,
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
  normalizePokemonReward 
} from '../utils/pokemonEvolution';
import { evaluateLeaderMatchup } from '../utils/typeChart';

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
  closeOutcomeModal: () => void;
  resetGame: () => void;
  openModal: (modal: GameState['activeModal']) => void;
  closeModal: () => void;
  setActiveTab: (tab: NavigationTab) => void;
  toggleSound: () => void;
  currentEvent: GameEvent | null;
  calculateLegacyTier: (score: number) => CareerLegacyTier;
  getEarnedBadges: () => Badge[];
  hasSavedGame: boolean;
  savedGameData: GameState | null;
}

const initialStats: TrainerStats = {
  skill: 55,
  reputation: 15,
  bond: 80,
  stamina: 90,
  money: 3000
};

const initialState: GameState = {
  trainerName: 'Red',
  avatarId: 'avatar-red',
  specialization: 'Combate',
  stats: { ...initialStats },
  career: {
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
  soundEnabled: true
};

function loadSavedGame(): GameState {
  const saved = getSavedGameFromStorage();
  if (saved) {
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
  | { type: 'CLOSE_OUTCOME_MODAL' }
  | { type: 'RESET_GAME' }
  | { type: 'OPEN_MODAL'; payload: GameState['activeModal'] }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_ACTIVE_TAB'; payload: NavigationTab }
  | { type: 'TOGGLE_SOUND' };

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
        initialVictories = 2;
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
      const initialMon: PokemonMember = {
        ...starterChoice.initialPokemon,
        exp: 0,
        maxExp: calculateMaxExpForLevel(initialLvl),
        stats: calculatePokemonStats(initialLvl, initialStg),
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
      let pokemonAwarded: PokemonMember | undefined = undefined;
      let evolvedName: string | undefined = undefined;

      // Type matchup evaluation based on Team Leader (Slot #1)
      const leaderMon = newTeam[0];
      const typeMatchup = evaluateLeaderMatchup(leaderMon, currentEvent);

      // Add new Pokemon if provided - balanced with team average level
      if (option.addPokemon) {
        const teamAvgLvl = newTeam.length > 0
          ? Math.round(newTeam.reduce((acc, m) => acc + (m.level || 5), 0) / newTeam.length)
          : 8;

        const normalizedReward = normalizePokemonReward(option.addPokemon, teamAvgLvl);
        const kantoMatch = findPokemonByName(normalizedReward.species || normalizedReward.name);

        const newMon: PokemonMember = {
          ...normalizedReward,
          id: `mon-${Date.now()}-${Math.random()}`,
          exp: normalizedReward.exp || 0,
          maxExp: calculateMaxExpForLevel(normalizedReward.level),
          stats: calculatePokemonStats(normalizedReward.level, normalizedReward.stage || 1),
          moves: getPokemonMoves(normalizedReward.species, normalizedReward.level, normalizedReward.type),
          spriteUrl: normalizedReward.spriteUrl || (kantoMatch ? kantoMatch.sprite : undefined)
        };
        if (newTeam.length < 6) {
          newTeam.push(newMon);
        } else {
          // Replace last non-starter mon if team full
          newTeam[newTeam.length - 1] = newMon;
        }
        pokemonAwarded = newMon;
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
              newTeam[starterIndex] = {
                ...starterMon,
                name: nextStageObj.name,
                species: nextStageObj.species,
                type: nextStageObj.type,
                stage: nextStageObj.stage,
                level: nextStageObj.level,
                spriteUrl: kantoEvolveMatch ? kantoEvolveMatch.sprite : starterMon.spriteUrl
              };
              evolvedName = nextStageObj.name;
            }
          }
        }
      }

      // Process automatic leveling, EXP distribution and evolution for all Pokémon in team
      const { updatedTeam, evolutionNotices, expSummary } = processTeamLevelingAndEvolution(
        newTeam,
        !!option.isVictory,
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

      const victs = state.career.victories + (option.isVictory ? 1 : 0);
      const defs = state.career.defeats + (option.isDefeat ? 1 : 0);
      const caughtCount = state.career.pokemonCaught + (option.addPokemon ? 1 : 0);
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
        summary: option.outcomeText,
        statChanges: statChangesList.map(s => `${s.delta > 0 ? '+' : ''}${s.delta} ${s.label}`),
        badgeEarned: awardedBadge?.name,
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
          legendaryScore: newLegendaryScore,
          unlockedAchievements: allUnlocked
        },
        historyLog: [...state.historyLog, logEntry],
        currentEventIndex: nextEventIdx,
        isGameOver: isOver,
        lastOutcome: {
          title: currentEvent.title,
          description: option.outcomeText,
          statChanges: statChangesList,
          badgeAwarded: awardedBadge,
          pokemonAwarded: pokemonAwarded,
          evolvedPokemon: evolvedName,
          newAchievements: newlyUnlocked.length > 0 ? newlyUnlocked : undefined,
          chainedEventUnlockedTitle: unlockedChainedTitle,
          expSummary,
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
        closeOutcomeModal,
        resetGame,
        openModal,
        closeModal,
        setActiveTab,
        toggleSound,
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
