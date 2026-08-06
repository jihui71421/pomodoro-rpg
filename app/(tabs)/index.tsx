import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formatTime, usePomodoroTimer } from '@/hooks/use-pomodoro-timer';

export default function HomeScreen() {
  // 타이머의 모든 상태와 조작 함수는 커스텀 훅에서 가져온다.
  const {
    mode,
    secondsLeft,
    isRunning,
    completedFocusCount,
    start,
    pause,
    reset,
    skipBreak,
    endStudy,
  } = usePomodoroTimer();

  // '학습 종료' 확인 팝업을 보여줄지 여부.
  // RN의 기본 Alert.alert는 웹(react-native-web)에서 아무 동작도 하지 않기 때문에,
  // 웹/모바일 어디서나 동일하게 동작하도록 직접 만든 팝업(Modal)을 사용한다.
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
      {/* 현재 모드 표시 (집중 중 / 휴식 중) */}
      <ThemedText type="subtitle" style={styles.modeLabel}>
        {isFocusMode ? '집중 시간' : '휴식 시간'}
      </ThemedText>

      {/* 남은 시간을 mm:ss 형태로 크게 표시 */}
      <ThemedText type="title" style={styles.timerText}>
        {formatTime(secondsLeft)}
      </ThemedText>

      {/* 시작 / 일시정지 / 리셋 버튼 */}
      <ThemedView style={styles.buttonRow}>
        {isRunning ? (
          <Pressable style={[styles.button, styles.pauseButton]} onPress={pause}>
            <ThemedText style={styles.buttonText}>일시정지</ThemedText>
          </Pressable>
        ) : (
          <Pressable style={[styles.button, styles.startButton]} onPress={start}>
            <ThemedText style={styles.buttonText}>{startButtonLabel}</ThemedText>
          </Pressable>
        )}

        <Pressable style={[styles.button, styles.resetButton]} onPress={reset}>
          <ThemedText style={styles.buttonText}>리셋</ThemedText>
        </Pressable>

        {/* 휴식 모드일 때만 '휴식 건너뛰기' 버튼을 보여준다. */}
        {!isFocusMode && (
          <Pressable style={[styles.button, styles.skipButton]} onPress={skipBreak}>
            <ThemedText style={styles.buttonText}>휴식 건너뛰기</ThemedText>
          </Pressable>
        )}

        {/* '학습 종료' 버튼: 집중/휴식 모드 상관없이 항상 보여준다. */}
        <Pressable style={[styles.button, styles.endButton]} onPress={handleEndStudyPress}>
          <ThemedText style={styles.buttonText}>학습 종료</ThemedText>
        </Pressable>
      </ThemedView>

      {/* 오늘 완료한 집중 횟수 */}
      <ThemedText style={styles.countText}>오늘 완료한 집중 횟수: {completedFocusCount}회</ThemedText>

      {/* 학습 종료 확인 팝업. transparent로 설정해 뒤 화면이 어둡게 비치도록 한다. */}
      <Modal
        visible={isEndConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelEndStudy}>
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalCard}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              학습을 종료하시겠습니까?
            </ThemedText>
            <ThemedText style={styles.modalMessage}>
              현재 진행 중인 타이머가 종료됩니다. 오늘의 집중 기록은 유지됩니다.
            </ThemedText>
            <ThemedView style={styles.modalButtonRow}>
              <Pressable style={[styles.button, styles.cancelButton]} onPress={handleCancelEndStudy}>
                <ThemedText style={styles.buttonText}>취소</ThemedText>
              </Pressable>
              <Pressable style={[styles.button, styles.endButton]} onPress={handleConfirmEndStudy}>
                <ThemedText style={styles.buttonText}>종료</ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        </View>
      </Modal>
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
  modeLabel: {
    textAlign: 'center',
  },
  timerText: {
    fontSize: 64,
    lineHeight: 72,
  },
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
  cancelButton: {
    backgroundColor: '#687076',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  countText: {
    marginTop: 8,
  },
  // 팝업 뒤 배경을 반투명 검정으로 덮어서 팝업에 집중되도록 한다.
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 12,
    padding: 24,
    gap: 12,
  },
  modalTitle: {
    textAlign: 'center',
  },
  modalMessage: {
    textAlign: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
});
