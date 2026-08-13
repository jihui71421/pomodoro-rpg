import { StyleSheet, Text, View } from 'react-native';

import { StarIcon } from '@/components/pomodoro/pixel-icons';
import { PixelPanel } from '@/components/pomodoro/pixel-panel';
import { StatBar } from '@/components/pomodoro/stat-bar';
import { RPGColors } from '@/constants/theme';
import { EXP_TO_NEXT_LEVEL } from '@/storage/leveling';

type GrowthSummaryProps = {
  level: number;
  // 현재 레벨 안에서 쌓은 경험치(0 ~ EXP_TO_NEXT_LEVEL). storage/leveling.ts의 규칙을 그대로 따른다.
  exp: number;
};

// 통계 화면 하단의 "캐릭터 성장" 카드.
// 레벨업 계산은 하지 않는다 — hooks/use-study-statistics.ts가 AsyncStorage에서 읽어온
// level/exp를 그대로 받아서, 홈 화면(components/pomodoro/character-panel.tsx)과 동일한
// StatBar로 보여주기만 한다.
export function GrowthSummary({ level, exp }: GrowthSummaryProps) {
  const expToNextLevel = Math.max(0, EXP_TO_NEXT_LEVEL - exp);

  return (
    <PixelPanel style={styles.container}>
      <View style={styles.titleRow}>
        <StarIcon />
        <Text style={styles.title}>캐릭터 성장</Text>
        <Text style={styles.level}>LV.{level}</Text>
      </View>

      <StatBar icon={<StarIcon />} label="EXP" value={exp} max={EXP_TO_NEXT_LEVEL} color={RPGColors.exp} />

      <Text style={styles.nextLevel}>다음 레벨까지 {expToNextLevel} EXP</Text>
    </PixelPanel>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 480,
    padding: 20,
    gap: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    color: RPGColors.gold,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  level: {
    color: RPGColors.gold,
    fontSize: 13,
    fontWeight: '700',
  },
  nextLevel: {
    color: RPGColors.textDim,
    fontSize: 12,
    textAlign: 'right',
  },
});
