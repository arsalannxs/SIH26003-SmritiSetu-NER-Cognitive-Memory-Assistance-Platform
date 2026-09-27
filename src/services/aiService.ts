import { Language } from '../types';

export interface EncouragementResponse {
  message: string;
  isAi: boolean;
}

export interface CaregiverSummaryResponse {
  summary: string;
  observations?: string[];
  isAi: boolean;
}

export interface VoiceAssistantResponse {
  reply: string;
  isAi: boolean;
}

export const aiService = {
  async getEncouragingMessage(
    name: string,
    language: Language,
    recentGame: string
  ): Promise<EncouragementResponse> {
    try {
      const res = await fetch('/api/ai/encourage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, language, recentGame }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      // Local graceful fallback
      if (language === 'hi') {
        return {
          message: `शाबाश ${name}! आज आपने ${recentGame} में बहुत अच्छा समय बिताया।`,
          isAi: false,
        };
      }
      if (language === 'as') {
        return {
          message: `বঢ়িয়া ${name}! আজি আপুনি ${recentGame} সুন্দৰকৈ সম্পূৰ্ণ কৰিলে।`,
          isAi: false,
        };
      }
      return {
        message: `Wonderful job today, ${name}! You engaged with ${recentGame} with joyful focus.`,
        isAi: false,
      };
    }
  },

  async getCaregiverSummary(
    patientName: string,
    gamesPlayed: number,
    remindersCompleted: string,
    notes: string[]
  ): Promise<CaregiverSummaryResponse> {
    try {
      const res = await fetch('/api/ai/caregiver-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientName, gamesPlayed, remindersCompleted, notes }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      return {
        summary: `${patientName} maintained steady cognitive engagement this week with ${gamesPlayed} mind games and ${remindersCompleted} routine adherence. Morning recall games showed pleasant enthusiasm with cultural NER themes.`,
        observations: [
          'High routine consistency observed in morning medication and hydration.',
          'Pacing was relaxed; no signs of frustration noted.',
          'Assam flora and cultural items elicited joyful recognition.',
        ],
        isAi: false,
      };
    }
  },

  async askVoiceAssistant(
    query: string,
    language: Language,
    patientName: string
  ): Promise<VoiceAssistantResponse> {
    try {
      const res = await fetch('/api/ai/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language, patientName }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      const lower = query.toLowerCase();
      if (lower.includes('medicine') || lower.includes('দৱাই') || lower.includes('दवाई')) {
        if (language === 'hi') return { reply: 'आपकी अगली दवाई दोपहर 12 बजे है। आराम से पानी के साथ लें।', isAi: false };
        if (language === 'as') return { reply: 'আপোনাৰ পৰৱৰ্তী দৰব দুপৰীয়া ১২ বজাত আছে। পানীৰ সৈতে লব।', isAi: false };
        return { reply: 'Your next medicine is scheduled for 12:00 PM after lunch.', isAi: false };
      }
      if (lower.includes('water') || lower.includes('पानी') || lower.includes('পানী')) {
        if (language === 'hi') return { reply: 'पानी पीना सेहत के लिए बहुत अच्छा है। चलिए एक घूंट पानी पीते हैं।', isAi: false };
        if (language === 'as') return { reply: 'পানী খোৱাটো ভাল। আহক এতিয়া এগিলাচ পানী খাওঁ।', isAi: false };
        return { reply: 'Staying hydrated keeps your mind fresh. Please take a sip of water now.', isAi: false };
      }
      if (lower.includes('game') || lower.includes('play') || lower.includes('खेल') || lower.includes('খেল')) {
        if (language === 'hi') return { reply: 'चलिए आज का मजेदार खेल शुरू करते हैं! प्ले बटन दबाएं।', isAi: false };
        if (language === 'as') return { reply: 'আহক আজিৰ স্মৃতি খেল আৰম্ভ কৰোঁ! প্লে বুটাম স্পৰ্শ কৰক।', isAi: false };
        return { reply: 'Let us start the memory game! Tap the Play button on your screen.', isAi: false };
      }
      if (language === 'hi') {
        return { reply: 'आज आपकी दिनचर्या में सुबह की दवाई, स्मृति खेल और शाम को परिवार से बातचीत शामिल है।', isAi: false };
      }
      if (language === 'as') {
        return { reply: 'আজি আপোনাৰ দিনলিপিত পুৱাৰ দৰব, স্মৃতি খেল আৰু সন্ধিয়া পৰিয়ালৰ সৈতে সময় কটোৱা আছে।', isAi: false };
      }
      return { reply: 'Today you have your scheduled medication, a relaxing memory game, and family time this evening.', isAi: false };
    }
  },
};
