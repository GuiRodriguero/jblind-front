import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cashGameApi } from '../services/cashGameApi';
import { type CashGameActivePlayer, type CashGameLog, CashGameLogType } from '../types/cashgame.types';

interface CashGameDetails {
  id: string;
  name: string;
  smallBlind: number;
  bigBlind: number;
  minBuyIn: number;
  maxBuyIn: number;
  players?: Array<{
    id: string;
    name: string;
    totalInvested: number;
    currentStack: number;
  }>;
  logs?: Array<{
    id: number | string;
    playerId: string | null;
    type: CashGameLogType;
    amount: number;
    message: string;
    timestamp: string;
  }>;
}

export function useCashGameSession(cashGameId: string | null) {
  const { t } = useTranslation();
  const [players, setPlayers] = useState<CashGameActivePlayer[]>([]);
  const [logs, setLogs] = useState<CashGameLog[]>([]);
  const [cashGame, setCashGame] = useState<CashGameDetails | null>(null);
  const [isLoading, setIsLoading] = useState(() => !!cashGameId);

  const loadSessionData = useCallback(async () => {
    if (!cashGameId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data: CashGameDetails = await cashGameApi.getDetails(cashGameId);
      setCashGame(data);

      if (data.players) {
        const initialPlayers: CashGameActivePlayer[] = data.players.map(p => ({
          id: p.id,
          name: p.name,
          totalInvested: Number(p.totalInvested) || 0,
          currentStack: Number(p.currentStack) || 0,
          cashedOutValue: null,
          isActive: Number(p.currentStack) > 0 || Number(p.totalInvested) === 0,
          profit: (Number(p.currentStack) || 0) - (Number(p.totalInvested) || 0),
        }));
        setPlayers(initialPlayers);
      }

      if (data.logs) {
        setLogs(data.logs.map(log => ({
          id: String(log.id),
          type: log.type,
          message: log.message,
          timestamp: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })));
      }
    } catch (error) {
      console.error('Error fetching cash game details:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cashGameId]);

  useEffect(() => {
    loadSessionData();
  }, [loadSessionData]);

  const addLocalLog = (type: CashGameLogType, message: string) => {
    const newLog: CashGameLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      message,
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleAction = async (
    playerId: string | number,
    type: CashGameLogType,
    amount: number,
    message: string,
    playerUpdate: Partial<CashGameActivePlayer> | ((p: CashGameActivePlayer) => Partial<CashGameActivePlayer>),
    errorKey: string
  ) => {
    if (!cashGameId) return;
    try {
      await cashGameApi.persistLog(cashGameId, playerId, type, amount, message);
      setPlayers(prev => prev.map(p => {
        if (p.id == playerId) {
          const updates = typeof playerUpdate === 'function' ? playerUpdate(p) : playerUpdate;
          return { ...p, ...updates };
        }
        return p;
      }));
      addLocalLog(type, message);
    } catch (error) {
      console.error(`Error in action ${type}:`, error);
      alert(errorKey);
    }
  };

  const handleAddPlayer = async (name: string, buyIn: number) => {
    if (!cashGameId) return;
    try {
      const savedPlayer = await cashGameApi.addPlayer(cashGameId, name);
      const playerId = savedPlayer.id;
      const message = t('cashgame.active.logs.buyIn', { name, amount: buyIn.toFixed(2) });

      if (buyIn > 0) {
        await cashGameApi.persistLog(cashGameId, playerId, CashGameLogType.BUY_IN, buyIn, message);
      }

      const newPlayer: CashGameActivePlayer = {
        id: playerId,
        name,
        totalInvested: buyIn,
        currentStack: buyIn,
        cashedOutValue: null,
        isActive: true,
        profit: 0,
      };

      setPlayers(prev => [...prev, newPlayer]);
      if (buyIn > 0) addLocalLog(CashGameLogType.BUY_IN, message);
    } catch (error) {
      alert(t('cashgame.active.errors.addPlayer'));
    }
  };

  const handleRebuy = async (playerId: number | string, amount: number) => {
    const player = players.find(p => p.id == playerId);
    if (!player) return;

    const isFirstBuyIn = player.totalInvested === 0;
    const type = isFirstBuyIn ? CashGameLogType.BUY_IN : CashGameLogType.REBUY;
    const messageKey = isFirstBuyIn ? 'cashgame.active.logs.buyIn' : 'cashgame.active.logs.rebuy';
    const message = t(messageKey, { name: player.name, amount: amount.toFixed(2) });

    await handleAction(
      playerId,
      type,
      amount,
      message,
      p => ({
        totalInvested: p.totalInvested + amount,
        currentStack: amount,
      }),
      t('cashgame.active.errors.rebuy')
    );
  };

  const handleAddOn = async (playerId: number | string, amount: number) => {
    const player = players.find(p => p.id == playerId);
    if (!player) return;

    const message = t('cashgame.active.logs.addon', { name: player.name, amount: amount.toFixed(2) });

    await handleAction(
      playerId,
      CashGameLogType.ADD_ON,
      amount,
      message,
      p => ({
        totalInvested: p.totalInvested + amount,
        currentStack: p.currentStack + amount,
      }),
      t('cashgame.active.errors.addon')
    );
  };

  const handleCashOut = async (playerId: number | string, finalAmount: number) => {
    const player = players.find(p => p.id == playerId);
    if (!player) return;

    const profit = finalAmount - player.totalInvested;
    const resultText = profit >= 0
      ? t('cashgame.active.logs.profit', { amount: profit.toFixed(2) })
      : t('cashgame.active.logs.loss', { amount: Math.abs(profit).toFixed(2) });

    const message = t('cashgame.active.logs.cashout', { name: player.name, amount: finalAmount.toFixed(2), result: resultText });

    await handleAction(
      playerId,
      CashGameLogType.CASHOUT,
      finalAmount,
      message,
      p => ({
        isActive: false,
        cashedOutValue: finalAmount,
        profit: finalAmount - p.totalInvested,
        currentStack: 0,
      }),
      t('cashgame.active.errors.cashout')
    );
  };

  const handleUpdateStack = (playerId: number | string, newStack: number) => {
    setPlayers(prev => prev.map(p => {
      if (p.id == playerId) {
        return { ...p, currentStack: newStack };
      }
      return p;
    }));
  };

  return {
    cashGame,
    players,
    logs,
    isLoading,
    handleAddPlayer,
    handleRebuy,
    handleAddOn,
    handleCashOut,
    handleUpdateStack,
    refreshSession: loadSessionData,
  };
}