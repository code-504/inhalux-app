import React, { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BlurredBackgroundProps } from "@/interfaces/BlurredBackground";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BlurredBackground = memo((props: BlurredBackgroundProps) => {
    const { bottom } = useSafeAreaInsets();
    const backgroundColor = useMemo(
        () => props.backgroundColor || Colors.black,
        [props.backgroundColor]
    );
    const opacity = useMemo(() => props.opacity || 0.2, [props.opacity]);

    const containerStyle = useMemo(
        () => [
            styles.container,
            {
                backgroundColor,
                opacity,
                marginBottom: bottom,
            },
        ],
        [backgroundColor, opacity, bottom]
    );

    return <BottomSheetBackdrop {...props} style={containerStyle} />;
});

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: "hidden",
    },
});

export default BlurredBackground;
