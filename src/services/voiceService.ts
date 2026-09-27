import { Language } from '../types';

class VoiceService {
  private isSpeechSynthesisSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  speak(text: string, language: Language, onEnd?: () => void): void {
    if (!this.isSpeechSynthesisSupported || !text) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      // Gentle, clear speech pacing for elderly listeners
      utterance.rate = 0.88;
      utterance.pitch = 1.0;

      // Select voice based on language
      const voices = window.speechSynthesis.getVoices();
      if (language === 'hi') {
        utterance.lang = 'hi-IN';
        const hiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('HI'));
        if (hiVoice) utterance.voice = hiVoice;
      } else if (language === 'as') {
        utterance.lang = 'as-IN';
        // Many browsers don't have native Assamese, fallback to Bengali/Hindi phonetics or Indian English
        const asVoice = voices.find(v => v.lang.includes('as') || v.lang.includes('bn') || v.lang.includes('hi'));
        if (asVoice) utterance.voice = asVoice;
      } else {
        utterance.lang = 'en-IN';
        const inVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US'));
        if (inVoice) utterance.voice = inVoice;
      }

      if (onEnd) {
        utterance.onend = () => onEnd();
        utterance.onerror = () => onEnd();
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      if (onEnd) onEnd();
    }
  }

  stopSpeaking(): void {
    if (this.isSpeechSynthesisSupported) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('Speech cancel error:', e);
      }
    }
  }

  isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  createRecognizer(
    language: Language,
    onResult: (transcript: string) => void,
    onError: (err: any) => void,
    onEnd: () => void
  ): any {
    if (!this.isSpeechRecognitionSupported()) return null;

    try {
      const SpeechRecognitionConstructor =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognizer = new SpeechRecognitionConstructor();
      recognizer.continuous = false;
      recognizer.interimResults = false;

      if (language === 'hi') {
        recognizer.lang = 'hi-IN';
      } else if (language === 'as') {
        recognizer.lang = 'as-IN';
      } else {
        recognizer.lang = 'en-IN';
      }

      recognizer.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        onResult(transcript);
      };

      recognizer.onerror = (event: any) => {
        onError(event);
      };

      recognizer.onend = () => {
        onEnd();
      };

      return recognizer;
    } catch (e) {
      console.warn('Failed to create SpeechRecognizer:', e);
      return null;
    }
  }
}

export const voiceService = new VoiceService();
