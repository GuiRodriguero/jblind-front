import { useEffect, useState } from 'react';
import { TimerBlindsTableCard } from '../components/TimerStructureCard';
import { TimerPrizePoolCard } from '../components/TimerPrizePoolCard';
import { TimerClockBoard } from '../components/TimerClockBoard';
import { TimerPlayersCard } from '../components/TimerPlayersCard';
import { TimerStatsFooter } from '../components/TimerStatsFooter';

export function TimerView() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isPlaying) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          // Se chegou a zero, para o cronómetro e tira do play
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsPlaying(false);

            // TODO Futuro: Aqui você chamará a função que avança o Nível/Round!

            return 0;
          }
          // Caso contrário, desconta 1 segundo
          return prevTime - 1;
        });
      }, 1000); // 1000 ms = 1 segundo
    }

    // A função de "cleanup" do useEffect é essencial para não haver memory leaks no React
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNextRound = () => {
    setTimeLeft(15 * 60); // Reseta para 15 min
    // No futuro: mudaria do Round 1 para o 2
  };

  const handlePrevRound = () => {
    setTimeLeft(15 * 60); // Reseta para 15 min
    // No futuro: mudaria do Round 2 para o 1
  };

  return (
    <div className="h-full flex flex-col p-6 gap-6 overflow-hidden">
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-3 flex flex-col gap-6 h-full min-h-0">
          <TimerBlindsTableCard />
          <TimerPrizePoolCard />
        </div>

        <TimerClockBoard
          isPlaying={isPlaying}
          timeLeft={timeLeft}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onNextRound={handleNextRound}
          onPrevRound={handlePrevRound}
        />
        <TimerPlayersCard />
      </div>

      <TimerStatsFooter />
    </div>
  );
}
