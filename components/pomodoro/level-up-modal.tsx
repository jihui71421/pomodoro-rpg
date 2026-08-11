import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type LevelUpModalProps = {
  visible: boolean;
  level: number;
  onClose: () => void;
};

// 집중 완료로 실제 레벨업이 발생했을 때만 뜨는 축하 모달.
// 다크모드 여부와 상관없이 항상 밝은 톤을 유지해야 하므로,
// ThemedView/ThemedText 대신 고정 색상의 View/Text를 사용한다.
export function LevelUpModal({ visible, level, onClose }: LevelUpModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>LEVEL UP!</Text>
          <Text style={styles.levelText}>Lv.{level} 달성!</Text>
          <Text style={styles.message}>집중해서 새로운 레벨에 도달했어요.</Text>
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>확인</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    padding: 28,
    gap: 6,
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderWidth: 2,
    borderColor: '#facc15',
  },
  emoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#d97706',
    letterSpacing: 1,
  },
  levelText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#11181C',
  },
  message: {
    fontSize: 14,
    color: '#3a3a3a',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    backgroundColor: '#0a7ea4',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
