import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type TimerControlsProps = {
  isRunning: boolean;
  // 지금이 집중 시간인지(true) 휴식 시간인지(false). 휴식 중일 때만 '휴식 건너뛰기' 버튼을 보여준다.
  isFocusMode: boolean;
  // 시작 버튼에 표시할 문구 ('시작' 또는 '휴식 시작')
  startButtonLabel: string;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkipBreak: () => void;
  onEndStudyPress: () => void;
};

// 시작/일시정지, 리셋, (휴식 중일 때만) 휴식 건너뛰기, 학습 종료 버튼을 모아둔 컴포넌트.
// 실제로 상태를 바꾸지는 않고, 버튼이 눌렸을 때 부모가 넘겨준 함수를 호출하기만 한다.
export function TimerControls({
  isRunning,
  isFocusMode,
  startButtonLabel,
  onStart,
  onPause,
  onReset,
  onSkipBreak,
  onEndStudyPress,
}: TimerControlsProps) {
  return (
    <ThemedView style={styles.buttonRow}>
      {isRunning ? (
        <Pressable style={[styles.button, styles.pauseButton]} onPress={onPause}>
          <ThemedText style={styles.buttonText}>일시정지</ThemedText>
        </Pressable>
      ) : (
        <Pressable style={[styles.button, styles.startButton]} onPress={onStart}>
          <ThemedText style={styles.buttonText}>{startButtonLabel}</ThemedText>
        </Pressable>
      )}

      <Pressable style={[styles.button, styles.resetButton]} onPress={onReset}>
        <ThemedText style={styles.buttonText}>리셋</ThemedText>
      </Pressable>

      {/* 휴식 모드일 때만 '휴식 건너뛰기' 버튼을 보여준다. */}
      {!isFocusMode && (
        <Pressable style={[styles.button, styles.skipButton]} onPress={onSkipBreak}>
          <ThemedText style={styles.buttonText}>휴식 건너뛰기</ThemedText>
        </Pressable>
      )}

      {/* '학습 종료' 버튼: 집중/휴식 모드 상관없이 항상 보여준다. */}
      <Pressable style={[styles.button, styles.endButton]} onPress={onEndStudyPress}>
        <ThemedText style={styles.buttonText}>학습 종료</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  startButton: {
    backgroundColor: '#0a7ea4',
  },
  pauseButton: {
    backgroundColor: '#d97706',
  },
  resetButton: {
    backgroundColor: '#687076',
  },
  skipButton: {
    backgroundColor: '#9333ea',
  },
  endButton: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
