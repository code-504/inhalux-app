import React, { ReactElement, useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MontserratSemiText } from './StyledText';
//import { SEARCH_HANDLE_HEIGHT } from '@gorhom/bottom-sheet-example-app';
//import { LOCATION_DETAILS_HEIGHT } from '../locationDetails';

interface BottomSheetViewPorps {
  animatedPosition: Animated.SharedValue<number>;
  animatedIndex: Animated.SharedValue<number>;
  children: JSX.Element | ReactElement | JSX.Element[] | ReactElement[] | null
}

const BottomSheetView = ({ animatedIndex, animatedPosition, children }: BottomSheetViewPorps) => {
  // hooks
  const { bottom: bottomSafeArea } = useSafeAreaInsets();

  // styles
  const lockedYPosition = useMemo(
    () =>
    bottomSafeArea,
    [bottomSafeArea]
  );
  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY:
            animatedPosition.value > lockedYPosition
              ? animatedPosition.value - 24
              : lockedYPosition - 24,
        },
      ],
    }),
    [lockedYPosition]
  );

  const containerStyle = useMemo(
    () => [
      styles.container,
      containerAnimatedStyle,
    ],
    [containerAnimatedStyle]
  );

  return (
    <Animated.View style={containerStyle}>
      { children }
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    top: -80,
    padding: 2,
    marginTop: 0,
  },
  label: {
    fontSize: 16,
    lineHeight: 16,
  },
});

export default BottomSheetView;