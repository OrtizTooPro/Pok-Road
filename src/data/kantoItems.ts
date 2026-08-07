import { TrainerStats, PokemonMember } from '../types';

export type ItemCategory = 'POKEBALL' | 'MEDICINE' | 'STONE' | 'VITAMIN' | 'UTILITY';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  price: number;
  spriteUrl: string;
  iconEmoji: string;
  minAge: number;
  effectType: 'RESTORE_STAMINA' | 'HEAL_FULL' | 'EVOLVE_POKEMON' | 'STAT_BOOST' | 'CAPTURE_BONUS' | 'TEAM_BOND';
  effectValue: number;
  statTarget?: keyof TrainerStats;
  eligibleSpecies?: string[]; // E.g., ['Eevee', 'Pikachu', 'Growlithe', 'Bellsprout', 'Weepinbell', 'Poliwhirl', 'Staryu', 'Nidoran♂', 'Jigglypuff']
}

export const KANTO_ITEMS: ShopItem[] = [
  // --- POKÉBALLS ---
  {
    id: 'poke-ball',
    name: 'Poké Ball',
    description: 'Cápsula básica y confiable para capturar Pokémon salvajes durante tus exploraciones.',
    category: 'POKEBALL',
    price: 200,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
    iconEmoji: '🔴',
    minAge: 10,
    effectType: 'CAPTURE_BONUS',
    effectValue: 15
  },
  {
    id: 'great-ball',
    name: 'Super Ball',
    description: 'Cápsula de alto rendimiento con una tasa de captura superior a la Poké Ball estándar.',
    category: 'POKEBALL',
    price: 600,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png',
    iconEmoji: '🔵',
    minAge: 13,
    effectType: 'CAPTURE_BONUS',
    effectValue: 30
  },
  {
    id: 'ultra-ball',
    name: 'Ultra Ball',
    description: 'Cápsula de nivel ultra con una tasa de captura excelente para Pokémon raros y legendarios.',
    category: 'POKEBALL',
    price: 1200,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png',
    iconEmoji: '🟡',
    minAge: 17,
    effectType: 'CAPTURE_BONUS',
    effectValue: 50
  },

  // --- MEDICINAS Y RESTAURADORES ---
  {
    id: 'potion',
    name: 'Poción',
    description: 'Restaura 25 puntos de Resistencia (Estamina) recuperando las fuerzas para continuar.',
    category: 'MEDICINE',
    price: 200,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png',
    iconEmoji: '🧪',
    minAge: 10,
    effectType: 'RESTORE_STAMINA',
    effectValue: 25,
    statTarget: 'stamina'
  },
  {
    id: 'super-potion',
    name: 'Superpoción',
    description: 'Restaura 60 puntos de Resistencia (Estamina) revitalizando a tu equipo rápidamente.',
    category: 'MEDICINE',
    price: 700,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-potion.png',
    iconEmoji: '💊',
    minAge: 13,
    effectType: 'RESTORE_STAMINA',
    effectValue: 60,
    statTarget: 'stamina'
  },
  {
    id: 'hyper-potion',
    name: 'Hiperpoción',
    description: 'Restaura 100 puntos de Resistencia (Estamina) dejando a tu equipo listo para combates duros.',
    category: 'MEDICINE',
    price: 1200,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hyper-potion.png',
    iconEmoji: '🩹',
    minAge: 16,
    effectType: 'RESTORE_STAMINA',
    effectValue: 100,
    statTarget: 'stamina'
  },
  {
    id: 'max-potion',
    name: 'Máx. Poción',
    description: 'Restaura por completo toda la Resistencia del entrenador y cura las heridas del equipo.',
    category: 'MEDICINE',
    price: 2500,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-potion.png',
    iconEmoji: '✨',
    minAge: 20,
    effectType: 'HEAL_FULL',
    effectValue: 100,
    statTarget: 'stamina'
  },
  {
    id: 'full-restore',
    name: 'Restaurar Todo',
    description: 'Restaura la salud al máximo y elimina todos los problemas de estado de todo tu equipo.',
    category: 'MEDICINE',
    price: 3000,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/full-restore.png',
    iconEmoji: '💖',
    minAge: 22,
    effectType: 'HEAL_FULL',
    effectValue: 100,
    statTarget: 'stamina'
  },
  {
    id: 'antidote',
    name: 'Antídoto',
    description: 'Cura el envenenamiento y reconforta la salud de tus Pokémon.',
    category: 'MEDICINE',
    price: 100,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/antidote.png',
    iconEmoji: '🧪',
    minAge: 10,
    effectType: 'RESTORE_STAMINA',
    effectValue: 15,
    statTarget: 'stamina'
  },
  {
    id: 'full-heal',
    name: 'Cura Total',
    description: 'Cura cualquier problema de estado alterado y refuerza el Vínculo con tus Pokémon.',
    category: 'MEDICINE',
    price: 600,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/full-heal.png',
    iconEmoji: '🌟',
    minAge: 14,
    effectType: 'TEAM_BOND',
    effectValue: 4,
    statTarget: 'bond'
  },
  {
    id: 'revive',
    name: 'Revivir',
    description: 'Revive a un Pokémon debilitado devuélvele la energía necesaria para volver al combate.',
    category: 'MEDICINE',
    price: 1500,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png',
    iconEmoji: '💛',
    minAge: 15,
    effectType: 'RESTORE_STAMINA',
    effectValue: 50,
    statTarget: 'stamina'
  },

  // --- PIEDRAS EVOLUTIVAS ---
  {
    id: 'fire-stone',
    name: 'Piedra Fuego',
    description: 'Cálida gema roja. Evoluciona de inmediato a Pokémon compatibles como Eevee o Growlithe.',
    category: 'STONE',
    price: 2100,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fire-stone.png',
    iconEmoji: '🔥',
    minAge: 14,
    effectType: 'EVOLVE_POKEMON',
    effectValue: 1,
    eligibleSpecies: ['Eevee', 'Growlithe', 'Vulpix']
  },
  {
    id: 'water-stone',
    name: 'Piedra Agua',
    description: 'Transparente gema azul. Evoluciona a Pokémon compatibles como Eevee, Staryu o Poliwhirl.',
    category: 'STONE',
    price: 2100,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/water-stone.png',
    iconEmoji: '💧',
    minAge: 14,
    effectType: 'EVOLVE_POKEMON',
    effectValue: 1,
    eligibleSpecies: ['Eevee', 'Staryu', 'Poliwhirl', 'Shellder']
  },
  {
    id: 'thunder-stone',
    name: 'Piedra Trueno',
    description: 'Gema amarilla con un dibujo de rayo. Evoluciona a Pokémon como Pikachu o Eevee.',
    category: 'STONE',
    price: 2100,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png',
    iconEmoji: '⚡',
    minAge: 14,
    effectType: 'EVOLVE_POKEMON',
    effectValue: 1,
    eligibleSpecies: ['Pikachu', 'Eevee']
  },
  {
    id: 'leaf-stone',
    name: 'Piedra Hoja',
    description: 'Gema verde con dibujo de hoja. Evoluciona a Pokémon como Bellsprout, Gloom o Exeggcute.',
    category: 'STONE',
    price: 2100,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leaf-stone.png',
    iconEmoji: '🍃',
    minAge: 14,
    effectType: 'EVOLVE_POKEMON',
    effectValue: 1,
    eligibleSpecies: ['Bellsprout', 'Weepinbell', 'Gloom', 'Exeggcute']
  },
  {
    id: 'moon-stone',
    name: 'Piedra Lunar',
    description: 'Mística piedra negra. Evoluciona a Pokémon como Nidoran♂, Jigglypuff, Clefairy o Nidorina.',
    category: 'STONE',
    price: 3000,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-stone.png',
    iconEmoji: '🌙',
    minAge: 16,
    effectType: 'EVOLVE_POKEMON',
    effectValue: 1,
    eligibleSpecies: ['Nidoran♂', 'Jigglypuff', 'Clefairy', 'Nidorino', 'Nidorina']
  },

  // --- VITAMINAS Y POTENCIADORES ---
  {
    id: 'hp-up',
    name: 'Más HP',
    description: 'Vitamina nutritiva que aumenta en +25 la Resistencia máxima del entrenador.',
    category: 'VITAMIN',
    price: 9800,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hp-up.png',
    iconEmoji: '❤️',
    minAge: 18,
    effectType: 'STAT_BOOST',
    effectValue: 25,
    statTarget: 'stamina'
  },
  {
    id: 'protein',
    name: 'Proteínas',
    description: 'Suplemento nutricional que aumenta en +6 la Habilidad de combate táctico.',
    category: 'VITAMIN',
    price: 9800,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/protein.png',
    iconEmoji: '💪',
    minAge: 18,
    effectType: 'STAT_BOOST',
    effectValue: 6,
    statTarget: 'skill'
  },
  {
    id: 'carbos',
    name: 'Carburante',
    description: 'Tónico energético que aumenta en +5 la Popularidad y agilidad del entrenador.',
    category: 'VITAMIN',
    price: 9800,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/carbos.png',
    iconEmoji: '⚡',
    minAge: 18,
    effectType: 'STAT_BOOST',
    effectValue: 5,
    statTarget: 'reputation'
  },
  {
    id: 'pp-up',
    name: 'Más PP',
    description: 'Aumenta en +6 el Vínculo especial y maestría táctica con tu equipo.',
    category: 'VITAMIN',
    price: 9800,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pp-up.png',
    iconEmoji: '🔮',
    minAge: 20,
    effectType: 'STAT_BOOST',
    effectValue: 6,
    statTarget: 'bond'
  },

  // --- UTENSILIOS Y EXPLORACIÓN ---
  {
    id: 'escape-rope',
    name: 'Cuerda Huida',
    description: 'Cuerda resistente para salir velozmente de cuevas y evitar el cansancio (+20 Estamina).',
    category: 'UTILITY',
    price: 550,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/escape-rope.png',
    iconEmoji: '🪢',
    minAge: 11,
    effectType: 'RESTORE_STAMINA',
    effectValue: 20,
    statTarget: 'stamina'
  },
  {
    id: 'max-repel',
    name: 'Máx. Repelente',
    description: 'Aerosol de máxima eficacia que previene emboscadas y mantiene con energía a tu equipo.',
    category: 'UTILITY',
    price: 700,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-repel.png',
    iconEmoji: '🌫️',
    minAge: 15,
    effectType: 'RESTORE_STAMINA',
    effectValue: 25,
    statTarget: 'stamina'
  }
];

