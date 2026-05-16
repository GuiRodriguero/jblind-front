import { useTranslation } from 'react-i18next';

export function TimerPrizePoolCard({ buyIn, totalPlayers }: { buyIn: number; totalPlayers: number }) {
  const { t } = useTranslation();
  const totalPool = buyIn * totalPlayers;

  const prizes = [
    { pos: '1st', val: `$${(totalPool * 0.5).toFixed(2)}` },
    { pos: '2nd', val: `$${(totalPool * 0.3).toFixed(2)}` },
    { pos: '3rd', val: `$${(totalPool * 0.2).toFixed(2)}` },
  ];

  return (
    <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col overflow-hidden min-h-0">
      <h2 className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 shrink-0">
        {t('timer.prizePool')}
      </h2>
      <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar space-y-3">
        {totalPool > 0 ? (
          prizes.map((prize) => (
            <div
              key={prize.pos}
              className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5"
            >
              <span className="font-bold text-blue-400">{prize.pos}</span>
              <span className="font-mono text-sm">{prize.val}</span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-xs mt-4">{t('timer.freeTournament')}</p>
        )}
      </div>
    </div>
  );
}
