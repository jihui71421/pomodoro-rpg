import Svg, { Rect } from 'react-native-svg';

// Figma Make 원본(App.tsx)의 SwordIcon/HeartIcon/StarIcon/PotionIcon <rect> 좌표를
// 그대로 옮긴 아이콘 세트. 새로 그린 아이콘이 아니라 원본 좌표를 react-native-svg의
// <Svg>/<Rect>로만 옮겨 적은 것이다 (숫자 하나도 바꾸지 않았다).

// 검 아이콘: 헤더 왼쪽("POMO RPG" 옆)에서 사용
export function SwordIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 8 8">
      <Rect x={3} y={0} width={2} height={5} fill="#90caf9" />
      <Rect x={3} y={5} width={2} height={1} fill="#ffd700" />
      <Rect x={1} y={5} width={6} height={1} fill="#ffd700" />
      <Rect x={3} y={6} width={2} height={2} fill="#a1887f" />
    </Svg>
  );
}

// 하트 아이콘: HP 게이지 + "오늘 완료한 집중 횟수" 하트 행에서 사용.
// full=false면 회색(빈 하트)으로 그려진다.
export function HeartIcon({ full = true }: { full?: boolean }) {
  const color = full ? '#e53935' : '#444444';
  return (
    <Svg width={12} height={12} viewBox="0 0 8 8">
      <Rect x={1} y={1} width={2} height={1} fill={color} />
      <Rect x={5} y={1} width={2} height={1} fill={color} />
      <Rect x={0} y={2} width={3} height={2} fill={color} />
      <Rect x={5} y={2} width={3} height={2} fill={color} />
      <Rect x={0} y={4} width={8} height={1} fill={color} />
      <Rect x={1} y={5} width={6} height={1} fill={color} />
      <Rect x={2} y={6} width={4} height={1} fill={color} />
      <Rect x={3} y={7} width={2} height={1} fill={color} />
    </Svg>
  );
}

// 별 아이콘: 헤더 오른쪽("LV.N" 옆) + EXP 게이지에서 사용
export function StarIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 8 8">
      <Rect x={3} y={0} width={2} height={2} fill="#ffd700" />
      <Rect x={0} y={3} width={8} height={2} fill="#ffd700" />
      <Rect x={2} y={1} width={4} height={5} fill="#ffd700" />
      <Rect x={1} y={5} width={2} height={2} fill="#ffd700" />
      <Rect x={5} y={5} width={2} height={2} fill="#ffd700" />
    </Svg>
  );
}

// 포션 아이콘: MP 게이지에서 사용
export function PotionIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 8 8">
      <Rect x={3} y={0} width={2} height={2} fill="#aaaaaa" />
      <Rect x={2} y={2} width={4} height={1} fill="#888888" />
      <Rect x={1} y={3} width={6} height={4} fill="#e040fb" />
      <Rect x={0} y={4} width={8} height={2} fill="#e040fb" />
      <Rect x={1} y={6} width={6} height={1} fill="#ce93d8" />
      <Rect x={2} y={4} width={1} height={1} fill="rgba(255,255,255,0.5)" />
    </Svg>
  );
}

// 달력 아이콘: 캘린더 화면의 선택일 상세 패널 제목 옆에서 사용.
// active=true면 골드, false면 어두운 보라색.
export function CalendarIcon({ active = false }: { active?: boolean }) {
  const color = active ? '#ffd700' : '#6a5f8a';
  return (
    <Svg width={20} height={20} viewBox="0 0 10 10">
      <Rect x={1} y={1} width={1} height={2} fill={color} />
      <Rect x={8} y={1} width={1} height={2} fill={color} />
      <Rect x={1} y={2} width={8} height={7} fill={color} />
      <Rect x={2} y={4} width={6} height={4} fill="#0d0d1a" />
      <Rect x={3} y={5} width={1} height={1} fill={color} />
      <Rect x={5} y={5} width={1} height={1} fill={color} />
      <Rect x={3} y={7} width={1} height={1} fill={color} />
    </Svg>
  );
}
