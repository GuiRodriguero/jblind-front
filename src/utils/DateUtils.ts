export const formatDateTime = (isoString: string) => {
  if (!isoString) return { date: '-', time: '-' };
  const dateObj = new Date(isoString);

  const date = dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const time = dateObj.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return { date, time };
};
