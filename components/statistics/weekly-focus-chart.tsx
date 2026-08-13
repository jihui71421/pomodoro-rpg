import { StyleSheet, Text, View } from 'react-native';

import { PixelPanel } from '@/components/pomodoro/pixel-panel';
import { RPGColors } from '@/constants/theme';
import type { DailyStat } from '@/storage/statistics';

type WeeklyFocusChartProps = {
  // 날짜 오름차순(과거 -> 오늘). storage/statistics.ts의 getRecentDailyStats()가
  // 기록이 없는 날도 이미 0으로 채워서 반환하므로, 여기서는 값을 그대로 막대 높이로 옮기기만 한다.
  dailyStats: DailyStat[];
  todayDateKey: string;
};

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
const CHART_HEIGHT = 100;
// 모든 값이 0이거나 값이 아주 작아도 막대가 아예 안 보이지 않도록 하는 최소 높이.
const MIN_BAR_HEIGHT = 4;

function weekdayLabel(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  return WEEKDAY_LABELS[new Date(year, month - 1, day).getDay()];
}

// 최근 7일 집중 시간(분)을 세로 막대그래프로 보여준다.
// 외부 차트 라이브러리를 쓰지 않고, StatBar(components/pomodoro/stat-bar.tsx)와 같은 방식으로
// RN View의 height만 조절해서 막대를 그린다.
export function WeeklyFocusChart({ dailyStats, todayDateKey }: WeeklyFocusChartProps) {
  // 최댓값이 0이면(최근 7일 기록이 전혀 없으면) 나눗셈을 하지 않고 모든 막대를 최소 높이로 그린다.
  const maxMinutes = Math.max(0, ...dailyStats.map((stat) => stat.totalFocusMinutes));

  return (
    <PixelPanel style={styles.container}>
      <Text style={styles.title}>최근 7일 집중 시간</Text>

      <View style={styles.chart}>
        {dailyStats.map((stat) => {
          const isToday = stat.date === todayDateKey;
          const barHeight =
            maxMinutes > 0
              ? Math.max(MIN_BAR_HEIGHT, (stat.totalFocusMinutes / maxMinutes) * CHART_HEIGHT)
              : MIN_BAR_HEIGHT;

          return (
            <View key={stat.date} style={styles.column}>
              <View style={styles.barTrack}>
                <View style={[styles.bar, { height: barHeight }, isToday && styles.barToday]} />
              </View>
              <Text style={[styles.weekday, isToday && styles.weekdayToday]}>{weekdayLabel(stat.date)}</Text>
            </View>
          );
        })}
      </View>
    </PixelPanel>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 480,
    padding: 20,
    gap: 16,
  },
  title: {
    color: RPGColors.gold,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: CHART_HEIGHT + 24,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  barTrack: {
    width: '100%',
    height: CHART_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 14,
    backgroundColor: '#42a5f5',
    borderWidth: 2,
    borderColor: '#000000',
  },
  barToday: {
    backgroundColor: RPGColors.gold,
  },
  weekday: {
    color: RPGColors.textDim,
    fontSize: 11,
    fontWeight: '700',
  },
  weekdayToday: {
    color: RPGColors.gold,
  },
});
