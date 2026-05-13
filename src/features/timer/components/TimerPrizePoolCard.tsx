export function TimerPrizePoolCard() {
  const prizes = [
    { pos: '1st', val: '$1,000.00' },
    { pos: '2nd', val: '$600.00' },
    { pos: '3rd', val: '$400.00' },
    { pos: '4th', val: '$200.00' },
    { pos: '5th', val: '$100.00' },
  ];

  return (
    <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col overflow-hidden min-h-0">
      <h2 className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 shrink-0">
        Prize Pool
      </h2>
      <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar space-y-3">
        {prizes.map((prize) => (
          <div
            key={prize.pos}
            className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5"
          >
            <span className="font-bold text-blue-400">{prize.pos}</span>
            <span className="font-mono text-sm">{prize.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
