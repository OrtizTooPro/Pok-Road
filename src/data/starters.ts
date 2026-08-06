import { PokemonMember } from '../types';
import { getPokemonSprite } from './kantoPokedex';

export interface StarterChoice {
  id: string;
  name: string;
  species: string;
  type: string;
  secondaryType?: string;
  category: 'Fuego' | 'Agua' | 'Planta' | 'Eléctrico';
  description: string;
  bonusText: string;
  initialPokemon: PokemonMember;
  evolutionStages: { stage: number; species: string; name: string; type: string; level: number }[];
}

export const STARTER_OPTIONS: StarterChoice[] = [
  {
    id: 'starter-fire',
    name: 'Charmander',
    species: 'Charmander',
    type: 'Fuego',
    category: 'Fuego',
    description: 'Pokémon Lagartija de espíritu ardiente. Su llama en la cola indica su pasión en el combate.',
    bonusText: '+5 Habilidad de Combate inicial. Ataques devastadores de alto riesgo.',
    initialPokemon: {
      id: 'starter-1',
      name: 'Charmander',
      species: 'Charmander',
      type: 'Fuego',
      level: 5,
      stage: 1,
      isStarter: true,
      spriteUrl: getPokemonSprite(4),
      iconEmoji: '🔥'
    },
    evolutionStages: [
      { stage: 1, species: 'Charmander', name: 'Charmander', type: 'Fuego', level: 5 },
      { stage: 2, species: 'Charmeleon', name: 'Charmeleon', type: 'Fuego', level: 16 },
      { stage: 3, species: 'Charizard', name: 'Charizard', type: 'Fuego / Volador', level: 36 }
    ]
  },
  {
    id: 'starter-water',
    name: 'Squirtle',
    species: 'Squirtle',
    type: 'Agua',
    category: 'Agua',
    description: 'Pokémon Tortuguita de caparazón resistente. Destaca por su templanza táctica y equilibrio.',
    bonusText: '+10 Resistencia física inicial. Gran versatilidad defensiva.',
    initialPokemon: {
      id: 'starter-2',
      name: 'Squirtle',
      species: 'Squirtle',
      type: 'Agua',
      level: 5,
      stage: 1,
      isStarter: true,
      spriteUrl: getPokemonSprite(7),
      iconEmoji: '💧'
    },
    evolutionStages: [
      { stage: 1, species: 'Squirtle', name: 'Squirtle', type: 'Agua', level: 5 },
      { stage: 2, species: 'Wartortle', name: 'Wartortle', type: 'Agua', level: 16 },
      { stage: 3, species: 'Blastoise', name: 'Blastoise', type: 'Agua', level: 36 }
    ]
  },
  {
    id: 'starter-grass',
    name: 'Bulbasaur',
    species: 'Bulbasaur',
    type: 'Planta / Veneno',
    category: 'Planta',
    description: 'Pokémon Semilla leal y analítico. La semilla en su lomo crece a medida que se fortalece el vínculo.',
    bonusText: '+15 Vínculo con el Equipo inicial. Estrategia y curación constante.',
    initialPokemon: {
      id: 'starter-3',
      name: 'Bulbasaur',
      species: 'Bulbasaur',
      type: 'Planta / Veneno',
      level: 5,
      stage: 1,
      isStarter: true,
      spriteUrl: getPokemonSprite(1),
      iconEmoji: '🍃'
    },
    evolutionStages: [
      { stage: 1, species: 'Bulbasaur', name: 'Bulbasaur', type: 'Planta / Veneno', level: 5 },
      { stage: 2, species: 'Ivysaur', name: 'Ivysaur', type: 'Planta / Veneno', level: 16 },
      { stage: 3, species: 'Venusaur', name: 'Venusaur', type: 'Planta / Veneno', level: 36 }
    ]
  },
  {
    id: 'starter-electric',
    name: 'Pikachu',
    species: 'Pikachu',
    type: 'Eléctrico',
    category: 'Eléctrico',
    description: 'Pokémon Ratón de mejillas rojas llenas de energía. Famoso por su velocidad chispeante y su gran lealtad.',
    bonusText: '+10 Velocidad y Popularidad inicial. Ataques velozmente decisivos.',
    initialPokemon: {
      id: 'starter-4',
      name: 'Pikachu',
      species: 'Pikachu',
      type: 'Eléctrico',
      level: 5,
      stage: 1,
      isStarter: true,
      spriteUrl: getPokemonSprite(25),
      iconEmoji: '⚡'
    },
    evolutionStages: [
      { stage: 1, species: 'Pikachu', name: 'Pikachu', type: 'Eléctrico', level: 5 },
      { stage: 2, species: 'Raichu', name: 'Raichu', type: 'Eléctrico', level: 22 }
    ]
  }
];
