import React, { useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

const TabSwitcher = () => {
  const selectedIndex = useSharedValue(0);
  const translateX = useSharedValue(0);

  const firstTabRef = useRef<TapGestureHandler>(null);
  const secondTabRef = useRef<TapGestureHandler>(null);

  const handleTabPress = (index: number) => {
    selectedIndex.value = withTiming(index, { duration: 300, easing: Easing.ease });

    if (index === 1) {
      translateX.value = withSpring(1, {}, () => {
        translateX.value = 0;
      });
    } else {
      translateX.value = withSpring(0);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          width: 200,
          height: 40,
          borderRadius: 20,
          overflow: 'hidden',
          flexDirection: 'row',
        }}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: 20,
            transform: [{ translateX: translateX }],
          }}
        />
        <Animated.View
          style={{
            flexDirection: 'row',
          }}
        >
          <TapGestureHandler
            ref={firstTabRef}
            onHandlerStateChange={(event) =>
              event.nativeEvent.state === State.END && handleTabPress(0)
            }
          >
            <Animated.View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'red' }}>Tab 1</Text>
            </Animated.View>
          </TapGestureHandler>
          <TapGestureHandler
            ref={secondTabRef}
            onHandlerStateChange={(event) =>
              event.nativeEvent.state === State.END && handleTabPress(1)
            }
          >
            <Animated.View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'red' }}>Tab 2</Text>
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </View>
    </View>
  );
};

export default TabSwitcher;