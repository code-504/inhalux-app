import React, { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Colors from '@/constants/Colors';
import { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useMonitor } from '@/context/MonitorProvider';

const BlurredMonitorBackground = (props: BottomSheetBackdropProps) => {
    const { setOptionsOpen } = useMonitor()

  const containerStyle = useMemo(
    () => [
      styles.container,
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
         onPress={() => setOptionsOpen(false)}
         pressBehavior={'collapse'}
         disappearsOnIndex={-1}
         appearsOnIndex={0}
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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
});

export default BlurredMonitorBackground;