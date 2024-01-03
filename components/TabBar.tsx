import Colors from '@/constants/Colors';
import React, { useRef, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent, TouchableHighlightBase, Dimensions, Keyboard } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { MontserratSemiText } from './StyledText';
import { Button } from 'tamagui';
import { FlatList } from 'react-native-gesture-handler';
import Ripple from 'react-native-material-ripple';
import { FlashList } from '@shopify/flash-list';

interface Tab {
	name: string
	Icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>
	Component: JSX.Element
}

interface TabBarProps {
  tabs: Tab[]
}

const { width: screenWidth } = Dimensions.get('window');
const SPACING = 12;
const ITEM_WIDTH = screenWidth;

function TabBar({ tabs }: TabBarProps) {
	const [activeTab, setActiveTab] = useState(0);
	const [ width, setWidth ] = useState<number>(0);
	const translateX = useSharedValue(2);
	const flashListRef = useRef<FlashList<any>>(null);

	const handleTabPress = (index: number) => {
		Keyboard.dismiss();

		setActiveTab(index);

		scrollToIndex(index)
		
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

	const scrollToIndex = (index:number) => {
		flashListRef.current?.scrollToIndex({ index: index, animated: true })
	};

	return (
		<View>
			<View style={styles.tabView}>
				<View style={styles.container}>
					<View style={styles.tabsContainer}>
						{tabs.map((tab, index) => (
		
							<Ripple
								key={index}
								onTouchStart={() => handleTabPress(index)}
								style={[styles.tab]}
							>
									<tab.Icon />
									<MontserratSemiText>{tab.name}</MontserratSemiText>
							</Ripple>
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
			</View>
			
				<FlashList 
					ref={flashListRef}
					data={tabs}
					keyExtractor={(item: any) => item.id}
					horizontal
					showsHorizontalScrollIndicator={false}
					scrollEnabled={false}
					pagingEnabled
					decelerationRate={0}
					snapToInterval={ITEM_WIDTH}
					snapToAlignment={"center"}
					scrollEventThrottle={16}
					estimatedItemSize={ITEM_WIDTH}
					renderItem={( { item, index } ) => {
						return (
							<View style={{ width: ITEM_WIDTH, marginTop: 20, height: "100%"}}>
								<RenderItem item={ item } />
							</View>
						);
					}}
				/>
				<View style={styles.background}></View>
		
			{ /*tabComponents[activeTab] && tabComponents[activeTab]*/ }
		</View>
	);
};

const RenderItem = ({ item }: any) => {
	return item.Component
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
	alignItems: "center",
	width: "100%",
	height: 64,
	padding: 2,
	marginTop: 16,
    marginBottom: 8,
	borderRadius: 100,
	backgroundColor: Colors.white
  },
  tabView: {
	width: "100%",
	paddingHorizontal: 24,
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
	height: 62,
	borderRadius: 100,
	overflow: "hidden",
	gap: 8
  },
  activeTab: {
    borderBottomColor: 'blue', // Cambia el color activo según tus preferencias
  },
  tabText: {
    fontSize: 14,
  },
  background: { 
	position: "absolute",
	top: 0,
	width: "100%",
	backgroundColor: Colors.white, 
	marginTop: 200,
	height: "100%" ,
	zIndex: -1,
	borderTopLeftRadius: 38,
        borderTopRightRadius: 38,
  }
});

export default TabBar;