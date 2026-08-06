export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'COMBATE' | 'COLECCIÓN' | 'VÍNCULO' | 'RECURSOS' | 'LIGA';
  icon: string; // Icon identifier or emoji
  badgeColor: string; // CSS color theme
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'FIRST_CATCH',
    title: 'Primer Recluta',
    description: 'Añade tu primer Pokémon capturado al equipo de carrera.',
    category: 'COLECCIÓN',
    icon: '⚽',
    badgeColor: 'border-emerald-600 bg-emerald-100 text-emerald-900'
  },
  {
    id: 'FIRST_GYM',
    title: 'Primer Paso al Trono',
    description: 'Consigue tu 1ª Medalla de Gimnasio Oficial de Kanto.',
    category: 'LIGA',
    icon: '🏅',
    badgeColor: 'border-amber-600 bg-amber-100 text-amber-900'
  },
  {
    id: 'BADGE_4',
    title: 'Medallista de Élite',
    description: 'Consigue 4 Medallas de Gimnasio de la región.',
    category: 'LIGA',
    icon: '🎖️',
    badgeColor: 'border-blue-600 bg-blue-100 text-blue-900'
  },
  {
    id: 'KANTO_MASTER',
    title: 'Maestro de las 8 Medallas',
    description: 'Completa las 8 Medallas de Gimnasio de Kanto.',
    category: 'LIGA',
    icon: '👑',
    badgeColor: 'border-purple-600 bg-purple-100 text-purple-900'
  },
  {
    id: 'VICTORIES_5',
    title: 'Racha Imparable',
    description: 'Consigue al menos 5 victorias en tus desafíos de carrera.',
    category: 'COMBATE',
    icon: '🔥',
    badgeColor: 'border-red-600 bg-red-100 text-red-900'
  },
  {
    id: 'MAX_BOND',
    title: 'Lazo Indestructible',
    description: 'Alcanza los 100 puntos máximos de Vínculo con tus Pokémon.',
    category: 'VÍNCULO',
    icon: '💖',
    badgeColor: 'border-pink-600 bg-pink-100 text-pink-900'
  },
  {
    id: 'MASTER_TACTICIAN',
    title: 'Maestro Táctico',
    description: 'Alcanza 90 o más en Habilidad Táctica de Combate.',
    category: 'COMBATE',
    icon: '⚔️',
    badgeColor: 'border-indigo-600 bg-indigo-100 text-indigo-900'
  },
  {
    id: 'POKEMON_TEAM_FULL',
    title: 'Escuadrón Completo',
    description: 'Forma un equipo completo con 6 Pokémon.',
    category: 'COLECCIÓN',
    icon: '🐉',
    badgeColor: 'border-teal-600 bg-teal-100 text-teal-900'
  },
  {
    id: 'RICH_TRAINER',
    title: 'Magnate de la Liga',
    description: 'Acumula 10,000 $ Pokécupones o más en tu billetera.',
    category: 'RECURSOS',
    icon: '💎',
    badgeColor: 'border-yellow-600 bg-yellow-100 text-yellow-900'
  },
  {
    id: 'HALL_OF_FAME',
    title: 'Leyenda del Salón de la Fama',
    description: 'Concluye tu carrera como ¡LEYENDA DEL SALÓN DE LA FAMA! (Score 90+).',
    category: 'LIGA',
    icon: '🌟',
    badgeColor: 'border-amber-500 bg-yellow-200 text-amber-950'
  }
];

export function checkNewAchievements(
  currentUnlocked: string[],
  stats: { skill: number; bond: number; money: number },
  career: { victories: number; badgesWon: string[]; team: any[]; legendaryScore: number },
  legacyScore?: number
): string[] {
  const newUnlocked: string[] = [];

  const addIf = (id: string, condition: boolean) => {
    if (condition && !currentUnlocked.includes(id) && !newUnlocked.includes(id)) {
      newUnlocked.push(id);
    }
  };

  addIf('FIRST_CATCH', career.team.length >= 2);
  addIf('FIRST_GYM', career.badgesWon.length >= 1);
  addIf('BADGE_4', career.badgesWon.length >= 4);
  addIf('KANTO_MASTER', career.badgesWon.length >= 8);
  addIf('VICTORIES_5', career.victories >= 5);
  addIf('MAX_BOND', stats.bond >= 100);
  addIf('MASTER_TACTICIAN', stats.skill >= 90);
  addIf('POKEMON_TEAM_FULL', career.team.length >= 6);
  addIf('RICH_TRAINER', stats.money >= 10000);
  if (legacyScore !== undefined) {
    addIf('HALL_OF_FAME', legacyScore >= 90);
  }

  return newUnlocked;
}
