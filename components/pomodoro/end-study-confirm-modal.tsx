import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type EndStudyConfirmModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

// '학습 종료' 버튼을 눌렀을 때 뜨는 확인 팝업.
// RN의 기본 Alert.alert는 웹(react-native-web)에서 아무 동작도 하지 않기 때문에,
// 웹/모바일 어디서나 동일하게 동작하도록 직접 만든 팝업(Modal)을 사용한다.
export function EndStudyConfirmModal({ visible, onCancel, onConfirm }: EndStudyConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      {/* 팝업 뒤 배경을 반투명 검정으로 덮어서 팝업에 집중되도록 한다. */}
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalCard}>
          <ThemedText type="subtitle" style={styles.modalTitle}>
            학습을 종료하시겠습니까?
          </ThemedText>
          <ThemedText style={styles.modalMessage}>
            현재 진행 중인 타이머가 종료됩니다. 오늘의 집중 기록은 유지됩니다.
          </ThemedText>
          <ThemedView style={styles.modalButtonRow}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <ThemedText style={styles.buttonText}>취소</ThemedText>
            </Pressable>
            <Pressable style={[styles.button, styles.endButton]} onPress={onConfirm}>
              <ThemedText style={styles.buttonText}>종료</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#687076',
  },
  endButton: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
