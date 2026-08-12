import { StyleSheet, View, type ViewProps } from 'react-native';

import { RPGColors, RPGMetrics } from '@/constants/theme';

// Figma Make 원본의 .pixel-panel을 옮긴 컨테이너.
// 원본은 3px 테두리 + inset 박스섀도우(좌상단 밝게/우하단 어둡게) + 바깥 2px 검정 링,
// 총 3겹으로 이루어진 프레임이다. RN은 inset box-shadow를 지원하지 않아서,
//   - 바깥 검정 링  -> outer(패딩만큼 검정 배경을 보여주는 바깥 View)
//   - 안쪽 3px 테두리 + 베벨 -> inner(변마다 다른 색의 테두리)
// 두 겹의 View로 근사했다.
export function PixelPanel({ style, children, ...rest }: ViewProps) {
  return (
    <View style={styles.outer}>
      <View style={[styles.inner, style]} {...rest}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    // 폭을 명시하지 않으면 부모(alignItems:'center')가 이 View를 늘려주지 않고,
    // 안쪽 inner의 width:'100%'가 무엇의 100%인지 모호해져서 실제 기기 폭과
    // 다르게 계산되는 문제가 있었다. 100%로 고정해서 그 모호함을 없앤다.
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: RPGMetrics.outerBorderWidth,
  },
  inner: {
    backgroundColor: RPGColors.panel,
    borderWidth: RPGMetrics.borderWidth,
    borderColor: RPGColors.border,
    // 좌상단은 밝게, 우하단은 어둡게 해서 베벨(입체) 느낌을 낸다.
    borderTopColor: 'rgba(255,255,255,0.15)',
    borderLeftColor: 'rgba(255,255,255,0.15)',
    borderRightColor: 'rgba(0,0,0,0.4)',
    borderBottomColor: 'rgba(0,0,0,0.4)',
  },
});
