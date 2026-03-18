export type DrawMode = 'all' | 'pre_k_k3' | 'k4_k7';

export type ParticipantDto = {
  id: number;
  name: string;
  cohort: 'pre_k_k3' | 'k4_k7';
  points: number;
  rank: string;
  state: string;
  excluded_all: number;
  excluded_pre_k_k3: number;
  excluded_k4_k7: number;
  excluded_by_mode: 'all' | 'pre_k_k3' | 'k4_k7' | null;
  excluded_reason: string | null;
  excluded_at: string | null;
};

export type StatsDto = {
  totalParticipants: number;
  totalExcluded: number;
  remainingPreKK3: number;
  remainingK4K7: number;
};
