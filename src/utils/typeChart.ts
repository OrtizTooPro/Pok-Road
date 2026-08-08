import { PokemonMember, GameEvent } from '../types';

export type PokemonType = 
  | 'Acero'
  | 'Agua'
  | 'Bicho'
  | 'Dragón'
  | 'Eléctrico'
  | 'Fantasma'
  | 'Fuego'
  | 'Hada'
  | 'Hielo'
  | 'Lucha'
  | 'Normal'
  | 'Planta'
  | 'Psíquico'
  | 'Roca'
  | 'Siniestro'
  | 'Tierra'
  | 'Veneno'
  | 'Volador';

// Official Matrix of attacker vs defender type effectiveness
// Key: AttackerType -> DefenderType -> Multiplier (0, 0.5, 1, 2)
const TYPE_MATRIX: Record<string, Record<string, number>> = {
  Acero: {
    Hada: 2.0, Hielo: 2.0, Roca: 2.0,
    Acero: 0.5, Agua: 0.5, Eléctrico: 0.5, Fuego: 0.5
  },
  Agua: {
    Fuego: 2.0, Roca: 2.0, Tierra: 2.0,
    Agua: 0.5, Dragón: 0.5, Planta: 0.5
  },
  Bicho: {
    Planta: 2.0, Psíquico: 2.0, Siniestro: 2.0,
    Acero: 0.5, Fantasma: 0.5, Fuego: 0.5, Hada: 0.5, Lucha: 0.5, Veneno: 0.5, Volador: 0.5
  },
  Dragón: {
    Dragón: 2.0,
    Acero: 0.5,
    Hada: 0.0
  },
  Eléctrico: {
    Agua: 2.0, Volador: 2.0,
    Dragón: 0.5, Eléctrico: 0.5, Planta: 0.5,
    Tierra: 0.0
  },
  Fantasma: {
    Fantasma: 2.0, Psíquico: 2.0,
    Siniestro: 0.5,
    Normal: 0.0
  },
  Fuego: {
    Acero: 2.0, Bicho: 2.0, Hielo: 2.0, Planta: 2.0,
    Agua: 0.5, Dragón: 0.5, Fuego: 0.5, Roca: 0.5
  },
  Hada: {
    Dragón: 2.0, Lucha: 2.0, Siniestro: 2.0,
    Acero: 0.5, Fuego: 0.5, Veneno: 0.5
  },
  Hielo: {
    Dragón: 2.0, Planta: 2.0, Tierra: 2.0, Volador: 2.0,
    Acero: 0.5, Agua: 0.5, Fuego: 0.5, Hielo: 0.5
  },
  Lucha: {
    Acero: 2.0, Hielo: 2.0, Normal: 2.0, Roca: 2.0, Siniestro: 2.0,
    Bicho: 0.5, Hada: 0.5, Psíquico: 0.5, Veneno: 0.5, Volador: 0.5,
    Fantasma: 0.0
  },
  Normal: {
    Acero: 0.5, Roca: 0.5,
    Fantasma: 0.0
  },
  Planta: {
    Agua: 2.0, Roca: 2.0, Tierra: 2.0,
    Acero: 0.5, Bicho: 0.5, Dragón: 0.5, Fuego: 0.5, Planta: 0.5, Veneno: 0.5, Volador: 0.5
  },
  Psíquico: {
    Lucha: 2.0, Veneno: 2.0,
    Acero: 0.5, Psíquico: 0.5,
    Siniestro: 0.0
  },
  Roca: {
    Bicho: 2.0, Fuego: 2.0, Hielo: 2.0, Volador: 2.0,
    Acero: 0.5, Lucha: 0.5, Tierra: 0.5
  },
  Siniestro: {
    Fantasma: 2.0, Psíquico: 2.0,
    Hada: 0.5, Lucha: 0.5, Siniestro: 0.5
  },
  Tierra: {
    Acero: 2.0, Eléctrico: 2.0, Fuego: 2.0, Roca: 2.0, Veneno: 2.0,
    Bicho: 0.5, Planta: 0.5,
    Volador: 0.0
  },
  Veneno: {
    Hada: 2.0, Planta: 2.0,
    Fantasma: 0.5, Roca: 0.5, Tierra: 0.5, Veneno: 0.5,
    Acero: 0.0
  },
  Volador: {
    Bicho: 2.0, Lucha: 2.0, Planta: 2.0,
    Acero: 0.5, Eléctrico: 0.5, Roca: 0.5
  }
};

