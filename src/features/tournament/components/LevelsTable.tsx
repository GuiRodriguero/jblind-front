import type { TournamentLevel } from '../types/tournament.types';
import { useTranslation } from 'react-i18next';
import { BreakRow } from './BreakRow';
import BlindRow from './BlindRow';

interface LevelsTableProps {
  readonly levels: TournamentLevel[];
  readonly onLevelsChange: (levels: TournamentLevel[]) => void;
}

export default function LevelsTable({ levels, onLevelsChange }: LevelsTableProps) {
  const { t } = useTranslation();

  const removeLevel = (id: string) => {
    onLevelsChange(levels.filter((l) => l.id !== id));
  };

  const updateLevel = (id: string, field: keyof TournamentLevel, value: number) => {
    const updated = levels.map((l) => {
      if (l.id === id) {
        const newLevel = { ...l, [field]: value };
        if (field === 'bigBlind') {
          newLevel.smallBlind = value / 2;
        }
        return newLevel;
      }
      return l;
    });
    onLevelsChange(updated);
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="text-[10px] uppercase text-gray-500 border-b border-white/5 bg-white/2">
          <th className="p-3 font-bold text-center w-16">Round</th>
          <th className="p-3 font-bold">Small / Big Blind</th>
          <th className="p-3 font-bold w-24">Ante</th>
          <th className="p-3 font-bold w-24 text-center">{t('tournament.new.level.duration')}</th>
          <th className="p-3 w-12"></th>
        </tr>
      </thead>
      <tbody>
        {levels.map((level) =>
          level.isBreak ? (
            <BreakRow key={level.id} level={level} onUpdate={updateLevel} onRemove={removeLevel} />
          ) : (
            <BlindRow key={level.id} level={level} onUpdate={updateLevel} onRemove={removeLevel} />
          ),
        )}
      </tbody>
    </table>
  );
}
