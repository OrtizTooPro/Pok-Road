import { GameState } from '../types';

export interface ScoreBreakdownCategory {
  title: string;
  points: number;
  maxPoints: number;
  description: string;
  icon: string;
}

export interface DetailedScoreResult {
  totalScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  rankGrade: 'SS+' | 'S' | 'A' | 'B' | 'C' | 'D';
  rankTitle: string;
  rankDescription: string;
  gradeColor: { bg: string; text: string; border: string; badgeBg: string };
  categories: ScoreBreakdownCategory[];
  statsPts: number;
  badgesPts: number;
  battlesPts: number;
  pokedexPts: number;
  achievementsPts: number;
  legendaryPts: number;
}

export function calculateTotalCareerScore(state: GameState): DetailedScoreResult {
  const { stats, career } = state;

  // 1. Stats Score (Max 2500 Pts)
  // Skill, Reputation, Bond, Stamina (0-100 each) + Money
  const skillPts = Math.min(600, stats.skill * 6);
  const repPts = Math.min(600, stats.reputation * 6);
  const bondPts = Math.min(600, stats.bond * 6);
  const staminaPts = Math.min(400, stats.stamina * 4);
  const moneyPts = Math.min(300, Math.floor(stats.money / 40));
  const statsPts = Math.min(2500, skillPts + repPts + bondPts + staminaPts + moneyPts);

  // 2. Badges Score (Max 2400 Pts)
  const badgeCount = career.badgesWon ? career.badgesWon.length : 0;
  const badgesPts = Math.min(2400, badgeCount * 300);

  // 3. Battles Score (Max 2200 Pts)
  const victories = career.victories || 0;
  const defeats = career.defeats || 0;
  const totalBattles = victories + defeats;
  const winRate = totalBattles > 0 ? (victories / totalBattles) * 100 : 100;

  let victoryPts = victories * 60;
  let winRateBonus = 0;
  if (winRate >= 90 && totalBattles >= 10 && defeats <= 1) winRateBonus = 500;
  else if (winRate >= 80 && totalBattles >= 8) winRateBonus = 300;
  else if (winRate >= 65 && totalBattles >= 5) winRateBonus = 150;

  const defeatPenalty = defeats * 80;
  const battlesPts = Math.min(2200, Math.max(0, victoryPts + winRateBonus - defeatPenalty));

  // 4. Pokédex & Team Score (Max 1800 Pts)
  const teamLevelSum = career.team ? career.team.reduce((acc, m) => acc + (m.level || 10), 0) : 0;
  const legendariesCount = career.team ? career.team.filter(m => m.isLegendary).length : 0;
  
  const pokemonCaughtPts = (career.pokemonCaught || 1) * 40;
  const teamLevelPts = Math.floor(teamLevelSum * 1.5);
  const legendaryMonBonus = legendariesCount * 250;
  const pokedexPts = Math.min(1800, pokemonCaughtPts + teamLevelPts + legendaryMonBonus);

  // 5. Achievements Score (Max 1500 Pts)
  const achievementsCount = career.unlockedAchievements ? career.unlockedAchievements.length : 0;
  const achievementsPts = Math.min(1500, achievementsCount * 200);

  // 6. Legendary Statue Score (Max 1500 Pts)
  const legendaryScoreVal = Math.min(100, career.legendaryScore || 0);
  const legendaryPts = Math.min(1500, Math.round(legendaryScoreVal * 15));

  // Total Score Sum
  const totalScore = Math.round(statsPts + badgesPts + battlesPts + pokedexPts + achievementsPts + legendaryPts);
  const maxPossibleScore = 11900;
  const percentageScore = Math.min(100, Math.round((totalScore / maxPossibleScore) * 100));

  // Determine Grade with Strict Mastery Requirements
  let rankGrade: 'SS+' | 'S' | 'A' | 'B' | 'C' | 'D' = 'D';
  let rankTitle = 'Entrenador Promesa';
  let rankDescription = 'Has dado tus primeros pasos en Kanto. Tu viaje apenas comienza, ¡sigue entrenando!';
  let gradeColor = {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-600',
    badgeBg: 'bg-gray-800'
  };

  const hasAllBadges = badgeCount >= 8;

  if (totalScore >= 10500 && hasAllBadges && winRate >= 85 && legendaryScoreVal >= 70) {
    rankGrade = 'SS+';
    rankTitle = '¡LEYENDA INMORTAL DE KANTO!';
    rankDescription = 'Has alcanzado la cima absoluta con una maestría legendaria impecable. Tu estatua de oro macizo encabezará el Salón de la Fama y tu nombre será inmortalizado.';
    gradeColor = {
      bg: 'bg-amber-100',
      text: 'text-amber-950',
      border: 'border-amber-600',
      badgeBg: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600'
    };
  } else if (totalScore >= 8800 && hasAllBadges) {
    rankGrade = 'S';
    rankTitle = 'Campeón Maestro de la Liga';
    rankDescription = 'Demostraste una maestría táctica deslumbrante y conquistaste las 8 medallas de Kanto. ¡Te has proclamado el Gran Campeón indiscutible!';
    gradeColor = {
      bg: 'bg-yellow-50',
      text: 'text-yellow-950',
      border: 'border-yellow-600',
      badgeBg: 'bg-yellow-500'
    };
  } else if (totalScore >= 7200) {
    rankGrade = 'A';
    rankTitle = 'As del Alto Mando';
    rankDescription = 'Pocos entrenadores en el mundo alcanzan tu nivel. Tu nombre impone respeto en todos los estadios regionales.';
    gradeColor = {
      bg: 'bg-purple-50',
      text: 'text-purple-950',
      border: 'border-purple-600',
      badgeBg: 'bg-purple-600'
    };
  } else if (totalScore >= 5500) {
    rankGrade = 'B';
    rankTitle = 'Líder Consagrado de Gimnasio';
    rankDescription = 'Una carrera sólida, repleta de combates memorables y el afecto incondicional de tu equipo y seguidores.';
    gradeColor = {
      bg: 'bg-blue-50',
      text: 'text-blue-950',
      border: 'border-blue-600',
      badgeBg: 'bg-blue-600'
    };
  } else if (totalScore >= 3800) {
    rankGrade = 'C';
    rankTitle = 'Entrenador Veterano de Ruta';
    rankDescription = 'Has completado un viaje respetable por Kanto, reuniendo valiosas experiencias y aprendizajes.';
    gradeColor = {
      bg: 'bg-emerald-50',
      text: 'text-emerald-950',
      border: 'border-emerald-600',
      badgeBg: 'bg-emerald-600'
    };
  }

  const categories: ScoreBreakdownCategory[] = [
    {
      title: 'Desarrollo de Atributos y Capital',
      points: statsPts,
      maxPoints: 2500,
      description: `Habilidad (${stats.skill}), Popularidad (${stats.reputation}), Vínculo (${stats.bond}), Resistencia (${stats.stamina}) y $${stats.money.toLocaleString()}`,
      icon: '📊'
    },
    {
      title: 'Medallas Regionales Conquistadas',
      points: badgesPts,
      maxPoints: 2400,
      description: `${badgeCount} de 8 Medallas oficiales ganadas en Gimnasios de Kanto (${badgesPts} Pts)`,
      icon: '🎖️'
    },
    {
      title: 'Combates y Ratio de Victoria',
      points: battlesPts,
      maxPoints: 2200,
      description: `${victories} Victorias / ${defeats} Derrotas (${Math.round(winRate)}% efectividad)`,
      icon: '⚔️'
    },
    {
      title: 'Manejo de Equipo y Capturas',
      points: pokedexPts,
      maxPoints: 1800,
      description: `${career.pokemonCaught} Pokémon capturados, Nivel total del equipo: ${teamLevelSum}`,
      icon: '🐲'
    },
    {
      title: 'Trofeos y Logros Especiales',
      points: achievementsPts,
      maxPoints: 1500,
      description: `${achievementsCount} Logros y Títulos de Carrera desbloqueados`,
      icon: '🏆'
    },
    {
      title: 'Consagración de Estatua Leyenda',
      points: legendaryPts,
      maxPoints: 1500,
      description: `${legendaryScoreVal}% de medidor de Estatua de Oro acumulado`,
      icon: '🗿'
    }
  ];

  return {
    totalScore,
    maxPossibleScore,
    percentageScore,
    rankGrade,
    rankTitle,
    rankDescription,
    gradeColor,
    categories,
    statsPts,
    badgesPts,
    battlesPts,
    pokedexPts,
    achievementsPts,
    legendaryPts
  };
}
