export type MinigameId = 'sequence_repeat' | 'memory_pairs' | 'timing_bar' | 'shell_game' | 'pkmn_tactical_strike';

export interface SequenceRepeatConfig {
  sequence_length: number;
  display_speed_ms: number;
  available_buttons: string[];
}

export interface MemoryPairsConfig {
  rows: number;
  cols: number;
  time_limit_seconds: number;
  preview_time_seconds: number;
}

export interface TimingBarConfig {
  target_zone_size_percent: number;
  indicator_speed: number;
  target_zone_movement: boolean;
}

export interface ShellGameConfig {
  shell_count: number;
  shuffle_speed: number;
  shuffle_swaps: number;
}

export interface TacticalStrikeConfig {
  total_zones: number;
  max_attempts: number;
  target_score_to_win: number;
  defender_switch_interval_ms: number;
  blocked_zones_count_simultaneous: number;
}

export interface MinigameSessionProps {
  round: number; // 1-indexed (e.g. Enemy Pokémon 1 of N)
  totalRounds: number; // Enemy team count
  teamLives: number; // Lives remaining (based on player team size)
  maxTeamLives: number; // Player team size
  combatWinChance: number; // 0-100 percentage
  onRoundSuccess: () => void;
  onRoundFail: () => void;
}