/**
 * Normalizes a raw type string (e.g., "Fuego / Volador" -> ["Fuego", "Volador"])
 */
export function parseTypes(typeStr: string): string[] {
  if (!typeStr) return ['Normal'];
  return typeStr
    .split(/[\s/,\-+]+/)
    .map(t => t.trim())
    .filter(Boolean)
    .map(t => {
      // Normalize to remove accents so "Eléctrico" matches "electr", "Dragón" matches "dragon", etc.
      const clean = t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (clean.includes('fuego')) return 'Fuego';
      if (clean.includes('agua')) return 'Agua';
      if (clean.includes('planta')) return 'Planta';
      if (clean.includes('electr') || clean.includes('elect')) return 'Eléctrico';
      if (clean.includes('hielo')) return 'Hielo';
      if (clean.includes('lucha')) return 'Lucha';
      if (clean.includes('veneno')) return 'Veneno';
      if (clean.includes('tierra')) return 'Tierra';
      if (clean.includes('volador')) return 'Volador';
      if (clean.includes('psiq') || clean.includes('psic')) return 'Psíquico';
      if (clean.includes('bicho')) return 'Bicho';
      if (clean.includes('roca')) return 'Roca';
      if (clean.includes('fantasma')) return 'Fantasma';
      if (clean.includes('dragon')) return 'Dragón';
      if (clean.includes('acero')) return 'Acero';
      if (clean.includes('siniestro')) return 'Siniestro';
      if (clean.includes('hada')) return 'Hada';
      return 'Normal';
    });
}

/**
 * Calculates offensive multiplier of attacker type(s) against defender type(s)
 */
export function getTypeEffectivenessMultiplier(attackerTypeStr: string, defenderTypeStr: string): number {
  const attackers = parseTypes(attackerTypeStr);
  const defenders = parseTypes(defenderTypeStr);

  let maxMultiplier = 1.0;

  for (const atk of attackers) {
    let atkMultiplier = 1.0;
    for (const def of defenders) {
      const mult = TYPE_MATRIX[atk]?.[def] ?? 1.0;
      atkMultiplier *= mult;
    }
    if (atkMultiplier > maxMultiplier || maxMultiplier === 1.0) {
      maxMultiplier = atkMultiplier;
    }
  }

  return maxMultiplier;
}

/**
 * Returns weaknesses (> 1.0x damage received) and resistances (< 1.0x damage received) for a given Pokemon type
 */
export function getWeaknessesAndResistances(typeStr: string): {
  weaknesses: string[];
  resistances: string[];
  immunities: string[];
} {
  const defenderTypes = parseTypes(typeStr);
  const allTypes: string[] = [
    'Acero', 'Agua', 'Bicho', 'Dragón', 'Eléctrico', 'Fantasma',
    'Fuego', 'Hada', 'Hielo', 'Lucha', 'Normal', 'Planta',
    'Psíquico', 'Roca', 'Siniestro', 'Tierra', 'Veneno', 'Volador'
  ];

  const weaknesses: string[] = [];
  const resistances: string[] = [];
  const immunities: string[] = [];

  for (const atk of allTypes) {
    let totalMult = 1.0;
    for (const def of defenderTypes) {
      const mult = TYPE_MATRIX[atk]?.[def] ?? 1.0;
      totalMult *= mult;
    }

    if (totalMult === 0) {
      immunities.push(atk);
    } else if (totalMult > 1.0) {
      weaknesses.push(atk);
    } else if (totalMult < 1.0) {
      resistances.push(atk);
    }
  }

  return { weaknesses, resistances, immunities };
}

/**
 * Returns offensive effectiveness (superEffective, notEffective, noEffect) for a given attacker type
 */
