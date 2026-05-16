import { useTranslation } from 'react-i18next';

export function TimerBlindsTableCard({ levels, currentIndex }: { levels: any[]; currentIndex: number }) {
  const { t } = useTranslation();

  return (
    <div className="flex-2 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col overflow-hidden min-h-0">
      <h2 className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 shrink-0">
        {t('timer.structure')}
      </h2>
      <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
        <table className="w-full text-xs text-center text-gray-300 relative">
          <thead className="sticky top-0 bg-background z-10">
            <tr className="text-gray-500 border-b border-white/5">
              <th className="pb-2">Round</th>
              <th className="pb-2">Blinds</th>
              <th className="pb-2">Ante</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((level: any, index: number) => (
              <tr key={index} className={index === currentIndex ? 'bg-blue-600/20 text-blue-400 font-bold' : ''}>
                <td className="py-3">{level.isBreak ? 'BREAK' : level.roundNumber}</td>
                <td>{level.isBreak ? '-' : `${level.smallBlind}/${level.bigBlind}`}</td>
                <td>{level.isBreak ? '-' : level.ante}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
