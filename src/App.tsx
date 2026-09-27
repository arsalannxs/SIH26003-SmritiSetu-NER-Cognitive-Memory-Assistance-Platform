/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserMode, 
  Language, 
  PatientProfile, 
  ReminderItem, 
  GameResult, 
  CaregiverNote, 
  CaregiverAlert, 
  GameType 
} from './types';
import { storageService } from './services/storageService';
import { adaptiveDifficultyEngine } from './services/adaptiveDifficulty';
import { Header } from './components/Header';
import { BottomNav, PatientTab } from './components/BottomNav';
import { VoiceModal } from './components/VoiceModal';
import { RunDemoModal } from './components/RunDemoModal';
import { OfflineBanner } from './components/OfflineBanner';

// Patient Views
import { PatientHome } from './patient/PatientHome';
import { GamesMenu } from './patient/GamesMenu';
import { RemindersView } from './patient/RemindersView';
import { PatientProgress } from './patient/PatientProgress';

// Games
import { MemoryMatchGame } from './games/MemoryMatchGame';
import { RoutineSequenceGame } from './games/RoutineSequenceGame';
import { ObjectRecognitionGame } from './games/ObjectRecognitionGame';
import { PatternGame } from './games/PatternGame';
import { AttentionGame } from './games/AttentionGame';
import { FamilyPhotoGame } from './games/FamilyPhotoGame';

// Portals
import { CaregiverDashboard } from './caregiver/CaregiverDashboard';
import { HealthcareWorkerDashboard } from './healthcare/HealthcareWorkerDashboard';

