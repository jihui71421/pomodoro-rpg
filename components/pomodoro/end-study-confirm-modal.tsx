import { Modal, StyleSheet, Text, View } from 'react-native';

import { PixelCharacter } from '@/components/pomodoro/pixel-character';
import { PixelPanel } from '@/components/pomodoro/pixel-panel';
import { RPGButton } from '@/components/pomodoro/rpg-button';
import { RPGColors } from '@/constants/theme';

type EndStudyConfirmModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

// Figma Make 원본(App.tsx)의 학습 종료 확인 모달(showEndModal)을 그대로 옮긴 것.
// '취소'/'종료'를 눌렀을 때 실행되는 함수(onCancel/onConfirm)는 부모
// (app/(tabs)/index.tsx)가 그대로 넘겨주므로 로직은 전혀 건드리지 않았고,
// 홈 화면에 이미 있는 디자인 시스템(PixelPanel/RPGButton/PixelCharacter)을
// 그대로 재사용해서 모양만 Figma에 맞게 바꿨다.
export function EndStudyConfirmModal({ visible, onCancel, onConfirm }: EndStudyConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <PixelPanel style={styles.card}>
          <View style={styles.characterWrap}>
            {/* Figma 원본: <PixelSlime color="#e53935" /> — RPGColors.hp와 같은 값 */}
            <PixelCharacter color={RPGColors.hp} />
          </View>

          <Text style={styles.title}>학습을 종료하시겠습니까?</Text>
          <Text style={styles.message}>
            현재 진행 중인 타이머가 종료됩니다.{'\n'}오늘의 집중 기록은 유지됩니다.
          </Text>

          <View style={styles.buttonRow}>
            <RPGButton label="취소" variant="gray" onPress={onCancel} />
            <RPGButton label="종료" variant="red" onPress={onConfirm} />
          </View>
        </PixelPanel>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // Figma 원본의 배경 dim 처리(rgba(0,0,0,0.85))
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 24,
  },
  characterWrap: {
    marginBottom: 8,
  },
  title: {
    color: RPGColors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    color: RPGColors.textDim,
    fontSize: 12,
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
});
