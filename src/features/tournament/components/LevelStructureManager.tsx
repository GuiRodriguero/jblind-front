import { Plus, Trash2, Coffee, Clock } from 'lucide-react';
import type { TournamentLevel } from '../types/tournament.types';
import { useTranslation } from 'react-i18next';

interface LevelStructureManagerProps {
  readonly levels: TournamentLevel[];
  readonly onLevelsChange: (levels: TournamentLevel[]) => void;
}

export function LevelStructureManager({ levels, onLevelsChange }: LevelStructureManagerProps) {
  const { t } = useTranslation();

  const addLevel = () => {
    const lastLevel = levels[levels.length - 1];
    const newRound = (lastLevel?.round || 0) + 1;
    const nextBigBlind = lastLevel ? lastLevel.bigBlind + 100 : 200;

    const newLevel: TournamentLevel = {
      id: crypto.randomUUID(),
      round: newRound,
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
      round: 0,
      smallBlind: 0,
      bigBlind: 0,
      ante: 0,
      duration: 10,
      isBreak: true,
    };
    onLevelsChange([...levels, newLevel]);
  };

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
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Levels & Intervals</h3>
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
            {levels.map((level) => (
              <tr
                key={level.id}
                className={`border-b border-white/5 transition-colors ${level.isBreak ? 'bg-amber-900/5' : 'hover:bg-white/2'}`}
              >
                <td className="p-2 text-center">
                  {level.isBreak ? (
                    <div className="flex justify-center text-amber-500">
                      <Coffee size={16} />
                    </div>
                  ) : (
                    <span className="text-sm font-mono text-gray-400">{level.round}</span>
                  )}
                </td>

                <td className="p-2">
                  {level.isBreak ? (
                    <span className="text-xs font-bold text-amber-500/80 tracking-widest uppercase">
                      {t('tournament.new.level.break')}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={level.smallBlind}
                        onChange={(e) => updateLevel(level.id, 'smallBlind', Number(e.target.value))}
                        className="w-20 bg-transparent border border-white/10 rounded px-2 py-1 text-sm text-gray-300 focus:border-blue-500 outline-none"
                      />
                      <span className="text-gray-600">/</span>
                      <input
                        type="number"
                        value={level.bigBlind}
                        onChange={(e) => updateLevel(level.id, 'bigBlind', Number(e.target.value))}
                        className="w-20 bg-transparent border border-white/10 rounded px-2 py-1 text-sm text-white font-bold focus:border-blue-500 outline-none"
                      />
                    </div>
                  )}
                </td>

                <td className="p-2">
                  {!level.isBreak && (
                    <input
                      type="number"
                      value={level.ante}
                      onChange={(e) => updateLevel(level.id, 'ante', Number(e.target.value))}
                      className="w-full bg-transparent border border-white/10 rounded px-2 py-1 text-sm text-gray-400 focus:border-blue-500 outline-none"
                    />
                  )}
                </td>

                <td className="p-2 text-center">
                  <div className="flex items-center justify-center gap-1 bg-white/5 rounded px-2 py-1">
                    <Clock size={12} className="text-gray-500" />
                    <input
                      type="number"
                      value={level.duration}
                      onChange={(e) => updateLevel(level.id, 'duration', Number(e.target.value))}
                      className="w-8 bg-transparent text-xs text-center font-bold outline-none"
                    />
                    <span className="text-[10px] text-gray-600">m</span>
                  </div>
                </td>

                <td className="p-2 text-right">
                  <button
                    onClick={() => removeLevel(level.id)}
                    className="p-1.5 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {levels.length === 0 && (
          <div className="p-10 text-center text-gray-600 text-sm italic">{t('tournament.new.level.empty')}</div>
        )}
      </div>
    </div>
  );
}
