import { PokemonMember, PokemonStats, PokemonIVs, TeamExpSummary, MemberExpGain, GameEvent, OptionChoice } from '../types';
import { findPokemonByName } from '../data/kantoPokedex';

interface EvolutionRule {
  fromSpecies: string;
  toSpecies: string;
  minLevel: number;
}

export function generateRandomIVs(): PokemonIVs {
  return {
    hp: Math.floor(Math.random() * 31) + 1,
    attack: Math.floor(Math.random() * 31) + 1,
    defense: Math.floor(Math.random() * 31) + 1,
    speed: Math.floor(Math.random() * 31) + 1,
    special: Math.floor(Math.random() * 31) + 1,
  };
}

export function getPokemonPotentialJudgement(ivs?: PokemonIVs): {
  overallLabel: string;
  tierClass: string;
  badgeColor: string;
  stars: string;
  bestStatLabel: string;
  summaryText: string;
} {
  if (!ivs) {
    return {
      overallLabel: 'Potencial Aceptable',
      tierClass: 'text-amber-900 bg-amber-50 border-amber-300',
      badgeColor: 'bg-amber-500',
      stars: '★ ★',
      bestStatLabel: 'Estadísticas equilibradas',
      summaryText: 'Evaluación del Juez de Genes: Demuestra un rendimiento físico y táctico estándar.'
    };
  }

  const total = ivs.hp + ivs.attack + ivs.defense + ivs.speed + ivs.special; // max 155, min 5
  const statEntries = [
    { stat: 'hp', name: 'Puntos de Salud', value: ivs.hp },
    { stat: 'attack', name: 'Ataque', value: ivs.attack },
    { stat: 'defense', name: 'Defensa', value: ivs.defense },
    { stat: 'speed', name: 'Velocidad', value: ivs.speed },
    { stat: 'special', name: 'Especial', value: ivs.special },
  ];
  statEntries.sort((a, b) => b.value - a.value);

  const bestStat = statEntries[0];
  let bestStatTerm = 'Inmejorable';
  if (bestStat.value >= 31) bestStatTerm = '¡Sin igual!';
  else if (bestStat.value >= 26) bestStatTerm = 'Espectacular';
  else if (bestStat.value >= 18) bestStatTerm = 'Notable';
  else if (bestStat.value >= 10) bestStatTerm = 'Decente';
  else bestStatTerm = 'Normal';

  let overallLabel = 'Potencial Aceptable';
  let tierClass = 'text-amber-950 bg-amber-50 border-amber-400';
  let badgeColor = 'bg-amber-500';
  let stars = '★ ★';

  if (total >= 135) {
    overallLabel = 'Potencial Extraordinario (S-Tier)';
    tierClass = 'text-purple-950 bg-purple-50 border-purple-400';
    badgeColor = 'bg-purple-600';
    stars = '★ ★ ★ ★ ★';
  } else if (total >= 110) {
    overallLabel = 'Potencial Excelente (A-Tier)';
    tierClass = 'text-indigo-950 bg-indigo-50 border-indigo-400';
    badgeColor = 'bg-indigo-600';
    stars = '★ ★ ★ ★';
  } else if (total >= 80) {
    overallLabel = 'Potencial Superior (B-Tier)';
    tierClass = 'text-emerald-950 bg-emerald-50 border-emerald-400';
    badgeColor = 'bg-emerald-600';
    stars = '★ ★ ★';
  } else if (total < 50) {
    overallLabel = 'Potencial Básico';
    tierClass = 'text-slate-800 bg-slate-100 border-slate-300';
    badgeColor = 'bg-slate-500';
    stars = '★';
  }

  const bestStatLabel = `Destaca especialmente en ${bestStat.name} (${bestStatTerm})`;
  const summaryText = `Evaluación del Juez de Genes: Pokémon con un ${overallLabel}. ${bestStatLabel}.`;

  return { overallLabel, tierClass, badgeColor, stars, bestStatLabel, summaryText };
}

