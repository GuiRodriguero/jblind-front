import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PokerChip from './chip/PokerChip';
import type { ReactNode } from 'react';

interface TimerClockBoardProps {
  isPlaying: boolean;
  timeLeft: number;
  roundName: string;
  isBreak?: boolean;
  shouldColorUp?: boolean;
  currentBlinds: ReactNode;
  currentBigBlind: number;
  currentAnte: number;
  nextBlinds: string;
  nextAnte: number;
  nextBreakMessage?: string | null;
  onTogglePlay: () => void;
  onNextRound: () => void;
  onPrevRound: () => void;
}

export function TimerClockBoard({
  isPlaying,
  timeLeft,
  roundName,
  isBreak,
  shouldColorUp,
  currentBlinds,
  currentBigBlind,
  currentAnte,
  nextBlinds,
  nextAnte,
  nextBreakMessage,
  onTogglePlay,
  onNextRound,
  onPrevRound,
}: TimerClockBoardProps) {
  const { t } = useTranslation();

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  const renderCurrentChips = (bigBlind: number) => {
    const standardChips = [1, 5, 10, 25, 100, 500, 1000, 5000, 10000, 25000];
    const validChips = standardChips.filter((chip) => chip <= bigBlind);
    const chipsToShow = validChips.slice(-2).reverse();

    return (
      <div className="flex items-center gap-2 mt-3">
        {chipsToShow.map((chip) => (
          <PokerChip key={chip} amount={chip} />
        ))}
      </div>
    );
  };

  const glowColor = isBreak && shouldColorUp ? 'bg-amber-500/20' : 'bg-blue-600/20';

  return (
    <div className="col-span-6 flex flex-col items-center justify-between bg-white/2 rounded-2xl border border-white/5 p-4 xl:p-6 min-h-0 overflow-hidden">
      <span className="text-gray-500 font-bold tracking-[0.3em] shrink-0 mt-2 xl:mt-4">{roundName}</span>

      <h1 className="text-[clamp(5rem,18vh,12rem)] font-digital leading-none tracking-tighter text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] my-auto shrink-0 tabular-nums">
        {formatTime(timeLeft)}
      </h1>

      <div className="flex flex-col items-center w-full shrink-0">
        <div className="flex items-center gap-4 xl:gap-6 mb-4 xl:mb-6">
          <button
            onClick={onPrevRound}
            className="p-2 xl:p-3 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <SkipBack size={24} />
          </button>
          <button
            onClick={onTogglePlay}
            className="w-16 h-16 xl:w-20 xl:h-20 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-900/30 transition-all hover:scale-105"
          >
            {isPlaying ? (
              <Pause size={28} fill="currentColor" />
            ) : (
              <Play size={28} fill="currentColor" className="ml-1 xl:ml-2" />
            )}
          </button>
          <button
            onClick={onNextRound}
            className="p-2 xl:p-3 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <SkipForward size={24} />
          </button>
        </div>

        {nextBreakMessage ? (
          <p className="text-sm xl:text-base text-blue-400 font-medium mb-3">{nextBreakMessage}</p>
        ) : (
          <div className="h-5 xl:h-6 mb-3" />
        )}

        <div className="flex justify-around items-start w-full bg-[#0a0a0a] py-4 px-2 xl:p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div
            className={`absolute left-1/4 bottom-0 -translate-x-1/2 w-32 h-16 ${glowColor} blur-[30px] rounded-full pointer-events-none transition-colors duration-1000`}
          ></div>

          <div className="text-center flex flex-col items-center relative z-10 w-1/2">
            <p className="text-[10px] xl:text-xs text-blue-400 uppercase font-bold mb-1">{t('timer.currentBlinds')}</p>
            <p className="text-3xl xl:text-5xl font-bold text-white drop-shadow-md">{currentBlinds}</p>
            {!isBreak && <p className="text-xs xl:text-sm text-gray-400 mt-1">Ante: {currentAnte}</p>}
            {isBreak && shouldColorUp && (
              <div className="flex items-center gap-4">
                <p className="text-[12px] text-amber-400 font-bold uppercase">{t('timer.removeLowChips')}</p>
                <PokerChip size="sm" />
              </div>
            )}
            {renderCurrentChips(currentBigBlind)}
          </div>

          <div className="w-px bg-white/10 h-24 my-auto"></div>

          <div className="text-center flex flex-col items-center opacity-50 w-1/2">
            <p className="text-[10px] xl:text-xs text-gray-600 uppercase font-bold mb-1">{t('timer.nextBlinds')}</p>
            <p className="text-2xl xl:text-4xl text-gray-500 font-bold">{nextBlinds}</p>
            {!isBreak && <p className="text-xs xl:text-sm text-gray-500 mt-1">Ante: {nextAnte}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
