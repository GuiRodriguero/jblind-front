import { useTranslation } from 'react-i18next';

interface PrizePayout {
  readonly position: number;
  readonly value: number;
  readonly percentage?: number;
}

interface TimerPrizePoolCardProps {
  readonly buyIn: number;
  readonly totalPlayers: number;
  readonly payouts?: PrizePayout[];
}

const ordinal = (position: number) => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const remainder = position % 100;
  return `${position}${suffixes[(remainder - 20) % 10] ?? suffixes[remainder] ?? suffixes[0]}`;
};

export function TimerPrizePoolCard({ buyIn, totalPlayers, payouts = [] }: TimerPrizePoolCardProps) {
  const { t } = useTranslation();
  const totalPool = buyIn * totalPlayers;

  const sortedPayouts = [...payouts].sort((a, b) => a.position - b.position);

  const prizes = sortedPayouts.map((payout) => ({
    pos: ordinal(payout.position),
    val: `$${Number(payout.value || 0).toFixed(2)}`,
  }));

  return (
    <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col overflow-hidden min-h-0">
      <h2 className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 shrink-0">
        {t('timer.prizePool')}
      </h2>
      <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar space-y-3">
        {prizes.length > 0 ? (
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
          <p className="text-center text-gray-500 text-xs mt-4">
            {totalPool > 0 ? `$${totalPool.toFixed(2)}` : t('timer.freeTournament')}
          </p>
        )}
      </div>
    </div>
  );
}
