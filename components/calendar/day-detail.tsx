import { StyleSheet } from 'react-native';

import { formatDayTitle } from '@/components/calendar/calendar-date';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formatTimeOfDay, type DailyRecord } from '@/storage/app-storage';

type DayDetailProps = {
  // 선택된 날짜 ('YYYY-MM-DD').
  dateKey: string;
  // 선택된 날짜의 기록. 기록이 없으면 undefined.
  record: DailyRecord | undefined;
};

// 캘린더에서 선택한 날짜의 학습 기록(또는 "기록 없음" 안내)을 보여주는 컴포넌트.
export function DayDetail({ dateKey, record }: DayDetailProps) {
  const hasRecord = !!record && record.completedFocusCount > 0;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        📅 {formatDayTitle(dateKey)}
      </ThemedText>

      {!hasRecord ? (
        <ThemedView style={styles.emptyBox}>
          <ThemedText style={styles.emptyText}>아직 학습 기록이 없어요.</ThemedText>
          <ThemedText style={styles.emptyText}>오늘도 조금씩 성장해봐요! 🌱</ThemedText>
        </ThemedView>
      ) : (
        <ThemedView style={styles.statsBox}>
          <ThemedView style={styles.statRow}>
            <StatItem label="집중 횟수" value={`${record.completedFocusCount}회`} />
            <StatItem label="집중 시간" value={`${record.totalFocusMinutes}분`} />
            <StatItem label="획득 EXP" value={`+${record.earnedExp} EXP`} />
          </ThemedView>

          <ThemedView style={styles.timesContainer}>
            <ThemedText style={styles.timesTitle}>완료 기록</ThemedText>
            {record.completedTimes.map((isoString, index) => (
              <ThemedText key={isoString} style={styles.timeItem}>
                {index + 1}. {formatTimeOfDay(isoString)}
              </ThemedText>
            ))}
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <ThemedView style={styles.statItem}>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    textAlign: 'center',
  },
  emptyBox: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 24,
  },
  emptyText: {
    opacity: 0.7,
  },
  statsBox: {
    gap: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.6,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
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
