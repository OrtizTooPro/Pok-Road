import { 
  MinigameId, 
  SequenceRepeatConfig, 
  MemoryPairsConfig, 
  TimingBarConfig, 
  ShellGameConfig, 
  TacticalStrikeConfig 
} from '../types/minigames';

export const MINIGAMES_CONFIG = {
  sequence_repeat: {
    id: 'sequence_repeat' as MinigameId,
    name: 'Secuencia de Botones',
    description: 'Memoriza y repite la secuencia de botones.',
    base_difficulty: {
      sequence_length: 3,
      display_speed_ms: 800,
      available_buttons: ['A', 'B', 'X', 'Y']
    },
    scaling_per_round: {
      sequence_length_add: 1,
      display_speed_ms_sub: 100
    }
  },
  memory_pairs: {
    id: 'memory_pairs' as MinigameId,
    name: 'Voltear Parejas',
    description: 'Encuentra todas las parejas ocultas antes de que se agote el tiempo.',
    base_difficulty: {
      rows: 2,
      cols: 3,
      time_limit_seconds: 20,
      preview_time_seconds: 2
    },
    scaling_per_round: {
      rows_cols_add: { rows: 2, cols: 4 },
      time_limit_seconds_sub: 3,
      preview_time_seconds_sub: 0.5
    }
  },
  timing_bar: {
    id: 'timing_bar' as MinigameId,
    name: 'Zona de Impacto',
    description: 'Pulsa cuando el indicador esté dentro de la zona objetivo.',
    base_difficulty: {
      target_zone_size_percent: 25,
      indicator_speed: 1.0,
      target_zone_movement: false
    },
    scaling_per_round: {
      target_zone_size_percent_sub: 4,
      indicator_speed_add: 0.3,
      target_zone_movement: true
    }
  },
  shell_game: {
    id: 'shell_game' as MinigameId,
    name: '¿Dónde está la Pokéball?',
    description: 'Sigue con la mirada el contenedor correcto.',
    base_difficulty: {
      shell_count: 3,
      shuffle_speed: 1.0,
      shuffle_swaps: 5
    },
    scaling_per_round: {
      shell_count_add: 1,
      shuffle_speed_add: 0.4,
      shuffle_swaps_add: 3
    }
  },
  pkmn_tactical_strike: {
    id: 'pkmn_tactical_strike' as MinigameId,
    name: 'Ataque Táctico de Campeonato',
    description: 'Encuentra las brechas en la guardia del rival antes de agotar tus oportunidades.',
    base_difficulty: {
      total_zones: 6,
      max_attempts: 6,
      target_score_to_win: 4,
      defender_switch_interval_ms: 800,
      blocked_zones_count_simultaneous: 2
    },
    scaling_per_round: {
      defender_switch_interval_ms_sub: 100,
      blocked_zones_count_add: 1
    }
  }
};

/**
 * Calculates difficulty for round (1-indexed) adjusted by combat win chance
 */
export function getSequenceRepeatDifficulty(round: number, winChance: number): SequenceRepeatConfig {
  const roundOffset = round - 1;
  const chanceBonus = winChance >= 80 ? -1 : winChance <= 40 ? 1 : 0;
  const length = Math.min(8, Math.max(3, MINIGAMES_CONFIG.sequence_repeat.base_difficulty.sequence_length + roundOffset * MINIGAMES_CONFIG.sequence_repeat.scaling_per_round.sequence_length_add + chanceBonus));
  const speed = Math.max(300, MINIGAMES_CONFIG.sequence_repeat.base_difficulty.display_speed_ms - roundOffset * MINIGAMES_CONFIG.sequence_repeat.scaling_per_round.display_speed_ms_sub);
  return {
    sequence_length: length,
    display_speed_ms: speed,
    available_buttons: MINIGAMES_CONFIG.sequence_repeat.base_difficulty.available_buttons
  };
}

export function getMemoryPairsDifficulty(round: number, winChance: number): MemoryPairsConfig {
  const roundOffset = round - 1;
  let rows = 2;
  let cols = 3;
  if (roundOffset === 1) { rows = 2; cols = 4; } // 8 cards = 4 pairs
  else if (roundOffset >= 2) { rows = 3; cols = 4; } // 12 cards = 6 pairs

  const chanceBonus = winChance >= 80 ? 3 : winChance <= 40 ? -2 : 0;
  const timeLimit = Math.max(10, MINIGAMES_CONFIG.memory_pairs.base_difficulty.time_limit_seconds - roundOffset * MINIGAMES_CONFIG.memory_pairs.scaling_per_round.time_limit_seconds_sub + chanceBonus);
  const previewTime = Math.max(0.5, MINIGAMES_CONFIG.memory_pairs.base_difficulty.preview_time_seconds - roundOffset * MINIGAMES_CONFIG.memory_pairs.scaling_per_round.preview_time_seconds_sub);

  return { rows, cols, time_limit_seconds: timeLimit, preview_time_seconds: previewTime };
}

export function getTimingBarDifficulty(round: number, winChance: number): TimingBarConfig {
  const roundOffset = round - 1;
  const chanceBonus = winChance >= 80 ? 5 : winChance <= 40 ? -4 : 0;
  const targetSize = Math.max(10, MINIGAMES_CONFIG.timing_bar.base_difficulty.target_zone_size_percent - roundOffset * MINIGAMES_CONFIG.timing_bar.scaling_per_round.target_zone_size_percent_sub + chanceBonus);
  const speed = MINIGAMES_CONFIG.timing_bar.base_difficulty.indicator_speed + roundOffset * MINIGAMES_CONFIG.timing_bar.scaling_per_round.indicator_speed_add;
  const movement = roundOffset > 0 || winChance < 50;

  return { target_zone_size_percent: targetSize, indicator_speed: speed, target_zone_movement: movement };
}

export function getShellGameDifficulty(round: number, winChance: number): ShellGameConfig {
  const roundOffset = round - 1;
  const count = Math.min(5, MINIGAMES_CONFIG.shell_game.base_difficulty.shell_count + Math.floor(roundOffset * 0.5));
  const speed = MINIGAMES_CONFIG.shell_game.base_difficulty.shuffle_speed + roundOffset * MINIGAMES_CONFIG.shell_game.scaling_per_round.shuffle_speed_add;
  const swaps = MINIGAMES_CONFIG.shell_game.base_difficulty.shuffle_swaps + roundOffset * MINIGAMES_CONFIG.shell_game.scaling_per_round.shuffle_swaps_add;

  return { shell_count: count, shuffle_speed: speed, shuffle_swaps: swaps };
}

export function getTacticalStrikeDifficulty(round: number, winChance: number): TacticalStrikeConfig {
  const roundOffset = round - 1;
  const switchMs = Math.max(350, MINIGAMES_CONFIG.pkmn_tactical_strike.base_difficulty.defender_switch_interval_ms - roundOffset * 100);
  const blockedCount = roundOffset >= 2 ? 3 : 2;

  return {
    total_zones: 6,
    max_attempts: 6,
    target_score_to_win: 4,
    defender_switch_interval_ms: switchMs,
    blocked_zones_count_simultaneous: blockedCount
  };
}
