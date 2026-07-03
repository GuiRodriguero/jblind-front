import { Pause, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CashGameTimerBoardProps {
  isPlaying: boolean;
  elapsedSeconds: number;
  title: string;
  blinds: string;
  onTogglePlay: () => void;
}

export function CashGameTimerBoard({ isPlaying, elapsedSeconds, title, blinds, onTogglePlay }: CashGameTimerBoardProps) {
  const { t } = useTranslation();

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl border border-white/10 p-8">
      <span className="text-green-500 font-bold tracking-[0.3em] uppercase mb-4">{title}</span>

      <div className="flex items-center gap-8 mb-6">
        <h1 className="text-7xl xl:text-9xl font-digital text-white drop-shadow-[0_0_30px_rgba(34,197,94,0.3)] tabular-nums">
          {formatTime(elapsedSeconds)}
        </h1>

        <button onClick={onTogglePlay} className="w-16 h-16 xl:w-20 xl:h-20 flex items-center justify-center bg-green-600 hover:bg-green-500 text-white rounded-full shadow-lg shadow-green-900/30 transition-all hover:scale-105">
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
        </button>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">{t('cashgame.active.timer.blinds')}</p>
        <p className="text-3xl xl:text-5xl font-black text-white">{blinds}</p>
      </div>
    </div>
  );
}