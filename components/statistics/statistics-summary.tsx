import { StyleSheet, Text, View } from 'react-native';

import { PixelPanel } from '@/components/pomodoro/pixel-panel';
import { RPGColors } from '@/constants/theme';
import type { MonthlyStat } from '@/storage/statistics';

type StatisticsSummaryProps = {
  monthlyStat: MonthlyStat;
};

// 통계 화면 최상단의 "이번 달 학습" 요약 카드.
// components/calendar/day-detail.tsx의 StatItem(라벨 + 색상 있는 숫자) 패턴을 그대로 재사용해서
// 캘린더 화면과 같은 색 규칙(집중 횟수=blue, EXP=gold)을 유지한다.
export function StatisticsSummary({ monthlyStat }: StatisticsSummaryProps) {
  return (
    <PixelPanel style={styles.container}>
      <Text style={styles.title}>이번 달 학습</Text>

      <View style={styles.heroBlock}>
        <Text style={styles.heroValue}>{monthlyStat.totalFocusMinutes}분</Text>
        <Text style={styles.heroLabel}>총 집중 시간</Text>
      </View>

      <View style={styles.statRow}>
        <StatItem label="집중 횟수" value={`${monthlyStat.totalFocusCount}회`} color="#42a5f5" />
        <StatItem label="획득 EXP" value={`+${monthlyStat.totalEarnedExp}`} color={RPGColors.gold} />
      </View>

      <Text style={styles.average}>일평균 {monthlyStat.averageFocusMinutesPerDay.toFixed(1)}분</Text>
    </PixelPanel>
  );
}

function StatItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 480,
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  title: {
    color: RPGColors.gold,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroBlock: {
    alignItems: 'center',
    gap: 2,
  },
  heroValue: {
    color: RPGColors.gold,
    fontSize: 36,
    fontWeight: '700',
  },
  heroLabel: {
    color: RPGColors.textDim,
    fontSize: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    color: RPGColors.textDim,
    fontSize: 11,
  },
  average: {
    color: RPGColors.textDim,
    fontSize: 12,
  },
});
