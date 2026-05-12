export function TimerView() {
  return (
    <div className="h-full flex flex-col p-6 gap-6">
      <div className="grid grid-cols-12 gap-6 flex-1">
        <div className="col-span-3 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col">
          <h2 className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Structure</h2>
          <table className="w-full text-xs text-center text-gray-300">
            <thead>
              <tr className="text-gray-500 border-b border-white/5">
                <th className="pb-2">Round</th>
                <th className="pb-2">Blinds</th>
                <th className="pb-2">Ante</th>
              </tr>
            </thead>
            <tbody>
              {[8, 9, 10, 11, 12].map((round) => (
                <tr key={round} className={round === 10 ? 'bg-blue-600/20 text-blue-400 font-bold' : ''}>
                  <td className="py-3">{round}</td>
                  <td>
                    {round * 100}/{round * 200}
                  </td>
                  <td>{round * 100}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-6 flex flex-col items-center justify-center gap-8">
          <span className="text-gray-500 font-bold tracking-[0.3em]">ROUND 10</span>

          <div className="relative group">
            <h1 className="text-[12rem] font-black leading-none tracking-tighter">28:29</h1>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-blue-400 font-medium">Next break in 15 minutes</p>
            <div className="flex gap-12 mt-8">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Current Blinds</p>
                <p className="text-4xl font-bold">200 / 400</p>
                <p className="text-sm text-gray-400">Ante: 400</p>
              </div>
              <div className="text-center opacity-50">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Next Blinds</p>
                <p className="text-4xl font-bold">400 / 800</p>
                <p className="text-sm text-gray-400">Ante: 800</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 bg-white/5 rounded-2xl border border-white/10 p-4">
          <h2 className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Prize Pool</h2>
          <div className="space-y-4">
            {[
              { pos: '1st', val: '$1,000.00' },
              { pos: '2nd', val: '$600.00' },
              { pos: '3rd', val: '$400.00' },
            ].map((prize) => (
              <div
                key={prize.pos}
                className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5"
              >
                <span className="font-bold text-blue-400">{prize.pos}</span>
                <span className="font-mono text-lg">{prize.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 py-6 border-t border-white/10 mt-auto">
        <StatItem label="Entrants" value="1,000" />
        <StatItem label="Remaining" value="700" />
        <StatItem label="Chips in Play" value="200,000" />
        <StatItem label="Avg. Stack" value="286" />
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
