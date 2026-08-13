import { useCallback, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { getDailyStat, getMonthlyComparison, getMonthlyStat, getRecentDailyStats } from '@/storage/statistics';
import { getTodayDateString, loadAppData, type StudyHistory } from '@/storage/app-storage';

// 학습 통계 화면(11일차에 Figma UI를 입힐 예정)이 사용할 데이터를 계산해서 반환하는 훅.
//
// 포모도로 타이머(hooks/use-pomodoro-timer.ts)와 완전히 분리되어 있고, 그 훅의 상태나
// 저장 로직은 전혀 건드리지 않는다. app/(tabs)/calendar.tsx와 똑같은 방식
// (화면이 보일 때마다 loadAppData()로 history를 새로 읽어오는 방식)으로 최신 기록을 가져와서
// storage/statistics.ts의 순수 계산 함수들에 넘기기만 한다.
export function useStudyStatistics() {
  const [history, setHistory] = useState<StudyHistory>({});
  // 캐릭터의 레벨/경험치. 별도로 계산하지 않고 loadAppData()가 이미 읽어오는 값을 그대로 노출한다.
  // (usePomodoroTimer가 홈 화면에서 하는 것과 같은 방식 — 여기서는 표시만 하고 저장/레벨업 계산은 하지 않는다.)
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);

  // 캘린더 탭과 동일하게, 이 화면이 다시 보일 때마다(다른 탭에서 돌아온 경우 포함) 최신 기록을 다시 불러온다.
  useFocusEffect(
    useCallback(() => {
      let isCancelled = false;

      loadAppData().then((data) => {
        if (isCancelled) return;
        setHistory(data.history);
        setLevel(data.level);
        setExp(data.exp);
      });

      return () => {
        isCancelled = true;
      };
    }, [])
  );

  const today = new Date();

  return {
    history,
    level,
    exp,
    // 선택한 날짜(기본값: 오늘) 하나의 집중 횟수/시간/EXP.
    getDailyStat: (date: string = getTodayDateString()) => getDailyStat(history, date),
    // 오늘을 포함한 최근 7일, 날짜 오름차순(과거 -> 오늘).
    recentDailyStats: getRecentDailyStats(history, 7, today),
    // 이번 달 합계 + 일평균.
    monthlyStat: getMonthlyStat(history, today.getFullYear(), today.getMonth()),
    // 이번 달 vs 지난 달 비교.
    monthlyComparison: getMonthlyComparison(history, today.getFullYear(), today.getMonth()),
  };
}
