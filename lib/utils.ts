import bcrypt from 'bcryptjs';

// Authentication helper
export async function validatePassword(password: string, storedPassword: string): Promise<boolean> {
  // For this implementation, we're using plain text comparison with env variables
  // In a production app, you would use bcrypt to hash passwords
  return password === storedPassword;
}

// Random selection with weighting based on score (instead of points)
export function selectRandomParticipant(participants: any[]) {
  if (participants.length === 0) {
    return null;
  }
  
  // If only one participant, return that one
  if (participants.length === 1) {
    return participants[0];
  }
  
  // Create a weighted array based on score
  const weightedArray: number[] = [];
  
  participants.forEach((participant, index) => {
    // Use score as weight - higher score = higher chance
    const weight = participant.score || 1;
    for (let i = 0; i < weight; i++) {
      weightedArray.push(index);
    }
  });
  
  // Select random index from weighted array
  const randomIndex = Math.floor(Math.random() * weightedArray.length);
  const selectedIndex = weightedArray[randomIndex];
  
  return participants[selectedIndex];
}

// Format date for display
export function formatDate(date: string | Date) {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('ar-SA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(d);
}

// Convert program name to Arabic
export function getProgramNameArabic(program: string) {
  return program === 'Primary_Program' ? 'البرنامج الابتدائي' : 'البرنامج الثانوي';
}

// Convert ranking to Arabic
export function getRankingNameArabic(ranking: string) {
  const rankings: Record<string, string> = {
    '1': 'الجائزة الأولى',
    '2': 'الجائزة الثانية',
    '3': 'الجائزة الثالثة',
    '4': 'الجائزة الرابعة',
    '5': 'الجائزة الخامسة',
  };
  
  return rankings[ranking] || ranking;
}
