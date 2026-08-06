import { GameEvent, TrainerSpecialization, PokemonMember } from '../types';
import { GAME_EVENTS, CHAINED_EVENTS, BRANCHING_EVENTS, EXPANDED_REGIONAL_EVENTS, MASTER_PROTOCOL_EVENTS } from '../data/eventsData';
import { KANTO_POKEDEX } from '../data/kantoPokedex';
import { EVOLUTION_RULES } from './pokemonEvolution';
import { getRouteForAge, getRandomEncounterForRoute } from '../data/kantoRoutes';

/**
 * All base non-chained events
 */
export const ALL_BASE_EVENTS: GameEvent[] = [
  ...GAME_EVENTS,
  ...BRANCHING_EVENTS,
  ...EXPANDED_REGIONAL_EVENTS,
  ...MASTER_PROTOCOL_EVENTS
];

export const ALL_GAME_EVENTS_CATALOG: GameEvent[] = [
  ...ALL_BASE_EVENTS,
  ...CHAINED_EVENTS
];

/**
 * Helper to shuffle array randomly (Fisher-Yates)
 */
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Helper to pick random item from an array
 */
function randomPick<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Helper to get a random integer in range [min, max]
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Weather & Environmental modifiers
 */
const WEATHER_CONDITIONS = [
  { name: 'Bajo Sol Radiante', icon: '☀️', bonus: 'Fuego/Planta' },
  { name: 'Bajo Lluvia Torrencial', icon: '🌧️', bonus: 'Agua/Eléctrico' },
  { name: 'En Tormenta de Arena', icon: '🌪️', bonus: 'Roca/Tierra' },
  { name: 'Bajo la Niebla del Alba', icon: '🌫️', bonus: 'Fantasma/Psíquico' },
  { name: 'En la Brisa Marina', icon: '🌊', bonus: 'Agua/Volador' }
];

const RIVAL_NAMES = [
  'Rival Azul (Gary)',
  'Silver (El Rival Sombrío)',
  'Koga (El Discípulo Ninja)',
  'Lass Green (La Entrenadora Táctica)',
  'Falkner (El Especialista Aéreo)'
];

/**
 * Generate dynamic wild encounter event procedurally
 */
function createProceduralWildEvent(idSuffix: string, age: number): GameEvent {
  const route = getRouteForAge(age);
  const encounter = getRandomEncounterForRoute(route);
  const chosenPkm = encounter.pokemon;
  const level = encounter.level;
  const weather = randomPick(WEATHER_CONDITIONS);
  const typesStr = chosenPkm.types.join(' / ');

  const pkMember: Omit<PokemonMember, 'id'> = {
    name: chosenPkm.name,
    species: chosenPkm.name,
    type: typesStr,
    level,
    stage: age <= 12 ? 1 : (level >= 36 ? 3 : level >= 18 ? 2 : 1),
    spriteUrl: chosenPkm.sprite
  };

  return {
    id: `proc-wild-${idSuffix}-${Date.now()}-${randomInt(100, 999)}`,
    title: `Encuentro Salvaje en ${route.name}: ${chosenPkm.name} ${weather.icon}`,
    category: 'WILD_ENCOUNTER',
    age,
    location: route.name,
    description: `Mientras avanzas por ${route.name} ${weather.name.toLowerCase()}, entre los matorrales aparece un ${chosenPkm.name} salvaje de nivel ${pkMember.level} (${typesStr}) en su hábitat oficial.`,
    options: [
      {
        id: `opt-proc-${idSuffix}-a`,
        text: `Intentar capturar a ${chosenPkm.name} en ${route.name}.`,
        outcomeText: `¡Lanzas la Pokéball con precisión! ${chosenPkm.name} de nivel ${level} se une a tu equipo.`,
        statEffects: { skill: randomInt(6, 12), bond: randomInt(4, 10), legendaryScoreDelta: 3 },
        addPokemon: pkMember,
        isVictory: true
      },
      {
        id: `opt-proc-${idSuffix}-b`,
        text: `Estudiar los patrones de combate de ${chosenPkm.name} en esta ruta y continuar.`,
        outcomeText: `Analizas su comportamiento salvaje en ${route.name} y consigues valiosos apuntes para tu guía de viaje.`,
        statEffects: { skill: randomInt(10, 18), money: randomInt(400, 1200) }
      }
    ]
  };
}