export function getOffensiveEffectiveness(typeStr: string): {
  superEffective: string[];
  notEffective: string[];
  noEffect: string[];
} {
  const allTypes: string[] = [
    'Acero', 'Agua', 'Bicho', 'Dragón', 'Eléctrico', 'Fantasma',
    'Fuego', 'Hada', 'Hielo', 'Lucha', 'Normal', 'Planta',
    'Psíquico', 'Roca', 'Siniestro', 'Tierra', 'Veneno', 'Volador'
  ];

  const superEffective: string[] = [];
  const notEffective: string[] = [];
  const noEffect: string[] = [];

  for (const def of allTypes) {
    const mult = getTypeEffectivenessMultiplier(typeStr, def);
    if (mult >= 2.0) {
      superEffective.push(def);
    } else if (mult === 0) {
      noEffect.push(def);
    } else if (mult < 1.0) {
      notEffective.push(def);
    }
  }

  return { superEffective, notEffective, noEffect };
}

/**
 * Infers opponent element/type from event metadata
 */
export function inferEventOpponentType(event: GameEvent): string {
  const title = event.title.toLowerCase();
  const desc = event.description.toLowerCase();
  const badgeId = event.badgeId?.toLowerCase() || '';

  // Gym Leaders
  if (badgeId.includes('roca') || badgeId.includes('boulder') || title.includes('brock') || desc.includes('brock')) return 'Roca';
  if (badgeId.includes('cascada') || badgeId.includes('cascade') || title.includes('misty') || desc.includes('misty')) return 'Agua';
  if (badgeId.includes('trueno') || badgeId.includes('thunder') || title.includes('surge') || desc.includes('surge')) return 'Eléctrico';
  if (badgeId.includes('arcoiris') || badgeId.includes('rainbow') || title.includes('erika') || desc.includes('erika')) return 'Planta';
  if (badgeId.includes('alma') || badgeId.includes('soul') || title.includes('koga') || desc.includes('koga')) return 'Veneno';
  if (badgeId.includes('pantano') || badgeId.includes('marsh') || title.includes('sabrina') || desc.includes('sabrina')) return 'Psíquico';
  if (badgeId.includes('volcan') || badgeId.includes('volcano') || title.includes('blaine') || desc.includes('blaine')) return 'Fuego';
  if (badgeId.includes('tierra') || badgeId.includes('earth') || title.includes('giovanni') || desc.includes('giovanni')) return 'Tierra';

  // Elite Four
  if (title.includes('lorelei') || desc.includes('lorelei')) return 'Hielo';
  if (title.includes('bruno') || desc.includes('bruno')) return 'Lucha';
  if (title.includes('agatha') || desc.includes('agatha')) return 'Fantasma';
  if (title.includes('lance') || desc.includes('lance')) return 'Dragón';

  // Specific Legendaries / Pokemon keywords
  if (title.includes('zapdos') || desc.includes('zapdos') || desc.includes('central eléctrica')) return 'Eléctrico';
  if (title.includes('articuno') || desc.includes('articuno') || desc.includes('islas espuma')) return 'Hielo';
  if (title.includes('moltres') || desc.includes('moltres') || desc.includes('venera fuego')) return 'Fuego';
  if (title.includes('mewtwo') || desc.includes('mewtwo') || title.includes('mew')) return 'Psíquico';
  if (title.includes('snorlax') || desc.includes('snorlax')) return 'Normal';
  if (title.includes('gyarados') || desc.includes('lago')) return 'Agua';
  if (title.includes('charizard') || desc.includes('llamas')) return 'Fuego';
  if (title.includes('onix') || desc.includes('rocas')) return 'Roca';
  if (title.includes('gengar') || desc.includes('torre pokémon') || desc.includes('fantasmas')) return 'Fantasma';
  if (title.includes('team rocket') || desc.includes('guarida rocket') || desc.includes('rocket')) return 'Veneno';

  if (event.category === 'GYM_BATTLE') return 'Roca';
  if (event.category === 'VILLAIN_TEAM') return 'Veneno';
  if (event.category === 'LEAGUE_TOURNAMENT') return 'Dragón';
  if (event.category === 'WILD_ENCOUNTER') return 'Planta';

  return 'Normal';
}

export interface MatchupEvaluation {
  opponentType: string;
  offensiveMultiplier: number;
  defensiveMultiplier: number;
  netScore: number; // > 1 advantageous, < 1 disadvantageous
  label: string;
  badgeBg: string;
  badgeText: string;
  effectDescription: string;
  skillBonus: number;
  expBonusPercent: number;
}

