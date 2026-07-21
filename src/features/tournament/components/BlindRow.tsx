import { Clock, Trash2 } from 'lucide-react';
import type { TournamentLevel } from '../types/tournament.types';

interface BlindRowProps {
  level: TournamentLevel;
  onUpdate: (id: string, field: keyof TournamentLevel, value: number) => void;
  onRemove: (id: string) => void;
}

export default function BlindRow({ level, onUpdate, onRemove }: BlindRowProps) {
  return (
    <tr className="border-b border-white/5 transition-colors hover:bg-white/2">
      <td className="p-2 text-center">
        <span className="text-sm font-mono text-gray-400">{level.round}</span>
      </td>

      <td className="p-2">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={level.smallBlind}
            onChange={(e) => onUpdate(level.id, 'smallBlind', Number(e.target.value))}
            className="w-20 bg-transparent border border-white/10 rounded px-2 py-1 text-sm text-gray-300 focus:border-blue-500 outline-none"
          />
          <span className="text-gray-600">/</span>
          <input
            type="number"
            value={level.bigBlind}
            onChange={(e) => onUpdate(level.id, 'bigBlind', Number(e.target.value))}
            className="w-20 bg-transparent border border-white/10 rounded px-2 py-1 text-sm text-white font-bold focus:border-blue-500 outline-none"
          />
        </div>
      </td>

      <td className="p-2">
        <input
          type="number"
          value={level.ante}
          onChange={(e) => onUpdate(level.id, 'ante', Number(e.target.value))}
          className="w-full bg-transparent border border-white/10 rounded px-2 py-1 text-sm text-gray-400 focus:border-blue-500 outline-none"
        />
      </td>

      <td className="p-2 text-center">
        <div className="flex items-center justify-center gap-1 bg-white/5 rounded px-2 py-1">
          <Clock size={12} className="text-gray-500" />
          <input
            type="number"
            value={level.durationInMinutes}
            onChange={(e) => onUpdate(level.id, 'durationInMinutes', Number(e.target.value))}
            className="w-8 bg-transparent text-xs text-center font-bold outline-none"
          />
          <span className="text-[10px] text-gray-600">m</span>
        </div>
      </td>

      <td className="p-2 text-right">
        <button onClick={() => onRemove(level.id)} className="p-1.5 text-gray-600 hover:text-red-500 transition-colors">
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
}