export const EVOLUTION_RULES: EvolutionRule[] = [
  // Starters
  { fromSpecies: 'Bulbasaur', toSpecies: 'Ivysaur', minLevel: 16 },
  { fromSpecies: 'Ivysaur', toSpecies: 'Venusaur', minLevel: 32 },
  { fromSpecies: 'Charmander', toSpecies: 'Charmeleon', minLevel: 16 },
  { fromSpecies: 'Charmeleon', toSpecies: 'Charizard', minLevel: 36 },
  { fromSpecies: 'Squirtle', toSpecies: 'Wartortle', minLevel: 16 },
  { fromSpecies: 'Wartortle', toSpecies: 'Blastoise', minLevel: 36 },
  { fromSpecies: 'Pikachu', toSpecies: 'Raichu', minLevel: 26 },
  { fromSpecies: 'Eevee', toSpecies: 'Jolteon', minLevel: 25 },

  // Route & Wild Kanto Pokemon
  { fromSpecies: 'Caterpie', toSpecies: 'Metapod', minLevel: 7 },
  { fromSpecies: 'Metapod', toSpecies: 'Butterfree', minLevel: 10 },
  { fromSpecies: 'Weedle', toSpecies: 'Kakuna', minLevel: 7 },
  { fromSpecies: 'Kakuna', toSpecies: 'Beedrill', minLevel: 10 },
  { fromSpecies: 'Pidgey', toSpecies: 'Pidgeotto', minLevel: 18 },
  { fromSpecies: 'Pidgeotto', toSpecies: 'Pidgeot', minLevel: 36 },
  { fromSpecies: 'Rattata', toSpecies: 'Raticate', minLevel: 20 },
  { fromSpecies: 'Spearow', toSpecies: 'Fearow', minLevel: 20 },
  { fromSpecies: 'Ekans', toSpecies: 'Arbok', minLevel: 22 },
  { fromSpecies: 'Sandshrew', toSpecies: 'Sandslash', minLevel: 22 },
  { fromSpecies: 'Nidoran♀', toSpecies: 'Nidorina', minLevel: 16 },
  { fromSpecies: 'Nidorina', toSpecies: 'Nidoqueen', minLevel: 32 },
  { fromSpecies: 'Nidoran♂', toSpecies: 'Nidorino', minLevel: 16 },
  { fromSpecies: 'Nidorino', toSpecies: 'Nidoking', minLevel: 32 },
  { fromSpecies: 'Clefairy', toSpecies: 'Clefable', minLevel: 25 },
  { fromSpecies: 'Vulpix', toSpecies: 'Ninetales', minLevel: 28 },
  { fromSpecies: 'Jigglypuff', toSpecies: 'Wigglytuff', minLevel: 25 },
  { fromSpecies: 'Zubat', toSpecies: 'Golbat', minLevel: 22 },
  { fromSpecies: 'Oddish', toSpecies: 'Gloom', minLevel: 21 },
  { fromSpecies: 'Gloom', toSpecies: 'Vileplume', minLevel: 36 },
  { fromSpecies: 'Paras', toSpecies: 'Parasect', minLevel: 24 },
  { fromSpecies: 'Venonat', toSpecies: 'Venomoth', minLevel: 31 },
  { fromSpecies: 'Diglett', toSpecies: 'Dugtrio', minLevel: 26 },
  { fromSpecies: 'Meowth', toSpecies: 'Persian', minLevel: 28 },
  { fromSpecies: 'Psyduck', toSpecies: 'Golduck', minLevel: 33 },
  { fromSpecies: 'Mankey', toSpecies: 'Primeape', minLevel: 28 },
  { fromSpecies: 'Growlithe', toSpecies: 'Arcanine', minLevel: 30 },
  { fromSpecies: 'Poliwag', toSpecies: 'Poliwhirl', minLevel: 25 },
  { fromSpecies: 'Poliwhirl', toSpecies: 'Poliwrath', minLevel: 38 },
  { fromSpecies: 'Abra', toSpecies: 'Kadabra', minLevel: 16 },
  { fromSpecies: 'Kadabra', toSpecies: 'Alakazam', minLevel: 38 },
  { fromSpecies: 'Machop', toSpecies: 'Machoke', minLevel: 28 },
  { fromSpecies: 'Machoke', toSpecies: 'Machamp', minLevel: 42 },
  { fromSpecies: 'Bellsprout', toSpecies: 'Weepinbell', minLevel: 21 },
  { fromSpecies: 'Weepinbell', toSpecies: 'Victreebel', minLevel: 36 },
  { fromSpecies: 'Tentacool', toSpecies: 'Tentacruel', minLevel: 30 },
  { fromSpecies: 'Geodude', toSpecies: 'Graveler', minLevel: 25 },
  { fromSpecies: 'Graveler', toSpecies: 'Golem', minLevel: 40 },
  { fromSpecies: 'Ponyta', toSpecies: 'Rapidash', minLevel: 40 },
  { fromSpecies: 'Slowpoke', toSpecies: 'Slowbro', minLevel: 37 },
  { fromSpecies: 'Magnemite', toSpecies: 'Magneton', minLevel: 30 },
  { fromSpecies: 'Doduo', toSpecies: 'Dodrio', minLevel: 31 },
  { fromSpecies: 'Seel', toSpecies: 'Dewgong', minLevel: 34 },
  { fromSpecies: 'Grimer', toSpecies: 'Muk', minLevel: 38 },
  { fromSpecies: 'Shellder', toSpecies: 'Cloyster', minLevel: 30 },
  { fromSpecies: 'Gastly', toSpecies: 'Haunter', minLevel: 25 },
  { fromSpecies: 'Haunter', toSpecies: 'Gengar', minLevel: 40 },
  { fromSpecies: 'Drowzee', toSpecies: 'Hypno', minLevel: 26 },
  { fromSpecies: 'Krabby', toSpecies: 'Kingler', minLevel: 28 },
  { fromSpecies: 'Voltorb', toSpecies: 'Electrode', minLevel: 30 },
  { fromSpecies: 'Exeggcute', toSpecies: 'Exeggutor', minLevel: 32 },
  { fromSpecies: 'Cubone', toSpecies: 'Marowak', minLevel: 28 },
  { fromSpecies: 'Koffing', toSpecies: 'Weezing', minLevel: 35 },
  { fromSpecies: 'Rhyhorn', toSpecies: 'Rhydon', minLevel: 42 },
  { fromSpecies: 'Horsea', toSpecies: 'Seadra', minLevel: 32 },
  { fromSpecies: 'Goldeen', toSpecies: 'Seaking', minLevel: 33 },
  { fromSpecies: 'Staryu', toSpecies: 'Starmie', minLevel: 30 },
  { fromSpecies: 'Magikarp', toSpecies: 'Gyarados', minLevel: 20 },
  { fromSpecies: 'Omanyte', toSpecies: 'Omastar', minLevel: 40 },
  { fromSpecies: 'Kabuto', toSpecies: 'Kabutops', minLevel: 40 },
  { fromSpecies: 'Dratini', toSpecies: 'Dragonair', minLevel: 30 },
  { fromSpecies: 'Dragonair', toSpecies: 'Dragonite', minLevel: 55 }
];

