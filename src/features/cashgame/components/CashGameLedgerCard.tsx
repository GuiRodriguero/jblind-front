import { User, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CashGameActivePlayer } from '../types/cashgame.types';
import { AddPlayerModal } from './AddPlayerModal';
import { CashGameActionModal, type ActionType } from './CashGameActionModal';
import { CashGamePlayerRow } from './CashGamePlayerRow';

interface CashGameLedgerCardProps {
  players: CashGameActivePlayer[];
  minBuyIn?: number;
  maxBuyIn?: number;
  onAddPlayer: (name: string, buyIn: number) => void;
  onRebuy: (playerId: number | string, amount: number) => void;
  onAddOn: (playerId: number | string, amount: number) => void;
  onCashOut: (playerId: number | string, finalAmount: number) => void;
  onUpdateStack: (playerId: number | string, newStack: number) => void;
}

export function CashGameLedgerCard({ 
  players, 
  minBuyIn,
  maxBuyIn,
  onAddPlayer, 
  onRebuy, 
  onAddOn, 
  onCashOut, 
  onUpdateStack 
}: CashGameLedgerCardProps) {
  const { t } = useTranslation();
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [actionModalConfig, setActionModalConfig] = useState<{
    type: ActionType;
    playerId: number | string;
    playerName: string;
  } | null>(null);

  const activePlayers = players.filter(p => p.isActive);

  return (
    <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <User size={16} /> {t('cashgame.active.ledger.title')}
        </h2>
        <button 
          onClick={() => setIsAddPlayerModalOpen(true)} 
          className="bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
        >
          <UserPlus size={14} /> {t('cashgame.active.ledger.addPlayer')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
        {activePlayers.map(player => (
          <CashGamePlayerRow 
            key={player.id} 
            player={player} 
            onAction={(type) => setActionModalConfig({ 
              type, 
              playerId: player.id, 
              playerName: player.name 
            })} 
          />
        ))}

        {activePlayers.length === 0 && (
          <div className="h-40 flex items-center justify-center text-gray-600 text-sm italic">
            {t('cashgame.new.players.empty')}
          </div>
        )}
      </div>

      {isAddPlayerModalOpen && (
        <AddPlayerModal 
          minBuyIn={minBuyIn}
          maxBuyIn={maxBuyIn}
          onClose={() => setIsAddPlayerModalOpen(false)}
          onConfirm={onAddPlayer}
        />
      )}

      {actionModalConfig && (
        <CashGameActionModal
          type={actionModalConfig.type}
          playerName={actionModalConfig.playerName}
          minBuyIn={minBuyIn}
          maxBuyIn={maxBuyIn}
          onClose={() => setActionModalConfig(null)}
          onConfirm={(amount) => {
            if (actionModalConfig.type === 'rebuy' || actionModalConfig.type === 'buyIn') onRebuy(actionModalConfig.playerId, amount);
            else if (actionModalConfig.type === 'addon') onAddOn(actionModalConfig.playerId, amount);
            else if (actionModalConfig.type === 'cashout') onCashOut(actionModalConfig.playerId, amount);
            else if (actionModalConfig.type === 'stack') onUpdateStack(actionModalConfig.playerId, amount);
          }}
        />
      )}
    </div>
  );
}