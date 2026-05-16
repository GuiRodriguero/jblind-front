import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TimerBlindsTableCard } from '../components/TimerStructureCard';
import { TimerPrizePoolCard } from '../components/TimerPrizePoolCard';
import { TimerClockBoard } from '../components/TimerClockBoard';
import { TimerPlayersCard } from '../components/TimerPlayersCard';
import { TimerStatsFooter } from '../components/TimerStatsFooter';
import { useTranslation } from 'react-i18next';

export function TimerView() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get('tournamentId');

  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState<any>(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    async function loadTournament() {
      if (!tournamentId) return;
      try {
        const response = await fetch(`http://localhost:8080/v1/tournaments/${tournamentId}`);
        if (response.ok) {
          const data = await response.json();
          setTournament(data);
          setTimeLeft(data.levels[0].durationInMinutes * 60);
        }
      } catch (error) {
        console.error('Error loading tournament:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTournament();
  }, [tournamentId]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      handleNextRound();
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const handleNextRound = () => {
    if (tournament && currentLevelIndex < tournament.levels.length - 1) {
      const nextIndex = currentLevelIndex + 1;
      setCurrentLevelIndex(nextIndex);
      setTimeLeft(tournament.levels[nextIndex].durationInMinutes * 60);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevRound = () => {
    if (tournament && currentLevelIndex > 0) {
      const prevIndex = currentLevelIndex - 1;
      setCurrentLevelIndex(prevIndex);
      setTimeLeft(tournament.levels[prevIndex].durationInMinutes * 60);
    }
  };

  if (loading) return <div className="p-8 text-white">{t('timer.loading')}</div>;
  if (!tournament) return <div className="p-8 text-white">{t('timer.notFound')}</div>;

  const currentLevel = tournament.levels[currentLevelIndex];
  const nextLevel = tournament.levels[currentLevelIndex + 1];

  return (
    <div className="h-full flex flex-col p-6 gap-6 overflow-hidden">
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-3 flex flex-col gap-6 h-full min-h-0">
          <TimerBlindsTableCard levels={tournament.levels} currentIndex={currentLevelIndex} />
          <TimerPrizePoolCard buyIn={tournament.buyIn} totalPlayers={tournament.expectedPlayers} />
        </div>

        <TimerClockBoard
          isPlaying={isPlaying}
          timeLeft={timeLeft}
          roundName={currentLevel.isBreak ? 'BREAK' : `ROUND ${currentLevel.roundNumber}`}
          currentBlinds={currentLevel.isBreak ? 'BREAK' : `${currentLevel.smallBlind} / ${currentLevel.bigBlind}`}
          currentAnte={currentLevel.ante || 0}
          nextBlinds={
            nextLevel ? (nextLevel.isBreak ? 'BREAK' : `${nextLevel.smallBlind} / ${nextLevel.bigBlind}`) : 'END'
          }
          nextAnte={nextLevel?.ante || 0}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onNextRound={handleNextRound}
          onPrevRound={handlePrevRound}
        />

        <TimerPlayersCard totalPlayers={tournament.expectedPlayers} />
      </div>

      <TimerStatsFooter
        entrants={tournament.expectedPlayers}
        chipsInPlay={tournament.expectedPlayers * tournament.startingStack}
        avgStack={tournament.startingStack}
      />
    </div>
  );
}