/**
 * Evaluates Leader Pokemon advantage against current Event Opponent
 */
export function evaluateLeaderMatchup(leaderMon: PokemonMember | undefined, event: GameEvent): MatchupEvaluation {
  if (!leaderMon) {
    return {
      opponentType: 'Normal',
      offensiveMultiplier: 1.0,
      defensiveMultiplier: 1.0,
      netScore: 1.0,
      label: 'NEUTRAL',
      badgeBg: 'bg-gray-100 border-gray-600',
      badgeText: 'text-gray-800',
      effectDescription: 'Sin líder asignado.',
      skillBonus: 0,
      expBonusPercent: 0
    };
  }

  const opponentType = inferEventOpponentType(event);
  const leaderType = leaderMon.type;

  const offensiveMult = getTypeEffectivenessMultiplier(leaderType, opponentType);
  const defensiveMult = getTypeEffectivenessMultiplier(opponentType, leaderType);

  // Net score: high offensive and low defensive multiplier is best
  let netScore = offensiveMult;
  if (defensiveMult === 0) netScore += 0.5;
  else if (defensiveMult < 1.0) netScore += 0.25;
  else if (defensiveMult > 1.0) netScore -= 0.25;

  let label = 'NEUTRAL';
  let badgeBg = 'bg-gray-100 border-gray-600';
  let badgeText = 'text-gray-800';
  let effectDescription = `Tu Líder ${leaderMon.name} (${leaderType}) tiene un enfrentamiento equilibrado contra el rival (${opponentType}).`;
  let skillBonus = 0;
  let expBonusPercent = 0;

  if (offensiveMult >= 2.0 && defensiveMult <= 0.5) {
    label = '⚡ SÚPER EFECTIVO (VENTAJA TOTAL)';
    badgeBg = 'bg-emerald-100 border-emerald-600';
    badgeText = 'text-emerald-900';
    effectDescription = `¡DOMINIO DE TIPO! ${leaderMon.name} (${leaderType}) inflige daño Súper Efectivo (x${offensiveMult}) contra rivales de tipo ${opponentType} y resiste sus ataques. (+20% Prob. Victoria, +25% EXP)`;
    skillBonus = 18;
    expBonusPercent = 25;
  } else if (offensiveMult >= 2.0) {
    label = '🔥 VENTAJOSO (VENTAJA ATAQUE)';
    badgeBg = 'bg-emerald-50 border-emerald-500';
    badgeText = 'text-emerald-800';
    effectDescription = `¡VENTAJA OFENSIVA! ${leaderMon.name} (${leaderType}) inflige daño Súper Efectivo (x${offensiveMult}) contra rivales de tipo ${opponentType}. (+12% Prob. Victoria, +15% EXP)`;
    skillBonus = 12;
    expBonusPercent = 15;
  } else if (defensiveMult <= 0.5) {
    label = '🛡️ RESISTENCIA DE TIPO';
    badgeBg = 'bg-blue-100 border-blue-600';
    badgeText = 'text-blue-900';
    effectDescription = `¡DEFENSA ROBUSTA! ${leaderMon.name} (${leaderType}) reduce el daño recibido de tipo ${opponentType}. (+10% Prob. Victoria, +10% EXP)`;
    skillBonus = 10;
    expBonusPercent = 10;
  } else if (offensiveMult <= 0.5 || defensiveMult >= 2.0) {
    label = '⚠️ DESVENTAJA DE TIPO';
    badgeBg = 'bg-amber-100 border-amber-600';
    badgeText = 'text-amber-900';
    effectDescription = `¡CUIDADO! ${leaderMon.name} (${leaderType}) tiene desventaja de tipo frente a ataques de ${opponentType}. (-8% Prob. Victoria)`;
    skillBonus = -8;
    expBonusPercent = 0;
  }

  return {
    opponentType,
    offensiveMultiplier: offensiveMult,
    defensiveMultiplier: defensiveMult,
    netScore,
    label,
    badgeBg,
    badgeText,
    effectDescription,
    skillBonus,
    expBonusPercent
  };
}
