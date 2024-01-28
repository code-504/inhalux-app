import Colors from "@/constants/Colors";
import React, { useRef, useState } from "react";
import {
    View,
    StyleSheet,
    LayoutChangeEvent,
    TouchableHighlightBase,
    Dimensions,
    Keyboard,
    TouchableOpacity,
    Pressable,
} from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { MontserratSemiText } from "./StyledText";
import { Button, ScrollView } from "tamagui";
import Ripple from "react-native-material-ripple";

interface TabProps {
    children: React.ReactElement<Tab> | React.ReactElement<Tab>[];
}

interface Tab {
    title: string;
    Icon?: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    children: JSX.Element | JSX.Element[];
}

const { width: screenWidth } = Dimensions.get("window");

const SPACING = 24;
const ITEM_WIDTH = screenWidth - SPACING * 2;

function TabBarMultiple({ children }: TabProps) {
    const [activeTab, setActiveTab] = useState(0);
    const scrollViewRef = useRef<ScrollView>();
    const scrollViewTabRef = useRef<ScrollView>();
    const [buttonLayout, setButtonLayout] = useState<Array<number>>([]);

    const handleTabPress = (index: number) => {
        Keyboard.dismiss();

        setActiveTab(index);
        //scrollToIndexTab(index);
        scrollToIndex(index);
    };

    /*const scrollToIndexTab = (index:number) => {
        let newScrollX = buttonLayout[index];
        scrollViewTabRef.current?.scrollTo({x: newScrollX - 24, y: 0, animated: true,});
	};*/

    const scrollToIndex = (index: number) => {
        let newScrollX = ITEM_WIDTH * index + 24 * index;
        scrollViewRef.current?.scrollTo({
            x: newScrollX,
            y: 0,
            animated: true,
        });
    };

    /*const handleLayout = (event: LayoutChangeEvent) => {
		const { x } = event.nativeEvent.layout;
        let numbers = buttonLayout;
        numbers.push(x)
		setButtonLayout(numbers)
	};*/

    return (
        <View>
            <View style={{ borderRadius: 100 }}>
                <ScrollView
                    ref={scrollViewTabRef}
                    style={{ borderRadius: 1000 }}
                    contentContainerStyle={styles.container}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={styles.tabsContainer}>
                        {React.Children.map(children, (child, index) => (
                            <Ripple
                                key={index}
                                onTouchEnd={() => handleTabPress(index)}
                                style={[
                                    styles.tab,
                                    {
                                        backgroundColor:
                                            activeTab === index
                                                ? Colors.white
                                                : Colors.lightGrey,
                                    },
                                ]}
                            >
                                {child.props.Icon && (
                                    <child.props.Icon fill={Colors.black} />
                                )}
                                <MontserratSemiText>
                                    {child.props.title}
                                </MontserratSemiText>
                            </Ripple>
                        ))}
                    </View>
                </ScrollView>
            </View>

            <ScrollView
                ref={scrollViewRef}
                automaticallyAdjustContentInsets={false}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                directionalLockEnabled={true}
                scrollsToTop={false}
                scrollEnabled={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {React.Children.map(children, (child) => child)}
            </ScrollView>
        </View>
    );
}

const Item = ({ children }: Tab) => {
    return <View style={{ width: ITEM_WIDTH, marginTop: 32 }}>{children}</View>;
};

TabBarMultiple.Item = Item;

export default TabBarMultiple;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        height: 64,
    },
    tabsContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 4,
        padding: 4,
        borderRadius: 1000,
        backgroundColor: Colors.lightGrey,
    },
    tab: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 56,
        borderRadius: 100,
        paddingHorizontal: 16,
        overflow: "hidden",
        gap: 16,
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
        height: "100%",
        zIndex: -1,
        borderTopLeftRadius: 38,
        borderTopRightRadius: 38,
    },
    scrollContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 24,
        height: "auto",
    },
});
