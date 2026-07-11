import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CashGameTimerBoard } from '../components/CashGameTimerBoard';
import { CashGameLedgerCard } from '../components/CashGameLedgerCard';
import { CashGameActivityLogs } from '../components/CashGameActivityLogs';
import { CashGameSummaryModal } from '../components/CashGameSummaryModal.tsx';
import { useWakeLock } from '../../../hooks/useWakeLock';
import { usePreventUnload } from '../../../hooks/usePreventUnload';
import { useTimer } from '../hooks/useTimer.ts';
import { useCashGameSession } from '../hooks/useCashGameSession.ts';

export function CashGameActiveView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cashGameId = searchParams.get('cashgameid');

  const [isPlaying, setIsPlaying] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const { elapsedSeconds } = useTimer(isPlaying);
  useWakeLock(isPlaying);

  const {
    cashGame, players, logs,
    handleAddPlayer, handleRebuy, handleAddOn, handleCashOut, handleUpdateStack
  } = useCashGameSession(cashGameId);

  usePreventUnload(isPlaying || players.length > 0);

  const handleEndSession = () => {
    if (players.some(p => p.isActive)) {
      alert(t('cashgame.active.errors.pendingCashOut'));
      return;
    }
    setShowSummary(true);
  };

  const handleFinishGame = () => {
    setShowSummary(false);
    navigate('/cashgames');
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
            blinds={cashGame ? t('cashgame.active.timer.blindsFormat', {
              sb: cashGame.smallBlind,
              bb: cashGame.bigBlind
            }) : '...'}
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