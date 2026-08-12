import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { RPGColors, RPGMetrics } from '@/constants/theme';

type StatBarProps = {
  // 게이지 왼쪽에 보여줄 아이콘 (HeartIcon/PotionIcon/StarIcon 등)
  icon: ReactNode;
  // 아이콘 옆 짧은 이름 (예: 'HP', 'MP', 'EXP')
  label: string;
  // 현재 값 / 최대 값
  value: number;
  max: number;
  // 채워지는 막대 색
  color: string;
};

// Figma Make 원본(App.tsx)의 PixelBar 컴포넌트를 그대로 옮긴 것.
// 아이콘 + 라벨 + 트랙(.bar-container) + 채움(.bar-fill, 위쪽에 밝은 하이라이트 줄) + 수치 순서로 배치한다.
export function StatBar({ icon, label, value, max, color }: StatBarProps) {
  const percent = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;

  return (
    <View style={styles.row}>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%`, backgroundColor: color }]}>
          {/* 원본 .bar-fill::after: 채워진 막대 위쪽에 밝은 하이라이트 줄 */}
          <View style={styles.fillHighlight} />
        </View>
      </View>
      <Text style={styles.value}>
        {value}/{max}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 16,
    alignItems: 'center',
  },
  label: {
    minWidth: 28,
    color: RPGColors.textDim,
    fontSize: RPGMetrics.fontSize.barLabel,
    fontWeight: '700',
  },
  track: {
    flex: 1,
    height: 14,
    backgroundColor: '#111111',
    borderWidth: 2,
    borderColor: '#000000',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  fillHighlight: {
    position: 'absolute',
    top: 2,
    left: 4,
    right: 4,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  value: {
    minWidth: 44,
    textAlign: 'right',
    color: '#cccccc',
    fontSize: RPGMetrics.fontSize.barValue,
  },
});
