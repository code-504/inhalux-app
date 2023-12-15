import React, { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Colors from '@/constants/Colors';
import { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BlurredDeviceBackground = (props: BottomSheetBackdropProps) => {
  const insets = useSafeAreaInsets();
  
  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        top: insets.top - 60
      },
      {
        backgroundColor: Colors.black,
        opacity: 0.2,
      },
    ],
    [Colors.black]
  );
  return Platform.OS === 'ios' ? (
    <View style={styles.container}>
      <BlurView blurType="chromeMaterial" style={styles.blurView} />
    </View>
  ) : (
    <BottomSheetBackdrop
         {...props}
         pressBehavior={'close'}
         appearsOnIndex={0}
         disappearsOnIndex={-1}
         style={containerStyle}
      />
  );
};

const styles = StyleSheet.create({
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    position: 'absolute', 
    left: 0, 
    right: 0, 
  },
});

export default BlurredDeviceBackground;