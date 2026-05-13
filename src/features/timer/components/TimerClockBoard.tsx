import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface TimerClockBoardProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export function TimerClockBoard({ isPlaying, onTogglePlay }: TimerClockBoardProps) {
  return (
    <div className="col-span-6 flex flex-col items-center justify-between bg-white/[0.02] rounded-2xl border border-white/5 p-4 xl:p-6 min-h-0 overflow-hidden">
      <span className="text-gray-500 font-bold tracking-[0.3em] shrink-0 mt-2 xl:mt-4">ROUND 10</span>

      <h1 className="text-[clamp(5rem,18vh,12rem)] font-black leading-none tracking-tighter text-white drop-shadow-2xl my-auto shrink-0">
        28:29
      </h1>

      <div className="flex flex-col items-center w-full shrink-0">
        <div className="flex items-center gap-4 xl:gap-6 mb-4 xl:mb-6">
          <button className="p-2 xl:p-3 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all">
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

          <button className="p-2 xl:p-3 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all">
            <SkipForward size={24} />
          </button>
        </div>

        <p className="text-sm xl:text-base text-blue-400 font-medium mb-3">Next break in 15 minutes</p>

        <div className="flex justify-around w-full bg-[#0a0a0a] py-4 px-2 xl:p-6 rounded-2xl border border-white/5">
          <div className="text-center">
            <p className="text-[10px] xl:text-xs text-gray-500 uppercase font-bold mb-1">Current Blinds</p>
            <p className="text-2xl xl:text-4xl font-bold">200 / 400</p>
            <p className="text-xs xl:text-sm text-gray-400 mt-1">Ante: 400</p>
          </div>

          <div className="w-px bg-white/10"></div>

          <div className="text-center opacity-50">
            <p className="text-[10px] xl:text-xs text-gray-600 uppercase font-bold mb-1">Next Blinds</p>
            <p className="text-2xl xl:text-4xl text-gray-500 font-bold">400 / 800</p>
            <p className="text-xs xl:text-sm text-gray-500 mt-1">Ante: 800</p>
          </div>
        </div>
      </div>
    </div>
  );
}
