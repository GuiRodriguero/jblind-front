import { Plus, Coffee } from 'lucide-react';
import type { TournamentLevel } from '../types/tournament.types';
import { useTranslation } from 'react-i18next';
import LevelsTable from './LevelsTable';
import { useState } from 'react';

interface LevelStructureManagerProps {
  readonly levels: TournamentLevel[];
  readonly onLevelsChange: (levels: TournamentLevel[]) => void;
}

export function LevelStructureManager({ levels, onLevelsChange }: LevelStructureManagerProps) {
  const { t } = useTranslation();
  const [currentRound, setCurrentRound] = useState(1);

  const addLevel = () => {
    setCurrentRound(currentRound + 1);

    const lastLevel = levels[levels.length - 1];
    const nextBigBlind = lastLevel ? lastLevel.bigBlind + 100 : 200;

    const newLevel: TournamentLevel = {
      id: crypto.randomUUID(),
      round: currentRound,
      smallBlind: nextBigBlind / 2,
      bigBlind: nextBigBlind,
      ante: 0,
      duration: lastLevel?.duration || 15,
      isBreak: false,
    };

    onLevelsChange([...levels, newLevel]);
  };

  const addBreak = () => {
    const newLevel: TournamentLevel = {
      id: crypto.randomUUID(),
      round: currentRound,
      smallBlind: 0,
      bigBlind: 0,
      ante: 0,
      duration: 10,
      isBreak: true,
    };
    onLevelsChange([...levels, newLevel]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          {t('tournament.new.blindStructure.title')}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={addBreak}
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-600/20 text-amber-500 rounded-md text-xs font-bold hover:bg-amber-600/30 transition-all"
          >
            <Coffee size={14} /> {t('tournament.new.level.addBreak')}
          </button>
          <button
            onClick={addLevel}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
          >
            <Plus size={14} /> {t('tournament.new.level.addLevel')}
          </button>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
        <LevelsTable levels={levels} onLevelsChange={onLevelsChange} />

        {levels.length === 0 && (
          <div className="p-10 text-center text-gray-600 text-sm italic">{t('tournament.new.level.empty')}</div>
        )}
      </div>
    </div>
  );
}
