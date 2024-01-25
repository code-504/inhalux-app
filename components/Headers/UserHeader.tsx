import { View, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "tamagui";
import Colors from "@/constants/Colors";
import { MontserratBoldText, MontserratText } from "../StyledText";
import { useUserData } from "@/api/user";
import { Link } from "expo-router";

import SettingsIcon from "@/assets/icons/settings_bold.svg";

interface UserHeaderProps {
    showUserName: boolean;
    transparent?: boolean;
    children: JSX.Element | JSX.Element[];
}

const UserHeader = ({
    showUserName,
    children,
    transparent,
}: UserHeaderProps) => {
    const { data } = useUserData();
    const transparentView = transparent || false;

    return (
        <SafeAreaView
            style={[
                styles.safeAre,
                {
                    backgroundColor: transparentView
                        ? "transparent"
                        : Colors.lightGrey,
                },
            ]}
        >
            <View style={styles.header}>
                <View style={styles.containerView}>
                    <Link href="/configuration">
                        <View style={styles.avatarWrap}>
                            <Avatar size="$6" circular>
                                <Avatar.Image
                                    accessibilityLabel="Cam"
                                    src={data?.avatar}
                                />
                                <Avatar.Fallback
                                    backgroundColor={Colors.darkGray}
                                />
                            </Avatar>

                            <View style={styles.avatarGear}>
                                <SettingsIcon />
                            </View>
                        </View>
                    </Link>

                    {showUserName && (
                        <View style={styles.headerTitleView}>
                            <MontserratText
                                style={styles.headerTitleWellcomeText}
                            >
                                Bienvenido 👋
                            </MontserratText>
                            <MontserratBoldText
                                style={styles.headerTitleNameText}
                                numberOfLines={1}
                            >
                                {data?.name || "Conectando..."}
                            </MontserratBoldText>
                        </View>
                    )}
                </View>

                <View>{children}</View>
            </View>
        </SafeAreaView>
    );
};

export default UserHeader;

const styles = StyleSheet.create({
    safeAre: {
        paddingHorizontal: 24,
    },
    containerView: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    headerTitleView: {
        display: "flex",
        flexDirection: "column",
        marginLeft: 16,
    },
    headerTitleWellcomeText: {
        color: Colors.light.grayText,
        fontSize: 14,
        marginBottom: 2,
    },
    headerTitleNameText: {
        color: Colors.light.text,
        fontSize: 16,
        width: Dimensions.get("window").width - 210,
    },
    avatarWrap: {
        position: "relative",
    },
    avatarGear: {
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        right: 0,
        bottom: 0,
        backgroundColor: Colors.white,
        borderRadius: 100,
        width: 22,
        height: 22,
    },
});
