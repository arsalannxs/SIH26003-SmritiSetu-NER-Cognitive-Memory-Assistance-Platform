import React, { useState } from 'react';
import { 
  PatientProfile, 
  GameResult, 
  ReminderItem, 
  CaregiverNote, 
  CaregiverAlert, 
  CulturalTheme, 
  Language 
} from '../types';
import { translations } from '../translations';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { 
  Users, 
  TrendingUp, 
  Bell, 
  FileText, 
  Palette, 
  Camera, 
  Plus, 
  Sparkles, 
  ShieldAlert, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface CaregiverDashboardProps {
  patients: PatientProfile[];
  activePatient: PatientProfile;
  setActivePatientId: (id: string) => void;
  gameResults: GameResult[];
  reminders: ReminderItem[];
  caregiverNotes: CaregiverNote[];
  alerts: CaregiverAlert[];
  language: Language;
  onPatientUpdated: (updated: PatientProfile) => void;
  onNoteAdded: (note: CaregiverNote) => void;
  onAlertRead: (id: string) => void;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({
  patients,
  activePatient,
  setActivePatientId,
  gameResults,
  reminders,
  caregiverNotes,
  alerts,
  language,
  onPatientUpdated,
  onNoteAdded,
  onAlertRead,
}) => {
  const t = translations[language];
  const [timeFilter, setTimeFilter] = useState<'7' | '30' | '90'>('7');
  const [activeTab, setActiveTab] = useState<'analytics' | 'notes' | 'theme' | 'photos' | 'alerts'>('analytics');
  
  // Note form state
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<'general' | 'mood' | 'routine' | 'game_feedback'>('game_feedback');

  // AI Summary State
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiObservations, setAiObservations] = useState<string[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // New photo form state
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoPerson, setPhotoPerson] = useState('');
  const [photoRelation, setPhotoRelation] = useState('');
  const [photoPrompt, setPhotoPrompt] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [showPhotoForm, setShowPhotoForm] = useState(false);

  // Weekly Trend Chart Data
  const weeklyData = [
    { day: 'Mon', activities: 4, accuracy: 85, reminders: 100 },
    { day: 'Tue', activities: 5, accuracy: 90, reminders: 90 },
    { day: 'Wed', activities: 3, accuracy: 80, reminders: 100 },
    { day: 'Thu', activities: 6, accuracy: 88, reminders: 95 },
    { day: 'Fri', activities: 4, accuracy: 82, reminders: 85 },
    { day: 'Sat', activities: 5, accuracy: 92, reminders: 100 },
    { day: 'Sun', activities: 4, accuracy: 88, reminders: 90 },
  ];

  // Activity Distribution Data
  const pieData = [
    { name: 'Memory Match', value: 35, color: '#F59E0B' },
    { name: 'Routine Recall', value: 25, color: '#10B981' },
    { name: 'Object Recog.', value: 20, color: '#0EA5E9' },
    { name: 'Attention Focus', value: 20, color: '#6366F1' },
  ];

  const handleGenerateAiSummary = async () => {
    setIsLoadingAi(true);
    const notesSummary = caregiverNotes.slice(0, 3).map((n) => n.text);
    const res = await aiService.getCaregiverSummary(
      activePatient.name,
      gameResults.length,
      '92%',
      notesSummary
    );
    setAiSummary(res.summary);
    if (res.observations) setAiObservations(res.observations);
    setIsLoadingAi(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const note = storageService.addCaregiverNote({
      patientId: activePatient.id,
      author: activePatient.caregiverName,
      role: 'caregiver',
      text: newNoteText.trim(),
      category: newNoteCategory,
    });
    onNoteAdded(note);
    setNewNoteText('');
  };

  const handleSelectTheme = (theme: CulturalTheme) => {
    const updated = storageService.updateActivePatient({ theme });
    onPatientUpdated(updated);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle || !photoPerson) return;

    storageService.addPhoto({
      patientId: activePatient.id,
      title: photoTitle,
      personName: photoPerson,
      relationship: photoRelation || 'Family Member',
      imageUrl: photoUrl || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80',
      storyPrompt: photoPrompt || `Do you remember this loving moment with ${photoPerson}?`,
    });

    setPhotoTitle('');
    setPhotoPerson('');
    setPhotoRelation('');
    setPhotoPrompt('');
    setPhotoUrl('');
    setShowPhotoForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 pb-24 animate-fade-in">
      {/* Top Banner: Patient Selector & Caregiver Profile */}
      <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-md shrink-0">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                Active Caregiver Portal
              </span>
              <span className="text-xs text-stone-500">• MDoNER NER Pilot</span>
            </div>
            <h1 className="text-2xl font-black text-stone-900 mt-1">
              {activePatient.name}
            </h1>
            <p className="text-xs font-semibold text-stone-600">
              Caregiver: {activePatient.caregiverName} ({activePatient.caregiverPhone})
            </p>
          </div>
        </div>

        {/* Switch Patient Dropdown */}
        <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-2xl border border-stone-200">
          <span className="text-xs font-bold text-stone-600 ml-2">Patient:</span>
          <select
            value={activePatient.id}
            onChange={(e) => setActivePatientId(e.target.value)}
            className="bg-white border border-stone-300 text-stone-900 font-bold text-sm rounded-xl px-3 py-2 shadow-xs focus:ring-2 focus:ring-teal-500 outline-none"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.city}, {p.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Safety Notice Banner (Requirement 19: Keep medical interpretation out of dashboard) */}
      <div className="bg-teal-50/80 border-2 border-teal-200 rounded-2xl p-4 flex items-start gap-3 text-xs font-semibold text-teal-950">
        <ShieldAlert className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <p>
          <span className="font-extrabold uppercase">Non-Diagnostic Platform: </span>
          {t.caregiver.nonDiagnosticNotice} Trends measure routine adherence and game engagement.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-extrabold transition-all ${
            activeTab === 'analytics'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Activity Trends & Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-extrabold transition-all relative ${
            activeTab === 'alerts'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alerts</span>
          {alerts.filter((a) => !a.read).length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-extrabold transition-all ${
            activeTab === 'notes'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Care Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-extrabold transition-all ${
            activeTab === 'theme'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Cultural Themes</span>
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-extrabold transition-all ${
            activeTab === 'photos'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Family Reminiscence Photos</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS & TRENDS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border-2 border-stone-200 shadow-sm">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Games Completed
              </span>
              <div className="text-3xl font-black text-amber-600 mt-1">
                {gameResults.length}
              </div>
              <span className="text-xs text-stone-600 font-semibold">
                Across 6 engagement types
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-stone-200 shadow-sm">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Average Focus Rate
              </span>
              <div className="text-3xl font-black text-emerald-600 mt-1">
                88%
              </div>
              <span className="text-xs text-stone-600 font-semibold">
                Non-stressful accuracy
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-stone-200 shadow-sm">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Routine Adherence
              </span>
              <div className="text-3xl font-black text-sky-600 mt-1">
                92%
              </div>
              <span className="text-xs text-stone-600 font-semibold">
                Medicine & hydration
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-stone-200 shadow-sm">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Current Difficulty
              </span>
              <div className="text-3xl font-black text-teal-600 mt-1 capitalize">
                {activePatient.currentDifficulty.replace('_', ' ')}
              </div>
              <span className="text-xs text-stone-600 font-semibold">
                Auto-adapted pace
              </span>
            </div>
          </div>

          {/* AI Activity Summary Card */}
          <div className="bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-black text-stone-900">
                  AI Activity Trend Summary (Gemini 3.8 Flash)
                </h3>
              </div>
              <button
                onClick={handleGenerateAiSummary}
                disabled={isLoadingAi}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all active:scale-95 shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoadingAi ? 'Analyzing Trends...' : 'Refresh AI Summary'}</span>
              </button>
            </div>

            {aiSummary ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-stone-800 leading-relaxed bg-white/90 p-4 rounded-2xl border border-amber-200">
                  {aiSummary}
                </p>
                {aiObservations.length > 0 && (
                  <div className="space-y-1 pl-2">
                    {aiObservations.map((obs, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs font-bold text-stone-700">
                        <span className="text-amber-600">•</span>
                        <span>{obs}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs font-semibold text-stone-600">
                Click "Refresh AI Summary" to generate supportive non-diagnostic observations from recent sessions.
              </p>
            )}
          </div>

          {/* Recharts Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Weekly Activity & Routine Trend */}
            <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-stone-900">
                    Weekly Activity & Routine Adherence
                  </h3>
                  <p className="text-xs text-stone-500">
                    Daily engagement count and routine adherence %
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold text-stone-700">
                  <button
                    onClick={() => setTimeFilter('7')}
                    className={`px-2 py-0.5 rounded-lg ${timeFilter === '7' ? 'bg-white shadow-xs' : ''}`}
                  >
                    7D
                  </button>
                  <button
                    onClick={() => setTimeFilter('30')}
                    className={`px-2 py-0.5 rounded-lg ${timeFilter === '30' ? 'bg-white shadow-xs' : ''}`}
                  >
                    30D
                  </button>
                  <button
                    onClick={() => setTimeFilter('90')}
                    className={`px-2 py-0.5 rounded-lg ${timeFilter === '90' ? 'bg-white shadow-xs' : ''}`}
                  >
                    90D
                  </button>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    />
                    <Bar dataKey="activities" name="Games & Activities" fill="#0D9488" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="reminders" name="Routine Adherence %" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Focus & Accuracy Trend */}
            <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-black text-stone-900">
                  Focus Rate Trend
                </h3>
                <p className="text-xs text-stone-500">
                  Gentle accuracy percentage over time
                </p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} domain={[60, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      name="Focus Rate %"
                      stroke="#0EA5E9"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#0EA5E9' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-stone-900">
              Caregiver Notifications & Routine Alerts
            </h3>
            <span className="text-xs text-stone-500 font-semibold">
              Non-emergency routine updates
            </span>
          </div>

          <div className="space-y-3">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-start justify-between gap-4 ${
                  alt.severity === 'warning'
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-white border-stone-200'
                } ${alt.read ? 'opacity-70' : 'shadow-sm'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 ${alt.severity === 'warning' ? 'bg-amber-200 text-amber-900' : 'bg-teal-100 text-teal-800'}`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-stone-900">
                        {alt.title}
                      </h4>
                      <span className="text-[11px] font-semibold text-stone-400">
                        {alt.timestamp}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-stone-600 mt-1">
                      {alt.message}
                    </p>
                  </div>
                </div>

                {!alt.read && (
                  <button
                    onClick={() => onAlertRead(alt.id)}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl shrink-0"
                  >
                    Mark Seen
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: NOTES & OBSERVATIONS */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-stone-900">
              {t.caregiver.addNote}
            </h3>

            <div className="flex items-center gap-2 flex-wrap">
              {(['game_feedback', 'routine', 'mood', 'general'] as const).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setNewNoteCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    newNoteCategory === cat
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>

            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder={t.caregiver.notePlaceholder}
              rows={3}
              className="w-full p-4 rounded-2xl border border-stone-300 font-semibold text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            />

            <button
              type="submit"
              disabled={!newNoteText.trim()}
              className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white font-black text-sm shadow-xs transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Save Observation</span>
            </button>
          </form>

          {/* Notes List */}
          <div className="space-y-3">
            <h4 className="text-base font-black text-stone-900">
              Observation History
            </h4>
            {caregiverNotes.map((note) => (
              <div key={note.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md capitalize">
                    {note.category.replace('_', ' ')}
                  </span>
                  <span className="text-stone-400 font-semibold">
                    {note.timestamp} • {note.author}
                  </span>
                </div>
                <p className="text-sm font-semibold text-stone-800">
                  {note.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CULTURAL THEMES SELECTOR */}
      {activeTab === 'theme' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-black text-stone-900">
              {t.caregiver.themeSelector}
            </h3>
            <p className="text-xs text-stone-500 font-semibold">
              Select culturally familiar themes for games and reminiscence (Requirement 23)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                id: 'assam_tea_flora' as CulturalTheme,
                title: 'Assam Tea Gardens & Native Flora',
                desc: 'Tea leaves, bamboo shoots, orchid flowers, tea cups',
                icon: '🍃',
                active: activePatient.theme === 'assam_tea_flora',
              },
              {
                id: 'ne_wildlife' as CulturalTheme,
                title: 'Northeast Wildlife & Nature',
                desc: 'One-horned rhino, Great Hornbill, forest rivers, hills',
                icon: '🦏',
                active: activePatient.theme === 'ne_wildlife',
              },
              {
                id: 'heritage_festivals' as CulturalTheme,
                title: 'Heritage, Bihu & Handloom',
                desc: 'Japi hat, Bihu Dhol drum, Golden Muga silk, bells',
                icon: '👒',
                active: activePatient.theme === 'heritage_festivals',
              },
              {
                id: 'himalayan_nature' as CulturalTheme,
                title: 'Himalayan Hills & Monasteries',
                desc: 'Pine trees, snow peaks, Loktak Lake flowers, morning mist',
                icon: '🏔️',
                active: activePatient.theme === 'himalayan_nature',
              },
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => handleSelectTheme(th.id)}
                className={`p-5 rounded-3xl border-3 text-left transition-all active:scale-98 flex items-start gap-4 ${
                  th.active
                    ? 'bg-amber-50 border-amber-500 shadow-md ring-4 ring-amber-100'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                  {th.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-stone-900">
                      {th.title}
                    </h4>
                    {th.active && (
                      <span className="text-[10px] bg-amber-500 text-stone-950 font-black px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-stone-500 mt-1">
                    {th.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: FAMILY PHOTOS REMINISCENCE MANAGER */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-stone-900">
                {t.caregiver.photosTitle}
              </h3>
              <p className="text-xs text-stone-500 font-semibold">
                Upload loved ones and familiar places for gentle memory stimulation
              </p>
            </div>
            <button
              onClick={() => setShowPhotoForm(!showPhotoForm)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Family Photo</span>
            </button>
          </div>

          {showPhotoForm && (
            <form onSubmit={handleAddPhoto} className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-4 animate-scale-up">
              <h4 className="text-base font-black text-stone-900">
                New Memory Album Photo
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-600 block mb-1">
                    Photo Title
                  </label>
                  <input
                    type="text"
                    required
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                    placeholder="e.g. Bihu celebration at ancestral house"
                    className="w-full p-3 rounded-xl border border-stone-300 text-sm font-semibold focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-600 block mb-1">
                    Person Name
                  </label>
                  <input
                    type="text"
                    required
                    value={photoPerson}
                    onChange={(e) => setPhotoPerson(e.target.value)}
                    placeholder="e.g. Rupali (Daughter)"
                    className="w-full p-3 rounded-xl border border-stone-300 text-sm font-semibold focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  Story Prompt / Question
                </label>
                <input
                  type="text"
                  value={photoPrompt}
                  onChange={(e) => setPhotoPrompt(e.target.value)}
                  placeholder="e.g. Remember the warm sunshine on the tea garden porch?"
                  className="w-full p-3 rounded-xl border border-stone-300 text-sm font-semibold focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm shadow-xs transition-all active:scale-95"
              >
                Save to Memory Album
              </button>
            </form>
          )}

          {/* Photo Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {storageService.getPhotos().map((pho) => (
              <div key={pho.id} className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm space-y-2 pb-3">
                <img src={pho.imageUrl} alt={pho.title} className="w-full h-40 object-cover" />
                <div className="px-3">
                  <h5 className="text-sm font-bold text-stone-900 truncate">{pho.personName}</h5>
                  <p className="text-xs text-stone-500 line-clamp-2">"{pho.storyPrompt}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
