import { Clock, Coffee, Trash2 } from 'lucide-react';
import type { TournamentLevel } from '../types/tournament.types';
import { useTranslation } from 'react-i18next';

interface BreakRowProps {
  level: TournamentLevel;
  onUpdate: (id: string, field: keyof TournamentLevel, value: number) => void;
  onRemove: (id: string) => void;
}

export function BreakRow({ level, onUpdate, onRemove }: BreakRowProps) {
  const { t } = useTranslation();

  return (
    <tr className="border-b border-white/5 transition-colors bg-amber-900/5">
      <td className="p-2 text-center">
        <div className="flex justify-center text-amber-500">
          <Coffee size={16} />
        </div>
      </td>

      <td className="p-2">
        <span className="text-xs font-bold text-amber-500/80 tracking-widest uppercase">
          {t('tournament.new.level.break')}
        </span>
      </td>

      <td className="p-2"></td>

      <td className="p-2 text-center">
        <div className="flex items-center justify-center gap-1 bg-white/5 rounded px-2 py-1">
          <Clock size={12} className="text-amber-600/50" />
          <input
            type="number"
            value={level.duration}
            onChange={(e) => onUpdate(level.id, 'duration', Number(e.target.value))}
            className="w-8 bg-transparent text-xs text-center font-bold outline-none text-amber-500"
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
