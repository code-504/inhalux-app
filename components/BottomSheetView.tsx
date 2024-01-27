import React, { ReactElement, memo, useEffect, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MontserratSemiText } from "./StyledText";
import { BottomSheetViewPorps } from "@/interfaces/Location";
import { useLocationStore } from "@/stores/location";
//import { SEARCH_HANDLE_HEIGHT } from '@gorhom/bottom-sheet-example-app';
//import { LOCATION_DETAILS_HEIGHT } from '../locationDetails';

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const BottomSheetView = ({
    animatedPosition,
    children,
}: BottomSheetViewPorps) => {
    console.log("Lol xlos");

    // hooks
    const [bottomSheetState] = useLocationStore((state) => [
        state.bottomSheetState,
    ]);
    const { bottom: bottomSafeArea } = useSafeAreaInsets();

    // styles
    const lockedYPosition = useMemo(
        () => SCREEN_HEIGHT - bottomSafeArea - bottomSheetState.lockPosition,
        [bottomSafeArea, bottomSheetState.lockPosition]
    );
    const containerAnimatedStyle = useAnimatedStyle(
        () => ({
            transform: [
                {
                    translateY:
                        animatedPosition.value > lockedYPosition
                            ? animatedPosition.value - bottomSheetState.position
                            : lockedYPosition - bottomSheetState.position,
                },
            ],
        }),
        [lockedYPosition, bottomSheetState.position]
    );

    const containerStyle = useMemo(
        () => [styles.container, containerAnimatedStyle],
        [containerAnimatedStyle]
    );

    return <Animated.View style={containerStyle}>{children}</Animated.View>;
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        right: 12,
        padding: 2,
        marginTop: 0,
    },
    label: {
        fontSize: 16,
        lineHeight: 16,
    },
});

export default memo(BottomSheetView);
