import React, { useState } from 'react';
import { FamilyPhoto, Language, PatientProfile } from '../types';
import { translations } from '../translations';
import { storageService } from '../services/storageService';
import { voiceService } from '../services/voiceService';
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, Volume2, Sparkles, UserCheck } from 'lucide-react';

interface FamilyPhotoGameProps {
  patient: PatientProfile;
  language: Language;
  onBack: () => void;
}

export const FamilyPhotoGame: React.FC<FamilyPhotoGameProps> = ({
  patient,
  language,
  onBack,
}) => {
  const t = translations[language];
  const [photos] = useState<FamilyPhoto[]>(storageService.getPhotos());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPersonDetails, setShowPersonDetails] = useState(false);

  const currentPhoto = photos[currentIndex] || photos[0];

  const handleNext = () => {
    setShowPersonDetails(false);
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setShowPersonDetails(false);
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleReadStory = () => {
    if (currentPhoto) {
      voiceService.speak(
        `${currentPhoto.storyPrompt}. ${showPersonDetails ? `This is ${currentPhoto.personName}, your ${currentPhoto.relationship}.` : ''}`,
        language
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-32 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-extrabold text-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.nav.back}</span>
        </button>

        <span className="text-sm font-black text-rose-900 bg-rose-100 px-3 py-1 rounded-xl">
          Photo {currentIndex + 1} of {photos.length}
        </span>
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
          {t.games.familyPhotoTitle}
        </h1>
        <p className="text-sm font-semibold text-stone-600 mt-1">
          {t.games.familyPhotoDesc}
        </p>
      </div>

      {/* Photo Card Container */}
      {currentPhoto && (
        <div className="bg-white rounded-3xl p-5 border-4 border-rose-200 shadow-xl space-y-4">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border-2 border-stone-200">
            <img
              src={currentPhoto.imageUrl}
              alt={currentPhoto.title}
              className="w-full h-full object-cover select-none"
            />
            {currentPhoto.year && (
              <span className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-md text-amber-200 text-xs font-black px-2.5 py-1 rounded-xl">
                Year: {currentPhoto.year}
              </span>
            )}
          </div>

          {/* Story Prompt */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-black text-rose-950">
                "{currentPhoto.storyPrompt}"
              </h3>
            </div>
            <button
              onClick={handleReadStory}
              className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 transition-colors shrink-0"
              title="Read aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Reveal Person Name Button / Details */}
          {!showPersonDetails ? (
            <button
              onClick={() => {
                setShowPersonDetails(true);
                voiceService.speak(`This is ${currentPhoto.personName}, your ${currentPhoto.relationship}.`, language);
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-base border border-amber-300 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <UserCheck className="w-5 h-5 text-amber-700" />
              <span>Who is in this photo?</span>
            </button>
          ) : (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center space-y-1 animate-scale-up">
              <h4 className="text-xl font-black text-emerald-950">
                {currentPhoto.personName}
              </h4>
              <p className="text-sm font-bold text-emerald-800">
                {currentPhoto.relationship}
              </p>
            </div>
          )}

          {/* Navigation Prev / Next */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-extrabold text-sm transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1 text-rose-600">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm transition-all active:scale-95 shadow-xs"
            >
              <span>Next Photo</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
