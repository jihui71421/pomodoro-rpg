import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CharacterPanel } from '@/components/pomodoro/character-panel';
import { EndStudyConfirmModal } from '@/components/pomodoro/end-study-confirm-modal';
import { FocusSummary } from '@/components/pomodoro/focus-summary';
import { LevelStatus } from '@/components/pomodoro/level-status';
import { LevelUpModal } from '@/components/pomodoro/level-up-modal';
import { PixelPanel } from '@/components/pomodoro/pixel-panel';
import { SwordIcon } from '@/components/pomodoro/pixel-icons';
import { BubbleTrigger } from '@/components/pomodoro/speech-bubble';
import { TimerControls } from '@/components/pomodoro/timer-controls';
import { TimerDisplay } from '@/components/pomodoro/timer-display';
import { RPGColors, RPGMetrics } from '@/constants/theme';
import { usePomodoroTimer } from '@/hooks/use-pomodoro-timer';

// Figma Make 원본(App.tsx)의 홈 화면 구조를 그대로 옮긴 것.
// 원본은 패널이 3개뿐이다: 상단 바 / (상태바+캐릭터+타이머+버튼을 모두 담은) 메인 패널 / 세션 카운터 패널.
export default function HomeScreen() {
  // 타이머의 모든 상태와 조작 함수는 커스텀 훅에서 가져온다. (이번 UI 작업에서 이 부분은 그대로 유지)
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

  // 시작/일시정지/리셋 버튼을 눌렀을 때 캐릭터 위에 잠깐 띄우는 말풍선.
  // 타이머 로직과는 무관한 순수 연출용 상태라서 usePomodoroTimer 훅에는 넣지 않았다.
  const [bubble, setBubble] = useState<BubbleTrigger | null>(null);
  // 같은 문구를 연달아 띄워도(예: 리셋을 두 번 연속 누름) 애니메이션이 처음부터
  // 다시 재생되도록, 누를 때마다 고유한 id를 하나씩 발급한다.
  const bubbleIdRef = useRef(0);
  const showBubble = (text: string) => {
    bubbleIdRef.current += 1;
    setBubble({ text, id: bubbleIdRef.current });
  };

  // 실제 시작/일시정지/리셋 로직(start/pause/reset)은 usePomodoroTimer가 그대로 담당하고,
  // 여기서는 그 호출 앞에 말풍선 표시만 얹은 얇은 래퍼를 버튼에 연결한다.
  const handleStartPress = () => {
    showBubble('⚔ 집중 시작!');
    start();
  };
  const handlePausePress = () => {
    showBubble('Ⅱ 일시정지');
    pause();
  };
  const handleResetPress = () => {
    showBubble('↻ 리셋!');
    reset();
  };

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

  // 팝업의 '종료' 버튼: 팝업을 닫고, 시작/일시정지/리셋과 동일하게 말풍선을 띄운 뒤
  // 실제로 학습 종료를 실행한다.
  const handleConfirmEndStudy = () => {
    setIsEndConfirmVisible(false);
    showBubble('🛡 학습 종료!');
    endStudy();
  };

  return (
    // edges={['top']}: 상태바/노치 아래에서 콘텐츠가 시작하도록 한다.
    // 하단은 탭 네비게이션이 이미 자기 높이만큼 화면을 나눠서 쓰고 있어서
    // 여기서 또 세이프 에어리어를 더하면 오히려 여백이 두 번 겹치므로 제외했다.
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 상단 바: 왼쪽 검+"POMO RPG", 오른쪽 별+"LV.N" */}
        <PixelPanel style={styles.header}>
          <View style={styles.headerSide}>
            <SwordIcon />
            <Text style={styles.title}>POMO RPG</Text>
          </View>
          <LevelStatus level={level} />
        </PixelPanel>

        {/* 메인 패널: 상태바(HP/MP/EXP) + 캐릭터 + 타이머 + 버튼이 전부 이 안에 함께 들어간다. */}
        <PixelPanel style={styles.mainPanel}>
          <CharacterPanel exp={exp} level={level} bubble={bubble} />

          <TimerDisplay isFocusMode={isFocusMode} secondsLeft={secondsLeft} />

          <TimerControls
            isRunning={isRunning}
            isFocusMode={isFocusMode}
            startButtonLabel={startButtonLabel}
            onStart={handleStartPress}
            onPause={handlePausePress}
            onReset={handleResetPress}
            onSkipBreak={skipBreak}
            onEndStudyPress={handleEndStudyPress}
          />
        </PixelPanel>

        <FocusSummary completedFocusCount={completedFocusCount} completedTimes={completedTimes} />
      </ScrollView>

      <EndStudyConfirmModal
        visible={isEndConfirmVisible}
        onCancel={handleCancelEndStudy}
        onConfirm={handleConfirmEndStudy}
      />

      {/* levelUpLevel이 null이 아닐 때만(=집중 완료로 실제 레벨업이 발생했을 때만) 표시된다. */}
      <LevelUpModal visible={levelUpLevel !== null} level={levelUpLevel ?? level} onClose={dismissLevelUp} />
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
    // 하단 탭 네비게이션과 콘텐츠(특히 마지막 세션 카운터 패널)가 겹치지 않도록
    // 기본 여백보다 조금 더 크게 잡았다.
    paddingBottom: RPGMetrics.screenPadding + 24,
  },
  header: {
    width: '100%',
    maxWidth: 480,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  headerSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: RPGColors.gold,
    fontWeight: '700',
    fontSize: RPGMetrics.fontSize.heading - 1,
    letterSpacing: 1,
  },
  mainPanel: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});
