import React, { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BlurredBackgroundProps } from "@/interfaces/BlurredBackground";

const BlurredBackground = memo((props: BlurredBackgroundProps) => {
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
            },
        ],
        [backgroundColor, opacity]
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
