import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI:', err);
  }
}

// Fallback deterministic generator
const getFallbackEncouragement = (name: string, language: string) => {
  if (language === 'hi') {
    return `शाबाश ${name}! आज आपने बहुत अच्छा समय बिताया। ऐसे ही सक्रिय रहिए!`;
  }
  if (language === 'as') {
    return `বঢ়িয়া ${name}! আজি আপুনি বহুত ভালকৈ খেলিলে। এনেদৰেই আনন্দত থাকক!`;
  }
  return `Wonderful job today, ${name}! You completed your activities with great focus and joy.`;
};

const getFallbackVoiceResponse = (query: string, language: string) => {
  const lower = query.toLowerCase();
  if (lower.includes('medicine') || lower.includes('দৱাই') || lower.includes('दवाई')) {
    if (language === 'hi') return 'आपकी अगली दवाई दोपहर 12 बजे है। आराम से पानी के साथ लें।';
    if (language === 'as') return 'আপোনাৰ পৰৱৰ্তী দৰব দুপৰীয়া ১২ বজাত আছে। পানীৰ সৈতে লব।';
    return 'Your next medicine is scheduled for 12:00 PM after lunch.';
  }
  if (lower.includes('water') || lower.includes('पानी') || lower.includes('পানী')) {
    if (language === 'hi') return 'पानी पीना सेहत के लिए बहुत अच्छा है। चलिए एक गिलास पानी पीते हैं।';
    if (language === 'as') return 'পানী খোৱাটো ভাল। আহক এতিয়া এগিলাচ পানী খাওঁ।';
    return 'Staying hydrated keeps your mind fresh. Please take a sip of water now.';
  }
  if (lower.includes('game') || lower.includes('play') || lower.includes('खेल') || lower.includes('খেল')) {
    if (language === 'hi') return 'चलिए आज का मजेदार खेल शुरू करते हैं!';
    if (language === 'as') return 'আহক আজিৰ স্মৃতি খেল আৰম্ভ কৰোঁ!';
    return 'Let us start the memory game! Tap the Play button on your screen.';
  }
  if (lower.includes('progress') || lower.includes('how did i do') || lower.includes('कैसा')) {
    if (language === 'hi') return 'आज आपने अपने सभी कार्य समय पर किए हैं। बहुत बढ़िया!';
    if (language === 'as') return 'আজি আপুনি সকলো কাম সুন্দৰকৈ সম্পূৰ্ণ কৰিলে। বহুত ভাল!';
    return 'You have done wonderfully today! You completed your morning routine and games.';
  }
  // Default routine answer
  if (language === 'hi') {
    return 'आज आपकी दिनचर्या में सुबह की दवाई, स्मृति खेल और शाम को परिवार से बातचीत शामिल है।';
  }
  if (language === 'as') {
    return 'আজি আপোনাৰ দিনলিপিত পুৱাৰ দৰব, স্মৃতি খেল আৰু সন্ধিয়া পৰিয়ালৰ সৈতে সময় কটোৱা আছে।';
  }
  return 'Today you have your morning medicine, a relaxing memory game, and family time this evening.';
};

// API Endpoints
app.post('/api/ai/encourage', async (req: Request, res: Response) => {
  try {
    const { name = 'Elderly Friend', language = 'en', recentGame = 'Memory Match' } = req.body;
    if (!ai) {
      return res.json({ message: getFallbackEncouragement(name, language), isAi: false });
    }

    const prompt = `You are a warm, gentle, respectful voice speaking to an elderly person named ${name} in the North Eastern Region of India who just played ${recentGame}.
Provide a short 1-2 sentence encouraging message in ${language === 'hi' ? 'Hindi' : language === 'as' ? 'Assamese' : 'English'}.
Keep it positive, simple, comforting, and respectful. Do not mention dementia, illness, or medical terms.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const text = response.text?.trim() || getFallbackEncouragement(name, language);
    res.json({ message: text, isAi: true });
  } catch (error) {
    console.error('Error generating encouragement:', error);
    res.json({ message: getFallbackEncouragement(req.body?.name || 'Friend', req.body?.language || 'en'), isAi: false });
  }
});

app.post('/api/ai/caregiver-summary', async (req: Request, res: Response) => {
  try {
    const { patientName = 'Dhiren', gamesPlayed = 4, remindersCompleted = '85%', notes = [] } = req.body;
    if (!ai) {
      return res.json({
        summary: `${patientName} engaged well this week with ${gamesPlayed} cognitive games and ${remindersCompleted} reminder completion. Attention games were completed with calm consistency.`,
        observations: [
          'Strongest engagement observed during morning hours (9:00 - 11:00 AM).',
          'Culturally familiar NER themes (Assam Tea Leaf & Hornbill) prompted enthusiastic recall.',
          'Pacing was steady; no signs of frustration noted.',
        ],
        isAi: false,
      });
    }

    const prompt = `You are an expert supportive care advisor for elderly caregivers in Northeast India.
Patient: ${patientName}
Cognitive activities completed: ${gamesPlayed}
Reminder completion rate: ${remindersCompleted}
Caregiver notes: ${JSON.stringify(notes)}

Generate a brief 2-3 sentence non-diagnostic activity observation summary for the caregiver.
CRITICAL SAFETY RULES:
- This is a non-diagnostic cognitive engagement summary.
- NEVER diagnose dementia or specify disease stages.
- NEVER suggest medical changes or medications.
- Focus strictly on engagement patterns, preferred themes, and encouraging gentle routines.
Return plain text summary.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      summary: response.text?.trim() || `${patientName} maintained consistent daily engagement.`,
      isAi: true,
    });
  } catch (error) {
    console.error('Error generating caregiver summary:', error);
    res.json({
      summary: `Patient maintained healthy engagement with scheduled routines and games this week.`,
      isAi: false,
    });
  }
});

app.post('/api/ai/voice-assistant', async (req: Request, res: Response) => {
  try {
    const { query = '', language = 'en', patientName = 'Elderly Friend' } = req.body;
    if (!query) {
      return res.json({ reply: 'I am here listening. How can I help you today?' });
    }

    if (!ai) {
      return res.json({ reply: getFallbackVoiceResponse(query, language), isAi: false });
    }

    const langName = language === 'hi' ? 'Hindi' : language === 'as' ? 'Assamese' : 'English';
    const prompt = `You are a loving, calm, and respectful digital companion named SmritiSetu assisting ${patientName}, an elderly person in Northeast India.
User query: "${query}"
Language required: ${langName}.

Rules:
1. Reply in 1 to 2 very simple, warm, easily spoken sentences.
2. If asking about routine/medicines/water, give a calm reassuring answer.
3. If asking about games, encourage them gently.
4. NO medical diagnoses or clinical advice.
5. Answer strictly in ${langName}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ reply: response.text?.trim() || getFallbackVoiceResponse(query, language), isAi: true });
  } catch (error) {
    console.error('Error in voice assistant:', error);
    res.json({ reply: getFallbackVoiceResponse(req.body?.query || '', req.body?.language || 'en'), isAi: false });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
