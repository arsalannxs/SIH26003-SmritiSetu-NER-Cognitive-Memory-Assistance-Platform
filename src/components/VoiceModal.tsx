import React, { useState, useEffect } from 'react';
import { Language, PatientProfile } from '../types';
import { translations } from '../translations';
import { voiceService } from '../services/voiceService';
import { aiService } from '../services/aiService';
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, HelpCircle } from 'lucide-react';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  patient: PatientProfile;
  onNavigateTab?: (tab: 'home' | 'play' | 'reminders' | 'progress') => void;
  onDrinkWater?: () => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  language,
  patient,
  onNavigateTab,
  onDrinkWater,
}) => {
  const t = translations[language];
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [isSpeakingResponse, setIsSpeakingResponse] = useState(false);
  const [recognizer, setRecognizer] = useState<any>(null);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      voiceService.stopSpeaking();
      setIsListening(false);
      setIsSpeakingResponse(false);
    }
  }, [isOpen]);

  const handleQuery = async (queryText: string) => {
    setSpokenText(queryText);
    setIsListening(false);

    // Contextual direct actions based on voice query
    const lower = queryText.toLowerCase();
    if (lower.includes('game') || lower.includes('play') || lower.includes('खेल') || lower.includes('খেল')) {
      if (onNavigateTab) {
        setTimeout(() => onNavigateTab('play'), 2500);
      }
    } else if (lower.includes('water') || lower.includes('पानी') || lower.includes('পানী')) {
      if (onDrinkWater) {
        onDrinkWater();
      }
    } else if (lower.includes('medicine') || lower.includes('দৱাই') || lower.includes('दवाई')) {
      if (onNavigateTab) {
        setTimeout(() => onNavigateTab('reminders'), 2500);
      }
    } else if (lower.includes('progress') || lower.includes('प्रगति') || lower.includes('প্ৰগতি')) {
      if (onNavigateTab) {
        setTimeout(() => onNavigateTab('progress'), 2500);
      }
    }

    // Call server AI / fallback
    const res = await aiService.askVoiceAssistant(queryText, language, patient.name);
    setAssistantReply(res.reply);
    setIsAiGenerated(res.isAi);

    // Speak response using elderly-friendly Text-to-Speech
    setIsSpeakingResponse(true);
    voiceService.speak(res.reply, language, () => {
      setIsSpeakingResponse(false);
    });
  };

  const startVoiceInput = () => {
    if (isListening) {
      if (recognizer) recognizer.stop();
      setIsListening(false);
      return;
    }

    voiceService.stopSpeaking();
    setIsSpeakingResponse(false);
    setAssistantReply('');

    const rec = voiceService.createRecognizer(
      language,
      (transcript: string) => {
        handleQuery(transcript);
      },
      (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (rec) {
      setRecognizer(rec);
      try {
        rec.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Recognizer start error:', e);
        setIsListening(false);
      }
    } else {
      // Browser doesn't support mic recognition: prompt user to use large preset query cards
      setAssistantReply(
        language === 'hi'
          ? 'माइक ब्राउज़र द्वारा समर्थित नहीं है। कृपया नीचे दिए गए प्रश्नों को छुएं।'
          : language === 'as'
          ? 'মাইক্ৰ’ফোন সুবিধা উপলব্ধ নহয়। অনুগ্ৰহ কৰি তলৰ প্ৰশ্নসমূহ স্পৰ্শ কৰক।'
          : 'Voice input is not supported in this browser. Please tap one of the friendly buttons below.'
      );
    }
  };

  const stopAudio = () => {
    voiceService.stopSpeaking();
    setIsSpeakingResponse(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border-4 border-amber-300 flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-amber-100 px-6 py-4 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-xs">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-950">
                {t.voice.title}
              </h2>
              <p className="text-xs text-amber-800 font-medium">
                {patient.name} • {language === 'hi' ? 'हिन्दी' : language === 'as' ? 'অসমীয়া' : 'English'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white hover:bg-stone-100 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors shadow-xs"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-center">
          {/* Big Microphone Push Button */}
          <div className="flex flex-col items-center justify-center pt-2">
            <button
              onClick={startVoiceInput}
              className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 shadow-xl ${
                isListening
                  ? 'bg-rose-500 text-white ring-8 ring-rose-200 animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950 ring-8 ring-amber-100'
              }`}
            >
              {isListening ? (
                <MicOff className="w-12 h-12" />
              ) : (
                <Mic className="w-12 h-12" />
              )}
            </button>
            <p className="mt-4 text-base font-bold text-stone-800">
              {isListening ? t.voice.listening : t.voice.tapToSpeak}
            </p>
            {isListening && (
              <p className="text-xs text-rose-600 font-semibold animate-pulse mt-1">
                Listening to you right now... Speak clearly.
              </p>
            )}
          </div>

          {/* User Transcript display */}
          {spokenText && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left">
              <span className="text-xs uppercase font-extrabold text-amber-800 tracking-wider">
                You Asked:
              </span>
              <p className="text-lg font-bold text-stone-900 mt-1">
                "{spokenText}"
              </p>
            </div>
          )}

          {/* Assistant Voice Reply display */}
          {assistantReply && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold text-emerald-800 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  {t.voice.assistantResponse}
                  {isAiGenerated && (
                    <span className="bg-emerald-200 text-emerald-900 text-[10px] px-1.5 py-0.5 rounded font-bold ml-1">
                      Gemini AI
                    </span>
                  )}
                </span>
                {isSpeakingResponse ? (
                  <button
                    onClick={stopAudio}
                    className="flex items-center gap-1 text-xs bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-2 py-1 rounded-lg"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>{t.voice.stopSpeaking}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsSpeakingResponse(true);
                      voiceService.speak(assistantReply, language, () => setIsSpeakingResponse(false));
                    }}
                    className="flex items-center gap-1 text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-2 py-1 rounded-lg"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen Again</span>
                  </button>
                )}
              </div>
              <p className="text-lg font-semibold text-emerald-950 leading-relaxed">
                {assistantReply}
              </p>
            </div>
          )}

          {/* Quick-tap Suggested Questions (Elderly friendly fallback) */}
          <div className="text-left space-y-2.5 pt-2">
            <div className="flex items-center gap-1.5 text-stone-600 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>{t.voice.speakPrompt}</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {t.voice.suggestedQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuery(query)}
                  className="w-full text-left p-3.5 rounded-2xl bg-stone-50 hover:bg-amber-100 text-stone-900 font-bold text-sm border border-stone-200 hover:border-amber-300 transition-all flex items-center justify-between group active:scale-98"
                >
                  <span>"{query}"</span>
                  <Volume2 className="w-4 h-4 text-stone-400 group-hover:text-amber-800 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-900 font-extrabold text-base transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
