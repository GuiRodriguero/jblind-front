import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CashGameTimerBoard } from '../components/CashGameTimerBoard';
import { CashGameLedgerCard } from '../components/CashGameLedgerCard';
import { CashGameActivityLogs } from '../components/CashGameActivityLogs';
import { type CashGameActivePlayer, type CashGameLog, CashGameLogType } from '../types/cashgame.types';
import { CashGameSummaryModal } from '../components/CashGameSummaryModal.tsx';

interface CashGameDetails {
  id: number | string;
  name: string;
  smallBlind: number;
  bigBlind: number;
  minBuyIn: number;
  maxBuyIn: number;
  players?: Array<{
    id: number | string;
    name: string;
    buyIn: number;
  }>;
}

export function CashGameActiveView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cashGameId = searchParams.get('cashgameid');

  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [players, setPlayers] = useState<CashGameActivePlayer[]>([]);
  const [logs, setLogs] = useState<CashGameLog[]>([]);
  const [cashGame, setCashGame] = useState<CashGameDetails | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (!cashGameId) return;

    async function fetchCashGameDetails() {
      try {
        const response = await fetch(`http://localhost:8080/v1/cashgames/${cashGameId}`);
        if (response.ok) {
          const data: CashGameDetails = await response.json();
          setCashGame(data);
          
          if (data.players && data.players.length > 0) {
            const initialPlayers: CashGameActivePlayer[] = data.players.map(p => ({
              id: p.id,
              name: p.name,
              totalInvested: Number(p.buyIn) || 0,
              currentStack: Number(p.buyIn) || 0,
              cashedOutValue: null,
              isActive: true,
              profit: 0,
            }));
            setPlayers(initialPlayers);

            const initialLogs: CashGameLog[] = initialPlayers
              .filter(p => p.totalInvested > 0)
              .map(p => ({
                id: Math.random().toString(36).substring(2, 9),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: CashGameLogType.BUY_IN,
                message: t('cashgame.active.logs.buyIn', { name: p.name, amount: p.totalInvested.toFixed(2) }),
              }));
            setLogs(initialLogs);
          }
        }
      } catch (error) {
        console.error('Error fetching cash game details:', error);
      }
    }

    fetchCashGameDetails();
  }, [cashGameId]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const addLog = (type: CashGameLog['type'], message: string) => {
    const newLog: CashGameLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      message,
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const persistLog = async (type: CashGameLogType, amount: number, message: string) => {
    if (!cashGameId) return false;
    try {
      const response = await fetch(`http://localhost:8080/v1/cashgames/${cashGameId}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, amount, message }),
      });
      return response.ok;
    } catch (error) {
      console.error('Network error while saving log:', error);
      return false;
    }
  };

  const handleAddPlayer = async (name: string, buyIn: number) => {
    const message = t('cashgame.active.logs.buyIn', { name, amount: buyIn.toFixed(2) });

    if (buyIn > 0) {
      const saved = await persistLog(CashGameLogType.BUY_IN, buyIn, message);
      if (!saved) {
        alert(t('cashgame.active.errors.addPlayer'));
        return;
      }
    }

    const newPlayer: CashGameActivePlayer = {
      id: Date.now().toString(),
      name,
      totalInvested: buyIn,
      currentStack: buyIn,
      cashedOutValue: null,
      isActive: true,
      profit: 0,
    };

    setPlayers(prev => [...prev, newPlayer]);
    if (buyIn > 0) addLog(CashGameLogType.BUY_IN, message);
  };

  const handleRebuy = async (playerId: number | string, amount: number) => {
    const player = players.find(p => p.id == playerId);
    if (!player) return;

    const isFirstBuyIn = player.totalInvested === 0;
    const type = isFirstBuyIn ? CashGameLogType.BUY_IN : CashGameLogType.REBUY;
    const messageKey = isFirstBuyIn ? 'cashgame.active.logs.buyIn' : 'cashgame.active.logs.rebuy';
    const message = t(messageKey, { name: player.name, amount: amount.toFixed(2) });

    const saved = await persistLog(type, amount, message);
    if (!saved) {
      alert(t('cashgame.active.errors.rebuy'));
      return;
    }

    setPlayers(prev => prev.map(p => {
      if (p.id == playerId) {
        return {
          ...p,
          totalInvested: p.totalInvested + amount,
          currentStack: amount
        };
      }
      return p;
    }));
    addLog(type, message);
  };

  const handleAddOn = async (playerId: number | string, amount: number) => {
    const player = players.find(p => p.id == playerId);
    if (!player) return;

    const message = t('cashgame.active.logs.addon', { name: player.name, amount: amount.toFixed(2) });

    const saved = await persistLog(CashGameLogType.ADD_ON, amount, message);
    if (!saved) {
      alert(t('cashgame.active.errors.addon'));
      return;
    }

    setPlayers(prev => prev.map(p => {
      if (p.id == playerId) {
        return {
          ...p,
          totalInvested: p.totalInvested + amount,
          currentStack: p.currentStack + amount
        };
      }
      return p;
    }));
    addLog(CashGameLogType.ADD_ON, message);
  };

  const handleCashOut = async (playerId: number | string, finalAmount: number) => {
    const player = players.find(p => p.id == playerId);
    if (!player) return;

    const profit = finalAmount - player.totalInvested;
    const resultText = profit >= 0
      ? t('cashgame.active.logs.profit', { amount: profit.toFixed(2) })
      : t('cashgame.active.logs.loss', { amount: Math.abs(profit).toFixed(2) });

    const message = t('cashgame.active.logs.cashout', { name: player.name, amount: finalAmount.toFixed(2), result: resultText });

    const saved = await persistLog(CashGameLogType.CASHOUT, finalAmount, message);
    if (!saved) {
      alert(t('cashgame.active.errors.cashout'));
      return;
    }

    setPlayers(prev => prev.map(p => {
      if (p.id == playerId) {
        return {
          ...p,
          isActive: false,
          cashedOutValue: finalAmount,
          profit,
          currentStack: 0
        };
      }
      return p;
    }));
    addLog(CashGameLogType.CASHOUT, message);
  };

  const handleUpdateStack = (playerId: number | string, newStack: number) => {
    setPlayers(prev => prev.map(p => {
      if (p.id == playerId) {
        return { ...p, currentStack: newStack };
      }
      return p;
    }));
  };

  const handleEndSession = () => {
    const hasActivePlayers = players.some(p => p.isActive);
    if (hasActivePlayers) {
      alert(t('cashgame.active.errors.pendingCashOut'));
      return;
    }
    setShowSummary(true);
  };

  const handleFinishGame = () => {
    setShowSummary(false);
    navigate('/cashgames');
    // HTTP PATCH: FINISH CashGame
  };

  return (
    <div className="min-h-full flex flex-col p-6 gap-6">

      <div className="flex justify-between items-center shrink-0">
        <button
          onClick={handleEndSession}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
        >
          {t('cashgame.active.endSession')}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-6 xl:h-full min-h-0">
          <CashGameTimerBoard
            isPlaying={isPlaying}
            elapsedSeconds={elapsedSeconds}
            title={cashGame?.name || t('cashgame.active.ledger.title')}
            blinds={cashGame ? t('cashgame.active.timer.blindsFormat', { sb: cashGame.smallBlind, bb: cashGame.bigBlind }) : '...'}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
          />
          <CashGameLedgerCard
            players={players}
            minBuyIn={cashGame?.minBuyIn}
            maxBuyIn={cashGame?.maxBuyIn}
            onAddPlayer={handleAddPlayer}
            onRebuy={handleRebuy}
            onAddOn={handleAddOn}
            onCashOut={handleCashOut}
            onUpdateStack={handleUpdateStack}
          />
        </div>

        <CashGameActivityLogs logs={logs} />
      </div>

      <CashGameSummaryModal
        isOpen={showSummary}
        players={players}
        onFinish={handleFinishGame}
      />

    </div>
  );
}