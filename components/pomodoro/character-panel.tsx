import { StyleSheet, View } from 'react-native';

import { Character } from '@/components/pomodoro/character';
import { HeartIcon, PotionIcon, StarIcon } from '@/components/pomodoro/pixel-icons';
import { StatBar } from '@/components/pomodoro/stat-bar';
import { RPGColors } from '@/constants/theme';
import { EXP_TO_NEXT_LEVEL } from '@/storage/leveling';

type CharacterPanelProps = {
  // 현재 레벨 안에서 쌓은 경험치. usePomodoroTimer의 실제 exp 값을 그대로 받는다.
  exp: number;
  // 현재 캐릭터 레벨. Figma Make 진화 단계 PNG를 고르는 데 쓰인다.
  level: number;
};

// HP/MP는 아직 실제 게임 로직이 없으므로(이번 단계 범위 아님) 항상 가득 찬 값으로
// 장식용으로만 보여준다. Figma Make 원본도 hp/mp state를 앱 자체적으로 관리하지만,
// 현재 Expo 프로젝트에는 그 state가 없어서 고정값으로 대체했다.
const DECORATIVE_HP = 100;
const DECORATIVE_MP = 100;

// Figma Make 원본에서 상태 바(HP→MP→EXP) + 캐릭터가 놓이는 순서 그대로.
// 원본은 이 부분이 별도 패널이 아니라, 메인 패널(app/(tabs)/index.tsx가 감싸는
// PixelPanel) 안에 그냥 속해 있는 하나의 섹션이라서 여기서는 자체 테두리를 두지 않는다.
export function CharacterPanel({ exp, level }: CharacterPanelProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        <StatBar icon={<HeartIcon full={DECORATIVE_HP > 30} />} label="HP" value={DECORATIVE_HP} max={100} color={RPGColors.hp} />
        <StatBar icon={<PotionIcon />} label="MP" value={DECORATIVE_MP} max={100} color={RPGColors.mp} />
        <StatBar icon={<StarIcon />} label="EXP" value={exp} max={EXP_TO_NEXT_LEVEL} color={RPGColors.exp} />
      </View>

      <View style={styles.characterWrap}>
        <Character level={level} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  bars: {
    width: '100%',
    gap: 8,
    marginBottom: 20,
  },
  characterWrap: {
    marginBottom: 8,
  },
});
