import { Users, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TournamentPlayer } from '../types/tournament.types';

interface TournamentPlayersProps {
  readonly players: TournamentPlayer[];
  readonly onPlayersChange: (players: TournamentPlayer[]) => void;
}

export function TournamentPlayersStep({ players, onPlayersChange }: TournamentPlayersProps) {
  const { t } = useTranslation();

  const addPlayer = () => {
    onPlayersChange([...players, { id: crypto.randomUUID(), name: '' }]);
  };

  const updatePlayer = (id: string, name: string) => {
    onPlayersChange(players.map((player) => (player.id === id ? { ...player, name } : player)));
  };

  const removePlayer = (id: string) => {
    onPlayersChange(players.filter((player) => player.id !== id));
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-2 text-blue-400 mb-6 border-b border-white/10 pb-4">
        <Users size={18} />
        <h2 className="font-bold uppercase tracking-widest text-xs">{t('tournament.new.players.title')}</h2>
      </div>

      <div className="flex flex-col gap-3">
        {players.map((player, index) => (
          <div key={player.id} className="flex items-center gap-3">
            <span className="w-7 text-center text-sm font-bold text-gray-500">{index + 1}</span>
            <input
              type="text"
              value={player.name}
              onChange={(e) => updatePlayer(player.id, e.target.value)}
              placeholder={t('tournament.new.players.placeholder')}
              className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
            />
            <button
              onClick={() => removePlayer(player.id)}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              aria-label={t('tournament.new.players.remove')}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {players.length === 0 && (
          <div className="p-10 text-center text-gray-600 text-sm italic">{t('tournament.new.players.empty')}</div>
        )}
      </div>

      <button
        onClick={addPlayer}
        className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
      >
        <Plus size={14} /> {t('tournament.new.players.addPlayer')}
      </button>
    </div>
  );
}
