import { 
  PatientProfile, 
  ReminderItem, 
  GameResult, 
  CaregiverNote, 
  CaregiverAlert, 
  FamilyPhoto, 
  SyncQueueItem 
} from '../types';
import { 
  INITIAL_PATIENTS, 
  INITIAL_REMINDERS, 
  INITIAL_GAME_RESULTS, 
  INITIAL_CAREGIVER_NOTES, 
  INITIAL_ALERTS, 
  INITIAL_FAMILY_PHOTOS 
} from '../data/mockData';

const STORAGE_KEYS = {
  PATIENTS: 'smriti_patients',
  ACTIVE_PATIENT_ID: 'smriti_active_patient_id',
  REMINDERS: 'smriti_reminders',
  GAME_RESULTS: 'smriti_game_results',
  CAREGIVER_NOTES: 'smriti_caregiver_notes',
  ALERTS: 'smriti_alerts',
  PHOTOS: 'smriti_photos',
  SYNC_QUEUE: 'smriti_sync_queue',
  SIMULATED_OFFLINE: 'smriti_simulated_offline',
  LANGUAGE: 'smriti_language',
};

class StorageService {
  private isBrowser = typeof window !== 'undefined';

  private getItem<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser) return defaultValue;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Failed to read from localStorage: ${key}`, e);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save to localStorage: ${key}`, e);
    }
  }

  // Patients
  getPatients(): PatientProfile[] {
    const patients = this.getItem<PatientProfile[]>(STORAGE_KEYS.PATIENTS, []);
    if (patients.length === 0) {
      this.setItem(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
      return INITIAL_PATIENTS;
    }
    return patients;
  }

  savePatients(patients: PatientProfile[]): void {
    this.setItem(STORAGE_KEYS.PATIENTS, patients);
  }

  getActivePatient(): PatientProfile {
    const patients = this.getPatients();
    const activeId = this.getItem<string>(STORAGE_KEYS.ACTIVE_PATIENT_ID, patients[0]?.id || 'pat-1');
    const found = patients.find(p => p.id === activeId);
    return found || patients[0] || INITIAL_PATIENTS[0];
  }

  setActivePatientId(id: string): void {
    this.setItem(STORAGE_KEYS.ACTIVE_PATIENT_ID, id);
  }

  updateActivePatient(partial: Partial<PatientProfile>): PatientProfile {
    const patients = this.getPatients();
    const active = this.getActivePatient();
    const updated = { ...active, ...partial };
    const newPatients = patients.map(p => p.id === active.id ? updated : p);
    this.savePatients(newPatients);
    return updated;
  }

  // Reminders
  getReminders(): ReminderItem[] {
    const reminders = this.getItem<ReminderItem[]>(STORAGE_KEYS.REMINDERS, []);
    if (reminders.length === 0) {
      this.setItem(STORAGE_KEYS.REMINDERS, INITIAL_REMINDERS);
      return INITIAL_REMINDERS;
    }
    return reminders;
  }

  saveReminders(reminders: ReminderItem[]): void {
    this.setItem(STORAGE_KEYS.REMINDERS, reminders);
  }

  toggleReminderTaken(id: string, taken: boolean): ReminderItem[] {
    const reminders = this.getReminders();
    const updated = reminders.map(r => {
      if (r.id === id) {
        return {
          ...r,
          taken,
          skipped: false,
          lastUpdated: taken ? `Completed today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : undefined,
        };
      }
      return r;
    });
    this.saveReminders(updated);
    this.enqueueSync({ action: 'reminder_update', payload: { id, taken }, timestamp: new Date().toISOString() });
    return updated;
  }

  skipReminder(id: string): ReminderItem[] {
    const reminders = this.getReminders();
    const updated = reminders.map(r => {
      if (r.id === id) {
        return {
          ...r,
          skipped: true,
          taken: false,
          lastUpdated: `Skipped today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        };
      }
      return r;
    });
    this.saveReminders(updated);
    this.enqueueSync({ action: 'reminder_update', payload: { id, skipped: true }, timestamp: new Date().toISOString() });
    return updated;
  }

  // Hydration
  incrementWaterIntake(): number {
    const patient = this.getActivePatient();
    const current = patient.waterDrunkToday || 0;
    const newCount = current + 1;
    this.updateActivePatient({ waterDrunkToday: newCount });
    this.enqueueSync({ action: 'water_intake', payload: { glasses: newCount }, timestamp: new Date().toISOString() });
    return newCount;
  }

  // Game Results
  getGameResults(): GameResult[] {
    const results = this.getItem<GameResult[]>(STORAGE_KEYS.GAME_RESULTS, []);
    if (results.length === 0) {
      this.setItem(STORAGE_KEYS.GAME_RESULTS, INITIAL_GAME_RESULTS);
      return INITIAL_GAME_RESULTS;
    }
    return results;
  }

  saveGameResult(result: Omit<GameResult, 'id'>): GameResult {
    const newResult: GameResult = {
      ...result,
      id: `gr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
    const results = this.getGameResults();
    const updated = [newResult, ...results];
    this.setItem(STORAGE_KEYS.GAME_RESULTS, updated);
    this.enqueueSync({ action: 'game_result', payload: newResult, timestamp: newResult.timestamp });
    return newResult;
  }

  // Caregiver Notes
  getCaregiverNotes(): CaregiverNote[] {
    const notes = this.getItem<CaregiverNote[]>(STORAGE_KEYS.CAREGIVER_NOTES, []);
    if (notes.length === 0) {
      this.setItem(STORAGE_KEYS.CAREGIVER_NOTES, INITIAL_CAREGIVER_NOTES);
      return INITIAL_CAREGIVER_NOTES;
    }
    return notes;
  }

  addCaregiverNote(note: Omit<CaregiverNote, 'id' | 'timestamp'>): CaregiverNote {
    const newNote: CaregiverNote = {
      ...note,
      id: `note-${Date.now()}`,
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };
    const notes = this.getCaregiverNotes();
    const updated = [newNote, ...notes];
    this.setItem(STORAGE_KEYS.CAREGIVER_NOTES, updated);
    this.enqueueSync({ action: 'caregiver_note', payload: newNote, timestamp: new Date().toISOString() });
    return newNote;
  }

  // Alerts
  getAlerts(): CaregiverAlert[] {
    const alerts = this.getItem<CaregiverAlert[]>(STORAGE_KEYS.ALERTS, []);
    if (alerts.length === 0) {
      this.setItem(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
      return INITIAL_ALERTS;
    }
    return alerts;
  }

  markAlertRead(id: string): void {
    const alerts = this.getAlerts();
    const updated = alerts.map(a => a.id === id ? { ...a, read: true } : a);
    this.setItem(STORAGE_KEYS.ALERTS, updated);
  }

  // Family Photos
  getPhotos(): FamilyPhoto[] {
    const photos = this.getItem<FamilyPhoto[]>(STORAGE_KEYS.PHOTOS, []);
    if (photos.length === 0) {
      this.setItem(STORAGE_KEYS.PHOTOS, INITIAL_FAMILY_PHOTOS);
      return INITIAL_FAMILY_PHOTOS;
    }
    return photos;
  }

  addPhoto(photo: Omit<FamilyPhoto, 'id'>): FamilyPhoto {
    const newPhoto: FamilyPhoto = {
      ...photo,
      id: `pho-${Date.now()}`,
    };
    const photos = this.getPhotos();
    const updated = [newPhoto, ...photos];
    this.setItem(STORAGE_KEYS.PHOTOS, updated);
    return newPhoto;
  }

  // Offline Sync Queue
  getSyncQueue(): SyncQueueItem[] {
    return this.getItem<SyncQueueItem[]>(STORAGE_KEYS.SYNC_QUEUE, []);
  }

  private enqueueSync(item: Omit<SyncQueueItem, 'id' | 'synced'>): void {
    const queue = this.getSyncQueue();
    const newItem: SyncQueueItem = {
      ...item,
      id: `sq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      synced: false,
    };
    this.setItem(STORAGE_KEYS.SYNC_QUEUE, [...queue, newItem]);
  }

  clearSyncQueue(): void {
    this.setItem(STORAGE_KEYS.SYNC_QUEUE, []);
  }

  // Simulated Offline Status (for testing and hackathon demonstration)
  isSimulatedOffline(): boolean {
    return this.getItem<boolean>(STORAGE_KEYS.SIMULATED_OFFLINE, false);
  }

  setSimulatedOffline(val: boolean): void {
    this.setItem(STORAGE_KEYS.SIMULATED_OFFLINE, val);
  }

  // Reset to initial demo data
  resetDemoData(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_PATIENT_ID);
    localStorage.removeItem(STORAGE_KEYS.REMINDERS);
    localStorage.removeItem(STORAGE_KEYS.GAME_RESULTS);
    localStorage.removeItem(STORAGE_KEYS.CAREGIVER_NOTES);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    localStorage.removeItem(STORAGE_KEYS.PHOTOS);
    localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
    localStorage.removeItem(STORAGE_KEYS.SIMULATED_OFFLINE);
  }
}

export const storageService = new StorageService();