export function calculateMaxExpForLevel(level: number): number {
  return Math.round(150 + level * 35 + Math.pow(level, 1.35) * 8);
}

export function calculatePokemonStats(
  level: number, 
  stage: number = 1, 
  species?: string,
  ivs?: PokemonIVs
): PokemonStats {
  const lvl = Math.max(1, level);
  const stg = Math.max(1, stage);
  const iv = ivs || { hp: 16, attack: 16, defense: 16, speed: 16, special: 16 };

  if (species) {
    const kantoMatch = findPokemonByName(species);
    if (kantoMatch && kantoMatch.baseStats) {
      const b = kantoMatch.baseStats;
      return {
        hp: Math.floor(((b.hp * 2 + iv.hp) * lvl) / 100 + lvl + 10),
        attack: Math.floor(((b.attack * 2 + iv.attack) * lvl) / 100 + 5),
        defense: Math.floor(((b.defense * 2 + iv.defense) * lvl) / 100 + 5),
        speed: Math.floor(((b.speed * 2 + iv.speed) * lvl) / 100 + 5),
        special: Math.floor(((b.special * 2 + iv.special) * lvl) / 100 + 5),
      };
    }
  }

  return {
    hp: Math.floor(22 + lvl * 2.9 + stg * 12 + (iv.hp * lvl) / 100),
    attack: Math.floor(12 + lvl * 2.1 + stg * 9 + (iv.attack * lvl) / 100),
    defense: Math.floor(10 + lvl * 2.0 + stg * 8 + (iv.defense * lvl) / 100),
    speed: Math.floor(11 + lvl * 2.1 + stg * 8 + (iv.speed * lvl) / 100),
    special: Math.floor(14 + lvl * 2.3 + stg * 9 + (iv.special * lvl) / 100),
  };
}

