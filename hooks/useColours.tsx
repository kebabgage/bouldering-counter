import { useCallback, useSyncExternalStore } from "react";

export type Colour = { color: string; count: number };
type ColoursByDate = Record<string, Colour[]>;

const STORAGE_KEY = "colours";

const defaultColors: Colour[] = [
  { color: "green", count: 0 },
  { color: "yellow", count: 0 },
  { color: "orange", count: 0 },
  { color: "blue", count: 0 },
  { color: "purple", count: 0 },
];

let cachedRaw: string | null = null;
let cachedParsed: ColoursByDate = {};

function getAllData(): ColoursByDate {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
    cachedRaw = "{}";
    cachedParsed = {};
    return cachedParsed;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedParsed = JSON.parse(raw);
    } catch {
      cachedParsed = {};
    }
  }
  return cachedParsed;
}

function getColoursForDate(date: string): Colour[] {
  const data = getAllData();
  return data[date] ?? defaultColors;
}

function subscribe(callback: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  const onCustom = () => callback();
  window.addEventListener("storage", onStorage);
  window.addEventListener("colours-updated", onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("colours-updated", onCustom);
  };
}

export function useColours(date: string) {
  const colours = useSyncExternalStore(
    subscribe,
    () => getColoursForDate(date),
    () => defaultColors,
  );

  const setColours = useCallback(
    (update: Colour[] | ((prev: Colour[]) => Colour[])) => {
      const allData = getAllData();
      const current = allData[date] ?? defaultColors;
      const next = typeof update === "function" ? update(current) : update;
      const updated = { ...allData, [date]: next };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      cachedRaw = null; // invalidate cache
      window.dispatchEvent(new Event("colours-updated"));
    },
    [date],
  );

  return [colours, setColours] as const;
}
