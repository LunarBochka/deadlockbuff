import type { MatchRecord } from './types';

export function asRecord(value: unknown): MatchRecord | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as MatchRecord
    : null;
}

export function asRecords(value: unknown): MatchRecord[] {
  return Array.isArray(value)
    ? value.map(asRecord).filter((entry): entry is MatchRecord => entry !== null)
    : [];
}

export function getNumber(record: MatchRecord | null | undefined, ...keys: string[]) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }
  return null;
}

export function getText(record: MatchRecord | null | undefined, ...keys: string[]) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === 'string' && value.length > 0) return value;
    if (typeof value === 'number') return String(value);
  }
  return null;
}

export function formatMatchTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  return `${minutes}:${(safeSeconds % 60).toString().padStart(2, '0')}`;
}

export function formatMatchNumber(value: number) {
  return Math.round(value).toLocaleString('ru-RU');
}

export function getMatchPlayers(metadata: MatchRecord | null) {
  const matchInfo = asRecord(metadata?.match_info);
  return asRecords(metadata?.players ?? matchInfo?.players);
}

export function getPlayerSlot(player: MatchRecord, fallback: number) {
  return getNumber(player, 'player_slot', 'player_id', 'slot') ?? fallback;
}

export function getPlayerSnapshots(player: MatchRecord) {
  return asRecords(player.stats).filter((snapshot) =>
    getNumber(snapshot, 'time_stamp_s', 'timestamp_s', 'time_s') !== null);
}

export function getLatestSnapshot(player: MatchRecord) {
  const snapshots = getPlayerSnapshots(player);
  return snapshots.reduce<MatchRecord | null>((latest, snapshot) => {
    if (!latest) return snapshot;
    const latestTime = getNumber(latest, 'time_stamp_s', 'timestamp_s', 'time_s') ?? 0;
    const snapshotTime = getNumber(snapshot, 'time_stamp_s', 'timestamp_s', 'time_s') ?? 0;
    return snapshotTime > latestTime ? snapshot : latest;
  }, null);
}

export function getItemImage(item: MatchRecord | undefined) {
  const images = asRecord(item?.images);
  return getText(item, 'image_webp', 'image', 'icon')
    || getText(images, 'icon_image_small_webp', 'icon_image_small', 'image_webp', 'image');
}
