const WEEKDAYS_SHORT = ['Жс', 'Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сб'];
const MONTHS = [
  'қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым',
  'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан',
];

const pad = (n: number) => String(n).padStart(2, '0');

// Date -> '2026-11-12'
export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// '2026-11-12' -> Date (локальное время, без сдвига часового пояса)
export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// '2026-11-12' -> '12 қараша'
export function formatDateKz(iso: string): string {
  const date = fromISODate(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export interface DayOption {
  iso: string;
  weekday: string; // 'Дс'
  day: number; // 12
}

// Список ближайших дней, начиная с сегодняшнего
export function getNextDays(count: number): DayOption[] {
  const result: DayOption[] = [];
  const today = new Date();
  for (let i = 0; i < count; i += 1) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    result.push({ iso: toISODate(d), weekday: WEEKDAYS_SHORT[d.getDay()], day: d.getDate() });
  }
  return result;
}
