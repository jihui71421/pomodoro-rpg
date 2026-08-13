import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GrowthSummary } from '@/components/statistics/growth-summary';
import { MonthlyComparison } from '@/components/statistics/monthly-comparison';
import { StatisticsSummary } from '@/components/statistics/statistics-summary';
import { WeeklyFocusChart } from '@/components/statistics/weekly-focus-chart';
import { RPGColors, RPGMetrics } from '@/constants/theme';
import { getTodayDateString } from '@/storage/app-storage';
import { useStudyStatistics } from '@/hooks/use-study-statistics';

// 학습 통계 탭 화면.
//
// 데이터 계산은 전부 storage/statistics.ts + hooks/use-study-statistics.ts에 그대로 맡기고,
// 이 화면은 그 결과를 components/statistics/*의 4개 카드(이번 달 요약 / 최근 7일 / 지난달 비교 /
// 캐릭터 성장)로 나눠서 보여주기만 한다. 홈/캘린더 화면과 같은 PixelPanel + RPGColors를 재사용해서
// 새 디자인 시스템을 만들지 않았다.
export default function StatisticsScreen() {
  const { recentDailyStats, monthlyStat, monthlyComparison, level, exp } = useStudyStatistics();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>통계</Text>

        <StatisticsSummary monthlyStat={monthlyStat} />
        <WeeklyFocusChart dailyStats={recentDailyStats} todayDateKey={getTodayDateString()} />
        <MonthlyComparison comparison={monthlyComparison} />
        <GrowthSummary level={level} exp={exp} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: RPGColors.background,
  },
  container: {
    alignItems: 'center',
    gap: RPGMetrics.panelGap,
    paddingHorizontal: RPGMetrics.screenPadding,
    paddingTop: RPGMetrics.screenPadding,
    // 홈/캘린더 화면과 동일하게, 하단 탭 네비게이션과 마지막 카드가 겹치지 않도록 여백을 더 둔다.
    paddingBottom: RPGMetrics.screenPadding + 24,
  },
  title: {
    width: '100%',
    maxWidth: 480,
    color: RPGColors.gold,
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 1,
  },
});
