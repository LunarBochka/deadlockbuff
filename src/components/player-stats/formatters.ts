export function getWinRate(wins: number, matches: number) {
  return matches > 0 ? Math.round((wins / matches) * 100) : 0;
}

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, '0')}`;
}

export function formatNetWorth(netWorth: number) {
  if (netWorth >= 10000) return `${(netWorth / 1000).toFixed(1)}k`;
  return netWorth.toLocaleString('ru-RU');
}

export function getHeroInitials(name?: string) {
  return name?.slice(0, 2).toUpperCase() || '?';
}
