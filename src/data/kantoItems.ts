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
  catchRatio?: number; // Ratio oficial de captura (1.0, 1.5, 2.0, 3.5, 255.0)
  statTarget?: keyof TrainerStats;
  eligibleSpecies?: string[]; // E.g., ['Eevee', 'Pikachu', 'Growlithe', 'Bellsprout', 'Weepinbell', 'Poliwhirl', 'Staryu', 'Nidoran♂', 'Jigglypuff']
  discountPercent?: number;
  originalPrice?: number;
  isFeatured?: boolean;
  eventNote?: string;
}

export const KANTO_ITEMS: ShopItem[] = [
  // --- POKÉBALLS ---
  {
    id: 'poke-ball',
    name: 'Poké Ball',
    description: 'Cápsula básica y confiable para capturar Pokémon salvajes (Ratio 1.0x).',
    category: 'POKEBALL',
    price: 200,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
    iconEmoji: '🔴',
    minAge: 10,
    effectType: 'CAPTURE_BONUS',
    effectValue: 15,
    catchRatio: 1.0
  },
  {
    id: 'great-ball',
    name: 'Super Ball',
    description: 'Cápsula de alto rendimiento con una tasa de captura del 150% superior a la Poké Ball (Ratio 1.5x).',
    category: 'POKEBALL',
    price: 600,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png',
    iconEmoji: '🔵',
    minAge: 12,
    effectType: 'CAPTURE_BONUS',
    effectValue: 30,
    catchRatio: 1.5
  },
  {
    id: 'ultra-ball',
    name: 'Ultra Ball',
    description: 'Cápsula de nivel ultra con doble eficacia de captura para Pokémon raros y legendarios (Ratio 2.0x).',
    category: 'POKEBALL',
    price: 1200,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png',
    iconEmoji: '🟡',
    minAge: 16,
    effectType: 'CAPTURE_BONUS',
    effectValue: 50,
    catchRatio: 2.0
  },
  {
    id: 'dusk-ball',
    name: 'Ocaso Ball',
    description: 'Cápsula nocturna con máxima eficacia al explorar cuevas o encontrarse con tipos Fantasma/Siniestro (Ratio 3.5x).',
    category: 'POKEBALL',
    price: 1000,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dusk-ball.png',
    iconEmoji: '🌙',
    minAge: 15,
    effectType: 'CAPTURE_BONUS',
    effectValue: 60,
    catchRatio: 3.5
  },
  {
    id: 'quick-ball',
    name: 'Veloz Ball',
    description: 'Cápsula de reacción inmediata. Si se usa en el primer turno de un encuentro, tiene un multiplicador de ratio de ×5.0 (×1.0 en turnos posteriores).',
    category: 'POKEBALL',
    price: 1000,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/quick-ball.png',
    iconEmoji: '⚡',
    minAge: 14,
    effectType: 'CAPTURE_BONUS',
    effectValue: 70,
    catchRatio: 5.0
  },
  {
    id: 'master-ball',
    name: 'Master Ball',
    description: 'La cápsula definitiva de Silph Co. Garantiza una captura del 100% infalible sin importar la especie (Ratio 255.0x). Objeto único e inalcanzable en tiendas.',
    category: 'POKEBALL',
    price: 0,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png',
    iconEmoji: '🟣',
    minAge: 99,
    effectType: 'CAPTURE_BONUS',
    effectValue: 100,
    catchRatio: 255.0
  },

  // --- MEDICINAS Y RESTAURADORES ---
  {
    id: 'potion',
    name: 'Poción',
    description: 'Restaura 25 pts de Resistencia y reduce la Fatiga del Equipo en -30%.',
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
    description: 'Restaura 60 pts de Resistencia y reduce la Fatiga del Equipo en -60%.',
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
    description: 'Restaura 100 pts de Resistencia y reduce la Fatiga del Equipo en -90%.',
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
    description: 'Restaura por completo toda la Resistencia y elimina toda la Fatiga del Equipo (0%).',
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
    description: 'Restaura la salud al máximo y elimina toda la Fatiga del Equipo al instante (0%).',
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
    description: 'Cura el envenenamiento y reduce la Fatiga del Equipo en -15%.',
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
    description: 'Cura cualquier estado alterado, refuerza Vínculo y reduce Fatiga en -25%.',
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
    description: 'Revive Pokémon debilitados y recupera la mitad de la Fatiga (-50%).',
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
 * Check if a location, title, or event description matches a Pokemon Center, Inn, or Camp context.
 */
export function checkPokemonCenterAvailability(
  location?: string,
  eventTitle?: string,
  eventDescription?: string
): { isAvailable: boolean; centerName: string } {
  const loc = (location || '').toLowerCase();
  const title = (eventTitle || '').toLowerCase();
  const desc = (eventDescription || '').toLowerCase();
  const combined = `${loc} ${title} ${desc}`;

  let name = 'Centro Pokémon y Puesto de Curación';
  if (location) {
    if (loc.includes('pueblo') || loc.includes('ciudad') || loc.includes('isla')) {
      name = `Centro Pokémon de ${location}`;
    } else {
      name = `Puesto de Enfermería (${location})`;
    }
  }

  return { isAvailable: true, centerName: name };
}

/**
 * Check if a location, title, or event description matches a city, town, farm, or merchant NPC context.
 */
export function checkShopAvailability(
  location?: string,
  eventTitle?: string,
  eventDescription?: string
): { isAvailable: boolean; shopName: string; isDepartmentStore: boolean; isIndigoPlateau: boolean; shopTypeTag?: string } {
  const loc = (location || '').toLowerCase();
  const title = (eventTitle || '').toLowerCase();
  const desc = (eventDescription || '').toLowerCase();
  const combined = `${loc} ${title} ${desc}`;

  // Check Indigo Plateau / League
  if (combined.includes('meseta añil') || combined.includes('liga pokémon') || combined.includes('liga pokemon')) {
    return {
      isAvailable: true,
      shopName: 'Pokétienda de la Meseta Añil (Liga Pokémon)',
      isDepartmentStore: false,
      isIndigoPlateau: true,
      shopTypeTag: 'LIGA'
    };
  }

  // Check Celadon Department Store
  if (combined.includes('azulona') && (combined.includes('centro comercial') || combined.includes('departamento') || combined.includes('gran tienda') || combined.includes('tienda grande'))) {
    return {
      isAvailable: true,
      shopName: 'Centro Comercial de Ciudad Azulona',
      isDepartmentStore: true,
      isIndigoPlateau: false,
      shopTypeTag: 'DEPARTAMENTAL'
    };
  }

  // Check Cities, Towns, Islands, Ports
  const cityKeywords = [
    'ciudad', 'pueblo', 'isla', 'centro comercial', 'silph', 'pokétienda', 
    'pokemart', 'bazar', 'asentamiento', 'puerto', 'villa', 'metrópoli'
  ];

  // Check Farms, Ranches, Countryside
  const farmKeywords = [
    'granja', 'rancho', 'establo', 'finca', 'huerto', 'agrícola', 'vacas', 'miltank', 'ponita'
  ];

  // Check Merchant NPCs and Vendors
  const merchantKeywords = [
    'mercader', 'tienda', 'comercial', 'vendedor', 'vendedora', 'comprar', 'comerciante', 
    'tendero', 'tendera', 'geólogo', 'boticario', 'boticaria', 'arbolista', 'pescador', 
    'enfermera', 'feriante', 'sanador', 'viajero', 'ambulante', 'buhonero', 'curandero',
    'curandera', 'puesto', 'supermercado', 'tiendas', 'almacén', 'cantina', 'posada', 
    'feria', 'subasta', 'víveres', 'provisiones', 'abastecer', 'abastecerte', 'adquirir'
  ];

  const isCityMatch = cityKeywords.some(k => combined.includes(k));
  const isFarmMatch = farmKeywords.some(k => combined.includes(k));
  const isMerchantMatch = merchantKeywords.some(k => combined.includes(k));

  if (isCityMatch || isFarmMatch || isMerchantMatch) {
    let name = 'Pokétienda de Kanto';
    let tag = 'ESTÁNDAR';

    if (isFarmMatch) {
      name = location ? `Puesto Rural y Granja de ${location}` : 'Puesto Agrícola y Granja';
      tag = 'GRANJA';
    } else if (isMerchantMatch && !isCityMatch) {
      name = location ? `Mercader Ambulante (${location})` : 'Mercader Viajero de la Ruta';
      tag = 'MERCADER';
    } else if (location) {
      if (loc.includes('pueblo') || loc.includes('ciudad') || loc.includes('isla')) {
        name = `Pokétienda de ${location}`;
        tag = 'CIUDAD';
      } else {
        name = `Puesto Comercial (${location})`;
        tag = 'COMERCIO';
      }
    }

    return {
      isAvailable: true,
      shopName: name,
      isDepartmentStore: loc.includes('azulona'),
      isIndigoPlateau: false,
      shopTypeTag: tag
    };
  }

  return {
    isAvailable: false,
    shopName: 'Sin Pokétienda o Mercader cercano',
    isDepartmentStore: false,
    isIndigoPlateau: false
  };
}

/**
 * Filter and dynamically restock shop items for each event moment.
 * Stock is renewed and balanced for the current level/age and location context.
 */
export function getShopStockForEvent(
  currentAge: number,
  location?: string,
  eventTitle?: string,
  eventDescription?: string,
  eventId?: string
): ShopItem[] {
  const shopInfo = checkShopAvailability(location, eventTitle, eventDescription);
  if (!shopInfo.isAvailable) return [];

  const loc = (location || '').toLowerCase();
  const title = (eventTitle || '').toLowerCase();
  const desc = (eventDescription || '').toLowerCase();
  const combined = `${loc} ${title} ${desc}`;

  // Deterministic seed based on event to keep stock stable during the event, but restocked on new events
  const seedString = `${eventId || title}-${currentAge}-${loc}`;
  let seed = 0;
  for (let i = 0; i < seedString.length; i++) {
    seed = (seed << 5) - seed + seedString.charCodeAt(i);
    seed |= 0;
  }
  const pseudoRandom = (offset: number) => {
    const x = Math.sin(Math.abs(seed) + offset) * 10000;
    return x - Math.floor(x);
  };

  // Filter items appropriate for this event shop type
  let stockPool: ShopItem[] = [];

  if (shopInfo.isDepartmentStore || shopInfo.isIndigoPlateau) {
    // Department store or League has full comprehensive stock
    stockPool = KANTO_ITEMS.map(i => ({ ...i }));
  } else {
    // Contextual stock building
    stockPool = KANTO_ITEMS.filter(item => {
      // Basic consumables are always stocked
      if (['poke-ball', 'potion', 'antidote'].includes(item.id)) return true;

      // Mid-tier unlocked by age or merchant
      if (item.minAge <= currentAge) return true;

      // Contextual unlocks regardless of strict minAge:
      // Geologist / Mountain / Cave events -> Evolution Stones & Escape Rope
      if ((combined.includes('geólogo') || combined.includes('cueva') || combined.includes('roca') || combined.includes('fósil') || combined.includes('montaña')) && (item.category === 'STONE' || item.id === 'escape-rope' || item.id === 'dusk-ball')) {
        return true;
      }

      // Farm / Countryside -> Leaf stone, Potions, Vitamins
      if ((shopInfo.shopTypeTag === 'GRANJA' || combined.includes('granja') || combined.includes('rancho')) && (item.id === 'leaf-stone' || item.id === 'super-potion' || item.category === 'VITAMIN')) {
        return true;
      }

      // Coastal / Fishing -> Water Stone & Quick Ball
      if ((combined.includes('pesca') || combined.includes('mar') || combined.includes('lago') || combined.includes('río') || combined.includes('isla')) && (item.id === 'water-stone' || item.id === 'quick-ball')) {
        return true;
      }

      return false;
    }).map(i => ({ ...i }));
  }

  // Master Ball can NEVER be purchased in any shop
  stockPool = stockPool.filter(item => item.id !== 'master-ball');

  // Restock & Offer Generation: Apply 1-2 special event discounts (15% to 25% off)
  if (stockPool.length > 0) {
    const discountIndex1 = Math.floor(pseudoRandom(1) * stockPool.length);
    const discountIndex2 = Math.floor(pseudoRandom(2) * stockPool.length);

    stockPool = stockPool.map((item, idx) => {
      if (idx === discountIndex1 || (idx === discountIndex2 && discountIndex2 !== discountIndex1)) {
        const discountPct = Math.floor(15 + pseudoRandom(idx + 10) * 11); // 15% - 25%
        const discountedPrice = Math.max(10, Math.round((item.price * (100 - discountPct)) / 100));
        return {
          ...item,
          originalPrice: item.price,
          price: discountedPrice,
          discountPercent: discountPct,
          isFeatured: true,
          eventNote: `🔥 ¡Oferta de Evento (-${discountPct}%)!`
        };
      }
      return item;
    });
  }

  return stockPool;
}
