import newRoundSound from '../../../assets/sounds/new-round-sound.mp3';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TimerBlindsTableCard } from '../components/TimerStructureCard';
import { TimerPrizePoolCard } from '../components/TimerPrizePoolCard';
import { TimerClockBoard } from '../components/TimerClockBoard';
import { TimerPlayersCard } from '../components/TimerPlayersCard';
import { TimerStatsFooter } from '../components/TimerStatsFooter';
import { useTranslation } from 'react-i18next';
import type { Player } from '../types/player.type';
import { CoffeeAnimated } from '../components/icon/CoffeeAnimatedIcon';

export function TimerView() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get('tournamentId');

  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState<any>(null);
  const [activePlayers, setActivePlayers] = useState<Player[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

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

  const handleEliminatePlayer = (playerId: number) => {
    setActivePlayers((prev) => {
      const remainingPlayers = prev.filter((p) => p.id !== playerId);

      if (remainingPlayers.length === 1) {
        setIsPlaying(false);
        localStorage.removeItem(`jblind_state_${tournamentId}`);
        setTimeout(() => {
          alert(`🎉 Torneio Finalizado! ${remainingPlayers[0].name} é o Campeão!`);
        }, 300);
        navigate('/tournaments');
      }

      return remainingPlayers;
    });
  };

  useEffect(() => {
    async function loadTournament() {
      if (!tournamentId) return;
      try {
        const response = await fetch(`http://localhost:8080/v1/tournaments/${tournamentId}`);
        if (response.ok) {
          const data = await response.json();
          setTournament(data);

          const savedState = localStorage.getItem(`jblind_state_${tournamentId}`);

          if (savedState) {
            const parsed = JSON.parse(savedState);
            setTimeLeft(parsed.timeLeft);
            setCurrentLevelIndex(parsed.currentLevelIndex);
            setActivePlayers(parsed.activePlayers);
          } else {
            const playersCount = Number(data.expectedPlayers) || 0;
            const stackCount = Number(data.startingStack) || 0;
            if (playersCount > 0) {
              const initialPlayers = Array.from({ length: playersCount }).map((_, i) => ({
                id: i + 1,
                name: `Player ${i + 1}`,
                seat: i + 1,
                chips: stackCount,
              }));
              setActivePlayers(initialPlayers);
            }
          }

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
      new Audio(newRoundSound).play();
      handleNextRound();
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (loading || !tournament) return;

    const stateToSave = {
      timeLeft,
      currentLevelIndex,
      activePlayers,
    };

    localStorage.setItem(`jblind_state_${tournamentId}`, JSON.stringify(stateToSave));
  }, [timeLeft, currentLevelIndex, activePlayers, tournamentId, loading, tournament]);

  if (loading) return <div className="p-8 text-white">{t('timer.loading')}</div>;
  if (!tournament) return <div className="p-8 text-white">{t('timer.notFound')}</div>;

  const currentLevel = tournament.levels[currentLevelIndex];
  const nextLevel = tournament.levels[currentLevelIndex + 1];
  let nextBreakMessage: string | null = null;

  const totalChipsInPlay = tournament.expectedPlayers * tournament.startingStack;
  const currentAvgStack = activePlayers.length > 0 ? totalChipsInPlay / activePlayers.length : 0;

  if (tournament && !currentLevel.isBreak) {
    let timeToBreakSeconds = timeLeft;
    let foundBreak = false;

    for (let i = currentLevelIndex + 1; i < tournament.levels.length; i++) {
      if (tournament.levels[i].isBreak) {
        foundBreak = true;
        break;
      }
      timeToBreakSeconds += tournament.levels[i].durationInMinutes * 60;
    }

    if (foundBreak) {
      const minutesToBreak = Math.ceil(timeToBreakSeconds / 60);
      nextBreakMessage = `${t('timer.nextBreakIn')} ${minutesToBreak} min`;
    }
  }

  const currentBlindsInfo = () => {
    if (currentLevel.isBreak) {
      return (
        <div className="flex items-center gap-4 xl:mb-6">
          <span className="uppercase">{t('timer.break')}</span>
          <CoffeeAnimated />
        </div>
      );
    }

    return <span>{`${currentLevel.smallBlind} / ${currentLevel.bigBlind}`}</span>;
  };

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
          roundName={currentLevel.isBreak ? `${t('timer.break')}` : `ROUND ${currentLevel.roundNumber}`}
          isBreak={currentLevel.isBreak}
          shouldColorUp={currentLevel.shouldColorUp}
          currentBlinds={currentBlindsInfo()}
          currentBigBlind={currentLevel.bigBlind}
          currentAnte={currentLevel.ante || 0}
          nextBlinds={
            nextLevel ? (nextLevel.isBreak ? 'BREAK' : `${nextLevel.smallBlind} / ${nextLevel.bigBlind}`) : 'END'
          }
          nextAnte={nextLevel?.ante || 0}
          nextBreakMessage={nextBreakMessage}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onNextRound={handleNextRound}
          onPrevRound={handlePrevRound}
        />

        <TimerPlayersCard players={activePlayers} onEliminate={handleEliminatePlayer} />
      </div>
      <TimerStatsFooter
        entrants={tournament.expectedPlayers}
        remaining={activePlayers.length}
        chipsInPlay={totalChipsInPlay}
        avgStack={currentAvgStack}
      />
    </div>
  );
}
