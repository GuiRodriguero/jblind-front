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
import { tournamentApi } from '../../tournament/services/tournamentApi';
import { TournamentLogType } from '../../tournament/types/tournament.types';
import { useWakeLock } from '../../../hooks/useWakeLock';
import { usePreventUnload } from '../../../hooks/usePreventUnload';

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

  useWakeLock(isPlaying);
  usePreventUnload(isPlaying || activePlayers.length > 0);

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

  const handleRebuy = async (playerId: string) => {
    if (!tournamentId) return;
    const player = activePlayers.find((p) => p.id === playerId);
    if (!player) return;
    try {
      await tournamentApi.persistLog(
        tournamentId,
        player.id,
        TournamentLogType.REBUY,
        Number(tournament.buyIn) || 0,
        t('timer.logs.rebuy', { name: player.name })
      );
      setActivePlayers((prev) =>
        prev.map((p) => (p.id === playerId ? { ...p, rebuys: p.rebuys + 1 } : p))
      );
    } catch (error) {
      console.error('Error registering rebuy:', error);
      alert(t('timer.errors.rebuy'));
    }
  };

  const handleAddOn = async (playerId: string) => {
    if (!tournamentId) return;
    const player = activePlayers.find((p) => p.id === playerId);
    if (!player) return;
    try {
      await tournamentApi.persistLog(
        tournamentId,
        player.id,
        TournamentLogType.ADD_ON,
        Number(tournament.buyIn) || 0,
        t('timer.logs.addon', { name: player.name })
      );
      const stackCount = Number(tournament.startingStack) || 0;
      setActivePlayers((prev) =>
        prev.map((p) =>
          p.id === playerId ? { ...p, addons: p.addons + 1, chips: p.chips + stackCount } : p
        )
      );
    } catch (error) {
      console.error('Error registering add-on:', error);
      alert(t('timer.errors.addon'));
    }
  };

  const handleEliminatePlayer = (playerId: string) => {
    setActivePlayers((prev) => {
      const remainingPlayers = prev.filter((p) => p.id !== playerId);

      if (remainingPlayers.length === 1) {
        setIsPlaying(false);
        setTimeout(() => {
          alert(t('timer.finished', { name: remainingPlayers[0].name }));
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

          const stackCount = Number(data.startingStack) || 0;
          const backendPlayers = Array.isArray(data.players) ? data.players : [];

          if (backendPlayers.length > 0) {
            const initialPlayers: Player[] = backendPlayers.map(
              (p: { id: string; name: string }, i: number) => ({
                id: p.id,
                name: p.name,
                seat: i + 1,
                chips: stackCount,
                rebuys: 0,
                addons: 0,
              })
            );
            setActivePlayers(initialPlayers);
          } else {
            const playersCount = Number(data.expectedPlayers) || 0;
            const initialPlayers: Player[] = Array.from({ length: playersCount }).map((_, i) => ({
              id: String(i + 1),
              name: `${t('timer.player')} ${i + 1}`,
              seat: i + 1,
              chips: stackCount,
              rebuys: 0,
              addons: 0,
            }));
            setActivePlayers(initialPlayers);
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
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (!(isPlaying && timeLeft === 0)) return;

    new Audio(newRoundSound).play();
    const timeoutId = setTimeout(() => {
      handleNextRound();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [isPlaying, timeLeft, currentLevelIndex, tournament]);

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
          <TimerPrizePoolCard
            buyIn={tournament.buyIn}
            totalPlayers={tournament.expectedPlayers}
            payouts={tournament.prize?.payouts ?? []}
          />
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