export function getPokemonMoves(species: string, level: number, type: string): string[] {
  const typeLower = type.toLowerCase();
  const moves: string[] = [];

  // Move 1: Basic
  moves.push('Placaje');

  // Move 2: Elemental basic
  if (typeLower.includes('fuego')) moves.push('Ascuas');
  else if (typeLower.includes('agua')) moves.push('Pistola Agua');
  else if (typeLower.includes('planta')) moves.push('Látigo Cepa');
  else if (typeLower.includes('eléctrico')) moves.push('Impactrueno');
  else if (typeLower.includes('psíquico')) moves.push('Confusión');
  else if (typeLower.includes('lucha')) moves.push('Golpe Karate');
  else if (typeLower.includes('veneno')) moves.push('Picotazo Ven.');
  else if (typeLower.includes('tierra')) moves.push('Disparo Lodo');
  else if (typeLower.includes('volador')) moves.push('Ataque Ala');
  else moves.push('Ataque Rápido');

  // Move 3: Intermediate unlocked at level 18+
  if (level >= 18) {
    if (typeLower.includes('fuego')) moves.push('Lanzallamas');
    else if (typeLower.includes('agua')) moves.push('Rayo Burbuja');
    else if (typeLower.includes('planta')) moves.push('Hoja Afilada');
    else if (typeLower.includes('eléctrico')) moves.push('Rayo');
    else if (typeLower.includes('psíquico')) moves.push('Psíquico');
    else if (typeLower.includes('lucha')) moves.push('Sumisión');
    else if (typeLower.includes('dragón')) moves.push('Garra Dragón');
    else moves.push('Cabezazo');
  }

  // Move 4: Ultimate unlocked at level 36+
  if (level >= 36) {
    if (typeLower.includes('fuego')) moves.push('Envite Ígneo');
    else if (typeLower.includes('agua')) moves.push('Hidrobomba');
    else if (typeLower.includes('planta')) moves.push('Rayo Solar');
    else if (typeLower.includes('eléctrico')) moves.push('Trueno');
    else if (typeLower.includes('psíquico')) moves.push('Premonición');
    else moves.push('Hiperrayo');
  }

  return moves;
}

export function calculateEventExpGain(
  eventCategory: string = 'WILD_ENCOUNTER',
  isVictory: boolean = true,
  specialization: string = 'Combate',
  trainerBond: number = 80
): number {
  let baseExp = 75;

  switch (eventCategory) {
    case 'LEAGUE_TOURNAMENT':
      baseExp = 180;
      break;
    case 'GYM_BATTLE':
      baseExp = 150;
      break;
    case 'VILLAIN_TEAM':
      baseExp = 120;
      break;
    case 'RIVAL_MATCH':
      baseExp = 100;
      break;
    case 'WILD_ENCOUNTER':
      baseExp = 75;
      break;
    case 'LIFESTYLE':
      baseExp = 50;
      break;
    default:
      baseExp = 75;
  }

  let multiplier = isVictory ? 1.35 : 1.1;

  // Specialization bonuses
  if (specialization === 'Crianza') multiplier += 0.25;
  if (specialization === 'Combate' && (eventCategory === 'GYM_BATTLE' || eventCategory === 'LEAGUE_TOURNAMENT' || eventCategory === 'RIVAL_MATCH')) {
    multiplier += 0.25;
  }
  if (specialization === 'Captura' && eventCategory === 'WILD_ENCOUNTER') {
    multiplier += 0.25;
  }
  if (specialization === 'Estrategia') {
    multiplier += 0.15;
  }

  // Bond multiplier (+0% to +30%)
  const bondBonus = Math.min(0.3, trainerBond / 330);
  multiplier += bondBonus;

  return Math.round(baseExp * multiplier);
}

