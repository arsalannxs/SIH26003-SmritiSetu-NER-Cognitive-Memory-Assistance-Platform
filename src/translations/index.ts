import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  appTagline: string;
  disclaimer: string;
  demoBadge: string;
  modes: {
    patient: string;
    caregiver: string;
    healthcare: string;
  };
  nav: {
    home: string;
    play: string;
    reminders: string;
    progress: string;
    talk: string;
    back: string;
  };
  home: {
    greetingMorning: string;
    greetingAfternoon: string;
    greetingEvening: string;
    cardPlay: string;
    cardPlayDesc: string;
    cardMedicines: string;
    cardMedicinesDesc: string;
    cardWater: string;
    cardWaterDesc: string;
    cardPlan: string;
    cardPlanDesc: string;
    cardProgress: string;
    cardProgressDesc: string;
    cardTalk: string;
    cardTalkDesc: string;
    todaysRoutine: string;
    quickWaterButton: string;
    glassesDrunk: string;
    talkPrompt: string;
  };
  games: {
    title: string;
    subtitle: string;
    level: string;
    easy: string;
    easyPlus: string;
    medium: string;
    hard: string;
    memoryMatchTitle: string;
    memoryMatchDesc: string;
    routineSequenceTitle: string;
    routineSequenceDesc: string;
    objectRecognitionTitle: string;
    objectRecognitionDesc: string;
    patternTitle: string;
    patternDesc: string;
    attentionTitle: string;
    attentionDesc: string;
    familyPhotoTitle: string;
    familyPhotoDesc: string;
    tapToMatch: string;
    whatComesNext: string;
    whatIsThis: string;
    findTheMatch: string;
    matchesFound: string;
    attempts: string;
    wellDone: string;
    greatJob: string;
    playAgain: string;
    nextQuestion: string;
    finishActivity: string;
    accuracy: string;
    adaptiveDifficultyNotice: string;
  };
  reminders: {
    title: string;
    subtitle: string;
    todayReminders: string;
    taken: string;
    skip: string;
    remindLater: string;
    statusTaken: string;
    statusPending: string;
    waterTitle: string;
    waterDesc: string;
    appointmentTitle: string;
    safetyDosageDisclaimer: string;
  };
  progress: {
    title: string;
    subtitle: string;
    thisWeek: string;
    activitiesCompleted: string;
    gamesPlayed: string;
    reminderRate: string;
    activeDays: string;
    encouragingNote: string;
    activityTrend: string;
  };
  voice: {
    title: string;
    listening: string;
    tapToSpeak: string;
    speakPrompt: string;
    suggestedQueries: string[];
    assistantResponse: string;
    stopSpeaking: string;
  };
  caregiver: {
    title: string;
    patientOverview: string;
    engagementTrends: string;
    filter7Days: string;
    filter30Days: string;
    filter90Days: string;
    activityHistory: string;
    alertsTitle: string;
    notesTitle: string;
    addNote: string;
    notePlaceholder: string;
    themeSelector: string;
    photosTitle: string;
    nonDiagnosticNotice: string;
  };
  healthcare: {
    title: string;
    assignedPatients: string;
    fieldObservations: string;
    addObservation: string;
    visitScheduler: string;
    noDiagnosticClaim: string;
  };
  offline: {
    offlineNotice: string;
    syncing: string;
    synced: string;
    online: string;
    simulateOffline: string;
    simulateOnline: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'SmritiSetu NER',
    appTagline: 'Cognitive & Memory Companion for North Eastern Region',
    disclaimer: 'Prototype — For cognitive engagement & memory assistance only. Not intended for clinical or diagnostic use.',
    demoBadge: 'DEMO DATA',
    modes: {
      patient: 'Elderly Mode',
      caregiver: 'Caregiver Mode',
      healthcare: 'Field Worker Mode',
    },
    nav: {
      home: 'Home',
      play: 'Play',
      reminders: 'Medicines',
      progress: 'My Progress',
      talk: 'Talk',
      back: '← Back',
    },
    home: {
      greetingMorning: 'Good Morning',
      greetingAfternoon: 'Good Afternoon',
      greetingEvening: 'Good Evening',
      cardPlay: '🧠 Play',
      cardPlayDesc: 'Fun memory games',
      cardMedicines: '💊 Medicines',
      cardMedicinesDesc: 'Daily reminders',
      cardWater: '💧 Drink Water',
      cardWaterDesc: 'Stay refreshed',
      cardPlan: "📅 Today's Plan",
      cardPlanDesc: 'Your simple routine',
      cardProgress: '❤️ My Progress',
      cardProgressDesc: 'Your happy week',
      cardTalk: '🎤 Talk to Me',
      cardTalkDesc: 'Speak anytime',
      todaysRoutine: "Today's Simple Routine",
      quickWaterButton: '💧 I DRANK WATER',
      glassesDrunk: 'glasses completed today',
      talkPrompt: 'Tap microphone to speak or ask anything',
    },
    games: {
      title: 'Gentle Mind Games',
      subtitle: 'Relaxing, non-competitive activities designed for joy & focus',
      level: 'Activity Difficulty',
      easy: 'Gentle (Easy)',
      easyPlus: 'Mild (Easy+)',
      medium: 'Engaging (Medium)',
      hard: 'Advanced (Hard)',
      memoryMatchTitle: 'Card Memory Match',
      memoryMatchDesc: 'Find friendly pairs of cultural objects & nature',
      routineSequenceTitle: 'Daily Routine Recall',
      routineSequenceDesc: 'What comes next in our daily morning and day?',
      objectRecognitionTitle: 'Object Recognition',
      objectRecognitionDesc: 'Name familiar everyday objects and utensils',
      patternTitle: 'Gentle Patterns',
      patternDesc: 'Pick the shape that completes the pattern',
      attentionTitle: 'Focus & Attention',
      attentionDesc: 'Find all matching items on the board',
      familyPhotoTitle: 'Family Memory Album',
      familyPhotoDesc: 'Recall loving memories with family photos',
      tapToMatch: 'Tap cards to find pairs',
      whatComesNext: 'What comes next in the routine?',
      whatIsThis: 'What is this object?',
      findTheMatch: 'Tap all the items indicated below',
      matchesFound: 'Matches',
      attempts: 'Tries',
      wellDone: 'Wonderful!',
      greatJob: 'You did that beautifully!',
      playAgain: 'Play Again',
      nextQuestion: 'Next',
      finishActivity: 'Done for Now',
      accuracy: 'Focus Rate',
      adaptiveDifficultyNotice: 'Activity difficulty adjusts automatically based on your comfort.',
    },
    reminders: {
      title: 'Daily Reminders',
      subtitle: 'Simple schedule set with care by your family',
      todayReminders: "Today's Schedule",
      taken: 'Taken',
      skip: 'Skip',
      remindLater: 'Remind Later',
      statusTaken: 'Completed',
      statusPending: 'Pending',
      waterTitle: 'Hydration Routine',
      waterDesc: 'A glass of fresh water keeps you healthy and alert',
      appointmentTitle: 'Family & Doctor Visits',
      safetyDosageDisclaimer: 'Reminders are entered by caregivers. SmritiSetu does not prescribe medications or dosages.',
    },
    progress: {
      title: 'My Progress',
      subtitle: 'Celebrating your daily focus and routine engagement',
      thisWeek: 'This Week at a Glance',
      activitiesCompleted: 'Activities Completed',
      gamesPlayed: 'Mind Games Enjoyed',
      reminderRate: 'Routines Followed',
      activeDays: 'Active Days',
      encouragingNote: 'You are doing wonderful! Each small step brings calm and sharpness to your day.',
      activityTrend: 'Weekly Engagement Trend',
    },
    voice: {
      title: 'Voice Assistant',
      listening: 'Listening to your voice...',
      tapToSpeak: 'Tap to Speak',
      speakPrompt: 'Speak naturally or tap one of the common questions below:',
      suggestedQueries: [
        'What do I have today?',
        'When is my medicine?',
        'Start a memory game',
        'Remind me to drink water',
        'How did I do today?',
      ],
      assistantResponse: 'SmritiSetu Voice Response:',
      stopSpeaking: 'Stop Audio',
    },
    caregiver: {
      title: 'Caregiver Dashboard',
      patientOverview: 'Patient Overview',
      engagementTrends: 'Engagement Trends (Non-diagnostic)',
      filter7Days: '7 Days',
      filter30Days: '30 Days',
      filter90Days: '90 Days',
      activityHistory: 'Activity History',
      alertsTitle: 'Caregiver Alerts',
      notesTitle: 'Observations & Notes',
      addNote: 'Add Care Note',
      notePlaceholder: 'e.g. Enjoyed the Assam tea memory game; needed a gentle reminder for afternoon tea...',
      themeSelector: 'Cultural Memory Theme',
      photosTitle: 'Family Reminiscence Photos',
      nonDiagnosticNotice: 'All insights represent engagement and activity consistency, NOT clinical cognitive assessments.',
    },
    healthcare: {
      title: 'Field & Community Health Worker Mode',
      assignedPatients: 'Assigned Elderly Patients in District',
      fieldObservations: 'Field Visit Observations',
      addObservation: 'Record Care Observation',
      visitScheduler: 'Upcoming Care Visits',
      noDiagnosticClaim: 'Observations are for social and routine care tracking. Not a medical diagnostic log.',
    },
    offline: {
      offlineNotice: 'Offline Mode: Activity is safely saved on this device and queued.',
      syncing: 'Syncing activity to secure cloud...',
      synced: 'All data synchronized',
      online: 'Connected',
      simulateOffline: 'Simulate Offline',
      simulateOnline: 'Restore Connection',
    },
  },
  hi: {
    appName: 'स्मृतिसेतु NER',
    appTagline: 'पूर्वोत्तर क्षेत्र के बुजुर्गों के लिए संज्ञानात्मक एवं स्मृति साथी',
    disclaimer: 'प्रारूप (प्रोटोटाइप) — केवल स्मृति सहायता और सहभागिता हेतु। यह कोई चिकित्सकीय निदान प्रणाली नहीं है।',
    demoBadge: 'डेमो डेटा',
    modes: {
      patient: 'बुजुर्ग मोड',
      caregiver: 'देखभालकर्ता मोड',
      healthcare: 'स्वास्थ्य कार्यकर्ता मोड',
    },
    nav: {
      home: 'होम',
      play: 'खेल',
      reminders: 'दवाई',
      progress: 'मेरी प्रगति',
      talk: 'बात करें',
      back: '← पीछे',
    },
    home: {
      greetingMorning: 'शुभ प्रभात',
      greetingAfternoon: 'शुभ दोपहर',
      greetingEvening: 'शुभ संध्या',
      cardPlay: '🧠 खेलें',
      cardPlayDesc: 'मनोरंजक स्मृति खेल',
      cardMedicines: '💊 दवाई',
      cardMedicinesDesc: 'दिन की दवाइयाँ',
      cardWater: '💧 पानी पिएं',
      cardWaterDesc: 'ताज़ा और स्वस्थ रहें',
      cardPlan: '📅 आज की योजना',
      cardPlanDesc: 'आपकी सरल दिनचर्या',
      cardProgress: '❤️ मेरी प्रगति',
      cardProgressDesc: 'आपका सप्ताह',
      cardTalk: '🎤 मुझसे बात करें',
      cardTalkDesc: 'कभी भी बोलें',
      todaysRoutine: 'आज की आसान दिनचर्या',
      quickWaterButton: '💧 मैंने पानी पिया',
      glassesDrunk: 'गिलास पानी पिया',
      talkPrompt: 'माइक दबाकर बोलें या कुछ भी पूछें',
    },
    games: {
      title: 'आसान दिमागी खेल',
      subtitle: 'सकारात्मक और सरल खेल जो मन को ताज़ा रखें',
      level: 'खेल का स्तर',
      easy: 'सरल (Easy)',
      easyPlus: 'हल्का (Easy+)',
      medium: 'मध्यम (Medium)',
      hard: 'उन्नत (Hard)',
      memoryMatchTitle: 'कार्ड मिलान खेल',
      memoryMatchDesc: 'सुंदर चित्रों के जोड़े ढूंढें',
      routineSequenceTitle: 'दिनचर्या क्रम खेल',
      routineSequenceDesc: 'सुबह के बाद अगला कदम क्या है?',
      objectRecognitionTitle: 'वस्तु पहचान',
      objectRecognitionDesc: 'दैनिक वस्तुओं के सही नाम बताएं',
      patternTitle: 'पैटर्न खेल',
      patternDesc: 'क्रम पूरा करने वाला सही आकार चुनें',
      attentionTitle: 'एकाग्रता खेल',
      attentionDesc: 'दिखाए गए चित्रों को ढूंढें',
      familyPhotoTitle: 'पारिवारिक संस्मरण एल्बम',
      familyPhotoDesc: 'परिवार की पुरानी मधुर यादें',
      tapToMatch: 'जोड़े ढूंढने के लिए कार्ड छुएं',
      whatComesNext: 'दिनचर्या में इसके बाद क्या आता है?',
      whatIsThis: 'यह कौन सी वस्तु है?',
      findTheMatch: 'नीचे दिए गए सभी चित्र चुनें',
      matchesFound: 'जोड़े',
      attempts: 'प्रयास',
      wellDone: 'बहुत खूब!',
      greatJob: 'आपने बहुत अच्छा खेला!',
      playAgain: 'फिर से खेलें',
      nextQuestion: 'अगला',
      finishActivity: 'पूरा हुआ',
      accuracy: 'सटीकता',
      adaptiveDifficultyNotice: 'आपके आराम के अनुसार खेल का स्तर खुद समायोजित होता है।',
    },
    reminders: {
      title: 'दैनिक स्मरण',
      subtitle: 'आपके परिवार द्वारा प्रेम से तैयार किया गया समय',
      todayReminders: 'आज का समय',
      taken: 'ले ली',
      skip: 'छोड़ें',
      remindLater: 'बाद में',
      statusTaken: 'पूर्ण',
      statusPending: 'बाकी',
      waterTitle: 'पानी पीने का समय',
      waterDesc: 'एक गिलास पानी आपको तरोताज़ा रखता है',
      appointmentTitle: 'पारिवारिक व डॉक्टर की भेंट',
      safetyDosageDisclaimer: 'दवाई की जानकारी परिवार द्वारा दर्ज की गई है। ऐप कोई चिकित्सीय सलाह नहीं देता।',
    },
    progress: {
      title: 'मेरी प्रगति',
      subtitle: 'आपकी दैनिक सक्रियता और सुंदर दिनचर्या',
      thisWeek: 'इस सप्ताह की झलक',
      activitiesCompleted: 'सम्पन्न गतिविधियाँ',
      gamesPlayed: 'खेले गए खेल',
      reminderRate: 'दवाई व दिनचर्या',
      activeDays: 'सक्रिय दिन',
      encouragingNote: 'आप बहुत अच्छा कर रहे हैं! हर छोटा कदम आपके मन को सुकून देता है।',
      activityTrend: 'साप्ताहिक सहभागिता',
    },
    voice: {
      title: 'ध्वनि सहायक',
      listening: 'आपकी आवाज सुनी जा रही है...',
      tapToSpeak: 'बोलने के लिए छुएं',
      speakPrompt: 'बोलिए या नीचे दिए गए किसी भी प्रश्न को चुनें:',
      suggestedQueries: [
        'आज मेरी क्या योजना है?',
        'मेरी दवाई कब है?',
        'स्मृति खेल शुरू करो',
        'पानी पीने का स्मरण कराओ',
        'आज मैंने कैसा किया?',
      ],
      assistantResponse: 'सहायक का उत्तर:',
      stopSpeaking: 'आवाज रोकें',
    },
    caregiver: {
      title: 'देखभालकर्ता डैशबोर्ड',
      patientOverview: 'रोगी का अवलोकन',
      engagementTrends: 'सहभागिता रुझान (गैर-निदानात्मक)',
      filter7Days: '7 दिन',
      filter30Days: '30 दिन',
      filter90Days: '90 दिन',
      activityHistory: 'गतिविधि इतिहास',
      alertsTitle: 'देखभालकर्ता सूचनाएं',
      notesTitle: 'टिप्पणी और अवलोकन',
      addNote: 'नई टिप्पणी जोड़ें',
      notePlaceholder: 'उदाहरण: आज असम चाय खेल का आनंद लिया; दोपहर की चाय में प्रसन्न थे...',
      themeSelector: 'सांस्कृतिक स्मृति थीम',
      photosTitle: 'पारिवारिक संस्मरण तस्वीरें',
      nonDiagnosticNotice: 'सभी निष्कर्ष केवल गतिविधि के रुझान दर्शाते हैं, यह कोई चिकित्सीय निदान नहीं है।',
    },
    healthcare: {
      title: 'क्षेत्रीय स्वास्थ्य कार्यकर्ता मोड',
      assignedPatients: 'जिले में आवंटित बुजुर्ग व्यक्ति',
      fieldObservations: 'क्षेत्रीय दौरे के अवलोकन',
      addObservation: 'देखभाल टिप्पणी दर्ज करें',
      visitScheduler: 'आगामी गृह भेंट',
      noDiagnosticClaim: 'ये टिप्पणियां सामाजिक सहायता हेतु हैं, चिकित्सकीय निदान हेतु नहीं।',
    },
    offline: {
      offlineNotice: 'ऑफ़लाइन मोड: आपकी गतिविधि इस डिवाइस पर सुरक्षित रूप से सहेजी जा रही है।',
      syncing: 'डेटा सुरक्षित क्लाउड पर भेजा जा रहा है...',
      synced: 'सभी डेटा सिंक हो चुका है',
      online: 'इंटरनेट जुड़ा हुआ है',
      simulateOffline: 'ऑफ़लाइन अनुकरण करें',
      simulateOnline: 'इंटरनेट चालू करें',
    },
  },
  as: {
    appName: 'স্মৃতিসেতু উত্তৰ-পূৰ্বাঞ্চল (NER)',
    appTagline: 'উত্তৰ-পূবৰ জ্যেষ্ঠ নাগৰিকৰ বাবে স্মৃতি আৰু মনোযোগ সহায়ক',
    disclaimer: 'প্ৰট’টাইপ — কেৱল স্মৃতি উদ্দীপনা আৰু সান্নিধ্যৰ বাবে। ই কোনো চিকিৎসা বা ৰোগ নিৰ্ণয় ব্যৱস্থা নহয়।',
    demoBadge: 'ডেমো তথ্য',
    modes: {
      patient: 'জেষ্ঠ নাগৰিক মোড',
      caregiver: 'শুশ্ৰূষাকাৰী মোড',
      healthcare: 'স্বাস্থ্যকৰ্মী মোড',
    },
    nav: {
      home: 'ঘৰ',
      play: 'খেল',
      reminders: 'দৰব',
      progress: 'মোৰ প্ৰগতি',
      talk: 'কথা পাতক',
      back: '← উভতি যাওক',
    },
    home: {
      greetingMorning: 'সু-প্ৰভাত',
      greetingAfternoon: 'শুভ অপৰাহ্ণ',
      greetingEvening: 'শুভ গধূলি',
      cardPlay: '🧠 খেলক',
      cardPlayDesc: 'আনন্দদায়ক স্মৃতি খেল',
      cardMedicines: '💊 দৰব',
      cardMedicinesDesc: 'দৈনিক ঔষধৰ সময়',
      cardWater: '💧 পানী খাওক',
      cardWaterDesc: 'তজবজীয়া হৈ থাকক',
      cardPlan: '📅 আজিৰ পৰিকল্পনা',
      cardPlanDesc: 'দৈনন্দিন সহজ কাম',
      cardProgress: '❤️ মোৰ প্ৰগতি',
      cardProgressDesc: 'সপ্তাহৰ আনন্দময় খতিয়ান',
      cardTalk: '🎤 মোৰ সৈতে কথা পাতক',
      cardTalkDesc: 'যিকোনো সময়তে কওক',
      todaysRoutine: 'আজিৰ সহজ দিনলিপি',
      quickWaterButton: '💧 মই পানী খালোঁ',
      glassesDrunk: 'গিলাচ পানী সম্পূৰ্ণ হ’ল',
      talkPrompt: 'মাইক্ৰ’ফোন টিপি কথা কওক বা প্ৰশ্ন সুধক',
    },
    games: {
      title: 'মন সতেজ কৰা খেল',
      subtitle: 'শান্ত আৰু আনন্দময় অভিজ্ঞতাৰ বাবে বিশেষ খেল',
      level: 'খেলৰ স্তৰ',
      easy: 'সহজ (Easy)',
      easyPlus: 'মৃদু (Easy+)',
      medium: 'মধ্যম (Medium)',
      hard: 'উন্নত (Hard)',
      memoryMatchTitle: 'কাৰ্ড মিলাই খেলো',
      memoryMatchDesc: 'পৰিচিত প্ৰকৃতি আৰু সংস্কৃতিৰ জোৰা বিচৰা খেল',
      routineSequenceTitle: 'দিনলিপিৰ ধাৰাবাহিকতা',
      routineSequenceDesc: 'পুৱাৰ পাছত আমি কি কৰোঁ?',
      objectRecognitionTitle: 'বস্তু চিনাক্তকৰণ',
      objectRecognitionDesc: 'দৈনন্দিন পৰিচিত সামগ্ৰীৰ নাম কওক',
      patternTitle: 'নক্সা মেলোৱা খেল',
      patternDesc: 'নক্সাটো পূৰাবলৈ সঠিক ছবি বাছক',
      attentionTitle: 'মনোযোগ আৰু একাগ্ৰতা',
      attentionDesc: 'নিৰ্দিষ্ট ছবিসমূহ বিচাৰি উলিয়াওক',
      familyPhotoTitle: 'পৰিয়ালৰ পুৰণি ছবিৰ এলবাম',
      familyPhotoDesc: 'পৰিয়ালৰ মৰমৰ পুৰণি স্মৃতি মনত পেলাওক',
      tapToMatch: 'জোৰা মিলাবলৈ কাৰ্ড স্পৰ্শ কৰক',
      whatComesNext: 'দিনলিপিত ইয়াৰ পাছত কি আহে?',
      whatIsThis: 'এই বস্তুটো কি হয়?',
      findTheMatch: 'তলৰ নিৰ্দেশ অনুসৰি সকলো বস্তু বাছক',
      matchesFound: 'মিলা জোৰা',
      attempts: 'চেষ্টা',
      wellDone: 'বহুত বঢ়িয়া!',
      greatJob: 'আপুনি বহুত ধুনীয়াকৈ খেলিলে!',
      playAgain: 'পুনৰ খেলক',
      nextQuestion: 'পৰৱৰ্তী',
      finishActivity: 'সম্পূৰ্ণ হ’ল',
      accuracy: 'মনোযোগৰ হাৰ',
      adaptiveDifficultyNotice: 'আপোনাৰ সুবিধা অনুসৰি খেলৰ কঠিনতা স্বয়ংক্ৰিয়ভাৱে নিৰ্ধাৰণ হয়।',
    },
    reminders: {
      title: 'দৈনিক সোঁৱৰণি',
      subtitle: 'পৰিয়ালৰ দ্বাৰা মৰমেৰে সজোৱা সময়সূচী',
      todayReminders: 'আজিৰ সময়সূচী',
      taken: 'খালোঁ',
      skip: 'এৰক',
      remindLater: 'পাছত',
      statusTaken: 'সম্পূৰ্ণ',
      statusPending: 'বাকী আছে',
      waterTitle: 'পানী খোৱাৰ সময়',
      waterDesc: 'এগিলাচ সতেজ পানীয়ে মন সুস্থ ৰাখে',
      appointmentTitle: 'পৰিয়াল আৰু চিকিৎসকৰ সাক্ষাত',
      safetyDosageDisclaimer: 'দৰবৰ সময়সূচী পৰিয়ালে লিপিবদ্ধ কৰিছে। এই ব্যৱস্থাই কোনো ঔষধ পৰামৰ্শ নিদিয়ে।',
    },
    progress: {
      title: 'মোৰ প্ৰগতি',
      subtitle: 'আপোনাৰ প্ৰতিদিনৰ মানসিক সুস্থতা আৰু সান্নিধ্য',
      thisWeek: 'এই সপ্তাহৰ চমু আভাস',
      activitiesCompleted: 'সম্পূৰ্ণ কৰা কাম',
      gamesPlayed: 'উপভোগ কৰা খেল',
      reminderRate: 'দিনলিপি পালন',
      activeDays: 'সক্ৰিয় দিন',
      encouragingNote: 'আপুনি বহুত সুন্দৰ কাম কৰি আছে! প্ৰতিটো পদক্ষেপে দিনটো আনন্দময় কৰি তোলে।',
      activityTrend: 'সাপ্তাহিক অংশগ্ৰহণৰ গতি',
    },
    voice: {
      title: 'ভইচ সহায়ক',
      listening: 'আপোনাৰ মাত শুনি থকা হৈছে...',
      tapToSpeak: 'কবলৈ স্পৰ্শ কৰক',
      speakPrompt: 'স্পষ্টকৈ কওক অথবা তলৰ যিকোনো এটা প্ৰশ্ন বাছক:',
      suggestedQueries: [
        'আজি মোৰ কি কি কাম আছে?',
        'মোৰ দৰব খোৱাৰ সময় কেতিয়া?',
        'স্মৃতি খেল আৰম্ভ কৰক',
        'পানী খোৱাৰ কথা সোঁৱৰাই দিয়ক',
        'আজি মোৰ দিনটো কেনে গ’ল?',
      ],
      assistantResponse: 'স্মৃতিসেতুৰ উত্তৰ:',
      stopSpeaking: 'মাত বন্ধ কৰক',
    },
    caregiver: {
      title: 'শুশ্ৰূষাকাৰীৰ ডেচব’ৰ্ড',
      patientOverview: 'ৰোগীৰ খতিয়ান',
      engagementTrends: 'অংশগ্ৰহণৰ ধাৰা (অ-চিকিৎসাজনিত)',
      filter7Days: '৭ দিন',
      filter30Days: '৩০ দিন',
      filter90Days: '৯০ দিন',
      activityHistory: 'কাৰ্যসূচীৰ ইতিহাস',
      alertsTitle: 'সতৰ্কবাৰ্তা',
      notesTitle: 'শুশ্ৰূষাকাৰীৰ টোকা',
      addNote: 'নতুন টোকা দিয়ক',
      notePlaceholder: 'যেনে: আজি চাহপাতৰ স্মৃতি খেল ভাল পালে; শান্ত আছিল...',
      themeSelector: 'সাংস্কৃতিক স্মৃতি থীম',
      photosTitle: 'পৰিয়ালৰ পুৰণি স্মৃতি ছবি',
      nonDiagnosticNotice: 'এই তথ্যসমূহ কেৱল মানসিক সন্তুষ্টি আৰু দৈনন্দিন কাৰ্যকলাপৰ নিৰীক্ষণ, ৰোগ নিৰ্ণয় নহয়।',
    },
    healthcare: {
      title: 'ক্ষেত্ৰভিত্তিক স্বাস্থ্যকৰ্মী মোড',
      assignedPatients: 'জিলাত আৱণ্টিত জ্যেষ্ঠ নাগৰিকসকল',
      fieldObservations: 'ক্ষেত্ৰ পৰিদৰ্শনৰ টোকা',
      addObservation: 'পৰ্যবেক্ষণ লিপিবদ্ধ কৰক',
      visitScheduler: 'পৰৱৰ্তী স্বাস্থ্য পৰিদৰ্শন',
      noDiagnosticClaim: 'এই টোকাসমূহ সমাজভিত্তিক যত্নৰ বাবেহে, চিকিৎসাজনিত নিদান নহয়।',
    },
    offline: {
      offlineNotice: 'অফলাইন মোড: আপোনাৰ তথ্য এই যন্ত্ৰটোতে সুৰক্ষিতভাৱে জমা হৈছে।',
      syncing: 'তথ্য সংৰক্ষণ কৰা হৈছে...',
      synced: 'সকলো তথ্য আপডেট হ’ল',
      online: 'ইণ্টাৰনেট সংযোজিত',
      simulateOffline: 'অফলাইন পৰীক্ষা কৰক',
      simulateOnline: 'ইণ্টাৰনেট চালু কৰক',
    },
  },
};
