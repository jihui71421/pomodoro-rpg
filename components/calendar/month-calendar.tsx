import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getMonthGrid, WEEKDAY_LABELS } from '@/components/calendar/calendar-date';
import { PixelPanel } from '@/components/pomodoro/pixel-panel';
import { RPGColors } from '@/constants/theme';

type MonthCalendarProps = {
  // 화면에 표시 중인 연도/월(month는 0=1월 ~ 11=12월).
  year: number;
  month: number;
  // 현재 선택된 날짜 ('YYYY-MM-DD').
  selectedDate: string;
  // 오늘 날짜 ('YYYY-MM-DD'). 오늘 칸을 살짝 구분해서 보여주기 위해 사용한다.
  todayDateKey: string;
  // 학습 기록이 있는 날짜들의 집합. 이 안에 있는 날짜는 점 표시를 보여준다.
  recordedDates: Set<string>;
  onSelectDate: (dateKey: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

const pad2 = (value: number) => String(value).padStart(2, '0');

// Figma Make 원본(App.tsx)의 CalendarScreen 중 월 헤더 + 요일 행 + 날짜 그리드를 옮긴 것.
// 날짜 계산(주 단위 격자 만들기)은 그대로 calendar-date.ts의 getMonthGrid를 재사용하고,
// 여기서는 스타일(픽셀 패널, 각진 선택 표시, 사각 점 등)만 Figma에 맞게 다시 그렸다.
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
    <PixelPanel style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onPrevMonth} hitSlop={8}>
          <Text style={styles.navButtonText}>{'<'}</Text>
        </Pressable>
        <Text style={styles.title}>
          {year} . {pad2(month + 1)}
        </Text>
        <Pressable onPress={onNextMonth} hitSlop={8}>
          <Text style={styles.navButtonText}>{'>'}</Text>
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label, index) => (
          <View key={label} style={styles.weekdayCell}>
            <Text style={[styles.weekdayText, index === 0 && styles.sundayText, index === 6 && styles.saturdayText]}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((cellDay, dayIndex) => {
              if (!cellDay) {
                return <View key={dayIndex} style={styles.dayCell} />;
              }

              const isSelected = cellDay.dateKey === selectedDate;
              const isToday = cellDay.dateKey === todayDateKey;
              const hasRecord = recordedDates.has(cellDay.dateKey);

              return (
                <Pressable key={cellDay.dateKey} style={styles.dayCell} onPress={() => onSelectDate(cellDay.dateKey)}>
                  <View style={[styles.dayBox, isToday && !isSelected && styles.dayBoxToday, isSelected && styles.dayBoxSelected]}>
                    <Text
                      style={[
                        styles.dayText,
                        dayIndex === 0 && styles.sundayText,
                        dayIndex === 6 && styles.saturdayText,
                        (isSelected || isToday) && styles.dayTextBold,
                        isSelected && styles.dayTextSelected,
                      ]}>
                      {cellDay.day}
                    </Text>
                    {hasRecord && <View style={[styles.dot, isSelected && styles.dotSelected]} />}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </PixelPanel>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 480,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  navButtonText: {
    color: '#42a5f5',
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  title: {
    color: RPGColors.gold,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    color: RPGColors.textDim,
    fontSize: 12,
    fontWeight: '700',
  },
  sundayText: {
    color: '#ef5350',
  },
  saturdayText: {
    color: '#42a5f5',
  },
  daysGrid: {
    gap: 2,
  },
  weekRow: {
    flexDirection: 'row',
    gap: 2,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
  },
  dayBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayBoxToday: {
    borderColor: RPGColors.border,
  },
  dayBoxSelected: {
    backgroundColor: '#1565c0',
    borderColor: '#90caf9',
  },
  dayText: {
    color: RPGColors.text,
    fontSize: 13,
    fontWeight: '400',
  },
  dayTextBold: {
    fontWeight: '700',
  },
  dayTextSelected: {
    color: '#ffffff',
  },
  dot: {
    position: 'absolute',
    bottom: 3,
    width: 4,
    height: 4,
    backgroundColor: RPGColors.gold,
  },
  dotSelected: {
    backgroundColor: '#ffffff',
  },
});
