import { StyleSheet, Text, View } from 'react-native';

import { StarIcon } from '@/components/pomodoro/pixel-icons';
import { RPGColors, RPGMetrics } from '@/constants/theme';

type LevelStatusProps = {
  // 캐릭터의 현재 레벨
  level: number;
};

// Figma Make 원본 헤더 오른쪽(⭐ + "LV.N")을 그대로 옮긴 것.
// 헤더 왼쪽("POMO RPG" 타이틀)은 app/(tabs)/index.tsx가 직접 조립한다.
export function LevelStatus({ level }: LevelStatusProps) {
  return (
    <View style={styles.row}>
      <StarIcon />
      <Text style={styles.level}>LV.{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  level: {
    color: RPGColors.gold,
    fontWeight: '700',
    fontSize: RPGMetrics.fontSize.heading - 2,
    letterSpacing: 1,
  },
});
