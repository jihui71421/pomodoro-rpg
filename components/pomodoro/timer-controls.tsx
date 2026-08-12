import { StyleSheet, View } from 'react-native';

import { RPGButton } from '@/components/pomodoro/rpg-button';

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

// Figma Make 원본(App.tsx)의 버튼 행 + '학습 종료' 버튼을 그대로 옮긴 것.
// 원본처럼 자체 패널 없이, 버튼 행(시작/일시정지, 리셋, 휴식 건너뛰기)과
// 학습 종료 버튼을 별도 줄로 나눈다. 버튼이 눌렸을 때 호출하는 함수(로직)는
// 그대로이고 RPGButton으로 모양만 바꿨다. 원본 색 배정: 시작/휴식시작=blue,
// 일시정지=gold, 리셋=gray, 휴식건너뛰기=purple, 학습종료=red.
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
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        {isRunning ? (
          <RPGButton label="일시정지" variant="gold" onPress={onPause} />
        ) : (
          <RPGButton label={startButtonLabel} variant="blue" onPress={onStart} />
        )}

        <RPGButton label="리셋" variant="gray" onPress={onReset} />

        {/* 휴식 모드일 때만 '휴식 건너뛰기' 버튼을 보여준다. */}
        {!isFocusMode && <RPGButton label="휴식 건너뛰기" variant="purple" onPress={onSkipBreak} />}
      </View>

      {/* '학습 종료' 버튼: 집중/휴식 모드 상관없이 항상 보여준다. */}
      <RPGButton label="학습 종료" variant="red" onPress={onEndStudyPress} style={styles.endButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  // RPGButton은 여러 개를 가로로 나열할 때(buttonRow)를 기준으로 기본값이
  // alignSelf:'flex-start'라서, 세로로 혼자 놓이는 이 버튼만 왼쪽에 붙어버린다.
  // 다른 버튼/레이아웃은 건드리지 않고 이 버튼 하나만 가운데로 오버라이드한다.
  endButton: {
    alignSelf: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
});