/**
 * Generate dynamic rival event procedurally
 */
function createProceduralRivalEvent(idSuffix: string, age: number): GameEvent {
  const rivalName = randomPick(RIVAL_NAMES);
  const prizeMoney = age * 250 + randomInt(200, 1000);

  return {
    id: `proc-rival-${idSuffix}-${Date.now()}-${randomInt(100, 999)}`,
    title: `Duelo de Rivalidad con ${rivalName}`,
    category: 'RIVAL_MATCH',
    age,
    location: `Paso de Ruta ${randomInt(5, 18)}`,
    description: `${rivalName} aparece interrumpiendo tu trayecto con una amplia sonrisa desafiante: "¡He estado entrenando duro en las colinas! ¡Veamos si tu equipo está a la altura de mis nuevas tácticas!"`,
    options: [
      {
        id: `opt-rival-${idSuffix}-a`,
        text: 'Aceptar el duelo frontalmente con tu mejor formación.',
        outcomeText: '¡Combate intenso! Tras un intercambio de movimientos deslumbrante, logras la victoria sobre tu rival.',
        statEffects: { skill: randomInt(12, 20), reputation: randomInt(10, 18), money: prizeMoney, legendaryScoreDelta: 5 },
        isVictory: true
      },
      {
        id: `opt-rival-${idSuffix}-b`,
        text: 'Proponer una batalla de exhibición enfocada en el trabajo en equipo.',
        outcomeText: 'Tu rival queda maravillado por la armonía y sincronización de tu equipo Pokémon.',
        statEffects: { bond: randomInt(15, 25), reputation: randomInt(12, 20) }
      }
    ]
  };
}

/**
 * Generate dynamic specialization milestone procedurally
 */
function createProceduralSpecEvent(idSuffix: string, age: number, spec: TrainerSpecialization): GameEvent {
  const specTitles: Record<TrainerSpecialization, string[]> = {
    Combate: ['Torneo de Maestros del Puño', 'Desafío del Dojo de Combate Intenso', 'Simposio de Tácticas Ofensivas'],
    Captura: ['Expedición a la Reserva Ecológica Secreta', 'Maratón de Rastreo de Huellas Raras', 'Certamen de Dominio de PokéBalls'],
    Crianza: ['Convención de Nutrición y Bayas Exóticas', 'Certificado del Gremio de Crianza', 'Encuentro de Cuidados y Vínculo Afín'],
    Estrategia: ['Seminario de Análisis de Tipos e Impacto', 'Torneo Táctico del Gran Tablero', 'Desafío de la Mente Entrenadora']
  };

  const title = randomPick(specTitles[spec] || specTitles['Combate']);

  return {
    id: `proc-spec-${idSuffix}-${Date.now()}-${randomInt(100, 999)}`,
    title: `Hito de Especialidad: ${title}`,
    category: 'LIFESTYLE',
    age,
    location: `Centro de Desarrollo de Kanto`,
    description: `A tus ${age} años, tu dedicación a la especialidad de ${spec} llama la atención de los mejores mentores de la región, abriéndote puertas exclusivas.`,
    options: [
      {
        id: `opt-spec-${idSuffix}-a`,
        text: `Aplicar tus conocimientos avanzados de ${spec} al máximo.`,
        outcomeText: `Destacas bruscamente entre los participantes. Los mentores reconocen tu destreza superior.`,
        statEffects: { skill: 15, reputation: 15, money: 2000, legendaryScoreDelta: 4 },
        specializationRequirement: spec,
        specializationBonusText: `Especialidad ${spec}`
      },
      {
        id: `opt-spec-${idSuffix}-b`,
        text: `Compartir tus técnicas con jóvenes aspirantes.`,
        outcomeText: `Te ganas el respeto y cariño de la comunidad de entrenadores de Kanto.`,
        statEffects: { bond: 20, reputation: 18 }
      }
    ]
  };
}

