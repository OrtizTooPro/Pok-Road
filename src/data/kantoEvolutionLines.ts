import { getPokemonSprite } from './kantoPokedex';

export interface EvolutionStep {
  id: number;
  name: string;
  sprite: string;
  methodToReach?: string; // e.g. "Nivel 16", "Piedra Fuego", "Intercambio", "Piedra Agua"
}

export interface EvolutionFamily {
  baseId: number;
  steps: EvolutionStep[];
  // For branching evolutions like Eevee
  branches?: {
    id: number;
    name: string;
    sprite: string;
    methodToReach: string;
  }[];
}

// Complete mapping for all 151 Kanto Pokémon evolution chains (Gen 1 Official)
export const KANTO_EVOLUTION_CHAINS: Record<number, EvolutionFamily> = {
  // 1-3: Bulbasaur
  1: { baseId: 1, steps: [{ id: 1, name: 'Bulbasaur', sprite: getPokemonSprite(1) }, { id: 2, name: 'Ivysaur', sprite: getPokemonSprite(2), methodToReach: 'Nivel 16' }, { id: 3, name: 'Venusaur', sprite: getPokemonSprite(3), methodToReach: 'Nivel 32' }] },
  2: { baseId: 1, steps: [{ id: 1, name: 'Bulbasaur', sprite: getPokemonSprite(1) }, { id: 2, name: 'Ivysaur', sprite: getPokemonSprite(2), methodToReach: 'Nivel 16' }, { id: 3, name: 'Venusaur', sprite: getPokemonSprite(3), methodToReach: 'Nivel 32' }] },
  3: { baseId: 1, steps: [{ id: 1, name: 'Bulbasaur', sprite: getPokemonSprite(1) }, { id: 2, name: 'Ivysaur', sprite: getPokemonSprite(2), methodToReach: 'Nivel 16' }, { id: 3, name: 'Venusaur', sprite: getPokemonSprite(3), methodToReach: 'Nivel 32' }] },

  // 4-6: Charmander
  4: { baseId: 4, steps: [{ id: 4, name: 'Charmander', sprite: getPokemonSprite(4) }, { id: 5, name: 'Charmeleon', sprite: getPokemonSprite(5), methodToReach: 'Nivel 16' }, { id: 6, name: 'Charizard', sprite: getPokemonSprite(6), methodToReach: 'Nivel 36' }] },
  5: { baseId: 4, steps: [{ id: 4, name: 'Charmander', sprite: getPokemonSprite(4) }, { id: 5, name: 'Charmeleon', sprite: getPokemonSprite(5), methodToReach: 'Nivel 16' }, { id: 6, name: 'Charizard', sprite: getPokemonSprite(6), methodToReach: 'Nivel 36' }] },
  6: { baseId: 4, steps: [{ id: 4, name: 'Charmander', sprite: getPokemonSprite(4) }, { id: 5, name: 'Charmeleon', sprite: getPokemonSprite(5), methodToReach: 'Nivel 16' }, { id: 6, name: 'Charizard', sprite: getPokemonSprite(6), methodToReach: 'Nivel 36' }] },

  // 7-9: Squirtle
  7: { baseId: 7, steps: [{ id: 7, name: 'Squirtle', sprite: getPokemonSprite(7) }, { id: 8, name: 'Wartortle', sprite: getPokemonSprite(8), methodToReach: 'Nivel 16' }, { id: 9, name: 'Blastoise', sprite: getPokemonSprite(9), methodToReach: 'Nivel 36' }] },
  8: { baseId: 7, steps: [{ id: 7, name: 'Squirtle', sprite: getPokemonSprite(7) }, { id: 8, name: 'Wartortle', sprite: getPokemonSprite(8), methodToReach: 'Nivel 16' }, { id: 9, name: 'Blastoise', sprite: getPokemonSprite(9), methodToReach: 'Nivel 36' }] },
  9: { baseId: 7, steps: [{ id: 7, name: 'Squirtle', sprite: getPokemonSprite(7) }, { id: 8, name: 'Wartortle', sprite: getPokemonSprite(8), methodToReach: 'Nivel 16' }, { id: 9, name: 'Blastoise', sprite: getPokemonSprite(9), methodToReach: 'Nivel 36' }] },

  // 10-12: Caterpie
  10: { baseId: 10, steps: [{ id: 10, name: 'Caterpie', sprite: getPokemonSprite(10) }, { id: 11, name: 'Metapod', sprite: getPokemonSprite(11), methodToReach: 'Nivel 7' }, { id: 12, name: 'Butterfree', sprite: getPokemonSprite(12), methodToReach: 'Nivel 10' }] },
  11: { baseId: 10, steps: [{ id: 10, name: 'Caterpie', sprite: getPokemonSprite(10) }, { id: 11, name: 'Metapod', sprite: getPokemonSprite(11), methodToReach: 'Nivel 7' }, { id: 12, name: 'Butterfree', sprite: getPokemonSprite(12), methodToReach: 'Nivel 10' }] },
  12: { baseId: 10, steps: [{ id: 10, name: 'Caterpie', sprite: getPokemonSprite(10) }, { id: 11, name: 'Metapod', sprite: getPokemonSprite(11), methodToReach: 'Nivel 7' }, { id: 12, name: 'Butterfree', sprite: getPokemonSprite(12), methodToReach: 'Nivel 10' }] },

  // 13-15: Weedle
  13: { baseId: 13, steps: [{ id: 13, name: 'Weedle', sprite: getPokemonSprite(13) }, { id: 14, name: 'Kakuna', sprite: getPokemonSprite(14), methodToReach: 'Nivel 7' }, { id: 15, name: 'Beedrill', sprite: getPokemonSprite(15), methodToReach: 'Nivel 10' }] },
  14: { baseId: 13, steps: [{ id: 13, name: 'Weedle', sprite: getPokemonSprite(13) }, { id: 14, name: 'Kakuna', sprite: getPokemonSprite(14), methodToReach: 'Nivel 7' }, { id: 15, name: 'Beedrill', sprite: getPokemonSprite(15), methodToReach: 'Nivel 10' }] },
  15: { baseId: 13, steps: [{ id: 13, name: 'Weedle', sprite: getPokemonSprite(13) }, { id: 14, name: 'Kakuna', sprite: getPokemonSprite(14), methodToReach: 'Nivel 7' }, { id: 15, name: 'Beedrill', sprite: getPokemonSprite(15), methodToReach: 'Nivel 10' }] },

  // 16-18: Pidgey
  16: { baseId: 16, steps: [{ id: 16, name: 'Pidgey', sprite: getPokemonSprite(16) }, { id: 17, name: 'Pidgeotto', sprite: getPokemonSprite(17), methodToReach: 'Nivel 18' }, { id: 18, name: 'Pidgeot', sprite: getPokemonSprite(18), methodToReach: 'Nivel 36' }] },
  17: { baseId: 16, steps: [{ id: 16, name: 'Pidgey', sprite: getPokemonSprite(16) }, { id: 17, name: 'Pidgeotto', sprite: getPokemonSprite(17), methodToReach: 'Nivel 18' }, { id: 18, name: 'Pidgeot', sprite: getPokemonSprite(18), methodToReach: 'Nivel 36' }] },
  18: { baseId: 16, steps: [{ id: 16, name: 'Pidgey', sprite: getPokemonSprite(16) }, { id: 17, name: 'Pidgeotto', sprite: getPokemonSprite(17), methodToReach: 'Nivel 18' }, { id: 18, name: 'Pidgeot', sprite: getPokemonSprite(18), methodToReach: 'Nivel 36' }] },

  // 19-20: Rattata
  19: { baseId: 19, steps: [{ id: 19, name: 'Rattata', sprite: getPokemonSprite(19) }, { id: 20, name: 'Raticate', sprite: getPokemonSprite(20), methodToReach: 'Nivel 20' }] },
  20: { baseId: 19, steps: [{ id: 19, name: 'Rattata', sprite: getPokemonSprite(19) }, { id: 20, name: 'Raticate', sprite: getPokemonSprite(20), methodToReach: 'Nivel 20' }] },

  // 21-22: Spearow
  21: { baseId: 21, steps: [{ id: 21, name: 'Spearow', sprite: getPokemonSprite(21) }, { id: 22, name: 'Fearow', sprite: getPokemonSprite(22), methodToReach: 'Nivel 20' }] },
  22: { baseId: 21, steps: [{ id: 21, name: 'Spearow', sprite: getPokemonSprite(21) }, { id: 22, name: 'Fearow', sprite: getPokemonSprite(22), methodToReach: 'Nivel 20' }] },

  // 23-24: Ekans
  23: { baseId: 23, steps: [{ id: 23, name: 'Ekans', sprite: getPokemonSprite(23) }, { id: 24, name: 'Arbok', sprite: getPokemonSprite(24), methodToReach: 'Nivel 22' }] },
  24: { baseId: 23, steps: [{ id: 23, name: 'Ekans', sprite: getPokemonSprite(23) }, { id: 24, name: 'Arbok', sprite: getPokemonSprite(24), methodToReach: 'Nivel 22' }] },

  // 25-26: Pikachu
  25: { baseId: 25, steps: [{ id: 25, name: 'Pikachu', sprite: getPokemonSprite(25) }, { id: 26, name: 'Raichu', sprite: getPokemonSprite(26), methodToReach: 'Piedra Trueno' }] },
  26: { baseId: 25, steps: [{ id: 25, name: 'Pikachu', sprite: getPokemonSprite(25) }, { id: 26, name: 'Raichu', sprite: getPokemonSprite(26), methodToReach: 'Piedra Trueno' }] },

  // 27-28: Sandshrew
  27: { baseId: 27, steps: [{ id: 27, name: 'Sandshrew', sprite: getPokemonSprite(27) }, { id: 28, name: 'Sandslash', sprite: getPokemonSprite(28), methodToReach: 'Nivel 22' }] },
  28: { baseId: 27, steps: [{ id: 27, name: 'Sandshrew', sprite: getPokemonSprite(27) }, { id: 28, name: 'Sandslash', sprite: getPokemonSprite(28), methodToReach: 'Nivel 22' }] },

  // 29-31: Nidoran♀
  29: { baseId: 29, steps: [{ id: 29, name: 'Nidoran♀', sprite: getPokemonSprite(29) }, { id: 30, name: 'Nidorina', sprite: getPokemonSprite(30), methodToReach: 'Nivel 16' }, { id: 31, name: 'Nidoqueen', sprite: getPokemonSprite(31), methodToReach: 'Piedra Lunar' }] },
  30: { baseId: 29, steps: [{ id: 29, name: 'Nidoran♀', sprite: getPokemonSprite(29) }, { id: 30, name: 'Nidorina', sprite: getPokemonSprite(30), methodToReach: 'Nivel 16' }, { id: 31, name: 'Nidoqueen', sprite: getPokemonSprite(31), methodToReach: 'Piedra Lunar' }] },
  31: { baseId: 29, steps: [{ id: 29, name: 'Nidoran♀', sprite: getPokemonSprite(29) }, { id: 30, name: 'Nidorina', sprite: getPokemonSprite(30), methodToReach: 'Nivel 16' }, { id: 31, name: 'Nidoqueen', sprite: getPokemonSprite(31), methodToReach: 'Piedra Lunar' }] },

  // 32-34: Nidoran♂
  32: { baseId: 32, steps: [{ id: 32, name: 'Nidoran♂', sprite: getPokemonSprite(32) }, { id: 33, name: 'Nidorino', sprite: getPokemonSprite(33), methodToReach: 'Nivel 16' }, { id: 34, name: 'Nidoking', sprite: getPokemonSprite(34), methodToReach: 'Piedra Lunar' }] },
  33: { baseId: 32, steps: [{ id: 32, name: 'Nidoran♂', sprite: getPokemonSprite(32) }, { id: 33, name: 'Nidorino', sprite: getPokemonSprite(33), methodToReach: 'Nivel 16' }, { id: 34, name: 'Nidoking', sprite: getPokemonSprite(34), methodToReach: 'Piedra Lunar' }] },
  34: { baseId: 32, steps: [{ id: 32, name: 'Nidoran♂', sprite: getPokemonSprite(32) }, { id: 33, name: 'Nidorino', sprite: getPokemonSprite(33), methodToReach: 'Nivel 16' }, { id: 34, name: 'Nidoking', sprite: getPokemonSprite(34), methodToReach: 'Piedra Lunar' }] },

  // 35-36: Clefairy
  35: { baseId: 35, steps: [{ id: 35, name: 'Clefairy', sprite: getPokemonSprite(35) }, { id: 36, name: 'Clefable', sprite: getPokemonSprite(36), methodToReach: 'Piedra Lunar' }] },
  36: { baseId: 35, steps: [{ id: 35, name: 'Clefairy', sprite: getPokemonSprite(35) }, { id: 36, name: 'Clefable', sprite: getPokemonSprite(36), methodToReach: 'Piedra Lunar' }] },

  // 37-38: Vulpix
  37: { baseId: 37, steps: [{ id: 37, name: 'Vulpix', sprite: getPokemonSprite(37) }, { id: 38, name: 'Ninetales', sprite: getPokemonSprite(38), methodToReach: 'Piedra Fuego' }] },
  38: { baseId: 37, steps: [{ id: 37, name: 'Vulpix', sprite: getPokemonSprite(37) }, { id: 38, name: 'Ninetales', sprite: getPokemonSprite(38), methodToReach: 'Piedra Fuego' }] },

  // 39-40: Jigglypuff
  39: { baseId: 39, steps: [{ id: 39, name: 'Jigglypuff', sprite: getPokemonSprite(39) }, { id: 40, name: 'Wigglytuff', sprite: getPokemonSprite(40), methodToReach: 'Piedra Lunar' }] },
  40: { baseId: 39, steps: [{ id: 39, name: 'Jigglypuff', sprite: getPokemonSprite(39) }, { id: 40, name: 'Wigglytuff', sprite: getPokemonSprite(40), methodToReach: 'Piedra Lunar' }] },

  // 41-42: Zubat
  41: { baseId: 41, steps: [{ id: 41, name: 'Zubat', sprite: getPokemonSprite(41) }, { id: 42, name: 'Golbat', sprite: getPokemonSprite(42), methodToReach: 'Nivel 22' }] },
  42: { baseId: 41, steps: [{ id: 41, name: 'Zubat', sprite: getPokemonSprite(41) }, { id: 42, name: 'Golbat', sprite: getPokemonSprite(42), methodToReach: 'Nivel 22' }] },

  // 43-45: Oddish
  43: { baseId: 43, steps: [{ id: 43, name: 'Oddish', sprite: getPokemonSprite(43) }, { id: 44, name: 'Gloom', sprite: getPokemonSprite(44), methodToReach: 'Nivel 21' }, { id: 45, name: 'Vileplume', sprite: getPokemonSprite(45), methodToReach: 'Piedra Hoja' }] },
  44: { baseId: 43, steps: [{ id: 43, name: 'Oddish', sprite: getPokemonSprite(43) }, { id: 44, name: 'Gloom', sprite: getPokemonSprite(44), methodToReach: 'Nivel 21' }, { id: 45, name: 'Vileplume', sprite: getPokemonSprite(45), methodToReach: 'Piedra Hoja' }] },
  45: { baseId: 43, steps: [{ id: 43, name: 'Oddish', sprite: getPokemonSprite(43) }, { id: 44, name: 'Gloom', sprite: getPokemonSprite(44), methodToReach: 'Nivel 21' }, { id: 45, name: 'Vileplume', sprite: getPokemonSprite(45), methodToReach: 'Piedra Hoja' }] },

  // 46-47: Paras
  46: { baseId: 46, steps: [{ id: 46, name: 'Paras', sprite: getPokemonSprite(46) }, { id: 47, name: 'Parasect', sprite: getPokemonSprite(47), methodToReach: 'Nivel 24' }] },
  47: { baseId: 46, steps: [{ id: 46, name: 'Paras', sprite: getPokemonSprite(46) }, { id: 47, name: 'Parasect', sprite: getPokemonSprite(47), methodToReach: 'Nivel 24' }] },

  // 48-49: Venonat
  48: { baseId: 48, steps: [{ id: 48, name: 'Venonat', sprite: getPokemonSprite(48) }, { id: 49, name: 'Venomoth', sprite: getPokemonSprite(49), methodToReach: 'Nivel 31' }] },
  49: { baseId: 48, steps: [{ id: 48, name: 'Venonat', sprite: getPokemonSprite(48) }, { id: 49, name: 'Venomoth', sprite: getPokemonSprite(49), methodToReach: 'Nivel 31' }] },

  // 50-51: Diglett
  50: { baseId: 50, steps: [{ id: 50, name: 'Diglett', sprite: getPokemonSprite(50) }, { id: 51, name: 'Dugtrio', sprite: getPokemonSprite(51), methodToReach: 'Nivel 26' }] },
  51: { baseId: 50, steps: [{ id: 50, name: 'Diglett', sprite: getPokemonSprite(50) }, { id: 51, name: 'Dugtrio', sprite: getPokemonSprite(51), methodToReach: 'Nivel 26' }] },

  // 52-53: Meowth
  52: { baseId: 52, steps: [{ id: 52, name: 'Meowth', sprite: getPokemonSprite(52) }, { id: 53, name: 'Persian', sprite: getPokemonSprite(53), methodToReach: 'Nivel 28' }] },
  53: { baseId: 52, steps: [{ id: 52, name: 'Meowth', sprite: getPokemonSprite(52) }, { id: 53, name: 'Persian', sprite: getPokemonSprite(53), methodToReach: 'Nivel 28' }] },

  // 54-55: Psyduck
  54: { baseId: 54, steps: [{ id: 54, name: 'Psyduck', sprite: getPokemonSprite(54) }, { id: 55, name: 'Golduck', sprite: getPokemonSprite(55), methodToReach: 'Nivel 33' }] },
  55: { baseId: 54, steps: [{ id: 54, name: 'Psyduck', sprite: getPokemonSprite(54) }, { id: 55, name: 'Golduck', sprite: getPokemonSprite(55), methodToReach: 'Nivel 33' }] },

  // 56-57: Mankey
  56: { baseId: 56, steps: [{ id: 56, name: 'Mankey', sprite: getPokemonSprite(56) }, { id: 57, name: 'Primeape', sprite: getPokemonSprite(57), methodToReach: 'Nivel 28' }] },
  57: { baseId: 56, steps: [{ id: 56, name: 'Mankey', sprite: getPokemonSprite(56) }, { id: 57, name: 'Primeape', sprite: getPokemonSprite(57), methodToReach: 'Nivel 28' }] },

  // 58-59: Growlithe
  58: { baseId: 58, steps: [{ id: 58, name: 'Growlithe', sprite: getPokemonSprite(58) }, { id: 59, name: 'Arcanine', sprite: getPokemonSprite(59), methodToReach: 'Piedra Fuego' }] },
  59: { baseId: 58, steps: [{ id: 58, name: 'Growlithe', sprite: getPokemonSprite(58) }, { id: 59, name: 'Arcanine', sprite: getPokemonSprite(59), methodToReach: 'Piedra Fuego' }] },

  // 60-62: Poliwag
  60: { baseId: 60, steps: [{ id: 60, name: 'Poliwag', sprite: getPokemonSprite(60) }, { id: 61, name: 'Poliwhirl', sprite: getPokemonSprite(61), methodToReach: 'Nivel 25' }, { id: 62, name: 'Poliwrath', sprite: getPokemonSprite(62), methodToReach: 'Piedra Agua' }] },
  61: { baseId: 60, steps: [{ id: 60, name: 'Poliwag', sprite: getPokemonSprite(60) }, { id: 61, name: 'Poliwhirl', sprite: getPokemonSprite(61), methodToReach: 'Nivel 25' }, { id: 62, name: 'Poliwrath', sprite: getPokemonSprite(62), methodToReach: 'Piedra Agua' }] },
  62: { baseId: 60, steps: [{ id: 60, name: 'Poliwag', sprite: getPokemonSprite(60) }, { id: 61, name: 'Poliwhirl', sprite: getPokemonSprite(61), methodToReach: 'Nivel 25' }, { id: 62, name: 'Poliwrath', sprite: getPokemonSprite(62), methodToReach: 'Piedra Agua' }] },

  // 63-65: Abra
  63: { baseId: 63, steps: [{ id: 63, name: 'Abra', sprite: getPokemonSprite(63) }, { id: 64, name: 'Kadabra', sprite: getPokemonSprite(64), methodToReach: 'Nivel 16' }, { id: 65, name: 'Alakazam', sprite: getPokemonSprite(65), methodToReach: 'Intercambio' }] },
  64: { baseId: 63, steps: [{ id: 63, name: 'Abra', sprite: getPokemonSprite(63) }, { id: 64, name: 'Kadabra', sprite: getPokemonSprite(64), methodToReach: 'Nivel 16' }, { id: 65, name: 'Alakazam', sprite: getPokemonSprite(65), methodToReach: 'Intercambio' }] },
  65: { baseId: 63, steps: [{ id: 63, name: 'Abra', sprite: getPokemonSprite(63) }, { id: 64, name: 'Kadabra', sprite: getPokemonSprite(64), methodToReach: 'Nivel 16' }, { id: 65, name: 'Alakazam', sprite: getPokemonSprite(65), methodToReach: 'Intercambio' }] },

  // 66-68: Machop
  66: { baseId: 66, steps: [{ id: 66, name: 'Machop', sprite: getPokemonSprite(66) }, { id: 67, name: 'Machoke', sprite: getPokemonSprite(67), methodToReach: 'Nivel 28' }, { id: 68, name: 'Machamp', sprite: getPokemonSprite(68), methodToReach: 'Intercambio' }] },
  67: { baseId: 66, steps: [{ id: 66, name: 'Machop', sprite: getPokemonSprite(66) }, { id: 67, name: 'Machoke', sprite: getPokemonSprite(67), methodToReach: 'Nivel 28' }, { id: 68, name: 'Machamp', sprite: getPokemonSprite(68), methodToReach: 'Intercambio' }] },
  68: { baseId: 66, steps: [{ id: 66, name: 'Machop', sprite: getPokemonSprite(66) }, { id: 67, name: 'Machoke', sprite: getPokemonSprite(67), methodToReach: 'Nivel 28' }, { id: 68, name: 'Machamp', sprite: getPokemonSprite(68), methodToReach: 'Intercambio' }] },

  // 69-71: Bellsprout
  69: { baseId: 69, steps: [{ id: 69, name: 'Bellsprout', sprite: getPokemonSprite(69) }, { id: 70, name: 'Weepinbell', sprite: getPokemonSprite(70), methodToReach: 'Nivel 21' }, { id: 71, name: 'Victreebel', sprite: getPokemonSprite(71), methodToReach: 'Piedra Hoja' }] },
  70: { baseId: 69, steps: [{ id: 69, name: 'Bellsprout', sprite: getPokemonSprite(69) }, { id: 70, name: 'Weepinbell', sprite: getPokemonSprite(70), methodToReach: 'Nivel 21' }, { id: 71, name: 'Victreebel', sprite: getPokemonSprite(71), methodToReach: 'Piedra Hoja' }] },
  71: { baseId: 69, steps: [{ id: 69, name: 'Bellsprout', sprite: getPokemonSprite(69) }, { id: 70, name: 'Weepinbell', sprite: getPokemonSprite(70), methodToReach: 'Nivel 21' }, { id: 71, name: 'Victreebel', sprite: getPokemonSprite(71), methodToReach: 'Piedra Hoja' }] },

  // 72-73: Tentacool
  72: { baseId: 72, steps: [{ id: 72, name: 'Tentacool', sprite: getPokemonSprite(72) }, { id: 73, name: 'Tentacruel', sprite: getPokemonSprite(73), methodToReach: 'Nivel 30' }] },
  73: { baseId: 72, steps: [{ id: 72, name: 'Tentacool', sprite: getPokemonSprite(72) }, { id: 73, name: 'Tentacruel', sprite: getPokemonSprite(73), methodToReach: 'Nivel 30' }] },

  // 74-76: Geodude
  74: { baseId: 74, steps: [{ id: 74, name: 'Geodude', sprite: getPokemonSprite(74) }, { id: 75, name: 'Graveler', sprite: getPokemonSprite(75), methodToReach: 'Nivel 25' }, { id: 76, name: 'Golem', sprite: getPokemonSprite(76), methodToReach: 'Intercambio' }] },
  75: { baseId: 74, steps: [{ id: 74, name: 'Geodude', sprite: getPokemonSprite(74) }, { id: 75, name: 'Graveler', sprite: getPokemonSprite(75), methodToReach: 'Nivel 25' }, { id: 76, name: 'Golem', sprite: getPokemonSprite(76), methodToReach: 'Intercambio' }] },
  76: { baseId: 74, steps: [{ id: 74, name: 'Geodude', sprite: getPokemonSprite(74) }, { id: 75, name: 'Graveler', sprite: getPokemonSprite(75), methodToReach: 'Nivel 25' }, { id: 76, name: 'Golem', sprite: getPokemonSprite(76), methodToReach: 'Intercambio' }] },

  // 77-78: Ponyta
  77: { baseId: 77, steps: [{ id: 77, name: 'Ponyta', sprite: getPokemonSprite(77) }, { id: 78, name: 'Rapidash', sprite: getPokemonSprite(78), methodToReach: 'Nivel 40' }] },
  78: { baseId: 77, steps: [{ id: 77, name: 'Ponyta', sprite: getPokemonSprite(77) }, { id: 78, name: 'Rapidash', sprite: getPokemonSprite(78), methodToReach: 'Nivel 40' }] },

  // 79-80: Slowpoke
  79: { baseId: 79, steps: [{ id: 79, name: 'Slowpoke', sprite: getPokemonSprite(79) }, { id: 80, name: 'Slowbro', sprite: getPokemonSprite(80), methodToReach: 'Nivel 37' }] },
  80: { baseId: 79, steps: [{ id: 79, name: 'Slowpoke', sprite: getPokemonSprite(79) }, { id: 80, name: 'Slowbro', sprite: getPokemonSprite(80), methodToReach: 'Nivel 37' }] },

  // 81-82: Magnemite
  81: { baseId: 81, steps: [{ id: 81, name: 'Magnemite', sprite: getPokemonSprite(81) }, { id: 82, name: 'Magneton', sprite: getPokemonSprite(82), methodToReach: 'Nivel 30' }] },
  82: { baseId: 81, steps: [{ id: 81, name: 'Magnemite', sprite: getPokemonSprite(81) }, { id: 82, name: 'Magneton', sprite: getPokemonSprite(82), methodToReach: 'Nivel 30' }] },

  // 83: Farfetch'd
  83: { baseId: 83, steps: [{ id: 83, name: "Farfetch'd", sprite: getPokemonSprite(83) }] },

  // 84-85: Doduo
  84: { baseId: 84, steps: [{ id: 84, name: 'Doduo', sprite: getPokemonSprite(84) }, { id: 85, name: 'Dodrio', sprite: getPokemonSprite(85), methodToReach: 'Nivel 31' }] },
  85: { baseId: 84, steps: [{ id: 84, name: 'Doduo', sprite: getPokemonSprite(84) }, { id: 85, name: 'Dodrio', sprite: getPokemonSprite(85), methodToReach: 'Nivel 31' }] },

  // 86-87: Seel
  86: { baseId: 86, steps: [{ id: 86, name: 'Seel', sprite: getPokemonSprite(86) }, { id: 87, name: 'Dewgong', sprite: getPokemonSprite(87), methodToReach: 'Nivel 34' }] },
  87: { baseId: 86, steps: [{ id: 86, name: 'Seel', sprite: getPokemonSprite(86) }, { id: 87, name: 'Dewgong', sprite: getPokemonSprite(87), methodToReach: 'Nivel 34' }] },

  // 88-89: Grimer
  88: { baseId: 88, steps: [{ id: 88, name: 'Grimer', sprite: getPokemonSprite(88) }, { id: 89, name: 'Muk', sprite: getPokemonSprite(89), methodToReach: 'Nivel 38' }] },
  89: { baseId: 88, steps: [{ id: 88, name: 'Grimer', sprite: getPokemonSprite(88) }, { id: 89, name: 'Muk', sprite: getPokemonSprite(89), methodToReach: 'Nivel 38' }] },

  // 90-91: Shellder
  90: { baseId: 90, steps: [{ id: 90, name: 'Shellder', sprite: getPokemonSprite(90) }, { id: 91, name: 'Cloyster', sprite: getPokemonSprite(91), methodToReach: 'Piedra Agua' }] },
  91: { baseId: 90, steps: [{ id: 90, name: 'Shellder', sprite: getPokemonSprite(90) }, { id: 91, name: 'Cloyster', sprite: getPokemonSprite(91), methodToReach: 'Piedra Agua' }] },

  // 92-94: Gastly
  92: { baseId: 92, steps: [{ id: 92, name: 'Gastly', sprite: getPokemonSprite(92) }, { id: 93, name: 'Haunter', sprite: getPokemonSprite(93), methodToReach: 'Nivel 25' }, { id: 94, name: 'Gengar', sprite: getPokemonSprite(94), methodToReach: 'Intercambio' }] },
  93: { baseId: 92, steps: [{ id: 92, name: 'Gastly', sprite: getPokemonSprite(92) }, { id: 93, name: 'Haunter', sprite: getPokemonSprite(93), methodToReach: 'Nivel 25' }, { id: 94, name: 'Gengar', sprite: getPokemonSprite(94), methodToReach: 'Intercambio' }] },
  94: { baseId: 92, steps: [{ id: 92, name: 'Gastly', sprite: getPokemonSprite(92) }, { id: 93, name: 'Haunter', sprite: getPokemonSprite(93), methodToReach: 'Nivel 25' }, { id: 94, name: 'Gengar', sprite: getPokemonSprite(94), methodToReach: 'Intercambio' }] },

  // 95: Onix
  95: { baseId: 95, steps: [{ id: 95, name: 'Onix', sprite: getPokemonSprite(95) }] },

  // 96-97: Drowzee
  96: { baseId: 96, steps: [{ id: 96, name: 'Drowzee', sprite: getPokemonSprite(96) }, { id: 97, name: 'Hypno', sprite: getPokemonSprite(97), methodToReach: 'Nivel 26' }] },
  97: { baseId: 96, steps: [{ id: 96, name: 'Drowzee', sprite: getPokemonSprite(96) }, { id: 97, name: 'Hypno', sprite: getPokemonSprite(97), methodToReach: 'Nivel 26' }] },

  // 98-99: Krabby
  98: { baseId: 98, steps: [{ id: 98, name: 'Krabby', sprite: getPokemonSprite(98) }, { id: 99, name: 'Kingler', sprite: getPokemonSprite(99), methodToReach: 'Nivel 28' }] },
  99: { baseId: 98, steps: [{ id: 98, name: 'Krabby', sprite: getPokemonSprite(98) }, { id: 99, name: 'Kingler', sprite: getPokemonSprite(99), methodToReach: 'Nivel 28' }] },

  // 100-101: Voltorb
  100: { baseId: 100, steps: [{ id: 100, name: 'Voltorb', sprite: getPokemonSprite(100) }, { id: 101, name: 'Electrode', sprite: getPokemonSprite(101), methodToReach: 'Nivel 30' }] },
  101: { baseId: 100, steps: [{ id: 100, name: 'Voltorb', sprite: getPokemonSprite(100) }, { id: 101, name: 'Electrode', sprite: getPokemonSprite(101), methodToReach: 'Nivel 30' }] },

  // 102-103: Exeggcute
  102: { baseId: 102, steps: [{ id: 102, name: 'Exeggcute', sprite: getPokemonSprite(102) }, { id: 103, name: 'Exeggutor', sprite: getPokemonSprite(103), methodToReach: 'Piedra Hoja' }] },
  103: { baseId: 102, steps: [{ id: 102, name: 'Exeggcute', sprite: getPokemonSprite(102) }, { id: 103, name: 'Exeggutor', sprite: getPokemonSprite(103), methodToReach: 'Piedra Hoja' }] },

  // 104-105: Cubone
  104: { baseId: 104, steps: [{ id: 104, name: 'Cubone', sprite: getPokemonSprite(104) }, { id: 105, name: 'Marowak', sprite: getPokemonSprite(105), methodToReach: 'Nivel 28' }] },
  105: { baseId: 104, steps: [{ id: 104, name: 'Cubone', sprite: getPokemonSprite(104) }, { id: 105, name: 'Marowak', sprite: getPokemonSprite(105), methodToReach: 'Nivel 28' }] },

  // 106: Hitmonlee
  106: { baseId: 106, steps: [{ id: 106, name: 'Hitmonlee', sprite: getPokemonSprite(106) }] },

  // 107: Hitmonchan
  107: { baseId: 107, steps: [{ id: 107, name: 'Hitmonchan', sprite: getPokemonSprite(107) }] },

  // 108: Lickitung
  108: { baseId: 108, steps: [{ id: 108, name: 'Lickitung', sprite: getPokemonSprite(108) }] },

  // 109-110: Koffing
  109: { baseId: 109, steps: [{ id: 109, name: 'Koffing', sprite: getPokemonSprite(109) }, { id: 110, name: 'Weezing', sprite: getPokemonSprite(110), methodToReach: 'Nivel 35' }] },
  110: { baseId: 109, steps: [{ id: 109, name: 'Koffing', sprite: getPokemonSprite(109) }, { id: 110, name: 'Weezing', sprite: getPokemonSprite(110), methodToReach: 'Nivel 35' }] },

  // 111-112: Rhyhorn
  111: { baseId: 111, steps: [{ id: 111, name: 'Rhyhorn', sprite: getPokemonSprite(111) }, { id: 112, name: 'Rhydon', sprite: getPokemonSprite(112), methodToReach: 'Nivel 42' }] },
  112: { baseId: 111, steps: [{ id: 111, name: 'Rhyhorn', sprite: getPokemonSprite(111) }, { id: 112, name: 'Rhydon', sprite: getPokemonSprite(112), methodToReach: 'Nivel 42' }] },

  // 113: Chansey
  113: { baseId: 113, steps: [{ id: 113, name: 'Chansey', sprite: getPokemonSprite(113) }] },

  // 114: Tangela
  114: { baseId: 114, steps: [{ id: 114, name: 'Tangela', sprite: getPokemonSprite(114) }] },

  // 115: Kangaskhan
  115: { baseId: 115, steps: [{ id: 115, name: 'Kangaskhan', sprite: getPokemonSprite(115) }] },

  // 116-117: Horsea
  116: { baseId: 116, steps: [{ id: 116, name: 'Horsea', sprite: getPokemonSprite(116) }, { id: 117, name: 'Seadra', sprite: getPokemonSprite(117), methodToReach: 'Nivel 32' }] },
  117: { baseId: 116, steps: [{ id: 116, name: 'Horsea', sprite: getPokemonSprite(116) }, { id: 117, name: 'Seadra', sprite: getPokemonSprite(117), methodToReach: 'Nivel 32' }] },

  // 118-119: Goldeen
  118: { baseId: 118, steps: [{ id: 118, name: 'Goldeen', sprite: getPokemonSprite(118) }, { id: 119, name: 'Seaking', sprite: getPokemonSprite(119), methodToReach: 'Nivel 33' }] },
  119: { baseId: 118, steps: [{ id: 118, name: 'Goldeen', sprite: getPokemonSprite(118) }, { id: 119, name: 'Seaking', sprite: getPokemonSprite(119), methodToReach: 'Nivel 33' }] },

  // 120-121: Staryu
  120: { baseId: 120, steps: [{ id: 120, name: 'Staryu', sprite: getPokemonSprite(120) }, { id: 121, name: 'Starmie', sprite: getPokemonSprite(121), methodToReach: 'Piedra Agua' }] },
  121: { baseId: 120, steps: [{ id: 120, name: 'Staryu', sprite: getPokemonSprite(120) }, { id: 121, name: 'Starmie', sprite: getPokemonSprite(121), methodToReach: 'Piedra Agua' }] },

  // 122: Mr. Mime
  122: { baseId: 122, steps: [{ id: 122, name: 'Mr. Mime', sprite: getPokemonSprite(122) }] },

  // 123: Scyther
  123: { baseId: 123, steps: [{ id: 123, name: 'Scyther', sprite: getPokemonSprite(123) }] },

  // 124: Jynx
  124: { baseId: 124, steps: [{ id: 124, name: 'Jynx', sprite: getPokemonSprite(124) }] },

  // 125: Electabuzz
  125: { baseId: 125, steps: [{ id: 125, name: 'Electabuzz', sprite: getPokemonSprite(125) }] },

  // 126: Magmar
  126: { baseId: 126, steps: [{ id: 126, name: 'Magmar', sprite: getPokemonSprite(126) }] },

  // 127: Pinsir
  127: { baseId: 127, steps: [{ id: 127, name: 'Pinsir', sprite: getPokemonSprite(127) }] },

  // 128: Tauros
  128: { baseId: 128, steps: [{ id: 128, name: 'Tauros', sprite: getPokemonSprite(128) }] },

  // 129-130: Magikarp
  129: { baseId: 129, steps: [{ id: 129, name: 'Magikarp', sprite: getPokemonSprite(129) }, { id: 130, name: 'Gyarados', sprite: getPokemonSprite(130), methodToReach: 'Nivel 20' }] },
  130: { baseId: 129, steps: [{ id: 129, name: 'Magikarp', sprite: getPokemonSprite(129) }, { id: 130, name: 'Gyarados', sprite: getPokemonSprite(130), methodToReach: 'Nivel 20' }] },

  // 131: Lapras
  131: { baseId: 131, steps: [{ id: 131, name: 'Lapras', sprite: getPokemonSprite(131) }] },

  // 132: Ditto
  132: { baseId: 132, steps: [{ id: 132, name: 'Ditto', sprite: getPokemonSprite(132) }] },

  // 133-136: Eevee (Branching)
  133: {
    baseId: 133,
    steps: [{ id: 133, name: 'Eevee', sprite: getPokemonSprite(133) }],
    branches: [
      { id: 134, name: 'Vaporeon', sprite: getPokemonSprite(134), methodToReach: 'Piedra Agua' },
      { id: 135, name: 'Jolteon', sprite: getPokemonSprite(135), methodToReach: 'Piedra Trueno' },
      { id: 136, name: 'Flareon', sprite: getPokemonSprite(136), methodToReach: 'Piedra Fuego' }
    ]
  },
  134: {
    baseId: 133,
    steps: [{ id: 133, name: 'Eevee', sprite: getPokemonSprite(133) }],
    branches: [
      { id: 134, name: 'Vaporeon', sprite: getPokemonSprite(134), methodToReach: 'Piedra Agua' },
      { id: 135, name: 'Jolteon', sprite: getPokemonSprite(135), methodToReach: 'Piedra Trueno' },
      { id: 136, name: 'Flareon', sprite: getPokemonSprite(136), methodToReach: 'Piedra Fuego' }
    ]
  },
  135: {
    baseId: 133,
    steps: [{ id: 133, name: 'Eevee', sprite: getPokemonSprite(133) }],
    branches: [
      { id: 134, name: 'Vaporeon', sprite: getPokemonSprite(134), methodToReach: 'Piedra Agua' },
      { id: 135, name: 'Jolteon', sprite: getPokemonSprite(135), methodToReach: 'Piedra Trueno' },
      { id: 136, name: 'Flareon', sprite: getPokemonSprite(136), methodToReach: 'Piedra Fuego' }
    ]
  },
  136: {
    baseId: 133,
    steps: [{ id: 133, name: 'Eevee', sprite: getPokemonSprite(133) }],
    branches: [
      { id: 134, name: 'Vaporeon', sprite: getPokemonSprite(134), methodToReach: 'Piedra Agua' },
      { id: 135, name: 'Jolteon', sprite: getPokemonSprite(135), methodToReach: 'Piedra Trueno' },
      { id: 136, name: 'Flareon', sprite: getPokemonSprite(136), methodToReach: 'Piedra Fuego' }
    ]
  },

  // 137: Porygon
  137: { baseId: 137, steps: [{ id: 137, name: 'Porygon', sprite: getPokemonSprite(137) }] },

  // 138-139: Omanyte
  138: { baseId: 138, steps: [{ id: 138, name: 'Omanyte', sprite: getPokemonSprite(138) }, { id: 139, name: 'Omastar', sprite: getPokemonSprite(139), methodToReach: 'Nivel 40' }] },
  139: { baseId: 138, steps: [{ id: 138, name: 'Omanyte', sprite: getPokemonSprite(138) }, { id: 139, name: 'Omastar', sprite: getPokemonSprite(139), methodToReach: 'Nivel 40' }] },

  // 140-141: Kabuto
  140: { baseId: 140, steps: [{ id: 140, name: 'Kabuto', sprite: getPokemonSprite(140) }, { id: 141, name: 'Kabutops', sprite: getPokemonSprite(141), methodToReach: 'Nivel 40' }] },
  141: { baseId: 140, steps: [{ id: 140, name: 'Kabuto', sprite: getPokemonSprite(140) }, { id: 141, name: 'Kabutops', sprite: getPokemonSprite(141), methodToReach: 'Nivel 40' }] },

  // 142: Aerodactyl
  142: { baseId: 142, steps: [{ id: 142, name: 'Aerodactyl', sprite: getPokemonSprite(142) }] },

  // 143: Snorlax
  143: { baseId: 143, steps: [{ id: 143, name: 'Snorlax', sprite: getPokemonSprite(143) }] },

  // 144: Articuno
  144: { baseId: 144, steps: [{ id: 144, name: 'Articuno', sprite: getPokemonSprite(144) }] },

  // 145: Zapdos
  145: { baseId: 145, steps: [{ id: 145, name: 'Zapdos', sprite: getPokemonSprite(145) }] },

  // 146: Moltres
  146: { baseId: 146, steps: [{ id: 146, name: 'Moltres', sprite: getPokemonSprite(146) }] },

  // 147-149: Dratini
  147: { baseId: 147, steps: [{ id: 147, name: 'Dratini', sprite: getPokemonSprite(147) }, { id: 148, name: 'Dragonair', sprite: getPokemonSprite(148), methodToReach: 'Nivel 30' }, { id: 149, name: 'Dragonite', sprite: getPokemonSprite(149), methodToReach: 'Nivel 55' }] },
  148: { baseId: 147, steps: [{ id: 147, name: 'Dratini', sprite: getPokemonSprite(147) }, { id: 148, name: 'Dragonair', sprite: getPokemonSprite(148), methodToReach: 'Nivel 30' }, { id: 149, name: 'Dragonite', sprite: getPokemonSprite(149), methodToReach: 'Nivel 55' }] },
  149: { baseId: 147, steps: [{ id: 147, name: 'Dratini', sprite: getPokemonSprite(147) }, { id: 148, name: 'Dragonair', sprite: getPokemonSprite(148), methodToReach: 'Nivel 30' }, { id: 149, name: 'Dragonite', sprite: getPokemonSprite(149), methodToReach: 'Nivel 55' }] },

  // 150: Mewtwo
  150: { baseId: 150, steps: [{ id: 150, name: 'Mewtwo', sprite: getPokemonSprite(150) }] },

  // 151: Mew
  151: { baseId: 151, steps: [{ id: 151, name: 'Mew', sprite: getPokemonSprite(151) }] }
};

export function getEvolutionFamily(pokemonId: number): EvolutionFamily | null {
  return KANTO_EVOLUTION_CHAINS[pokemonId] || null;
}
