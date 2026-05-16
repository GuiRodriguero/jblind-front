import { User, UserMinus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Player } from '../types/player.type';

interface TimerPlayersCardProps {
  readonly players: Player[];
  readonly onEliminate: (playerId: number) => void;
}

export function TimerPlayersCard({ players, onEliminate }: TimerPlayersCardProps) {
  const { t } = useTranslation();
  return (
    <div className="col-span-3 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col min-h-0 overflow-hidden">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('timer.playersTitle')}</h2>
        <span className="text-xs font-bold text-blue-400 bg-blue-900/30 px-2 py-1 rounded">
          {players.length} {t('timer.playersLeft')}
        </span>
      </div>

      <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors rounded-lg border border-transparent hover:border-white/10 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                <User size={14} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-200">{player.name}</p>
                <p className="text-[10px] text-gray-500 uppercase">
                  {t('timer.seat')} {player.seat}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-mono text-white">{player.chips.toLocaleString()}</p>
                <p className="text-[10px] text-green-400">{t('timer.chips')}</p>
              </div>
              <button
                onClick={() => onEliminate(player.id)}
                className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50"
                title="Eliminate Player"
              >
                <UserMinus size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
