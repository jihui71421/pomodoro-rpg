import { StyleSheet, Text, View } from 'react-native';

import { HeartIcon } from '@/components/pomodoro/pixel-icons';
import { PixelPanel } from '@/components/pomodoro/pixel-panel';
import { RPGColors, RPGMetrics } from '@/constants/theme';

type FocusSummaryProps = {
  // 오늘 완료한 집중 횟수
  completedFocusCount: number;
  // 오늘 집중을 완료한 시각들 (ISO 8601 문자열 배열). Figma Make 원본의 이 패널에는
  // 시간 목록이 표시되지 않아서(하트 행 + 횟수만) 여기서는 쓰지 않지만, 데이터 자체는
  // usePomodoroTimer가 계속 추적하고 캘린더 화면에서 사용한다.
  completedTimes: string[];
};

// 원본 세션당 최대로 그리는 하트 개수 (App.tsx의 MAX_SESSIONS)
const MAX_SESSION_HEARTS = 8;

// Figma Make 원본(App.tsx)의 세션 카운터 패널을 그대로 옮긴 것.
// 라벨(왼쪽) - 하트 행(가운데) - "N회"(오른쪽) 3분할 구조.
export function FocusSummary({ completedFocusCount }: FocusSummaryProps) {
  return (
    <PixelPanel style={styles.container}>
      <Text style={styles.label}>오늘 완료한 집중 횟수</Text>

      <View style={styles.hearts}>
        {Array.from({ length: MAX_SESSION_HEARTS }).map((_, index) => (
          <HeartIcon key={index} full={index < completedFocusCount} />
        ))}
      </View>

      <Text style={styles.count}>{completedFocusCount}회</Text>
    </PixelPanel>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 480,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  label: {
    color: RPGColors.textDim,
    fontSize: 12,
  },
  hearts: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  count: {
    color: RPGColors.gold,
    fontWeight: '700',
    fontSize: RPGMetrics.fontSize.heading - 1,
  },
});
