import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFocusEffect } from '@react-navigation/native';

import { addMonths } from '@/components/calendar/calendar-date';
import { DayDetail } from '@/components/calendar/day-detail';
import { MonthCalendar } from '@/components/calendar/month-calendar';
import { RPGColors, RPGMetrics } from '@/constants/theme';
import { getTodayDateString, loadAppData, type StudyHistory } from '@/storage/app-storage';

// 캘린더 탭 화면.
// 타이머 로직(usePomodoroTimer)은 그대로 두고, 여기서는 AsyncStorage에 저장된 history만
// 별도로 읽어와 보여준다. 이렇게 하면 홈 화면의 타이머 상태를 건드리지 않고
// "이 탭이 화면에 보일 때마다 최신 기록을 다시 불러오는" 방식으로 안전하게 구현할 수 있다.
export default function CalendarScreen() {
  const todayDateKey = getTodayDateString();
  const todayDate = useMemo(() => new Date(), []);

  const [year, setYear] = useState(todayDate.getFullYear());
  const [month, setMonth] = useState(todayDate.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayDateKey);
  const [history, setHistory] = useState<StudyHistory>({});

  // 캘린더 탭이 화면에 보일 때마다(다른 탭에서 돌아온 경우 포함) 최신 기록을 다시 불러온다.
  useFocusEffect(
    useCallback(() => {
      let isCancelled = false;

      loadAppData().then((data) => {
        if (isCancelled) return;
        setHistory(data.history);
      });

      return () => {
        isCancelled = true;
      };
    }, [])
  );

  const recordedDates = useMemo(() => {
    const dates = new Set<string>();
    for (const record of Object.values(history)) {
      if (record.completedFocusCount > 0) {
        dates.add(record.date);
      }
    }
    return dates;
  }, [history]);

  const handlePrevMonth = () => {
    const next = addMonths(year, month, -1);
    setYear(next.year);
    setMonth(next.month);
  };

  const handleNextMonth = () => {
    const next = addMonths(year, month, 1);
    setYear(next.year);
    setMonth(next.month);
  };

  return (
    // 홈 화면(app/(tabs)/index.tsx)과 동일한 방식: SafeAreaView(top)로 상단 잘림을
    // 막고, RPGColors/RPGMetrics로 같은 디자인 시스템을 재사용한다.
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <MonthCalendar
          year={year}
          month={month}
          selectedDate={selectedDate}
          todayDateKey={todayDateKey}
          recordedDates={recordedDates}
          onSelectDate={setSelectedDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        <DayDetail dateKey={selectedDate} record={history[selectedDate]} />
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
    paddingBottom: RPGMetrics.screenPadding + 24,
  },
});
