import newRoundSound from '../../../assets/sounds/new-round-sound.mp3';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TimerBlindsTableCard } from '../components/TimerStructureCard';
import { TimerPrizePoolCard } from '../components/TimerPrizePoolCard';
import { TimerClockBoard } from '../components/TimerClockBoard';
import { TimerPlayersCard } from '../components/TimerPlayersCard';
import { TimerStatsFooter } from '../components/TimerStatsFooter';
import { useTranslation } from 'react-i18next';
import { CoffeeAnimated } from '../components/icon/CoffeeAnimatedIcon';
import { useWakeLock } from '../../../hooks/useWakeLock';
import { usePreventUnload } from '../../../hooks/usePreventUnload';
import { useTournamentSession } from '../hooks/useTournamentSession';

export function TimerView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get('tournamentId');

  const {
    tournament,
    activePlayers,
    isPlaying,
    timeLeft,
    currentLevelIndex,
    setIsPlaying,
    handleNextRound,
    handlePrevRound,
    handleRebuy,
    handleAddOn,
    handleEliminatePlayer,
    setOnRoundEnd,
    isLoading,
  } = useTournamentSession(tournamentId);

  useWakeLock(isPlaying);
  usePreventUnload(isPlaying || activePlayers.length > 0);

  useEffect(() => {
    setOnRoundEnd(() => {
      new Audio(newRoundSound).play().catch((e) => console.error('Audio play failed', e));
    });
  }, [setOnRoundEnd]);

  useEffect(() => {
    if (activePlayers.length === 1 && tournament) {
      setIsPlaying(false);
      const winnerName = activePlayers[0].name;
      setTimeout(() => {
        alert(t('timer.finished', { name: winnerName }));
        navigate('/tournaments');
      }, 300);
    }
  }, [activePlayers.length, tournament, setIsPlaying, t, navigate]);

  if (isLoading) return <div className="p-8 text-white">{t('timer.loading')}</div>;
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
          <TimerPrizePoolCard
            buyIn={tournament.buyIn}
            totalPlayers={tournament.expectedPlayers}
            payouts={tournament.prize?.payouts ?? []}
          />
        </div>

        <TimerClockBoard
          isPlaying={isPlaying}
          timeLeft={timeLeft}
          roundName={currentLevel.isBreak ? `${t('timer.break')}` : `ROUND ${currentLevel.round}`}
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

        <TimerPlayersCard
          players={activePlayers}
          onEliminate={handleEliminatePlayer}
          allowRebuys={tournament.allowRebuys}
          allowAddOn={tournament.allowAddOn}
          onRebuy={handleRebuy}
          onAddOn={handleAddOn}
        />
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
