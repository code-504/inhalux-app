import { View, Keyboard, StyleSheet } from 'react-native'
import React, { Dispatch, SetStateAction, memo, useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView } from 'tamagui';
import Ripple from 'react-native-material-ripple';
import Colors from '@/constants/Colors';
import { MontserratSemiText } from '@/components/StyledText';

interface TagSelectProps {
    tags: Tag[];
    onTabChange ?: (index: number) => void;
}

export interface Tag {
    label: string;
    value: string;
}

const TagSelect = ({ tags, onTabChange }: TagSelectProps) => {

    const [activeTab, setActiveTab] = useState(0);
    
    const handleTabPress = useCallback(
        (index: number) => {
          Keyboard.dismiss();
          setActiveTab(index);
          onTabChange  && onTabChange(index);
        },
        [onTabChange]
    );

    return (
        <View>
            <View style={{ borderRadius: 100 }}>
                <ScrollView 
                    style={{ borderRadius: 1000 }}
                    contentContainerStyle={styles.container}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={styles.tabsContainer}>
                        {
                            tags.map((item, index) => (
                                <Ripple
                                    key={index}
                                    onTouchEnd={() => handleTabPress(index)}
                                    style={[styles.tab, { backgroundColor: activeTab === index ? Colors.white : Colors.lightGrey }]}
                                >
                                        <MontserratSemiText>{item.label}</MontserratSemiText>
                                </Ripple>
                            ))
                        }
                    </View>
                </ScrollView>
            </View>

        </View>
    )
}

export default memo(TagSelect)

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
        backgroundColor: Colors.lightGrey
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
    scrollContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 24,
        height: "auto",
    },
});