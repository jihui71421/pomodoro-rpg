import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { EndStudyConfirmModal } from '@/components/pomodoro/end-study-confirm-modal';
import { FocusSummary } from '@/components/pomodoro/focus-summary';
import { LevelStatus } from '@/components/pomodoro/level-status';
import { LevelUpModal } from '@/components/pomodoro/level-up-modal';
import { TimerControls } from '@/components/pomodoro/timer-controls';
import { TimerDisplay } from '@/components/pomodoro/timer-display';
import { ThemedView } from '@/components/themed-view';
import { usePomodoroTimer } from '@/hooks/use-pomodoro-timer';

export default function HomeScreen() {
  // 타이머의 모든 상태와 조작 함수는 커스텀 훅에서 가져온다.
  const {
    mode,
    secondsLeft,
    isRunning,
    completedFocusCount,
    completedTimes,
    level,
    exp,
    levelUpLevel,
    start,
    pause,
    reset,
    skipBreak,
    endStudy,
    dismissLevelUp,
  } = usePomodoroTimer();

  // '학습 종료' 확인 팝업을 보여줄지 여부.
  const [isEndConfirmVisible, setIsEndConfirmVisible] = useState(false);

  const isFocusMode = mode === 'focus';

  // 시작 버튼에 표시할 문구: 휴식 모드에서는 '휴식 시작'으로 다르게 보여준다.
  const startButtonLabel = isFocusMode ? '시작' : '휴식 시작';

  // '학습 종료' 버튼을 누르면 바로 종료하지 않고 확인 팝업만 띄운다.
  const handleEndStudyPress = () => {
    setIsEndConfirmVisible(true);
  };

  // 팝업의 '취소' 버튼: 팝업만 닫고 타이머는 그대로 진행한다.
  const handleCancelEndStudy = () => {
    setIsEndConfirmVisible(false);
  };

  // 팝업의 '종료' 버튼: 팝업을 닫고 실제로 학습 종료를 실행한다.
  const handleConfirmEndStudy = () => {
    setIsEndConfirmVisible(false);
    endStudy();
  };

  return (
    <ThemedView style={styles.container}>
      <LevelStatus level={level} exp={exp} />

      <TimerDisplay isFocusMode={isFocusMode} secondsLeft={secondsLeft} />

      <TimerControls
        isRunning={isRunning}
        isFocusMode={isFocusMode}
        startButtonLabel={startButtonLabel}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onSkipBreak={skipBreak}
        onEndStudyPress={handleEndStudyPress}
      />

      <FocusSummary completedFocusCount={completedFocusCount} completedTimes={completedTimes} />

      <EndStudyConfirmModal
        visible={isEndConfirmVisible}
        onCancel={handleCancelEndStudy}
        onConfirm={handleConfirmEndStudy}
      />

      {/* levelUpLevel이 null이 아닐 때만(=집중 완료로 실제 레벨업이 발생했을 때만) 표시된다. */}
      <LevelUpModal visible={levelUpLevel !== null} level={levelUpLevel ?? level} onClose={dismissLevelUp} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
});
