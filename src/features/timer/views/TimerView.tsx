import { useState } from 'react';
import { TimerBlindsTableCard } from '../components/TimerStructureCard';
import { TimerPrizePoolCard } from '../components/TimerPrizePoolCard';
import { TimerClockBoard } from '../components/TimerClockBoard';
import { TimerPlayersCard } from '../components/TimerPlayersCard';
import { TimerStatsFooter } from '../components/TimerStatsFooter';

export function TimerView() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="h-full flex flex-col p-6 gap-6 overflow-hidden">
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-3 flex flex-col gap-6 h-full min-h-0">
          <TimerBlindsTableCard />
          <TimerPrizePoolCard />
        </div>

        <TimerClockBoard isPlaying={isPlaying} onTogglePlay={() => setIsPlaying(!isPlaying)} />
        <TimerPlayersCard />
      </div>

      <TimerStatsFooter />
    </div>
  );
}
