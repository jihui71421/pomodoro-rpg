import { StyleSheet, Text, View } from 'react-native';

import { formatDayTitle } from '@/components/calendar/calendar-date';
import { PixelCharacter } from '@/components/pomodoro/pixel-character';
import { CalendarIcon, StarIcon, SwordIcon } from '@/components/pomodoro/pixel-icons';
import { PixelPanel } from '@/components/pomodoro/pixel-panel';
import { RPGColors } from '@/constants/theme';
import { formatTimeOfDay, type DailyRecord } from '@/storage/app-storage';
import { EXP_PER_FOCUS_SESSION } from '@/storage/leveling';

type DayDetailProps = {
  // 선택된 날짜 ('YYYY-MM-DD').
  dateKey: string;
  // 선택된 날짜의 기록. 기록이 없으면 undefined.
  record: DailyRecord | undefined;
};

const pad2 = (value: number) => String(value).padStart(2, '0');

// Figma Make 원본(App.tsx)의 CalendarScreen 중 "선택한 날짜 상세" 패널을 옮긴 것.
// 기록 유무 판단(hasRecord)과 record의 값(completedFocusCount/totalFocusMinutes/earnedExp/
// completedTimes)은 기존 storage/app-storage.ts의 DailyRecord를 그대로 쓰고, EXP 수치도
// storage/leveling.ts의 EXP_PER_FOCUS_SESSION을 재사용한다. 여기서는 표시 스타일만 바꿨다.
export function DayDetail({ dateKey, record }: DayDetailProps) {
  const hasRecord = !!record && record.completedFocusCount > 0;

  return (
    <PixelPanel style={styles.container}>
      <View style={styles.titleRow}>
        <CalendarIcon active />
        <Text style={styles.title}>{formatDayTitle(dateKey)}</Text>
      </View>

      {hasRecord ? (
        <>
          <View style={styles.statRow}>
            <StatItem label="집중 횟수" value={`${record.completedFocusCount}회`} color="#42a5f5" />
            <StatItem label="집중 시간" value={`${record.totalFocusMinutes}분`} color="#66bb6a" />
            <StatItem label="획득 EXP" value={`+${record.earnedExp}`} color={RPGColors.gold} />
          </View>

          <View style={styles.recordsSection}>
            <View style={styles.recordsHeader}>
              <StarIcon />
              <Text style={styles.recordsTitle}>완료 기록</Text>
            </View>

            <View style={styles.recordsList}>
              {record.completedTimes.map((isoString, index) => (
                <View key={isoString} style={styles.recordRow}>
                  <View style={styles.recordLeft}>
                    <Text style={styles.recordIndex}>{pad2(index + 1)}</Text>
                    <SwordIcon />
                    <Text style={styles.recordTime}>{formatTimeOfDay(isoString)}</Text>
                  </View>
                  <Text style={styles.recordExp}>+{EXP_PER_FOCUS_SESSION} EXP</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      ) : (
        <View style={styles.emptyBox}>
          <PixelCharacter isFocusMode={false} />
          <Text style={styles.emptyText}>
            아직 학습 기록이 없어요.{'\n'}오늘도 조금씩 성장해봐요! 🌱
          </Text>
        </View>
      )}
    </PixelPanel>
  );
}

function StatItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 480,
    padding: 18,
    gap: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: RPGColors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    color: RPGColors.textDim,
    fontSize: 11,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  recordsSection: {
    borderTopWidth: 2,
    borderTopColor: '#2a2540',
    paddingTop: 14,
    gap: 10,
  },
  recordsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordsTitle: {
    color: RPGColors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  recordsList: {
    gap: 6,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#12101f',
    borderWidth: 2,
    borderColor: '#2a2540',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordIndex: {
    color: RPGColors.gold,
    fontSize: 9,
    fontWeight: '700',
  },
  recordTime: {
    color: RPGColors.text,
    fontSize: 12,
  },
  recordExp: {
    color: '#66bb6a',
    fontSize: 11,
  },
  emptyBox: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  emptyText: {
    color: RPGColors.textDim,
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'center',
  },
});
