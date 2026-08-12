import Svg, { Rect } from 'react-native-svg';

import { RPGColors } from '@/constants/theme';

type PixelCharacterProps = {
  // 지금이 집중 시간인지(true) 휴식 시간인지(false). 몸 색깔이 여기에 따라 바뀐다.
  // (Figma Make 원본의 slimeColor 로직: 집중=파랑, 휴식=초록). color를 직접 넘기면
  // 이 값은 무시된다. 생략 시 기본값은 true(집중=파랑).
  isFocusMode?: boolean;
  // 특정 색을 강제로 쓰고 싶을 때 지정한다 (예: 학습 종료 모달의 빨간 캐릭터).
  // 생략하면 isFocusMode에 따라 자동으로 파랑/초록이 선택된다.
  color?: string;
};

// Figma Make 원본(App.tsx)의 PixelSlime 컴포넌트를 그대로 옮긴 것.
// viewBox/좌표/색을 하나도 바꾸지 않았고, <svg><rect/> 태그를
// react-native-svg의 <Svg><Rect/>로만 옮겼다.
//
// 원본에는 blinking(눈 깜빡임) prop과 .float(부유)/.shake(흔들림) CSS 애니메이션이
// 있지만, 이번 단계는 "복잡한 애니메이션 추가 금지" 지침에 따라 정적인 버전만 구현했다.
export function PixelCharacter({ isFocusMode = true, color }: PixelCharacterProps) {
  const resolvedColor = color ?? (isFocusMode ? RPGColors.characterFocus : RPGColors.characterBreak);

  return (
    <Svg width={64} height={64} viewBox="0 0 16 16">
      {/* 몸통 */}
      <Rect x={4} y={6} width={8} height={7} fill={resolvedColor} />
      <Rect x={3} y={7} width={10} height={5} fill={resolvedColor} />
      <Rect x={2} y={8} width={12} height={3} fill={resolvedColor} />
      {/* 윗쪽 돔 */}
      <Rect x={5} y={4} width={6} height={3} fill={resolvedColor} />
      <Rect x={6} y={3} width={4} height={2} fill={resolvedColor} />
      <Rect x={7} y={2} width={2} height={2} fill={resolvedColor} />
      {/* 하이라이트 */}
      <Rect x={6} y={4} width={2} height={1} fill="rgba(255,255,255,0.5)" />
      {/* 눈 (항상 뜬 상태로 고정) */}
      <Rect x={5} y={9} width={2} height={2} fill="#111111" />
      <Rect x={9} y={9} width={2} height={2} fill="#111111" />
      <Rect x={5} y={9} width={1} height={1} fill="#ffffff" />
      <Rect x={9} y={9} width={1} height={1} fill="#ffffff" />
      {/* 발 */}
      <Rect x={4} y={13} width={2} height={1} fill={resolvedColor} />
      <Rect x={6} y={13} width={4} height={2} fill={resolvedColor} />
      <Rect x={10} y={13} width={2} height={1} fill={resolvedColor} />
      {/* 광택 */}
      <Rect x={7} y={5} width={1} height={1} fill="rgba(255,255,255,0.7)" />
    </Svg>
  );
}
