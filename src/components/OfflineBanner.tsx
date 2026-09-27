import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { WifiOff, RefreshCw, CheckCircle, Wifi } from 'lucide-react';

interface OfflineBannerProps {
  isOffline: boolean;
  syncQueueCount: number;
  isSyncing: boolean;
  justSynced: boolean;
  language: Language;
  onRestoreOnline: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOffline,
  syncQueueCount,
  isSyncing,
  justSynced,
  language,
  onRestoreOnline,
}) => {
  const t = translations[language];

  if (!isOffline && !isSyncing && !justSynced) return null;

  return (
    <div className="bg-stone-900 text-stone-100 px-4 py-2 text-xs font-semibold shadow-md flex items-center justify-between gap-4 sticky top-[68px] z-30">
      <div className="flex items-center gap-2 max-w-xl mx-auto w-full justify-between">
        {isOffline ? (
          <div className="flex items-center gap-2 text-amber-300">
            <WifiOff className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
            <span>
              <strong>OFFLINE MODE:</strong> {t.offline.offlineNotice}
              {syncQueueCount > 0 && ` (${syncQueueCount} activities queued)`}
            </span>
          </div>
        ) : isSyncing ? (
          <div className="flex items-center gap-2 text-sky-300">
            <RefreshCw className="w-4 h-4 animate-spin text-sky-400 shrink-0" />
            <span>SYNCING... {t.offline.syncing}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>SYNC COMPLETE — {t.offline.synced}</span>
          </div>
        )}

        {isOffline && (
          <button
            onClick={onRestoreOnline}
            className="text-[11px] bg-stone-800 hover:bg-stone-700 text-amber-200 px-2.5 py-1 rounded-lg border border-stone-700 font-bold transition-colors shrink-0"
          >
            {t.offline.simulateOnline}
          </button>
        )}
      </div>
    </div>
  );
};
