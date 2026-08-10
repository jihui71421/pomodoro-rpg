import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EXP_TO_NEXT_LEVEL } from '@/storage/leveling';

type LevelStatusProps = {
  // 캐릭터의 현재 레벨
  level: number;
  // 현재 레벨 안에서 쌓은 경험치 (0 ~ EXP_TO_NEXT_LEVEL 사이 값)
  exp: number;
};

// 홈 화면 상단에 캐릭터의 현재 레벨과 경험치를 보여주는 컴포넌트.
// 아직 캐릭터 이미지나 레벨업 연출은 없지만, 나중에 "캐릭터 정보"를 추가하기 쉽도록
// 레벨/경험치 표시만 담당하는 컴포넌트로 미리 분리해두었다.
export function LevelStatus({ level, exp }: LevelStatusProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.levelText}>Lv. {level}</ThemedText>
      {/* 예: exp가 35면 "EXP 35 / 100" 처럼 보여준다. */}
      <ThemedText style={styles.expText}>
        EXP {exp} / {EXP_TO_NEXT_LEVEL}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  levelText: {
    fontSize: 22,
    fontWeight: '700',
  },
  expText: {
    opacity: 0.8,
  },
});
