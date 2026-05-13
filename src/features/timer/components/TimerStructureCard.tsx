export function TimerBlindsTableCard() {
  return (
    <div className="flex-2 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col overflow-hidden min-h-0">
      <h2 className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 shrink-0">Structure</h2>
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((round) => (
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
    </div>
  );
}
