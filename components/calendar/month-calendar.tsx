import { Pressable, StyleSheet, View } from 'react-native';

import { formatMonthTitle, getMonthGrid, WEEKDAY_LABELS } from '@/components/calendar/calendar-date';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type MonthCalendarProps = {
  // 화면에 표시 중인 연도/월(month는 0=1월 ~ 11=12월).
  year: number;
  month: number;
  // 현재 선택된 날짜 ('YYYY-MM-DD').
  selectedDate: string;
  // 오늘 날짜 ('YYYY-MM-DD'). 오늘 칸을 살짝 구분해서 보여주기 위해 사용한다.
  todayDateKey: string;
  // 학습 기록이 있는 날짜들의 집합. 이 안에 있는 날짜는 점(●) 표시를 보여준다.
  recordedDates: Set<string>;
  onSelectDate: (dateKey: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

// 연/월 이동 버튼, 요일 행, 날짜 격자를 보여주는 캘린더 본체.
// 복잡한 캘린더 라이브러리 없이, 순수 계산(calendar-date.ts) + 격자 렌더링만으로 직접 구현했다.
export function MonthCalendar({
  year,
  month,
  selectedDate,
  todayDateKey,
  recordedDates,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: MonthCalendarProps) {
  const weeks = getMonthGrid(year, month);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <Pressable style={styles.navButton} onPress={onPrevMonth} hitSlop={8}>
          <ThemedText style={styles.navButtonText}>‹</ThemedText>
        </Pressable>
        <ThemedText type="subtitle">{formatMonthTitle(year, month)}</ThemedText>
        <Pressable style={styles.navButton} onPress={onNextMonth} hitSlop={8}>
          <ThemedText style={styles.navButtonText}>›</ThemedText>
        </Pressable>
      </ThemedView>

      <View style={styles.weekRow}>
        {WEEKDAY_LABELS.map((label, index) => (
          <View key={label} style={styles.cell}>
            <ThemedText
              style={[
                styles.weekdayText,
                index === 0 ? styles.sundayText : undefined,
                index === 6 ? styles.saturdayText : undefined,
              ]}>
              {label}
            </ThemedText>
          </View>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekRow}>
          {week.map((cellDay, dayIndex) => {
            if (!cellDay) {
              return <View key={dayIndex} style={styles.cell} />;
            }

            const isSelected = cellDay.dateKey === selectedDate;
            const isToday = cellDay.dateKey === todayDateKey;
            const hasRecord = recordedDates.has(cellDay.dateKey);

            return (
              <Pressable
                key={cellDay.dateKey}
                style={styles.cell}
                onPress={() => onSelectDate(cellDay.dateKey)}>
                <View style={[styles.dayCircle, isSelected && styles.dayCircleSelected, isToday && !isSelected && styles.dayCircleToday]}>
                  <ThemedText
                    style={[
                      styles.dayText,
                      dayIndex === 0 ? styles.sundayText : undefined,
                      dayIndex === 6 ? styles.saturdayText : undefined,
                      isSelected && styles.dayTextSelected,
                    ]}>
                    {cellDay.day}
                  </ThemedText>
                  <View style={styles.dotSlot}>{hasRecord && <View style={[styles.dot, isSelected && styles.dotSelected]} />}</View>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </ThemedView>
  );
}

const CELL_SIZE = 40;

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 4,
  },
  navButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  navButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0a7ea4',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    width: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayText: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.6,
  },
  sundayText: {
    color: '#dc2626',
  },
  saturdayText: {
    color: '#0a7ea4',
  },
  dayCircle: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleToday: {
    borderWidth: 1.5,
    borderColor: '#0a7ea4',
  },
  dayCircleSelected: {
    backgroundColor: '#0a7ea4',
  },
  dayText: {
    fontSize: 14,
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  dotSlot: {
    height: 6,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#facc15',
  },
  dotSelected: {
    backgroundColor: '#fff',
  },
});
