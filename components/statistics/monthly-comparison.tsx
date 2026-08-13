import { StyleSheet, Text } from 'react-native';

import { PixelPanel } from '@/components/pomodoro/pixel-panel';
import { RPGColors } from '@/constants/theme';
import type { MonthlyComparison as MonthlyComparisonData } from '@/storage/statistics';

type MonthlyComparisonProps = {
  comparison: MonthlyComparisonData;
};

// 이번 달과 지난달의 총 집중 시간을 비교해서 보여준다.
// 계산은 storage/statistics.ts의 getMonthlyComparison() 결과를 그대로 쓰고, 여기서는 표시만 담당한다.
export function MonthlyComparison({ comparison }: MonthlyComparisonProps) {
  const { current, previous, focusMinutesDiff } = comparison;
  // 지난달에 완료한 집중이 하나도 없으면 "지난달 기록"이 없는 것으로 본다.
  // (새로운 저장 값을 추가하지 않고, 이미 계산된 previous.totalFocusCount만으로 판단한다.)
  const hasPreviousRecord = previous.totalFocusCount > 0;

  const diffStyle = focusMinutesDiff > 0 ? styles.increase : focusMinutesDiff < 0 ? styles.decrease : styles.neutral;
  const diffText =
    focusMinutesDiff === 0 ? '변화 없음' : `${focusMinutesDiff > 0 ? '▲' : '▼'} ${focusMinutesDiff > 0 ? '+' : ''}${focusMinutesDiff}분`;
  const message =
    focusMinutesDiff > 0 ? '지난달보다 더 공부했어요!' : focusMinutesDiff < 0 ? '지난달보다 적게 공부했어요' : '지난달과 비슷해요';

  return (
    <PixelPanel style={styles.container}>
      <Text style={styles.title}>지난달과 비교</Text>

      {!hasPreviousRecord ? (
        <Text style={styles.emptyText}>지난달 기록이 없어요</Text>
      ) : (
        <>
          <Text style={[styles.diffValue, diffStyle]}>{diffText}</Text>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.detail}>
            이번 달 {current.totalFocusMinutes}분 · 지난달 {previous.totalFocusMinutes}분
          </Text>
        </>
      )}
    </PixelPanel>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 480,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: RPGColors.gold,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  diffValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  increase: {
    color: '#66bb6a',
  },
  decrease: {
    color: '#e53935',
  },
  neutral: {
    color: RPGColors.textDim,
  },
  message: {
    color: RPGColors.text,
    fontSize: 13,
  },
  detail: {
    color: RPGColors.textDim,
    fontSize: 12,
  },
  emptyText: {
    color: RPGColors.textDim,
    fontSize: 13,
    paddingVertical: 8,
  },
});
