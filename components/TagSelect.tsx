import { View, Keyboard, StyleSheet, FlatList, Pressable } from "react-native";
import React, {
    Dispatch,
    SetStateAction,
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { ScrollView } from "tamagui";
import Ripple from "react-native-material-ripple";
import Colors from "@/constants/Colors";
import { MontserratSemiText, MontserratText } from "@/components/StyledText";

interface TagSelectProps {
    tags: Tag[];
    onTabChange?: (index: number) => void;
    renderTabs?: (
        tags: Tag[],
        handleTabPress: (index: number) => void,
        activeTab: number
    ) => React.ReactNode;
}

export interface Tag {
    label: string;
    value: string;
}

interface TabItemProps {
    index: number;
    handleTabPress: (index: number) => void;
    activeTab: number;
    label: string;
}

const TagSelect = ({ tags, onTabChange, renderTabs }: TagSelectProps) => {
    const [activeTab, setActiveTab] = useState<number>(0);

    const handleTabPress = useCallback(
        (index: number) => {
            Keyboard.dismiss();
            setActiveTab(index);
            onTabChange && onTabChange(index);
            console.log(index);
        },
        [onTabChange]
    );

    return renderTabs ? (
        <View style={{ height: 64, width: "100%" }}>
            {renderTabs(tags, handleTabPress, activeTab)}
        </View>
    ) : (
        <ScrollView
            style={{ borderRadius: 1000 }}
            contentContainerStyle={styles.container}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
        >
            <View style={styles.tabsContainer}>
                {tags.map((item, index) => (
                    <TabItem
                        key={index}
                        index={index}
                        activeTab={activeTab}
                        handleTabPress={handleTabPress}
                        label={item.label}
                    />
                ))}
            </View>
        </ScrollView>
    );
};

export const TabItem = memo(
    ({ index, handleTabPress, activeTab, label }: TabItemProps) => {
        return (
            <Pressable
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
                <MontserratSemiText>{label}</MontserratSemiText>
            </Pressable>
        );
    }
);

export default TagSelect;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        height: 64,
        gap: 4,
        padding: 4,
        backgroundColor: Colors.lightGrey,
    },
    tabsContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 4,
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
