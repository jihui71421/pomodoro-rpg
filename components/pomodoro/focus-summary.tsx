import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formatTimeOfDay } from '@/storage/app-storage';

type FocusSummaryProps = {
  // 오늘 완료한 집중 횟수
  completedFocusCount: number;
  // 오늘 집중을 완료한 시각들 (ISO 8601 문자열 배열, 오래된 시각이 앞쪽)
  completedTimes: string[];
};

// 홈 화면 하단에 "오늘 집중 횟수"와 "완료 시간 목록"을 보여주는 컴포넌트.
// 날짜가 바뀌면 usePomodoroTimer 훅이 이 값들을 자동으로 0/빈 배열로 초기화해준다.
export function FocusSummary({ completedFocusCount, completedTimes }: FocusSummaryProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.countText}>오늘 완료한 집중 횟수: {completedFocusCount}회</ThemedText>

      {/* 아직 완료한 집중이 없으면(completedTimes가 빈 배열) 목록 자체를 보여주지 않는다. */}
      {completedTimes.length > 0 && (
        <ThemedView style={styles.timesContainer}>
          <ThemedText style={styles.timesTitle}>완료 시간</ThemedText>
          {/* 완료한 순서(오래된 시각 -> 최신 시각) 그대로 한 줄씩 보여준다. */}
          {completedTimes.map((isoString, index) => (
            <ThemedText key={isoString} style={styles.timeItem}>
              {index + 1}. {formatTimeOfDay(isoString)}
            </ThemedText>
          ))}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    alignItems: 'center',
    gap: 8,
  },
  countText: {
    fontWeight: '600',
  },
  timesContainer: {
    alignItems: 'center',
    gap: 4,
  },
  timesTitle: {
    fontWeight: '600',
  },
  timeItem: {
    opacity: 0.8,
  },
});
