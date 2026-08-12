import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { RPGButtonVariants, RPGMetrics, type RPGButtonVariant } from '@/constants/theme';

type RPGButtonProps = {
  label: string;
  variant: RPGButtonVariant;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Figma Make 원본(index.css)의 .pixel-btn + .pixel-btn-* 을 옮긴 버튼.
// 구조: 그림자색 바탕(shadowWrapper)이 아래쪽 여백을 갖고, 그 위에 버튼 얼굴(face)이
// 얹혀서 "아래로 두껍게 튀어나온" 입체 버튼처럼 보인다. 원본 CSS의
// `box-shadow: 0 4px 0 그림자색` + `:active { box-shadow: 0 1px 0 그림자색; transform: translateY(3px) }`
// 을 그대로 흉내낸 것이다. 동작(onPress)은 그대로 전달만 하는 순수 표현용 컴포넌트다.
export function RPGButton({ label, variant, onPress, disabled, style }: RPGButtonProps) {
  const colors = RPGButtonVariants[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.shadowWrapper, { backgroundColor: colors.shadow }, style]}>
      {({ pressed }) => (
        <Text
          style={[
            styles.face,
            { backgroundColor: colors.background, borderColor: colors.border },
            pressed && styles.facePressed,
            disabled && styles.faceDisabled,
          ]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    alignSelf: 'flex-start',
    paddingBottom: RPGMetrics.buttonOffset,
  },
  face: {
    borderWidth: RPGMetrics.borderWidth,
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontWeight: '700',
    fontSize: RPGMetrics.fontSize.heading,
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
    overflow: 'hidden',
  },
  facePressed: {
    transform: [{ translateY: RPGMetrics.buttonOffset - 1 }],
  },
  faceDisabled: {
    opacity: 0.5,
  },
});
