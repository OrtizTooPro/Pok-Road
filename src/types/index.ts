export type TrainerSpecialization = 'Combate' | 'Captura' | 'Crianza' | 'Estrategia';

export type LeagueTier = 'Rutas Locales' | 'Gimnasios Regionales' | 'Frente de Batalla' | 'Alto Mando y Liga';

export interface TrainerStats {
  skill: number;        // Habilidad táctica en combate (0-100)
  reputation: number;   // Popularidad y fama entre entrenadores (0-100)
  bond: number;         // Vínculo y amistad con el equipo Pokémon (0-100)
  stamina: number;      // Resistencia física para los viajes (0-100)
  money: number;        // Pokécupones / Pokédólares acumulados ($)
}

export interface PokemonIVs {
  hp: number;      // IV de Puntos de Salud (1-31)
  attack: number;  // IV de Ataque (1-31)
  defense: number; // IV de Defensa (1-31)
  speed: number;   // IV de Velocidad (1-31)
  special: number; // IV de Especial (1-31)
}

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  special: number;
}

export interface PokemonMember {
  id: string;
  name: string;
  species: string;
  type: string;
  secondaryType?: string;
  level: number;
  exp?: number;
  maxExp?: number;
  stats?: PokemonStats;
  ivs?: PokemonIVs; // Valores Individuales Ocultos (1-31 por estadística)
  moves?: string[];
  stage: number; // 1, 2, 3
  isStarter?: boolean;
  isShiny?: boolean;
  isLegendary?: boolean;
  spriteUrl?: string;
  iconEmoji?: string;
}

export interface MemberExpGain {
  id: string;
  name: string;
  species: string;
  oldLevel: number;
  newLevel: number;
  expGained: number;
  currentExp: number;
  maxExp: number;
  didLevelUp: boolean;
  didEvolve: boolean;
  newSpecies?: string;
  spriteUrl?: string;
  statGain?: Partial<PokemonStats>;
}

export interface TeamExpSummary {
  baseExp: number;
  totalExpGained: number;
  levelUps: string[];
  evolutions: string[];
  memberGains: MemberExpGain[];
}

export interface Badge {
  id: string;
  name: string;
  gymLeader: string;
  type: string;
  city: string;
  iconName: string;
  description: string;
  statBonus?: string;
  spriteUrl?: string;
}

export interface OptionChoice {
  id: string;
  text: string;
  outcomeText: string;
  statEffects: Partial<TrainerStats> & { legendaryScoreDelta?: number };
  statRequirements?: Partial<TrainerStats>;
  specializationRequirement?: TrainerSpecialization;
  specializationBonusText?: string;
  awardBadgeId?: string;
  addPokemon?: Omit<PokemonMember, 'id'>;
  addItemId?: string;
  addItemQty?: number;
  evolveStarter?: boolean;
  evolveTeamIndex?: number;
  triggerNextEventId?: string;
  insertEventIdsOnSelect?: string[];
  chainedNotice?: string; // Optional preview notice of the chained event triggered
  isVictory?: boolean;
  isDefeat?: boolean;
  daysDelta?: number; // Custom days spent for this option
}

export interface GameEvent {
  id: string;
  title: string;
  category: 'GYM_BATTLE' | 'RIVAL_MATCH' | 'WILD_ENCOUNTER' | 'VILLAIN_TEAM' | 'LEAGUE_TOURNAMENT' | 'LIFESTYLE';
  age: number;
  tierRequirement?: LeagueTier;
  description: string;
  location: string;
  badgeId?: string;
  imageTag?: string;
  isChainedOnly?: boolean; // If true, only appears when unlocked by a decision
  parentEventTitle?: string; // Reference to the origin event that unlocked this
  options: OptionChoice[];
}

export interface CareerMetrics {
  age: number;
  victories: number;
  defeats: number;
  badgesWon: string[]; // Badge IDs
  pokemonCaught: number;
  daysSpent: number; // Total de días transcurridos en la región
  titlesWon: string[];
  team: PokemonMember[];
  pcBox?: PokemonMember[]; // Sistema de Almacenamiento PC
  legendaryScore: number; // 0-100%
  unlockedAchievements: string[]; // Achievement IDs
}

export interface CareerLogEntry {
  age: number;
  eventTitle: string;
  chosenOption: string;
  summary: string;
  statChanges: string[];
  badgeEarned?: string;
  pokemonAdded?: string;
  chainedEventUnlocked?: string;
}

export type CareerLegacyTier = 
  | 'Entrenador Novato' 
  | 'Líder de Gimnasio Local' 
  | 'Miembro del Alto Mando' 
  | 'Campeón Regional' 
  | '¡LEYENDA DEL SALÓN DE LA FAMA!';

export type NavigationTab = 'summary_badges' | 'challenge_timeline' | 'team' | 'pokedex' | 'inventory';

export interface GameState {
  trainerName: string;
  avatarId: string;
  specialization: TrainerSpecialization;
  stats: TrainerStats;
  teamFatigue: number; // 0 to 100% (0% = Descansado, 100% = Agotado)
  career: CareerMetrics;
  historyLog: CareerLogEntry[];
  activeEvents: GameEvent[]; // Dynamic event deck including unlocked chained events
  unlockedChainedEventIds: string[]; // Track all chained event IDs unlocked in history
  currentEventIndex: number;
  isGameStarted: boolean;
  isGameOver: boolean;
  lastOutcome: {
    title: string;
    description: string;
    statChanges: { stat: string; delta: number; label: string }[];
    fatigueDelta?: number;
    newFatigue?: number;
    badgeAwarded?: Badge;
    pokemonAwarded?: PokemonMember;
    sentToPC?: boolean;
    evolvedPokemon?: string;
    newAchievements?: string[];
    chainedEventUnlockedTitle?: string;
    expSummary?: TeamExpSummary;
    catchNotice?: {
      hasBall: boolean;
      usedBallName?: string;
      usedBallIcon?: string;
      catchChance?: number;
      captured: boolean;
      message: string;
    };
    typeMatchupNotice?: {
      label: string;
      description: string;
      badgeBg: string;
      badgeText: string;
    };
  } | null;
  activeModal: 'none' | 'league' | 'tournaments' | 'about' | 'privacy' | 'terms' | 'shop' | 'inventory';
  activeTab: NavigationTab;
  inventory: Record<string, number>;
  soundEnabled: boolean;
}