export function processTeamLevelingAndEvolution(
  team: PokemonMember[],
  isVictory: boolean = true,
  specialization: string = 'Combate',
  eventCategory: string = 'WILD_ENCOUNTER',
  trainerBond: number = 80,
  typeBonusPercent: number = 0
): { updatedTeam: PokemonMember[]; evolutionNotices: string[]; expSummary: TeamExpSummary } {
  const evolutionNotices: string[] = [];
  const levelUpNotices: string[] = [];
  const memberGains: MemberExpGain[] = [];

  let baseExpAwarded = calculateEventExpGain(eventCategory, isVictory, specialization, trainerBond);
  if (typeBonusPercent > 0) {
    baseExpAwarded = Math.round(baseExpAwarded * (1 + typeBonusPercent / 100));
  }

  // Find team level metrics
  const highestLevel = team.length > 0 ? Math.max(...team.map(m => m.level || 5)) : 5;

  const updatedTeam = team.map((mon, index) => {
    const currentLvl = mon.level || 5;
    const currentMaxExp = mon.maxExp || calculateMaxExpForLevel(currentLvl);
    let currentExp = mon.exp || 0;

    let expGainForMon = baseExpAwarded;

    // Leader Ace Bonus (Slot #1) gets +20% EXP for leading
    if (index === 0) {
      expGainForMon = Math.round(expGainForMon * 1.20);
    } else if (mon.isStarter) {
      expGainForMon = Math.round(expGainForMon * 1.10);
    }

    // Underdog Catch-Up Bonus: If Pokemon is 3+ levels behind highest team level, grant scaling catch-up EXP
    const levelDeficit = highestLevel - currentLvl;
    if (levelDeficit >= 3) {
      const catchUpMultiplier = 1 + Math.min(0.85, levelDeficit * 0.15);
      expGainForMon = Math.round(expGainForMon * catchUpMultiplier);
    }

    currentExp += expGainForMon;

    let newLevel = currentLvl;
    let newMaxExp = currentMaxExp;
    let didLevelUp = false;
    const monIVs = mon.ivs || generateRandomIVs();
    let oldStats = mon.stats || calculatePokemonStats(currentLvl, mon.stage || 1, mon.species || mon.name, monIVs);

    // Check level up loop
    while (currentExp >= newMaxExp && newLevel < 100) {
      currentExp -= newMaxExp;
      newLevel += 1;
      didLevelUp = true;
      newMaxExp = calculateMaxExpForLevel(newLevel);
    }

    let newSpecies = mon.species || mon.name;
    let newName = mon.name;
    let newStage = mon.stage || 1;
    let newType = mon.type;
    let newSpriteUrl = mon.spriteUrl;
    let didEvolve = false;

    // Check evolution rule
    const rule = EVOLUTION_RULES.find(
      r => r.fromSpecies.toLowerCase() === newSpecies.toLowerCase() && newLevel >= r.minLevel
    );

    if (rule) {
      const evoMatch = findPokemonByName(rule.toSpecies);
      if (evoMatch) {
        if (newName.toLowerCase() === newSpecies.toLowerCase()) {
          newName = evoMatch.name;
        }
        newSpecies = evoMatch.name;
        newStage += 1;
        newType = evoMatch.types.join(' / ');
        newSpriteUrl = evoMatch.sprite;
        didEvolve = true;

        evolutionNotices.push(`¡${mon.name} ha evolucionado en ${evoMatch.name}! (Nvl. ${newLevel})`);
      }
    }

    const newStats = calculatePokemonStats(newLevel, newStage, newSpecies, monIVs);
    const statGain = {
      hp: newStats.hp - oldStats.hp,
      attack: newStats.attack - oldStats.attack,
      defense: newStats.defense - oldStats.defense,
      speed: newStats.speed - oldStats.speed,
      special: newStats.special - oldStats.special,
    };

    if (didLevelUp) {
      levelUpNotices.push(`${newName} subió al Nvl. ${newLevel} (+${statGain.hp} PS, +${statGain.attack} ATK)`);
    }

    const newMoves = getPokemonMoves(newSpecies, newLevel, newType);

    memberGains.push({
      id: mon.id,
      name: newName,
      species: newSpecies,
      oldLevel: currentLvl,
      newLevel: newLevel,
      expGained: expGainForMon,
      currentExp,
      maxExp: newMaxExp,
      didLevelUp,
      didEvolve,
      newSpecies: didEvolve ? newSpecies : undefined,
      spriteUrl: newSpriteUrl,
      statGain
    });

    return {
      ...mon,
      ivs: monIVs,
      level: newLevel,
      exp: currentExp,
      maxExp: newMaxExp,
      stats: newStats,
      moves: newMoves,
      name: newName,
      species: newSpecies,
      stage: newStage,
      type: newType,
      spriteUrl: newSpriteUrl
    };
  });

  const expSummary: TeamExpSummary = {
    baseExp: baseExpAwarded,
    totalExpGained: memberGains.reduce((acc, m) => acc + m.expGained, 0),
    levelUps: levelUpNotices,
    evolutions: evolutionNotices,
    memberGains
  };

  return { updatedTeam, evolutionNotices, expSummary };
}

/**
 * Normalizes and balances a Pokémon reward so that it is appropriate for the player's current team level.
 * Prevents giving high-level or over-evolved Pokémon (e.g. Arbok level 21 when team is level 8).
 */
