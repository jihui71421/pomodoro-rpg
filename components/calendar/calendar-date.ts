// 캘린더 화면에서만 쓰이는 날짜 계산 유틸리티. AsyncStorage나 타이머 로직과는 상관없이
// "연/월이 주어졌을 때 화면에 그릴 날짜 표를 어떻게 만들지"만 담당하는 순수 함수들이다.

// 캘린더 한 칸에 해당하는 정보.
export type CalendarDay = {
  // 'YYYY-MM-DD' 형태의 날짜 문자열. history의 key와 같은 형식이다.
  dateKey: string;
  // 1~31 사이의 날짜(일).
  day: number;
};

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

// year, month(0=1월 ~ 11=12월), day로 'YYYY-MM-DD' 문자열을 만든다.
export function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}

// 캘린더 상단에 보여줄 제목. 예: "2026년 8월"
export function formatMonthTitle(year: number, month: number): string {
  return `${year}년 ${month + 1}월`;
}

// 'YYYY-MM-DD' 문자열을 날짜 상세 화면 제목으로 바꾼다. 예: "8월 10일"
export function formatDayTitle(dateKey: string): string {
  const [, month, day] = dateKey.split('-');
  return `${Number(month)}월 ${Number(day)}일`;
}

// (year, month)에서 delta개월만큼 이동한 (year, month)를 반환한다. delta는 음수(이전 달)도 가능하다.
export function addMonths(year: number, month: number, delta: number): { year: number; month: number } {
  const totalMonths = year * 12 + month + delta;
  return { year: Math.floor(totalMonths / 12), month: ((totalMonths % 12) + 12) % 12 };
}

export const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

// 특정 연/월의 날짜를 7칸(일~토)짜리 주(week) 단위 표로 만들어준다.
// 그 달에 속하지 않는 칸(월 시작 전/월 종료 후)은 null로 채운다.
export function getMonthGrid(year: number, month: number): (CalendarDay | null)[][] {
  const firstWeekday = new Date(year, month, 1).getDay(); // 0(일) ~ 6(토)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (CalendarDay | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ dateKey: formatDateKey(year, month, day), day });
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks: (CalendarDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}
