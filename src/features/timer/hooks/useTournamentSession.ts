import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { tournamentApi } from '../../tournament/services/tournamentApi';
import { TournamentLogType, type TournamentLog, type TournamentLevel } from '../../tournament/types/tournament.types';
import type { Player } from '../types/player.type';

interface TournamentDetails {
  id: string;
  name: string;
  buyIn: number;
  startingStack: number;
  expectedPlayers: number;
  allowRebuys: boolean;
  allowAddOn: boolean;
  status: string;
  levels: TournamentLevel[];
  players?: Array<{ id: string; name: string }>;
  logs?: TournamentLog[];
  prize?: {
    payouts: Array<{ position: number; value: number; percentage: number }>;
  };
}

export function useTournamentSession(tournamentId: string | null) {
  const { t } = useTranslation();
  const [tournament, setTournament] = useState<TournamentDetails | null>(null);
  const [activePlayers, setActivePlayers] = useState<Player[]>([]);
  const [logs, setLogs] = useState<TournamentLog[]>([]);
  const [isLoading, setIsLoading] = useState(() => !!tournamentId);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  
  const onRoundEndRef = useRef<(() => void) | null>(null);

  const reconstructSession = useCallback((details: TournamentDetails, sessionLogs: TournamentLog[]) => {
    const stackCount = Number(details.startingStack) || 0;
    const buyInAmount = Number(details.buyIn) || 0;
    
    const playersMap: Record<string, Player & { isActive: boolean }> = {};
    
    if (details.players && details.players.length > 0) {
      details.players.forEach((p, i) => {
        playersMap[p.id] = {
          id: p.id,
          name: p.name,
          seat: i + 1,
          chips: stackCount,
          rebuys: 0,
          addons: 0,
          isActive: true,
        };
      });
    } else {
      // Fallback for expected players if no players are registered yet
      const count = Number(details.expectedPlayers) || 0;
      for (let i = 0; i < count; i++) {
        const id = String(i + 1);
        playersMap[id] = {
          id,
          name: `${t('timer.player')} ${i + 1}`,
          seat: i + 1,
          chips: stackCount,
          rebuys: 0,
          addons: 0,
          isActive: true,
        };
      }
    }

    const sortedLogs = [...sessionLogs].sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    sortedLogs.forEach(log => {
      if (!log.playerId || !playersMap[log.playerId]) return;
      const p = playersMap[log.playerId];
      
      switch (log.type) {
        case TournamentLogType.REBUY:
          p.rebuys += 1;
          p.chips += (log.amount || buyInAmount);
          p.isActive = true;
          break;
        case TournamentLogType.ADD_ON:
          p.addons += 1;
          p.chips += (log.amount || buyInAmount);
          break;
        case TournamentLogType.ELIMINATION:
        case TournamentLogType.LEFT:
          p.isActive = false;
          p.chips = 0;
          break;
        case TournamentLogType.BUY_IN:
          p.isActive = true;
          break;
      }
    });

    return Object.values(playersMap).filter(p => p.isActive);
  }, [t]);

  const loadSessionData = useCallback(async () => {
    if (!tournamentId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const details = await tournamentApi.getDetails(tournamentId);
      const sessionLogs = details.logs || [];
      
      setTournament(details);
      setLogs(sessionLogs);
      
      const reconstructedPlayers = reconstructSession(details, sessionLogs);
      setActivePlayers(reconstructedPlayers);
      
      if (details.levels && details.levels.length > 0) {
        setTimeLeft(details.levels[0].durationInMinutes * 60);
      }
    } catch (error) {
      console.error('Error fetching tournament session data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [tournamentId, reconstructSession]);

  useEffect(() => {
    loadSessionData();
  }, [loadSessionData]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const handleNextRound = useCallback(() => {
    if (tournament && currentLevelIndex < tournament.levels.length - 1) {
      const nextIndex = currentLevelIndex + 1;
      setCurrentLevelIndex(nextIndex);
      setTimeLeft(tournament.levels[nextIndex].durationInMinutes * 60);
    } else {
      setIsPlaying(false);
    }
  }, [tournament, currentLevelIndex]);

  const handlePrevRound = useCallback(() => {
    if (tournament && currentLevelIndex > 0) {
      const prevIndex = currentLevelIndex - 1;
      setCurrentLevelIndex(prevIndex);
      setTimeLeft(tournament.levels[prevIndex].durationInMinutes * 60);
    }
  }, [tournament, currentLevelIndex]);

  useEffect(() => {
    if (isPlaying && timeLeft === 0) {
      if (onRoundEndRef.current) {
        onRoundEndRef.current();
      }
      handleNextRound();
    }
  }, [isPlaying, timeLeft, handleNextRound]);

  const setOnRoundEnd = (callback: () => void) => {
    onRoundEndRef.current = callback;
  };

  const handleAction = async (
    playerId: string,
    type: TournamentLogType,
    amount: number,
    message: string,
    successCallback: () => void,
    errorKey: string,
    playersLeft: number = activePlayers.length
  ) => {
    if (!tournamentId) return;
    try {
      const savedLog = await tournamentApi.persistLog(tournamentId, playerId, type, amount, message, playersLeft);
      setLogs(prev => [...prev, savedLog]);
      successCallback();
    } catch (error) {
      console.error(`Error in tournament action ${type}:`, error);
      alert(errorKey);
    }
  };

  const handleRebuy = async (playerId: string) => {
    if (!tournament) return;
    const player = activePlayers.find(p => p.id === playerId);
    if (!player) return;
    
    const amount = Number(tournament.buyIn) || 0;
    const message = t('timer.logs.rebuy', { name: player.name });
    
    await handleAction(
      playerId,
      TournamentLogType.REBUY,
      amount,
      message,
      () => {
        setActivePlayers(prev => prev.map(p => 
          p.id === playerId ? { ...p, rebuys: p.rebuys + 1, chips: p.chips + amount } : p
        ));
      },
      t('timer.errors.rebuy')
    );
  };

  const handleAddOn = async (playerId: string) => {
    if (!tournament) return;
    const player = activePlayers.find(p => p.id === playerId);
    if (!player) return;
    
    const amount = Number(tournament.startingStack) || 0;
    const message = t('timer.logs.addon', { name: player.name });
    
    await handleAction(
      playerId,
      TournamentLogType.ADD_ON,
      amount,
      message,
      () => {
        setActivePlayers(prev => prev.map(p => 
          p.id === playerId ? { ...p, addons: p.addons + 1, chips: p.chips + amount } : p
        ));
      },
      t('timer.errors.addon')
    );
  };

  const handleEliminatePlayer = async (playerId: string) => {
    if (!tournament) return;
    const player = activePlayers.find(p => p.id === playerId);
    if (!player) return;

    const playerFinalPosition = activePlayers.length;
    const eliminationMessage = t('timer.logs.elimination', { name: 'FIXME', eliminatedPlayerName: player.name });
    const leftMessage = t('timer.logs.left', { name: player.name, position: playerFinalPosition });

    //TODO: Change TournamentLogType.ELIMINATION to use playerId that eliminated the other player (playerId)
    await handleAction(playerId, TournamentLogType.ELIMINATION, 0, eliminationMessage, () => {setActivePlayers(prev => prev.filter(p => p.id !== playerId))}, t('timer.errors.eliminate'), playerFinalPosition);
    await handleAction(playerId, TournamentLogType.LEFT, 0, leftMessage, () => {}, t('timer.errors.eliminate'));

  };

  const handleChampion = async (playerId: string) => {
    if (!tournament) return;
    const player = activePlayers.find(p => p.id === playerId);
    if (!player) return;

    await handleAction(playerId, TournamentLogType.LEFT, 0, t('timer.logs.champion', { name: player.name }), () => {}, t('timer.errors.eliminate'));
  }

  return {
    tournament,
    activePlayers,
    logs,
    isLoading,
    isPlaying,
    timeLeft,
    currentLevelIndex,
    setIsPlaying,
    handleNextRound,
    handlePrevRound,
    handleRebuy,
    handleAddOn,
    handleEliminatePlayer,
    handleChampion,
    setOnRoundEnd,
    refreshSession: loadSessionData
  };
}