export default function App() {
  const [userMode, setUserMode] = useState<UserMode>('patient');
  const [language, setLanguage] = useState<Language>('en');
  
  // Data State
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [activePatient, setActivePatient] = useState<PatientProfile | null>(null);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [caregiverNotes, setCaregiverNotes] = useState<CaregiverNote[]>([]);
  const [alerts, setAlerts] = useState<CaregiverAlert[]>([]);
  
  // Navigation State
  const [patientTab, setPatientTab] = useState<PatientTab>('home');
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  
  // Modals
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isRunDemoModalOpen, setIsRunDemoModalOpen] = useState(false);
  
  // Offline & Sync State
  const [isOffline, setIsOffline] = useState(false);
  const [syncQueueCount, setSyncQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [justSynced, setJustSynced] = useState(false);

  // Initial load
  useEffect(() => {
    const loadedPatients = storageService.getPatients();
    const active = storageService.getActivePatient();
    setPatients(loadedPatients);
    setActivePatient(active);
    setLanguage(active.preferredLanguage || 'en');
    setReminders(storageService.getReminders());
    setGameResults(storageService.getGameResults());
    setCaregiverNotes(storageService.getCaregiverNotes());
    setAlerts(storageService.getAlerts());
    setSyncQueueCount(storageService.getSyncQueue().length);
    setIsOffline(storageService.isSimulatedOffline() || (typeof navigator !== 'undefined' && !navigator.onLine));

    // Online/offline listeners
    const handleOnline = () => {
      if (!storageService.isSimulatedOffline()) {
        triggerSyncProcess();
      }
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerSyncProcess = () => {
    setIsOffline(false);
    setIsSyncing(true);
    setTimeout(() => {
      storageService.clearSyncQueue();
      setSyncQueueCount(0);
      setIsSyncing(false);
      setJustSynced(true);
      setTimeout(() => setJustSynced(false), 3500);
    }, 1200);
  };

  const toggleSimulatedOffline = () => {
    const nextState = !isOffline;
    setIsOffline(nextState);
    storageService.setSimulatedOffline(nextState);
    if (!nextState) {
      triggerSyncProcess();
    }
  };

  const handlePatientChange = (id: string) => {
    storageService.setActivePatientId(id);
    const updated = storageService.getActivePatient();
    setActivePatient(updated);
    setLanguage(updated.preferredLanguage || 'en');
  };

  const handleToggleReminder = (id: string, taken: boolean) => {
    const updated = storageService.toggleReminderTaken(id, taken);
    setReminders(updated);
    setSyncQueueCount(storageService.getSyncQueue().length);
  };

  const handleSkipReminder = (id: string) => {
    const updated = storageService.skipReminder(id);
    setReminders(updated);
    setSyncQueueCount(storageService.getSyncQueue().length);
  };

  const handleDrinkWater = () => {
    storageService.incrementWaterIntake();
    const updatedPatient = storageService.getActivePatient();
    setActivePatient(updatedPatient);
    setSyncQueueCount(storageService.getSyncQueue().length);
  };

  const handleGameComplete = (result: GameResult) => {
    const updatedResults = storageService.getGameResults();
    setGameResults(updatedResults);
    setSyncQueueCount(storageService.getSyncQueue().length);

    // Adaptive Difficulty check
    if (activePatient) {
      const evaluation = adaptiveDifficultyEngine.evaluateDifficulty(
        activePatient.currentDifficulty,
        updatedResults
      );
      if (evaluation.suggestedDifficulty !== activePatient.currentDifficulty) {
        const updated = storageService.updateActivePatient({
          currentDifficulty: evaluation.suggestedDifficulty,
        });
        setActivePatient(updated);
      }
    }
  };

  const handleNoteAdded = (newNote: CaregiverNote) => {
    setCaregiverNotes(storageService.getCaregiverNotes());
    setSyncQueueCount(storageService.getSyncQueue().length);
  };

  const handleAlertRead = (id: string) => {
    storageService.markAlertRead(id);
    setAlerts(storageService.getAlerts());
  };

  if (!activePatient) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-amber-200">
      {/* Header with Modes, Language, Offline Indicator, and SIH Demo Button */}
      <Header
        userMode={userMode}
        setUserMode={setUserMode}
        language={language}
        setLanguage={setLanguage}
        activePatient={activePatient}
        isOffline={isOffline}
        toggleSimulatedOffline={toggleSimulatedOffline}
        syncQueueCount={syncQueueCount}
        onOpenRunDemo={() => setIsRunDemoModalOpen(true)}
      />

      {/* Offline & Sync Notification Banner */}
      <OfflineBanner
        isOffline={isOffline}
        syncQueueCount={syncQueueCount}
        isSyncing={isSyncing}
        justSynced={justSynced}
        language={language}
        onRestoreOnline={() => {
          storageService.setSimulatedOffline(false);
          triggerSyncProcess();
        }}
      />

      {/* Main Content Area based on User Mode */}
      <main className="max-w-6xl mx-auto">
        {/* MODE A: ELDERLY / PATIENT MODE */}
        {userMode === 'patient' && (
          <div>
            {/* If a game is active, render that specific game */}
            {activeGame === 'memory_match' && (
              <MemoryMatchGame
                patient={activePatient}
                language={language}
                onBack={() => setActiveGame(null)}
                onGameComplete={handleGameComplete}
              />
            )}

            {activeGame === 'routine_sequence' && (
              <RoutineSequenceGame
                patient={activePatient}
                language={language}
                onBack={() => setActiveGame(null)}
                onGameComplete={handleGameComplete}
              />
            )}

            {activeGame === 'object_recognition' && (
              <ObjectRecognitionGame
                patient={activePatient}
                language={language}
                onBack={() => setActiveGame(null)}
                onGameComplete={handleGameComplete}
              />
            )}

            {activeGame === 'pattern' && (
              <PatternGame
                patient={activePatient}
                language={language}
                onBack={() => setActiveGame(null)}
                onGameComplete={handleGameComplete}
              />
            )}

            {activeGame === 'attention' && (
              <AttentionGame
                patient={activePatient}
                language={language}
                onBack={() => setActiveGame(null)}
                onGameComplete={handleGameComplete}
              />
            )}

            {activeGame === 'family_photo' && (
              <FamilyPhotoGame
                patient={activePatient}
                language={language}
                onBack={() => setActiveGame(null)}
              />
            )}

            {/* If no game is active, render the chosen bottom nav screen */}
            {!activeGame && patientTab === 'home' && (
              <PatientHome
                patient={activePatient}
                reminders={reminders}
                language={language}
                onNavigateTab={(tab) => setPatientTab(tab)}
                onOpenVoice={() => setIsVoiceModalOpen(true)}
                onDrinkWater={handleDrinkWater}
                onToggleReminder={handleToggleReminder}
              />
            )}

            {!activeGame && patientTab === 'play' && (
              <GamesMenu
                patient={activePatient}
                language={language}
                onSelectGame={(g) => setActiveGame(g)}
                onBack={() => setPatientTab('home')}
              />
            )}

            {!activeGame && patientTab === 'reminders' && (
              <RemindersView
                patient={activePatient}
                reminders={reminders}
                language={language}
                onBack={() => setPatientTab('home')}
                onToggleReminder={handleToggleReminder}
                onSkipReminder={handleSkipReminder}
                onDrinkWater={handleDrinkWater}
              />
            )}

            {!activeGame && patientTab === 'progress' && (
              <PatientProgress
                patient={activePatient}
                gameResults={gameResults}
                reminders={reminders}
                language={language}
                onBack={() => setPatientTab('home')}
              />
            )}

            {/* Large Elderly Bottom Navigation Bar */}
            {!activeGame && (
              <BottomNav
                currentTab={patientTab}
                setTab={(tab) => setPatientTab(tab)}
                language={language}
                onOpenVoice={() => setIsVoiceModalOpen(true)}
              />
            )}
          </div>
        )}

        {/* MODE B: CAREGIVER MODE */}
        {userMode === 'caregiver' && (
          <CaregiverDashboard
            patients={patients}
            activePatient={activePatient}
            setActivePatientId={handlePatientChange}
            gameResults={gameResults}
            reminders={reminders}
            caregiverNotes={caregiverNotes}
            alerts={alerts}
            language={language}
            onPatientUpdated={(updated) => setActivePatient(updated)}
            onNoteAdded={handleNoteAdded}
            onAlertRead={handleAlertRead}
          />
        )}

        {/* MODE C: FIELD / HEALTHCARE WORKER MODE */}
        {userMode === 'healthcare' && (
          <HealthcareWorkerDashboard
            patients={patients}
            activePatient={activePatient}
            setActivePatientId={handlePatientChange}
            caregiverNotes={caregiverNotes}
            language={language}
            onNoteAdded={handleNoteAdded}
          />
        )}
      </main>

      {/* Voice Assistant Modal */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        language={language}
        patient={activePatient}
        onNavigateTab={(tab) => {
          setIsVoiceModalOpen(false);
          setUserMode('patient');
          setActiveGame(null);
          setPatientTab(tab);
        }}
        onDrinkWater={handleDrinkWater}
      />

      {/* SIH Presentation 17-Step Demo Modal */}
      <RunDemoModal
        isOpen={isRunDemoModalOpen}
        onClose={() => setIsRunDemoModalOpen(false)}
        setUserMode={setUserMode}
        onNavigateTab={(tab) => {
          setActiveGame(null);
          setPatientTab(tab);
        }}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
        toggleOffline={(offline) => {
          setIsOffline(offline);
          storageService.setSimulatedOffline(offline);
          if (!offline) triggerSyncProcess();
        }}
        language={language}
        patient={activePatient}
      />
    </div>
  );
}
