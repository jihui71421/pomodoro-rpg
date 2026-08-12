import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { RPGColors, RPGMetrics } from '@/constants/theme';
import { BREAK_SECONDS, FOCUS_SECONDS, formatTime } from '@/hooks/use-pomodoro-timer';

type TimerDisplayProps = {
  // 지금이 집중 시간인지(true) 휴식 시간인지(false)
  isFocusMode: boolean;
  // 남은 시간(초)
  secondsLeft: number;
};

// Figma Make 원본(App.tsx)에서 모드 라벨 + 큰 타이머 숫자 + 진행바가 있던 부분을 그대로 옮긴 것.
// 원본은 이 부분도 별도 패널이 아니라 메인 패널 안의 한 섹션이라 자체 테두리를 두지 않는다.
// 진행바 비율 계산에만 FOCUS_SECONDS/BREAK_SECONDS(훅에서 그대로 가져온 상수)를 쓰고,
// 시간이 줄어드는 로직 자체는 건드리지 않는다.
export function TimerDisplay({ isFocusMode, secondsLeft }: TimerDisplayProps) {
  const { width } = useWindowDimensions();

  const totalSeconds = isFocusMode ? FOCUS_SECONDS : BREAK_SECONDS;
  const progress = totalSeconds > 0 ? Math.max(0, Math.min(100, ((totalSeconds - secondsLeft) / totalSeconds) * 100)) : 0;
  const color = isFocusMode ? RPGColors.characterFocus : RPGColors.characterBreak;

  // 원본 CSS clamp(42px, 12vw, 64px)를 RN에서 화면 폭 기준으로 근사한 값.
  const timerFontSize = Math.min(RPGMetrics.fontSize.timerMax, Math.max(RPGMetrics.fontSize.timerMin, width * 0.12));

  return (
    <View style={styles.container}>
      <Text style={[styles.modeLabel, { color, textShadowColor: color }]}>
        {isFocusMode ? '⚔  집중 시간' : '🛌 휴식 시간'}
      </Text>

      <Text style={[styles.timerText, { color, fontSize: timerFontSize, textShadowColor: color }]}>
        {formatTime(secondsLeft)}
      </Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  modeLabel: {
    marginBottom: 12,
    fontSize: RPGMetrics.fontSize.modeLabel,
    fontWeight: '700',
    letterSpacing: 2,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  timerText: {
    marginBottom: 8,
    fontWeight: '800',
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    marginBottom: 24,
    backgroundColor: '#111111',
    borderWidth: 2,
    borderColor: '#333333',
  },
  progressFill: {
    height: '100%',
  },
});
