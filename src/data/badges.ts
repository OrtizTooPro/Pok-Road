import { Badge } from '../types';

export const REGIONAL_BADGES: Badge[] = [
  {
    id: 'badge-roca',
    name: 'Medalla Roca',
    gymLeader: 'Líder Brock',
    type: 'Roca',
    city: 'Ciudad Plateada',
    iconName: 'Mountain',
    description: 'Demuestra una determinación inquebrantable como la roca más dura.',
    statBonus: '+6 Habilidad Táctica • Reconocimiento Oficial Liga',
    spriteUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/boulder-badge.png'
  },
  {
    id: 'badge-cascada',
    name: 'Medalla Cascada',
    gymLeader: 'Líder Misty',
    type: 'Agua',
    city: 'Ciudad Celeste',
    iconName: 'Droplet',
    description: 'Simboliza la fluidez táctica y la serenidad bajo presión constante.',
    statBonus: '+6 Vínculo de Equipo • Permite uso de Surf fuera de combate',
    spriteUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/cascade-badge.png'
  },
  {
    id: 'badge-trueno',
    name: 'Medalla Trueno',
    gymLeader: 'Líder Lt. Surge',
    type: 'Eléctrico',
    city: 'Ciudad Carmín',
    iconName: 'Zap',
    description: 'Acredita una velocidad de respuesta devastadora y una ofensiva relámpago.',
    statBonus: '+8 Habilidad • +6 Popularidad • +4 Puntos de Leyenda',
    spriteUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/thunder-badge.png'
  },
  {
    id: 'badge-arcoiris',
    name: 'Medalla Arcoíris',
    gymLeader: 'Líder Erika',
    type: 'Planta',
    city: 'Ciudad Azulona',
    iconName: 'Flower2',
    description: 'Refleja la armonía con la naturaleza y la paciencia en el combate.',
    statBonus: '+8 Resistencia • +6 Vínculo • Acceso a Zona Safari',
    spriteUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/rainbow-badge.png'
  },
  {
    id: 'badge-alma',
    name: 'Medalla Alma',
    gymLeader: 'Líder Koga',
    type: 'Veneno',
    city: 'Ciudad Fucsia',
    iconName: 'Skull',
    description: 'Demuestra destreza sigilosa y resistencia ante tóxicos y tácticas ninja.',
    statBonus: '+8 Habilidad • +6 Resistencia • Permite uso de Manto Tóxico',
    spriteUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/soul-badge.png'
  },
  {
    id: 'badge-pantano',
    name: 'Medalla Pantano',
    gymLeader: 'Líder Sabrina',
    type: 'Psíquico',
    city: 'Ciudad Azafrán',
    iconName: 'Eye',
    description: 'Prueba la fuerza mental suprema y la resistencia ante ataques ilusorios.',
    statBonus: '+10 Habilidad • +8 Popularidad • Sumisión Pokémon hasta Nivel 70',
    spriteUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/marsh-badge.png'
  },
  {
    id: 'badge-volcan',
    name: 'Medalla Volcán',
    gymLeader: 'Líder Blaine',
    type: 'Fuego',
    city: 'Isla Canela',
    iconName: 'Flame',
    description: 'Premia la pasión ardiente y el coraje en situaciones extremas.',
    statBonus: '+10 Resistencia • +8 Popularidad • Impulso de Ataque Especial',
    spriteUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/volcano-badge.png'
  },
  {
    id: 'badge-tierra',
    name: 'Medalla Tierra',
    gymLeader: 'Líder Giovanni',
    type: 'Tierra',
    city: 'Ciudad Verde',
    iconName: 'Shield',
    description: 'Certifica el dominio total de la estrategia y el control del terreno.',
    statBonus: '+12 Habilidad • +10 Popularidad • Desbloqueo del Alto Mando',
    spriteUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/earth-badge.png'
  },
  {
    id: 'badge-master-100',
    name: 'Sello Gran Maestro 100%',
    gymLeader: 'Profesor Oak & Alto Mando',
    type: 'Estelar',
    city: 'Pueblo Paleta - Laboratorio Central',
    iconName: 'Crown',
    description: 'Acredita el completado del 100% de la Pokédex Kanto y la máxima maestría regional.',
    statBonus: '★ COMPLETADO 100% ABSOLUTO • Pokédex 151/151 • Rango Leyenda Mítica',
    spriteUrl: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/tri-pass.png'
  }
];

export function getBadgeById(badgeId: string): Badge | undefined {
  return REGIONAL_BADGES.find(b => b.id === badgeId);
}

export function getBadgeByName(name: string): Badge | undefined {
  const norm = name.toLowerCase().trim();
  return REGIONAL_BADGES.find(b => b.name.toLowerCase().includes(norm) || norm.includes(b.name.toLowerCase()));
}

