export type UserMode = 'patient' | 'caregiver' | 'healthcare';

export type Language = 'en' | 'hi' | 'as';

export type CulturalTheme = 'assam_tea_flora' | 'ne_wildlife' | 'heritage_festivals' | 'himalayan_nature';

export type DifficultyLevel = 'easy' | 'easy_plus' | 'medium' | 'hard';

export type GameType = 
  | 'memory_match' 
  | 'routine_sequence' 
  | 'object_recognition' 
  | 'pattern' 
  | 'attention' 
  | 'family_photo';

export interface GameResult {
  id: string;
  gameType: GameType;
  gameName: string;
  score: number;
  maxScore: number;
  timeSeconds: number;
  attempts: number;
  accuracy: number; // 0 - 100
  difficulty: DifficultyLevel;
  timestamp: string;
  completed: boolean;
}

export interface ReminderItem {
  id: string;
  title: string;
  type: 'medicine' | 'water' | 'meal' | 'walk' | 'game' | 'appointment' | 'family';
  time: string; // HH:mm format, e.g. "08:00"
  dosageInstruction?: string;
  notes?: string;
  location?: string;
  taken: boolean;
  skipped: boolean;
  frequency: string; // e.g. "Daily", "Weekly"
  lastUpdated?: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  state: string; // e.g. "Assam", "Meghalaya", "Arunachal Pradesh"
  preferredLanguage: Language;
  theme: CulturalTheme;
  caregiverName: string;
  caregiverPhone: string;
  waterGoalGlasses: number;
  waterDrunkToday: number;
  currentDifficulty: DifficultyLevel;
}

export interface CaregiverNote {
  id: string;
  patientId: string;
  author: string;
  role: 'caregiver' | 'healthcare_worker';
  timestamp: string;
  text: string;
  category: 'general' | 'mood' | 'routine' | 'game_feedback';
}

export interface CaregiverAlert {
  id: string;
  type: 'missed_reminder' | 'inactivity' | 'sync_pending' | 'caregiver_note';
  title: string;
  message: string;
  severity: 'info' | 'warning';
  timestamp: string;
  read: boolean;
}

export interface FamilyPhoto {
  id: string;
  patientId: string;
  title: string;
  personName: string;
  relationship: string;
  imageUrl: string;
  storyPrompt: string;
  year?: string;
}

export interface SyncQueueItem {
  id: string;
  action: 'game_result' | 'reminder_update' | 'water_intake' | 'caregiver_note';
  payload: any;
  timestamp: string;
  synced: boolean;
}
