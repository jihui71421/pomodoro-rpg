/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// POMO RPG 홈 화면 전용 디자인 토큰.
// 위 Colors/Fonts는 탭 바 등 앱 전체에서 계속 쓰이므로 그대로 두고,
// RPG 스타일을 적용하는 화면(우선 홈 화면)에서만 이 토큰을 사용한다.
//
// 값 자체는 Figma Make 원본 소스(index.css의 :root 변수)를 그대로 옮겨왔다.
// 새로 디자인한 색이 아니라, 원본 --rpg-* 변수와 1:1로 대응된다.
export const RPGColors = {
  background: '#0d0d1a', // --rpg-bg
  panel: '#1a1a2e', // --rpg-panel
  border: '#4a3f6b', // --rpg-border
  borderLight: '#7c6fa0', // --rpg-border-light
  gold: '#ffd700', // --rpg-gold
  hp: '#e53935', // --rpg-hp
  mp: '#1e88e5', // --rpg-mp
  exp: '#fbc02d', // --rpg-exp
  text: '#e8e0ff', // --rpg-text
  textDim: '#9e8fc8', // --rpg-text-dim
  // 포모도로 모드에 따라 바뀌는 캐릭터/타이머 색 (원본 slimeColor 로직과 동일)
  characterFocus: '#42a5f5',
  characterBreak: '#66bb6a',
};

export type RPGButtonVariant = 'blue' | 'gold' | 'gray' | 'purple' | 'red';

// 원본 index.css의 .pixel-btn-blue/-gold/-gray/-purple/-red 색상을 그대로 옮겼다.
// (background, border-color, box-shadow의 그림자색)
export const RPGButtonVariants: Record<RPGButtonVariant, { background: string; border: string; shadow: string }> = {
  blue: { background: '#1565c0', border: '#90caf9', shadow: '#0d47a1' },
  gold: { background: '#f57f17', border: '#ffe082', shadow: '#e65100' },
  gray: { background: '#37474f', border: '#90a4ae', shadow: '#263238' },
  purple: { background: '#6a1b9a', border: '#ce93d8', shadow: '#38006b' },
  red: { background: '#c62828', border: '#ef9a9a', shadow: '#7f0000' },
};

// 픽셀 RPG 느낌에 필요한 공통 치수 값. 원본 CSS 값과 최대한 맞췄다.
export const RPGMetrics = {
  // .pixel-panel/.pixel-btn의 안쪽 테두리 두께
  borderWidth: 3,
  // .pixel-panel/.pixel-btn 바깥의 검정 링(0 0 0 2px #000) 두께
  outerBorderWidth: 2,
  // 픽셀 버튼 아래쪽 offset(그림자) 두께. 누르면 이 값만큼 버튼이 내려간다.
  buttonOffset: 4,
  screenPadding: 16,
  panelGap: 16,
  fontSize: {
    // PixelBar 아이콘 옆 라벨 (HP/MP/EXP)
    barLabel: 8,
    // PixelBar 오른쪽 수치 (value/max)
    barValue: 9,
    // 모드 라벨("집중 시간"/"휴식 시간")
    modeLabel: 13,
    // 헤더 타이틀/레벨, 버튼 텍스트
    heading: 10,
    // 타이머 숫자의 최소/최대 크기 (원본 clamp(42px, 12vw, 64px) 근사)
    timerMin: 42,
    timerMax: 64,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