export function getItemById(id: string): ShopItem | undefined {
  return KANTO_ITEMS.find(item => item.id === id);
}

/**
  Check if a location or event description matches a city, town, or merchant context.
 */
export function checkShopAvailability(
  location?: string,
  eventTitle?: string,
  eventDescription?: string
): { isAvailable: boolean; shopName: string; isDepartmentStore: boolean; isIndigoPlateau: boolean } {
  const loc = (location || '').toLowerCase();
  const title = (eventTitle || '').toLowerCase();
  const desc = (eventDescription || '').toLowerCase();
  const combined = `${loc} ${title} ${desc}`;

  // Check Indigo Plateau
  if (combined.includes('meseta añil') || combined.includes('liga pokémon') || combined.includes('liga pokemon')) {
    return {
      isAvailable: true,
      shopName: 'Pokétienda de la Meseta Añil (Liga Pokémon)',
      isDepartmentStore: false,
      isIndigoPlateau: true
    };
  }

  // Check Celadon Department Store
  if (combined.includes('azulona') && (combined.includes('centro comercial') || combined.includes('departamento') || combined.includes('gran tienda'))) {
    return {
      isAvailable: true,
      shopName: 'Centro Comercial de Ciudad Azulona',
      isDepartmentStore: true,
      isIndigoPlateau: false
    };
  }

  // Check Cities and Towns
  const cityKeywords = ['ciudad', 'pueblo', 'isla', 'centro comercial', 'silph', 'pokétienda', 'pokemart', 'bazar'];
  const merchantKeywords = ['mercader', 'tienda', 'comercial', 'vendedor', 'vendedora', 'comprar', 'supermercado', 'tiendas', 'comerciante'];

  const isCityMatch = cityKeywords.some(k => combined.includes(k));
  const isMerchantMatch = merchantKeywords.some(k => combined.includes(k));

  if (isCityMatch || isMerchantMatch) {
    let name = 'Pokétienda de Kanto';
    if (location) {
      if (loc.includes('pueblo') || loc.includes('ciudad') || loc.includes('isla')) {
        name = `Pokétienda de ${location}`;
      } else if (isMerchantMatch) {
        name = `Mercader Ambulante (${location})`;
      }
    } else if (isMerchantMatch) {
      name = 'Mercader Ambulante de la Ruta';
    }

    return {
      isAvailable: true,
      shopName: name,
      isDepartmentStore: loc.includes('azulona'),
      isIndigoPlateau: false
    };
  }

  return {
    isAvailable: false,
    shopName: 'Sin Pokétienda cercana',
    isDepartmentStore: false,
    isIndigoPlateau: false
  };
}

/**
 * Filter shop items based on trainer age, location, and shop type.
 */
export function getShopStockForEvent(
  currentAge: number,
  location?: string,
  eventTitle?: string,
  eventDescription?: string
): ShopItem[] {
  const shopInfo = checkShopAvailability(location, eventTitle, eventDescription);
  if (!shopInfo.isAvailable) return [];

  return KANTO_ITEMS.filter(item => {
    // Celadon Department Store or Indigo Plateau unlock advanced items regardless of strict age
    if (shopInfo.isDepartmentStore || shopInfo.isIndigoPlateau) {
      return true;
    }
    // Standard stock filtered by age progression
    return item.minAge <= currentAge;
  });
}
