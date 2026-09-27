import React, { useState } from 'react';
import { PatientProfile, CaregiverNote, Language } from '../types';
import { translations } from '../translations';
import { storageService } from '../services/storageService';
import { 
  Stethoscope, 
  MapPin, 
  Phone, 
  Calendar, 
  FileText, 
  Plus, 
  ShieldAlert, 
  CheckCircle2, 
  Activity,
  Heart
} from 'lucide-react';

interface HealthcareWorkerDashboardProps {
  patients: PatientProfile[];
  activePatient: PatientProfile;
  setActivePatientId: (id: string) => void;
  caregiverNotes: CaregiverNote[];
  language: Language;
  onNoteAdded: (note: CaregiverNote) => void;
}

export const HealthcareWorkerDashboard: React.FC<HealthcareWorkerDashboardProps> = ({
  patients,
  activePatient,
  setActivePatientId,
  caregiverNotes,
  language,
  onNoteAdded,
}) => {
  const t = translations[language];
  const [newObs, setNewObs] = useState('');
  const [workerName, setWorkerName] = useState('Nurse Minati Das (ANM / ASHA)');

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObs.trim()) return;

    const note = storageService.addCaregiverNote({
      patientId: activePatient.id,
      author: workerName,
      role: 'healthcare_worker',
      text: newObs.trim(),
      category: 'general',
    });
    onNoteAdded(note);
    setNewObs('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 pb-24 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-700 text-white flex items-center justify-center shadow-md shrink-0">
            <Stethoscope className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                Community Health Worker Portal
              </span>
              <span className="text-xs text-stone-500">• Kamrup Metro Health Circle</span>
            </div>
            <h1 className="text-2xl font-black text-stone-900 mt-1">
              {t.healthcare.title}
            </h1>
            <p className="text-xs font-semibold text-stone-600">
              Assigned Field Worker: {workerName}
            </p>
          </div>
        </div>

        {/* District Pilot Indicator */}
        <div className="bg-indigo-50 border border-indigo-200 px-4 py-2.5 rounded-2xl text-indigo-950 text-xs font-bold flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-700" />
          <span>NER District Health Block 4 (Guwahati - Shillong - Tawang)</span>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-indigo-50/70 border-2 border-indigo-200 rounded-2xl p-4 flex items-start gap-3 text-xs font-semibold text-indigo-950">
        <ShieldAlert className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
        <p>
          <span className="font-extrabold uppercase">Field Protocol: </span>
          {t.healthcare.noDiagnosticClaim} Records are purely observational routines for community support.
        </p>
      </div>

      {/* Assigned Patients Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-lg font-black text-stone-900">
          {t.healthcare.assignedPatients} ({patients.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {patients.map((pat) => (
            <div
              key={pat.id}
              onClick={() => setActivePatientId(pat.id)}
              className={`p-5 rounded-3xl border-3 transition-all cursor-pointer shadow-sm ${
                pat.id === activePatient.id
                  ? 'bg-indigo-50/80 border-indigo-500 ring-4 ring-indigo-100'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-black text-stone-900">
                    {pat.name}
                  </h4>
                  <p className="text-xs font-semibold text-stone-500">
                    Age {pat.age} • {pat.city}, {pat.state}
                  </p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                  {pat.preferredLanguage.toUpperCase()}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/80 space-y-1.5 text-xs text-stone-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>Caregiver: {pat.caregiverName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Difficulty: {pat.currentDifficulty.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Field Observation Logger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Record Observation Form */}
        <form onSubmit={handleAddObservation} className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-black text-stone-900">
              {t.healthcare.addObservation} for {activePatient.name}
            </h3>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-600 block mb-1">
              Field Worker Name / Designation
            </label>
            <input
              type="text"
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-300 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-600 block mb-1">
              Non-Diagnostic Observation Notes
            </label>
            <textarea
              value={newObs}
              onChange={(e) => setNewObs(e.target.value)}
              placeholder="e.g. Conducted routine home visit. Patient was relaxed, recognized family photographs, blood pressure measured normal (124/80)..."
              rows={4}
              className="w-full p-4 rounded-2xl border border-stone-300 font-semibold text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!newObs.trim()}
            className="px-6 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50 text-white font-black text-sm shadow-xs transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Record Care Observation</span>
          </button>
        </form>

        {/* Previous Care Notes & Observations */}
        <div className="space-y-3">
          <h3 className="text-lg font-black text-stone-900">
            Care History for {activePatient.name}
          </h3>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {caregiverNotes.map((note) => (
              <div key={note.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-extrabold px-2 py-0.5 rounded-md ${note.role === 'healthcare_worker' ? 'bg-indigo-100 text-indigo-900' : 'bg-amber-100 text-amber-900'}`}>
                    {note.role === 'healthcare_worker' ? 'Health Worker' : 'Caregiver'}
                  </span>
                  <span className="text-stone-400 font-semibold">
                    {note.timestamp}
                  </span>
                </div>
                <p className="text-sm font-semibold text-stone-800">
                  {note.text}
                </p>
                <p className="text-xs font-bold text-stone-500">
                  By {note.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
