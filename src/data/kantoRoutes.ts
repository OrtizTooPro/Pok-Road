import { KantoPokemon, findPokemonByName, KANTO_POKEDEX } from './kantoPokedex';

export interface KantoRouteData {
  id: string;
  name: string;
  minAge: number;
  minLevel: number;
  maxLevel: number;
  speciesList: string[]; // Official Pokémon species natively appearing in this Kanto route/location
}

/**
  Official Kanto Route and Location Encounter Tables
  Directly matching the original Pokémon Red / Blue / Yellow / FireRed / LeafGreen Pokédex habitats.
*/
export const OFFICIAL_KANTO_ROUTES: KantoRouteData[] = [
  {
    id: 'route-1',
    name: 'Pueblo Paleta - Ruta 1',
    minAge: 10,
    minLevel: 3,
    maxLevel: 7,
    speciesList: ['Pidgey', 'Rattata']
  },
  {
    id: 'route-2',
    name: 'Ruta 2 (Praderas de Verde)',
    minAge: 10,
    minLevel: 4,
    maxLevel: 8,
    speciesList: ['Pidgey', 'Rattata', 'Caterpie', 'Weedle', 'Nidoran♀', 'Nidoran♂']
  },
  {
    id: 'viridian-forest',
    name: 'Bosque Verde',
    minAge: 10,
    minLevel: 5,
    maxLevel: 10,
    speciesList: ['Caterpie', 'Metapod', 'Weedle', 'Kakuna', 'Pikachu', 'Pidgey']
  },
  {
    id: 'route-3',
    name: 'Ruta 3 (Piedemonte de Monte Moon)',
    minAge: 11,
    minLevel: 8,
    maxLevel: 12,
    speciesList: ['Pidgey', 'Spearow', 'Rattata', 'Jigglypuff', 'Nidoran♀', 'Nidoran♂', 'Mankey']
  },
  {
    id: 'mt-moon',
    name: 'Monte Moon (Caverna Rocosa)',
    minAge: 11,
    minLevel: 9,
    maxLevel: 14,
    speciesList: ['Zubat', 'Geodude', 'Paras', 'Clefairy', 'Onix']
  },
  {
    id: 'route-4',
    name: 'Ruta 4 (Salida Oeste de Monte Moon)',
    minAge: 11,
    minLevel: 10,
    maxLevel: 14,
    speciesList: ['Rattata', 'Spearow', 'Ekans', 'Sandshrew', 'Mankey']
  },
  {
    id: 'route-24-25',
    name: 'Ruta 24 y 25 (Puente Pepita y Cabo Celeste)',
    minAge: 12,
    minLevel: 12,
    maxLevel: 17,
    speciesList: ['Caterpie', 'Metapod', 'Weedle', 'Kakuna', 'Pidgey', 'Pidgeotto', 'Oddish', 'Bellsprout', 'Abra', 'Venonat']
  },
  {
    id: 'route-5-6',
    name: 'Ruta 5 y 6 (Alrededores de Cerulean y Carmín)',
    minAge: 12,
    minLevel: 13,
    maxLevel: 17,
    speciesList: ['Pidgey', 'Pidgeotto', 'Rattata', 'Abra', 'Meowth', 'Oddish', 'Bellsprout', 'Mankey']
  },
  {
    id: 'route-11',
    name: 'Ruta 11 (Ese de Ciudad Carmín)',
    minAge: 13,
    minLevel: 14,
    maxLevel: 19,
    speciesList: ['Spearow', 'Drowzee', 'Ekans', 'Sandshrew', 'Rattata']
  },
  {
    id: 'diglett-cave',
    name: 'Cueva Diglett',
    minAge: 13,
    minLevel: 15,
    maxLevel: 22,
    speciesList: ['Diglett', 'Dugtrio']
  },
  {
    id: 'route-9-10',
    name: 'Ruta 9 y Ruta 10 (Senda al Túnel Roca)',
    minAge: 14,
    minLevel: 16,
    maxLevel: 21,
    speciesList: ['Rattata', 'Raticate', 'Spearow', 'Fearow', 'Ekans', 'Sandshrew', 'Voltorb', 'Machop']
  },
  {
    id: 'rock-tunnel',
    name: 'Túnel Roca',
    minAge: 14,
    minLevel: 16,
    maxLevel: 22,
    speciesList: ['Zubat', 'Geodude', 'Machop', 'Onix', 'Graveler']
  },
  {
    id: 'route-7-8',
    name: 'Ruta 7 y 8 (Camino a Ciudad Azulona)',
    minAge: 14,
    minLevel: 17,
    maxLevel: 22,
    speciesList: ['Pidgey', 'Pidgeotto', 'Rattata', 'Raticate', 'Vulpix', 'Growlithe', 'Abra', 'Kadabra', 'Meowth', 'Mankey']
  },
  {
    id: 'pokemon-tower',
    name: 'Torre Pokémon (Pueblo Lavanda)',
    minAge: 15,
    minLevel: 18,
    maxLevel: 25,
    speciesList: ['Gastly', 'Haunter', 'Cubone']
  },
  {
    id: 'cycling-road',
    name: 'Bici-Ruta 16, 17 y 18',
    minAge: 15,
    minLevel: 22,
    maxLevel: 28,
    speciesList: ['Spearow', 'Fearow', 'Doduo', 'Dodrio', 'Raticate', 'Ponyta', 'Grimer']
  },
  {
    id: 'route-12-15',
    name: 'Ruta 12, 13, 14 y 15 (Costa Oriental de Kanto)',
    minAge: 16,
    minLevel: 23,
    maxLevel: 29,
    speciesList: ['Oddish', 'Gloom', 'Bellsprout', 'Weepinbell', 'Pidgey', 'Pidgeotto', 'Venonat', 'Venomoth', 'Ditto']
  },
  {
    id: 'safari-zone',
    name: 'Zona Safari de Ciudad Fucsia',
    minAge: 16,
    minLevel: 24,
    maxLevel: 31,
    speciesList: ['Nidoran♀', 'Nidorina', 'Nidoran♂', 'Nidorino', 'Paras', 'Parasect', 'Venonat', 'Exeggcute', 'Rhyhorn', 'Chansey', 'Scyther', 'Pinsir', 'Tauros', 'Kangaskhan', 'Dratini']
  },
  {
    id: 'power-plant',
    name: 'Central de Energía Abandonada',
    minAge: 17,
    minLevel: 30,
    maxLevel: 36,
    speciesList: ['Voltorb', 'Electrode', 'Magnemite', 'Magneton', 'Pikachu', 'Raichu', 'Electabuzz']
  },
  {
    id: 'seafoam-islands',
    name: 'Islas Espuma (Caverna Glacial)',
    minAge: 17,
    minLevel: 28,
    maxLevel: 36,
    speciesList: ['Psyduck', 'Golduck', 'Slowpoke', 'Slowbro', 'Seel', 'Dewgong', 'Shellder', 'Cloyster', 'Horsea', 'Seadra', 'Zubat', 'Golbat']
  },
  {
    id: 'pokemon-mansion',
    name: 'Mansión Pokémon de Isla Cinnabar',
    minAge: 18,
    minLevel: 32,
    maxLevel: 39,
    speciesList: ['Koffing', 'Weezing', 'Vulpix', 'Ninetales', 'Growlithe', 'Arcanine', 'Ponyta', 'Rapidash', 'Grimer', 'Muk', 'Magmar', 'Ditto']
  },
  {
    id: 'route-21-23',
    name: 'Ruta 21, 22 y 23 (Vía a la Meseta Añil)',
    minAge: 19,
    minLevel: 34,
    maxLevel: 41,
    speciesList: ['Spearow', 'Fearow', 'Rattata', 'Raticate', 'Mankey', 'Primeape', 'Arbok', 'Sandslash', 'Ditto', 'Poliwag']
  },
  {
    id: 'victory-road',
    name: 'Calle Victoria (Desfiladero de los Titanes)',
    minAge: 20,
    minLevel: 38,
    maxLevel: 46,
    speciesList: ['Machop', 'Machoke', 'Geodude', 'Graveler', 'Onix', 'Golbat', 'Marowak', 'Venomoth']
  },
  {
    id: 'cerulean-cave',
    name: 'Cueva Celeste (Abismo Profundo)',
    minAge: 22,
    minLevel: 48,
    maxLevel: 60,
    speciesList: ['Golbat', 'Hypno', 'Magneton', 'Venomoth', 'Kadabra', 'Parasect', 'Raichu', 'Sandslash', 'Arbok', 'Graveler', 'Rhydon', 'Chansey', 'Ditto']
  }
];

/**
 * Returns a fitting Kanto route based on trainer age
 */
export function getRouteForAge(age: number): KantoRouteData {
  const eligible = OFFICIAL_KANTO_ROUTES.filter(r => r.minAge <= age);
  if (eligible.length === 0) return OFFICIAL_KANTO_ROUTES[0];
  
  // Pick from the top 3 most relevant routes for this age to keep progression feeling authentic
  const recentEligible = eligible.slice(Math.max(0, eligible.length - 3));
  const randomIndex = Math.floor(Math.random() * recentEligible.length);
  return recentEligible[randomIndex];
}

/**
 * Get a random Pokémon data object that natively spawns on the specified route
 */
export function getRandomEncounterForRoute(route: KantoRouteData): { pokemon: KantoPokemon; level: number } {
  const species = route.speciesList[Math.floor(Math.random() * route.speciesList.length)];
  const kantoPkm = findPokemonByName(species) || KANTO_POKEDEX[0];
  const level = Math.floor(Math.random() * (route.maxLevel - route.minLevel + 1)) + route.minLevel;
  return { pokemon: kantoPkm, level };
}
