import type { DrawMode, ParticipantDto } from './types';
import initialData from '../participants.json';

const STORAGE_KEY = 'sa7b_participants';

/**
 * Loads participants from localStorage.
 * On first load, seeds from the bundled participants.json.
 */
export function loadParticipants(): ParticipantDto[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as ParticipantDto[];
    } catch {
      // corrupt data — fall through to seed
    }
  }

  // First visit: seed from the JSON file
  const seeded = (initialData as ParticipantDto[]).map((p) => ({
    ...p,
    excluded_all: 0,
    excluded_pre_k_k3: 0,
    excluded_k4_k7: 0,
    excluded_by_mode: null,
    excluded_reason: null,
    excluded_at: null,
  })) as ParticipantDto[];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

function saveParticipants(participants: ParticipantDto[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
}

export function getAvailableParticipants(mode: DrawMode): ParticipantDto[] {
  const participants = loadParticipants();

  if (mode === 'all') {
    return participants.filter((p) => p.excluded_all === 0);
  }
  if (mode === 'pre_k_k3') {
    return participants.filter((p) => p.cohort === 'pre_k_k3' && p.excluded_all === 0);
  }
  if (mode === 'k4_k7') {
    return participants.filter((p) => p.cohort === 'k4_k7' && p.excluded_all === 0);
  }
  return [];
}

export function drawWinner(mode: DrawMode): ParticipantDto | null {
  const available = getAvailableParticipants(mode);
  if (available.length === 0) return null;

  const winner = available[Math.floor(Math.random() * available.length)]!;

  // Exclude the winner
  const participants = loadParticipants();
  const participant = participants.find((p) => p.id === winner.id);
  if (participant) {
    participant.excluded_all = 1;
    participant.excluded_pre_k_k3 = 1;
    participant.excluded_k4_k7 = 1;
    participant.excluded_by_mode = mode;
    participant.excluded_at = new Date().toISOString();
    saveParticipants(participants);
  }

  return winner;
}

export function getStats() {
  const participants = loadParticipants();
  const totalParticipants = participants.length;
  const totalExcluded = participants.filter((p) => p.excluded_all === 1).length;
  const remainingPreKK3 = participants.filter(
    (p) => p.cohort === 'pre_k_k3' && p.excluded_all === 0,
  ).length;
  const remainingK4K7 = participants.filter(
    (p) => p.cohort === 'k4_k7' && p.excluded_all === 0,
  ).length;

  const excludedParticipants = participants
    .filter((p) => p.excluded_all === 1)
    .reverse();

  return {
    stats: { totalParticipants, totalExcluded, remainingPreKK3, remainingK4K7 },
    excludedParticipants,
  };
}

export function restoreParticipant(id: number): void {
  const participants = loadParticipants();
  const participant = participants.find((p) => p.id === id);
  if (!participant) return;

  participant.excluded_all = 0;
  participant.excluded_pre_k_k3 = 0;
  participant.excluded_k4_k7 = 0;
  participant.excluded_by_mode = null;
  participant.excluded_reason = null;
  participant.excluded_at = null;
  saveParticipants(participants);
}

export function restoreAllParticipants(): void {
  const participants = loadParticipants();
  participants.forEach((p) => {
    p.excluded_all = 0;
    p.excluded_pre_k_k3 = 0;
    p.excluded_k4_k7 = 0;
    p.excluded_by_mode = null;
    p.excluded_reason = null;
    p.excluded_at = null;
  });
  saveParticipants(participants);
}
