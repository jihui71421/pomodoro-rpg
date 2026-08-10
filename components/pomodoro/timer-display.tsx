import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { formatTime } from '@/hooks/use-pomodoro-timer';

type TimerDisplayProps = {
  // 지금이 집중 시간인지(true) 휴식 시간인지(false)
  isFocusMode: boolean;
  // 남은 시간(초)
  secondsLeft: number;
};

// 현재 모드("집중 시간" / "휴식 시간")와 남은 시간(mm:ss)을 큼직하게 보여주는 컴포넌트.
export function TimerDisplay({ isFocusMode, secondsLeft }: TimerDisplayProps) {
  return (
    <>
      <ThemedText type="subtitle" style={styles.modeLabel}>
        {isFocusMode ? '집중 시간' : '휴식 시간'}
      </ThemedText>

      <ThemedText type="title" style={styles.timerText}>
        {formatTime(secondsLeft)}
      </ThemedText>
    </>
  );
}

const styles = StyleSheet.create({
  modeLabel: {
    textAlign: 'center',
  },
  timerText: {
    fontSize: 64,
    lineHeight: 72,
  },
});
