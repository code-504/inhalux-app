import React, { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { BlurredBackgroundProps } from '@/interfaces/BlurredBackground';

const BlurredBackground = memo((props: BlurredBackgroundProps) => {

	const containerStyle = useMemo(
		() => [
			styles.container,
			{
				backgroundColor: props.backgroundColor ? props.backgroundColor : Colors.black,
				opacity: props.opacity ? props.opacity : 0.2,
			},
		],
		[Colors.black, props.backgroundColor]
	);

	console.log("xd", props.name)

	return <BottomSheetBackdrop {...props} style={containerStyle} />
})

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

export default BlurredBackground;