import { Image, StyleSheet } from 'react-native';

type CharacterProps = {
  // 현재 캐릭터 레벨. 이 값에 따라 진화 단계별 PNG를 골라 보여준다.
  level: number;
};

// Figma Make에서 추출한 4단계 진화 슬라임 PNG(투명 배경, 512x512).
// require()는 정적 경로만 허용되므로 동적으로 조합하지 않고 4개를 각각 명시한다.
const CHARACTER_ASSETS = {
  1: require('@/assets/characters/slime-lv1.png'),
  5: require('@/assets/characters/slime-lv5.png'),
  10: require('@/assets/characters/slime-lv10.png'),
  20: require('@/assets/characters/slime-lv20.png'),
} as const;

// Lv.1~4 -> lv1, Lv.5~9 -> lv5, Lv.10~19 -> lv10, Lv.20+ -> lv20
function getCharacterAsset(level: number) {
  if (level >= 20) return CHARACTER_ASSETS[20];
  if (level >= 10) return CHARACTER_ASSETS[10];
  if (level >= 5) return CHARACTER_ASSETS[5];
  return CHARACTER_ASSETS[1];
}

// Figma Make 원본 캐릭터 디자인을 그대로 담은 PNG 에셋을 표시하는 컴포넌트.
// 기존 PixelCharacter(SVG)는 다른 화면(캘린더, 학습 종료 확인 모달)에서 계속 쓰이므로
// 그대로 두고, 레벨에 따라 진화하는 홈 화면 캐릭터만 이 컴포넌트로 새로 분리했다.
export function Character({ level }: CharacterProps) {
  return (
    <Image
      source={getCharacterAsset(level)}
      style={styles.image}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    // 기존 PixelCharacter(SVG)가 차지하던 64x64 영역과 동일하게 맞춰
    // 캐릭터 교체로 인한 레이아웃 변화가 없도록 한다. 원본이 정사각형(512x512)이므로
    // width/height를 같은 값으로 두면 비율이 왜곡되지 않는다.
    width: 64,
    height: 64,
  },
});