export function normalizePokemonReward(
  reward: Omit<PokemonMember, 'id'>,
  teamAvgLvl: number
): Omit<PokemonMember, 'id'> {
  const avgLvl = Math.max(5, teamAvgLvl || 5);

  // 1. Calculate balanced target level
  // Allow at most +2 levels over team average for normal Pokémon, +4 for legendaries
  const maxLvlDelta = reward.isLegendary ? 4 : 2;
  const maxAllowed = avgLvl + maxLvlDelta;
  const minAllowed = Math.max(5, avgLvl - 2);

  const originalLvl = reward.level || avgLvl;
  const targetLvl = Math.min(maxAllowed, Math.max(minAllowed, originalLvl));

  // 2. Check if species needs to be de-evolved because targetLvl is below evolution minLevel
  let currentSpecies = reward.species || reward.name;
  let currentStage = reward.stage || 1;

  while (true) {
    const evoRule = EVOLUTION_RULES.find(
      r => r.toSpecies.toLowerCase() === currentSpecies.toLowerCase()
    );
    if (evoRule && targetLvl < evoRule.minLevel) {
      currentSpecies = evoRule.fromSpecies;
      currentStage = Math.max(1, currentStage - 1);
    } else {
      break;
    }
  }

  const kantoMatch = findPokemonByName(currentSpecies);
  const finalType = kantoMatch ? kantoMatch.types.join(' / ') : (reward.type || 'Normal');
  const finalSprite = kantoMatch ? kantoMatch.sprite : reward.spriteUrl;

  let finalName = reward.name;
  // If species was de-evolved, update the displayed name to the base species name
  if (currentSpecies.toLowerCase() !== (reward.species || reward.name).toLowerCase()) {
    finalName = currentSpecies;
  }

  const finalIVs = reward.ivs || generateRandomIVs();

  return {
    ...reward,
    ivs: finalIVs,
    name: finalName,
    species: currentSpecies,
    level: targetLvl,
    stage: currentStage,
    type: finalType,
    spriteUrl: finalSprite,
    maxExp: calculateMaxExpForLevel(targetLvl),
    stats: calculatePokemonStats(targetLvl, currentStage, currentSpecies, finalIVs),
    moves: getPokemonMoves(currentSpecies, targetLvl, finalType)
  };
}

export function evolvePokemonWithStone(member: PokemonMember, stoneItemId: string): PokemonMember {
  let targetSpecies = '';
  const current = member.species || member.name;

  if (stoneItemId === 'fire-stone') {
    if (current === 'Eevee') targetSpecies = 'Flareon';
    if (current === 'Growlithe') targetSpecies = 'Arcanine';
    if (current === 'Vulpix') targetSpecies = 'Ninetales';
  } else if (stoneItemId === 'water-stone') {
    if (current === 'Eevee') targetSpecies = 'Vaporeon';
    if (current === 'Poliwhirl') targetSpecies = 'Poliwrath';
    if (current === 'Staryu') targetSpecies = 'Starmie';
    if (current === 'Shellder') targetSpecies = 'Cloyster';
  } else if (stoneItemId === 'thunder-stone') {
    if (current === 'Pikachu') targetSpecies = 'Raichu';
    if (current === 'Eevee') targetSpecies = 'Jolteon';
  } else if (stoneItemId === 'leaf-stone') {
    if (current === 'Bellsprout' || current === 'Weepinbell') targetSpecies = 'Victreebel';
    if (current === 'Gloom' || current === 'Oddish') targetSpecies = 'Vileplume';
    if (current === 'Exeggcute') targetSpecies = 'Exeggutor';
  } else if (stoneItemId === 'moon-stone') {
    if (current === 'Nidoran♂' || current === 'Nidorino') targetSpecies = 'Nidoking';
    if (current === 'Nidorina' || current === 'Nidoran♀') targetSpecies = 'Nidoqueen';
    if (current === 'Jigglypuff') targetSpecies = 'Wigglytuff';
    if (current === 'Clefairy') targetSpecies = 'Clefable';
  }

  if (!targetSpecies) return member;

  const kantoMatch = findPokemonByName(targetSpecies);
  const nextStage = Math.min(3, (member.stage || 1) + 1);
  const newLvl = Math.max(member.level, member.level + 2);
  const monIVs = member.ivs || generateRandomIVs();

  return {
    ...member,
    ivs: monIVs,
    name: targetSpecies,
    species: targetSpecies,
    stage: nextStage,
    level: newLvl,
    type: kantoMatch ? kantoMatch.types.join(' / ') : member.type,
    spriteUrl: kantoMatch ? kantoMatch.sprite : member.spriteUrl,
    stats: calculatePokemonStats(newLvl, nextStage, targetSpecies, monIVs),
    moves: getPokemonMoves(targetSpecies, newLvl, kantoMatch ? kantoMatch.types.join(' / ') : member.type)
  };
}

