import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent, TouchableHighlightBase } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { MontserratSemiText } from './StyledText';
import { Button } from 'tamagui';
import { FlatList } from 'react-native-gesture-handler';

interface Tab {
	name: string
	Icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>
	Component: JSX.Element
}

interface TabBarProps {
  tabs: Tab[]
}

function TabBar({ tabs }:TabBarProps) {
	const [activeTab, setActiveTab] = useState(0);
	const [ width, setWidth ] = useState<number>(0);
	const translateX = useSharedValue(2);

	const handleTabPress = (index: number) => {
		setActiveTab(index);
		
		translateX.value = withSpring(index * width + (index === 0 ? + 2 : 1), {
			duration: 1800,
			dampingRatio: 0.9,
			stiffness: 100,
			overshootClamping: false,
			restDisplacementThreshold: 0.01,
			restSpeedThreshold: 0.01,
		  })
	};

	const handleLayout = (event: LayoutChangeEvent) => {
		const { width } = event.nativeEvent.layout;
		setWidth(width);
	};

	const tabComponents = tabs.map((tab) => tab.Component);

	return (
		<View>
			<View style={styles.container}>
				<View style={styles.tabsContainer}>
					{tabs.map((tab, index) => (
					<View
						key={index}
						onTouchStart={() => handleTabPress(index)}
						style={[styles.tab, { opacity: index !== activeTab ? 0.7 : 1 }]}
					>
							<tab.Icon />
							<MontserratSemiText>{tab.name}</MontserratSemiText>
					</View>
					))}
				</View>

				<Animated.View
					onLayout={handleLayout}
					style={{
						width: "50%",
						height: 60,
						borderRadius: 100,
						backgroundColor: Colors.secondary, // Cambia el color del slider según tus preferencias
						position: 'absolute',
						zIndex: -1,
						transform: [{ translateX }]
					}}
				/>
			</View>

			{tabComponents[activeTab] && tabComponents[activeTab] }
		</View>
	);
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
	alignItems: "center",
	width: "100%",
	height: 64,
	padding: 2,
	marginTop: 16,
    marginBottom: 32,
	borderRadius: 100,
	backgroundColor: Colors.white
  },
  tabsContainer: {
	display: "flex",
	flexDirection: "row",
	gap: 2,
  },
  tab: {
	flex: 1,
	display: "flex",
	flexDirection: "row",
	justifyContent: "center",
	alignItems: "center",
	gap: 8
  },
  activeTab: {
    borderBottomColor: 'blue', // Cambia el color activo según tus preferencias
  },
  tabText: {
    fontSize: 14,
  }
});

export default TabBar;