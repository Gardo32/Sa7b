import fs from 'node:fs';
import path from 'node:path';
import type { ParticipantDto } from './types';

export type DrawMode = 'all' | 'pre_k_k3' | 'k4_k7';

const dataFilePath = path.join(process.cwd(), 'participants.json');

const readParticipants = (): ParticipantDto[] => {
  try {
    if (!fs.existsSync(dataFilePath)) return [];
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read data:', err);
    return [];
  }
};

const writeParticipants = (participants: ParticipantDto[]): void => {
  try {
    const tempPath = `${dataFilePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(participants, null, 2), 'utf-8');
    fs.renameSync(tempPath, dataFilePath);
  } catch (err) {
    console.error('Failed to write data:', err);
  }
};

export const getParticipants = (): ParticipantDto[] => {
  return readParticipants();
};

export const getParticipantById = (id: number): ParticipantDto | undefined => {
  const participants = readParticipants();
  return participants.find((p) => p.id === id);
};

export const getParticipantsByCohort = (cohort: 'pre_k_k3' | 'k4_k7'): ParticipantDto[] => {
  const participants = readParticipants();
  return participants.filter((p) => p.cohort === cohort);
};

export const getAvailableParticipants = (mode: DrawMode): ParticipantDto[] => {
  const participants = readParticipants();
  
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
};

export const excludeParticipant = (id: number, mode: DrawMode): void => {
  const participants = readParticipants();
  const participant = participants.find((p) => p.id === id);
  
  if (!participant) return;
  
  participant.excluded_all = 1;
  participant.excluded_pre_k_k3 = 1;
  participant.excluded_k4_k7 = 1;
  participant.excluded_by_mode = mode;
  participant.excluded_at = new Date().toISOString();
  
  writeParticipants(participants);
};

export const resetAllExclusions = (): void => {
  const participants = readParticipants();
  participants.forEach((p) => {
    p.excluded_all = 0;
    p.excluded_pre_k_k3 = 0;
    p.excluded_k4_k7 = 0;
    p.excluded_by_mode = null;
    p.excluded_reason = null;
    p.excluded_at = null;
  });
  writeParticipants(participants);
};

export const resetParticipant = (id: number): void => {
  const participants = readParticipants();
  const participant = participants.find((p) => p.id === id);
  
  if (!participant) return;
  
  participant.excluded_all = 0;
  participant.excluded_pre_k_k3 = 0;
  participant.excluded_k4_k7 = 0;
  participant.excluded_by_mode = null;
  participant.excluded_reason = null;
  participant.excluded_at = null;
  writeParticipants(participants);
};

