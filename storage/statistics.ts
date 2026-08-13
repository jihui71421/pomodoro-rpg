// 학습 통계(일별/최근 7일/월별) 계산 로직을 모아둔 파일.
//
// 중요: 이 파일은 새로운 저장 구조를 만들지 않는다.
// storage/app-storage.ts가 이미 관리하고 있는 history(StudyHistory, key='YYYY-MM-DD')를
// "읽기 전용"으로 집계해서 통계 수치를 계산만 한다. AsyncStorage에 아무것도 추가로 저장하지 않는다.
//
// history -> 날짜별 데이터(DailyStat) -> 일별/최근 7일 통계 -> 월별 통계
// 순서로 계산한다 (요청된 설계와 동일).

import type { DailyRecord, StudyHistory } from './app-storage';

// 날짜 하나에 대한 통계. history에 해당 날짜 기록이 있으면 그 값을 그대로 쓰고,
// 없으면(기록이 없는 날) 오류 없이 0으로 채운다.
export type DailyStat = {
  // 'YYYY-MM-DD'
  date: string;
  completedFocusCount: number;
  totalFocusMinutes: number;
  earnedExp: number;
};

// 월(년+월) 단위 통계.
export type MonthlyStat = {
  year: number;
  // 0(1월) ~ 11(12월). components/calendar/calendar-date.ts와 동일한 표기를 따른다.
  month: number;
  totalFocusCount: number;
  totalFocusMinutes: number;
  totalEarnedExp: number;
  // 그 달의 총 집중 시간을 그 달의 전체 일수로 나눈 값. (공부하지 않은 날도 분모에 포함)
  averageFocusMinutesPerDay: number;
};

// 이번 달과 지난 달을 함께 담아, 화면(11일차 Figma 작업)에서 증감을 표시할 수 있게 한다.
export type MonthlyComparison = {
  current: MonthlyStat;
  previous: MonthlyStat;
  // (양수 = 증가, 음수 = 감소, 0 = 동일). current - previous.
  focusCountDiff: number;
  focusMinutesDiff: number;
  earnedExpDiff: number;
};

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

// Date -> 'YYYY-MM-DD'. storage/app-storage.ts의 getTodayDateString()과 완전히 동일한 규칙
// (기기 로컬 시간 기준, 항상 두 자리로 패딩)이다. 다만 getTodayDateString()은 인자를 받지 않고
// 항상 "지금"만 계산하므로, 최근 7일처럼 지금이 아닌 다른 날짜도 같은 형식으로 만들어야 하는
// 여기서는 Date를 인자로 받는 버전을 별도로 둔다. 새로운 날짜 "형식"이 아니라 같은 형식을
// 다른 날짜에도 쓸 수 있게 한 것뿐이다.
function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function toDailyStat(history: StudyHistory, date: string): DailyStat {
  const record: DailyRecord | undefined = history[date];
  return {
    date,
    completedFocusCount: record?.completedFocusCount ?? 0,
    totalFocusMinutes: record?.totalFocusMinutes ?? 0,
    earnedExp: record?.earnedExp ?? 0,
  };
}

// 특정 날짜 하나의 통계. history에 기록이 없으면 0/0/0으로 채워서 반환한다(에러 없음).
export function getDailyStat(history: StudyHistory, date: string): DailyStat {
  return toDailyStat(history, date);
}

// endDate를 포함해서 과거로 days일치 통계를 날짜 오름차순(과거 -> 최신)으로 반환한다.
// 기본값은 "오늘을 포함한 최근 7일".
//
// 월/연도가 바뀌는 경우, 1일, 말일, 2월, 윤년 등은 여기서 직접 계산하지 않고
// new Date(year, month, day)의 자동 보정(day를 범위 밖으로 넘기면 알아서 이전/다음 달로 넘어가는 동작)에
// 맡긴다. 이 방식은 components/calendar/calendar-date.ts의 getMonthGrid()가 그 달의 일수를 구할 때
// 쓰는 것과 같은 방식이라, 프로젝트 안에서 날짜 계산 방식을 통일해서 쓴다.
export function getRecentDailyStats(history: StudyHistory, days: number, endDate: Date = new Date()): DailyStat[] {
  const stats: DailyStat[] = [];
  for (let offset = days - 1; offset >= 0; offset--) {
    const d = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - offset);
    stats.push(toDailyStat(history, formatDateKey(d)));
  }
  return stats;
}

// year/month(0=1월~11=12월)에 해당하는 날짜들의 history 기록을 모두 더한 월별 통계.
// history를 순회하면서 'YYYY-MM-' 접두사가 일치하는 기록만 합산한다.
// (history의 key/date는 항상 storage/app-storage.ts의 getTodayDateString()이 만든
//  'YYYY-MM-DD' 형식이므로, 이 접두사 비교만으로 안전하게 그 달의 기록만 골라낼 수 있다.)
export function getMonthlyStat(history: StudyHistory, year: number, month: number): MonthlyStat {
  const prefix = `${year}-${pad2(month + 1)}-`;

  let totalFocusCount = 0;
  let totalFocusMinutes = 0;
  let totalEarnedExp = 0;

  for (const record of Object.values(history)) {
    if (record.date.startsWith(prefix)) {
      totalFocusCount += record.completedFocusCount;
      totalFocusMinutes += record.totalFocusMinutes;
      totalEarnedExp += record.earnedExp;
    }
  }

  // 그 달의 실제 일수(28~31일, 2월/윤년 포함)를 구하는 방법도 getMonthGrid()와 동일하게
  // "다음 달 0일째"를 구하는 트릭을 쓴다. new Date(year, month+1, 0)은 항상 그 달의 마지막 날이 된다.
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const averageFocusMinutesPerDay = daysInMonth > 0 ? totalFocusMinutes / daysInMonth : 0;

  return { year, month, totalFocusCount, totalFocusMinutes, totalEarnedExp, averageFocusMinutesPerDay };
}

// year/month(이번 달)과 그 바로 이전 달을 함께 계산해서 비교할 수 있게 한다.
// 이전 달 계산은 components/calendar/calendar-date.ts의 addMonths(year, month, -1)와 같은 방식
// (연도 경계를 넘어갈 때 1월의 이전 달은 작년 12월이 되도록)을 그대로 따른다.
export function getMonthlyComparison(history: StudyHistory, year: number, month: number): MonthlyComparison {
  const current = getMonthlyStat(history, year, month);

  const totalMonths = year * 12 + month - 1;
  const previousYear = Math.floor(totalMonths / 12);
  const previousMonth = ((totalMonths % 12) + 12) % 12;
  const previous = getMonthlyStat(history, previousYear, previousMonth);

  return {
    current,
    previous,
    focusCountDiff: current.totalFocusCount - previous.totalFocusCount,
    focusMinutesDiff: current.totalFocusMinutes - previous.totalFocusMinutes,
    earnedExpDiff: current.totalEarnedExp - previous.totalEarnedExp,
  };
}
