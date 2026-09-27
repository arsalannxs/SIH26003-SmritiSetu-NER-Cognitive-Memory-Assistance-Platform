import React, { useState, useEffect } from 'react';
import { UserMode, Language, PatientProfile } from '../types';
import { voiceService } from '../services/voiceService';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Brain, 
  Pill, 
  Mic, 
  TrendingUp, 
  WifiOff, 
  Wifi, 
  RotateCcw,
  Smartphone,
  ShieldCheck
} from 'lucide-react';

interface RunDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  setUserMode: (mode: UserMode) => void;
  onNavigateTab: (tab: 'home' | 'play' | 'reminders' | 'progress') => void;
  onOpenVoice: () => void;
  toggleOffline: (simulate: boolean) => void;
  language: Language;
  patient: PatientProfile;
}

interface DemoStep {
  stepNumber: number;
  title: string;
  category: 'elderly' | 'caregiver' | 'offline_sync';
  description: string;
  actionLabel: string;
  narration: string;
}

export const RunDemoModal: React.FC<RunDemoModalProps> = ({
  isOpen,
  onClose,
  setUserMode,
  onNavigateTab,
  onOpenVoice,
  toggleOffline,
  language,
  patient,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps: DemoStep[] = [
    {
      stepNumber: 1,
      title: 'Elderly User Opens App',
      category: 'elderly',
      description: 'Dhiren Borah opens the SmritiSetu NER interface. Ultra-large buttons, high contrast, warm color palette, zero clutter.',
      actionLabel: 'Go to Elderly Home',
      narration: 'Welcome to SmritiSetu NER, designed for elderly individuals in the North Eastern Region.',
    },
    {
      stepNumber: 2,
      title: 'App Greets the User',
      category: 'elderly',
      description: 'Personalized morning greeting in regional language (Assamese / Hindi / English) with warm AI supportive message.',
      actionLabel: 'Listen to Greeting',
      narration: 'Good morning Dhiren! You are ready for a peaceful day.',
    },
    {
      stepNumber: 3,
      title: 'User Starts a Memory Game',
      category: 'elderly',
      description: 'Taps the large 🧠 Play card. Culturally familiar NER items appear (Assam tea leaf, Hornbill, Rhinoceros, Japi hat).',
      actionLabel: 'Launch Mind Games',
      narration: 'Let us start the Assam flora and culture card memory match.',
    },
    {
      stepNumber: 4,
      title: 'Game Records Performance',
      category: 'elderly',
      description: 'Patient completes pairs with calm focus. Attempts, accuracy, response time, and completion are securely recorded.',
      actionLabel: 'Record Activity',
      narration: 'Activity completed with steady focus and joy.',
    },
    {
      stepNumber: 5,
      title: 'Difficulty is Adapted',
      category: 'elderly',
      description: 'Adaptive Difficulty Engine promotes level from Gentle (Easy) to Mild (Easy+). Zero clinical judgment or disease labeling.',
      actionLabel: 'Inspect Adaptive Level',
      narration: 'Activity difficulty smoothly stepped up based on comfort.',
    },
    {
      stepNumber: 6,
      title: 'Medicine Reminder Appears',
      category: 'elderly',
      description: 'Non-intrusive reminder for Blood Pressure medicine with caregiver instructions and warm hydration reminder.',
      actionLabel: 'Open Medicines View',
      narration: 'Time for morning blood pressure medicine with warm water.',
    },
    {
      stepNumber: 7,
      title: 'User Marks Medicine as Taken',
      category: 'elderly',
      description: 'One-tap large green button marks medication as completed. Caregiver is notified in background.',
      actionLabel: 'Mark Taken',
      narration: 'Medicine marked completed successfully.',
    },
    {
      stepNumber: 8,
      title: 'Voice Assistant Query',
      category: 'elderly',
      description: 'Elderly user taps big mic and speaks: "What do I have today?" Speech recognition captures audio.',
      actionLabel: 'Open Voice Assistant',
      narration: 'User asks voice assistant: What do I have today?',
    },
    {
      stepNumber: 9,
      title: 'Voice Assistant Responds',
      category: 'elderly',
      description: 'Gemini AI generates warm 1-sentence answer; browser Text-to-Speech speaks it aloud at measured elderly-friendly speed.',
      actionLabel: 'Hear Voice Response',
      narration: 'Today you have your scheduled medication, a relaxing memory game, and family time this evening.',
    },
    {
      stepNumber: 10,
      title: 'Caregiver Opens Dashboard',
      category: 'caregiver',
      description: 'Caregiver switches to dedicated portal. Sees real-time activity status, patient profile, and notifications.',
      actionLabel: 'Switch to Caregiver Mode',
      narration: 'Caregiver accesses engagement monitoring dashboard.',
    },
    {
      stepNumber: 11,
      title: 'Caregiver Sees Activity Completion',
      category: 'caregiver',
      description: 'Clear visualization showing morning memory game completed and medicine taken without medical jargon.',
      actionLabel: 'Inspect Activity Metrics',
      narration: 'Today activities show consistent routine adherence.',
    },
    {
      stepNumber: 12,
      title: 'Weekly Engagement Trend',
      category: 'caregiver',
      description: 'Recharts graphs display 7-day, 30-day, and 90-day engagement consistency and focus rate trends.',
      actionLabel: 'View Recharts Analytics',
      narration: 'Weekly trends reflect steady daily participation.',
    },
    {
      stepNumber: 13,
      title: 'Caregiver Adds an Observation',
      category: 'caregiver',
      description: 'Caregiver logs note: "Loved the tea garden memory match today; enjoyed humming during Rongali Bihu photos."',
      actionLabel: 'View Caregiver Notes',
      narration: 'Observation saved securely for family and community review.',
    },
    {
      stepNumber: 14,
      title: 'System Works Offline',
      category: 'offline_sync',
      description: 'Rural village internet drops. App detects offline status. All games, reminders, and notes continue functioning locally.',
      actionLabel: 'Simulate Offline Drop',
      narration: 'Simulating remote village offline connectivity.',
    },
    {
      stepNumber: 15,
      title: 'Data is Queued Locally',
      category: 'offline_sync',
      description: 'IndexedDB/LocalStorage stores game results and hydration marks into an offline sync queue.',
      actionLabel: 'Inspect Sync Queue',
      narration: 'Activity is safely queued on device.',
    },
    {
      stepNumber: 16,
      title: 'Connection Returns',
      category: 'offline_sync',
      description: 'Internet connectivity restored in the North Eastern district. Sync worker triggers automatically.',
      actionLabel: 'Restore Online Connection',
      narration: 'Network connectivity re-established.',
    },
    {
      stepNumber: 17,
      title: 'Data Synchronizes Successfully',
      category: 'offline_sync',
      description: 'Queue drains cleanly. Real-time caregiver dashboard refreshes with zero data loss. SIH26003 flow complete!',
      actionLabel: 'Complete Demonstration',
      narration: 'All data synchronized seamlessly. Prototype demonstration complete.',
    },
  ];

  const currentStepData = steps[currentStep - 1];

  const executeStepAction = (stepIndex: number) => {
    const s = steps[stepIndex - 1];
    voiceService.speak(s.narration, language);

    switch (s.stepNumber) {
      case 1:
      case 2:
        setUserMode('patient');
        onNavigateTab('home');
        break;
      case 3:
      case 4:
      case 5:
        setUserMode('patient');
        onNavigateTab('play');
        break;
      case 6:
      case 7:
        setUserMode('patient');
        onNavigateTab('reminders');
        break;
      case 8:
      case 9:
        onOpenVoice();
        break;
      case 10:
      case 11:
      case 12:
      case 13:
        setUserMode('caregiver');
        break;
      case 14:
      case 15:
        toggleOffline(true);
        break;
      case 16:
      case 17:
        toggleOffline(false);
        break;
      default:
        break;
    }
  };

  const goToNextStep = () => {
    if (currentStep < steps.length) {
      const next = currentStep + 1;
      setCurrentStep(next);
      executeStepAction(next);
    } else {
      setIsPlaying(false);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      executeStepAction(prev);
    }
  };

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStep < steps.length) {
          goToNextStep();
        } else {
          setIsPlaying(false);
        }
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border-4 border-amber-400 flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black">
              SIH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">
                  Hackathon Demonstration Flow (Req 32)
                </span>
                <span className="text-[11px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded">
                  SIH26003 • MDoNER
                </span>
              </div>
              <h2 className="text-lg font-black text-white">
                Live Scenario Walkthrough
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar across 17 steps */}
        <div className="bg-stone-100 h-2 w-full overflow-hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Step Pill & Category */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              Step {currentStep} of {steps.length}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              currentStepData.category === 'elderly'
                ? 'bg-emerald-100 text-emerald-900'
                : currentStepData.category === 'caregiver'
                ? 'bg-teal-100 text-teal-900'
                : 'bg-rose-100 text-rose-900'
            }`}>
              {currentStepData.category.replace('_', ' ')}
            </span>
          </div>

          {/* Step Title & Description */}
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-stone-900">
              {currentStepData.title}
            </h3>
            <p className="text-base font-semibold text-stone-700 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Action Execution Button */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[11px] font-black uppercase text-amber-900 tracking-wider">
                Live App Transition:
              </span>
              <p className="text-sm font-bold text-stone-800">
                "{currentStepData.narration}"
              </p>
            </div>
            <button
              onClick={() => executeStepAction(currentStep)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-xs transition-all active:scale-95 shrink-0"
            >
              Trigger: {currentStepData.actionLabel}
            </button>
          </div>

          {/* Step Navigation Dots */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap pt-2">
            {steps.map((s) => (
              <button
                key={s.stepNumber}
                onClick={() => {
                  setCurrentStep(s.stepNumber);
                  executeStepAction(s.stepNumber);
                }}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  s.stepNumber === currentStep
                    ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-300 font-black scale-110 shadow-xs'
                    : s.stepNumber < currentStep
                    ? 'bg-emerald-200 text-emerald-950'
                    : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                }`}
              >
                {s.stepNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Controls: Prev, Play/Pause, Next */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-between gap-4">
          <button
            onClick={goToPrevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 disabled:opacity-40 text-stone-800 font-bold text-sm transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm shadow-xs transition-all active:scale-95 ${
              isPlaying
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-stone-900 hover:bg-stone-800 text-amber-300'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Auto-Play</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Auto-Play Demo</span>
              </>
            )}
          </button>

          <button
            onClick={goToNextStep}
            disabled={currentStep === steps.length}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-black text-sm shadow-xs transition-all active:scale-95"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