/**
 * Generates a unique, randomized, and completely non-repetitive adventure sequence for a new game session.
 * Ensures that no two runs ever share the same exact sequence or event properties.
 */
export function generateRandomAdventure(
  spec: TrainerSpecialization,
  starterId: string
): GameEvent[] {
  // 1. Group static events by age buckets
  const age10_11 = ALL_BASE_EVENTS.filter(e => !e.isChainedOnly && e.age >= 10 && e.age <= 11);
  const age12_13 = ALL_BASE_EVENTS.filter(e => !e.isChainedOnly && e.age >= 12 && e.age <= 13);
  const age14_15 = ALL_BASE_EVENTS.filter(e => !e.isChainedOnly && e.age >= 14 && e.age <= 15);
  const age16_17 = ALL_BASE_EVENTS.filter(e => !e.isChainedOnly && e.age >= 16 && e.age <= 17);
  const age18_20 = ALL_BASE_EVENTS.filter(e => !e.isChainedOnly && e.age >= 18);

  const processAgePool = (events: GameEvent[], ageValue: number, maxOptionalCount: number): GameEvent[] => {
    const mandatory = events.filter(e => e.category === 'GYM_BATTLE' || e.category === 'LEAGUE_TOURNAMENT' || e.id.startsWith('event-fork'));
    const optional = events.filter(e => e.category !== 'GYM_BATTLE' && e.category !== 'LEAGUE_TOURNAMENT' && !e.id.startsWith('event-fork'));

    // Randomly pick static optional events
    const sampledOptional = shuffle(optional).slice(0, maxOptionalCount);

    // Inject procedurally generated unique events for this specific run
    const procWild = createProceduralWildEvent(`age${ageValue}`, ageValue);
    const procRival = createProceduralRivalEvent(`age${ageValue}`, ageValue);
    const procSpec = createProceduralSpecEvent(`age${ageValue}`, ageValue, spec);

    // Combine mandatory, sampled optional, and procedural events
    const pool = [...mandatory, ...sampledOptional, procWild, procRival, procSpec];

    // Shuffle non-mandatory order within age block
    const sortedPool = pool.sort((a, b) => {
      if (a.category === 'GYM_BATTLE' && b.category !== 'GYM_BATTLE') return 1;
      if (b.category === 'GYM_BATTLE' && a.category !== 'GYM_BATTLE') return -1;
      return 0;
    });

    return sortedPool;
  };

  const pool1 = processAgePool(age10_11, 10, 2);
  const pool2 = processAgePool(age12_13, 12, 2);
  const pool3 = processAgePool(age14_15, 14, 2);
  const pool4 = processAgePool(age16_17, 16, 2);
  const pool5 = processAgePool(age18_20, 18, 3);

  const rawSequence = [...pool1, ...pool2, ...pool3, ...pool4, ...pool5];

  // Guarantee uniqueness of IDs in sequence
  const seenIds = new Set<string>();
  const finalSequence: GameEvent[] = [];

  for (const ev of rawSequence) {
    if (!seenIds.has(ev.id)) {
      seenIds.add(ev.id);
      finalSequence.push(ev);
    }
  }

  // Ensure strict chronological age order (Age 10 first, then 11, 12, etc.)
  finalSequence.sort((a, b) => {
    if (a.age !== b.age) return a.age - b.age;
    if (a.category === 'GYM_BATTLE' && b.category !== 'GYM_BATTLE') return 1;
    if (b.category === 'GYM_BATTLE' && a.category !== 'GYM_BATTLE') return -1;
    return 0;
  });

  return finalSequence;
}
