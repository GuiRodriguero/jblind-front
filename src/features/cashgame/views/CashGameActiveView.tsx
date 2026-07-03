import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CashGameTimerBoard } from '../components/CashGameTimerBoard';
import { CashGameLedgerCard } from '../components/CashGameLedgerCard';
import { CashGameActivityLogs } from '../components/CashGameActivityLogs';
import { type CashGameActivePlayer, type CashGameLog, CashGameLogType } from '../types/cashgame.types';

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
  const [searchParams] = useSearchParams();
  const cashGameId = searchParams.get('cashgameid');

  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [players, setPlayers] = useState<CashGameActivePlayer[]>([]);
  const [logs, setLogs] = useState<CashGameLog[]>([]);
  const [cashGame, setCashGame] = useState<CashGameDetails | null>(null);

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
                type: CashGameLogType.JOIN,
                message: t('cashgame.active.logs.join', { name: p.name, amount: p.totalInvested.toFixed(2) }),
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

  const handleAddPlayer = (name: string, buyIn: number) => {
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
    if (buyIn > 0) {
      addLog(CashGameLogType.JOIN, t('cashgame.active.logs.join', { name, amount: buyIn.toFixed(2) }));
    }
  };

  const handleRebuy = (playerId: number | string, amount: number) => {
    let playerName = '';
    let isFirstBuyIn = false;
    setPlayers(prev => prev.map(p => {
      if (p.id == playerId) {
        playerName = p.name;
        isFirstBuyIn = p.totalInvested === 0;
        return { 
          ...p, 
          totalInvested: p.totalInvested + amount,
          currentStack: amount
        };
      }
      return p;
    }));
    if (playerName) {
      if (isFirstBuyIn) {
        addLog(CashGameLogType.JOIN, t('cashgame.active.logs.join', { name: playerName, amount: amount.toFixed(2) }));
      } else {
        addLog(CashGameLogType.REBUY, t('cashgame.active.logs.rebuy', { name: playerName, amount: amount.toFixed(2) }));
      }
    }
  };

  const handleAddOn = (playerId: number | string, amount: number) => {
    let playerName = '';
    setPlayers(prev => prev.map(p => {
      if (p.id == playerId) {
        playerName = p.name;
        return { 
          ...p, 
          totalInvested: p.totalInvested + amount,
          currentStack: p.currentStack + amount
        };
      }
      return p;
    }));
    if (playerName) {
      addLog(CashGameLogType.ADDON, t('cashgame.active.logs.addon', { name: playerName, amount: amount.toFixed(2) }));
    }
  };

  const handleCashOut = (playerId: number | string, finalAmount: number) => {
    let playerName = '';
    let totalInvested = 0;
    
    setPlayers(prev => prev.map(p => {
      if (p.id == playerId) {
        playerName = p.name;
        totalInvested = p.totalInvested;
        const profit = finalAmount - p.totalInvested;
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

    if (playerName) {
      const profit = finalAmount - totalInvested;
      const resultText = profit >= 0 
        ? t('cashgame.active.logs.profit', { amount: profit.toFixed(2) }) 
        : t('cashgame.active.logs.loss', { amount: Math.abs(profit).toFixed(2) });
      addLog(CashGameLogType.CASHOUT, t('cashgame.active.logs.cashout', { name: playerName, amount: finalAmount.toFixed(2), result: resultText }));
    }
  };

  const handleUpdateStack = (playerId: number | string, newStack: number) => {
    setPlayers(prev => prev.map(p => {
      if (p.id == playerId) {
        return { ...p, currentStack: newStack };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-full flex flex-col p-6 gap-6">
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
    </div>
  );
}