import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { RPGColors, RPGMetrics } from '@/constants/theme';

// 버튼을 누를 때마다 id를 새로 발급해서 같은 문구를 연달아 눌러도(예: 리셋 두 번 연속)
// 애니메이션이 처음부터 다시 재생되도록 한다. Animated.View의 key로 쓰여서, id가
// 바뀌면 컴포넌트가 다시 마운트되며 CSS 애니메이션도 0%부터 새로 시작된다.
export type BubbleTrigger = { text: string; id: number };

type SpeechBubbleProps = {
  trigger: BubbleTrigger | null;
};

// 전체 표시 시간(등장~소멸, ms). 요구사항(약 1~1.5초 표시 후 소멸)에 맞춘 값.
const BUBBLE_DURATION_MS = 1500;

// 시작/일시정지/리셋 버튼을 누르면 캐릭터 위에 잠깐 떴다가 사라지는 픽셀 스타일 말풍선.
// character.tsx의 idle 모션과 동일하게, 이 프로젝트에서 이미 쓰고 있는 reanimated의
// CSS 스타일 animationName 방식(hello-wave.tsx 참고)을 사용한다.
export function SpeechBubble({ trigger }: SpeechBubbleProps) {
  // 한 번도 버튼을 누르기 전에는 보여줄 문구 자체가 없으므로 렌더링하지 않는다.
  if (!trigger) return null;

  return (
    <Animated.View
      // key가 바뀌면 매번 새로 마운트되어 애니메이션이 처음부터 다시 재생된다.
      key={trigger.id}
      style={[
        styles.anchor,
        {
          // 애니메이션이 끝난 뒤(fill-mode가 적용되지 않는 환경 대비)에도 최종 프레임과
          // 같은 값(opacity 0)으로 남도록 기본 스타일도 투명하게 맞춰둔다.
          opacity: 0,
          animationName: {
            '0%': { opacity: 0, transform: [{ translateY: 6 }] },
            '15%': { opacity: 1, transform: [{ translateY: 0 }] },
            '80%': { opacity: 1, transform: [{ translateY: 0 }] },
            '100%': { opacity: 0, transform: [{ translateY: -6 }] },
          },
          animationDuration: `${BUBBLE_DURATION_MS}ms`,
          animationTimingFunction: 'ease-in-out',
          animationFillMode: 'forwards',
          pointerEvents: 'none',
        },
      ]}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{trigger.text}</Text>
      </View>
      <View style={styles.tail} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    // 캐릭터(부모의 position:'relative' 기준) 바로 위, 가운데 정렬.
    // left/right를 캐릭터 폭보다 넓게 잡아 말풍선이 옆으로 넘쳐도 안 잘리게 한다.
    position: 'absolute',
    bottom: '100%',
    left: -120,
    right: -120,
    marginBottom: 10,
    alignItems: 'center',
    zIndex: 20,
  },
  bubble: {
    backgroundColor: RPGColors.panel,
    borderWidth: RPGMetrics.borderWidth,
    borderColor: RPGColors.gold,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  text: {
    color: RPGColors.gold,
    fontSize: RPGMetrics.fontSize.heading,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // 말풍선 아래 꼬리: 정사각형을 45도 회전시켜 다이아몬드 모양으로 만들고
  // 위쪽 절반만 bubble과 겹치도록 올려붙여서 아래를 향한 삼각형 꼬리처럼 보이게 한다.
  tail: {
    width: 10,
    height: 10,
    marginTop: -6,
    backgroundColor: RPGColors.panel,
    borderRightWidth: RPGMetrics.borderWidth,
    borderBottomWidth: RPGMetrics.borderWidth,
    borderColor: RPGColors.gold,
    transform: [{ rotate: '45deg' }],
  },
});
