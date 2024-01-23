import Colors from '@/constants/Colors';
import React, { memo, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Keyboard, FlatList } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { MontserratSemiText } from './StyledText';
import Ripple from 'react-native-material-ripple';

interface TabProps {
    children: React.ReactElement<Tab> | React.ReactElement<Tab>[],
    headerPadding ?: number
}

interface Tab {
    title: string;
    Icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    children: JSX.Element | JSX.Element[];
    height: number;
}

const { width: screenWidth } = Dimensions.get('window');

const SPACING = 24;
const ITEM_WIDTH = screenWidth;

const TabBar = memo(({ children, headerPadding }: TabProps) => {
    
    const [heightScroll, setHeightScroll] = useState<number>(0);
	const [ width, setWidth ] = useState<number>(0);
	const translateX = useSharedValue(2);
	const scrollViewRef = useRef<FlatList | null>(null);
    const hPadding = headerPadding ? headerPadding : 0;

    useEffect(() => {
        const selectedTab = React.Children.toArray(children)[0] as React.ReactElement<Tab>;
        setHeightScroll(selectedTab.props.height)
    }, [])

	const handleTabPress = (index: number) => {
		Keyboard.dismiss();

		//scrollToIndex(index)

        scrollViewRef.current?.scrollToIndex({ index, animated: true })

        const selectedTab = React.Children.toArray(children)[index] as React.ReactElement<Tab>;

        setHeightScroll(selectedTab.props.height)
		
		translateX.value = withSpring(index * width + (index === 0 ? + 4 : 4), {
			duration: 1800,
			dampingRatio: 0.9,
			stiffness: 100,
			overshootClamping: false,
			restDisplacementThreshold: 0.01,
			restSpeedThreshold: 0.01,
		});
	};

	const handleLayout = (event: { nativeEvent: { layout: { width: number } } }) => {
		const { width } = event.nativeEvent.layout;
		setWidth(width);
	};

	/*const scrollToIndex = (index:number) => {
        let newScrollX = index > 0 ? ITEM_WIDTH * index + 24 : ITEM_WIDTH * index;
        scrollViewRef.current?.scrollToOffset({ offset: newScrollX, animated: true });
	};*/

	return (
		<View>
			<View style={[styles.tabView, { paddingHorizontal: hPadding }]}>
				<View style={styles.container}>
					<View style={styles.tabsContainer}>
                        {React.Children.map(children, (child, index) => (
                            <Ripple
                                key={index}
                                onTouchEnd={() => handleTabPress(index)}
                                style={[styles.tab]}
                            >
                                <child.props.Icon fill={Colors.black} />
                                <MontserratSemiText>{child.props.title}</MontserratSemiText>
                            </Ripple>
                        ))}
					</View>

					<Animated.View
						onLayout={handleLayout}
						style={{
							width: "50%",
							height: 56,
							borderRadius: 100,
							backgroundColor: Colors.white,
							position: 'absolute',
							zIndex: -1,
							transform: [{ translateX }]
						}}
					/>
				</View>
			</View>

            <FlatList
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ height: heightScroll }}
                data={React.Children.toArray(children)}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => <React.Fragment>{item}</React.Fragment>}
                //initialNumToRender={1} // Adjust as needed
            />
		
			{/* tabComponents[activeTab] && tabComponents[activeTab] */}
		</View>
	);
});

const Item = memo(({ children }: Tab) => {
    
	return (
        <View style={{ width: ITEM_WIDTH }}>
            {children}
        </View>
    )
})

export default {
    TabBar: TabBar,
    Item: Item
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 64,
        padding: 4,
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 100,
        backgroundColor: Colors.lightGrey
    },
    tabView: {
        width: "100%",
    },
    tabsContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 4,
    },
    tab: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 56,
        borderRadius: 100,
        overflow: "hidden",
        gap: 16
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
    },
});