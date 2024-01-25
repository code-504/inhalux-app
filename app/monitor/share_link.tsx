import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Share,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
    Camera,
    Code,
    useCameraDevice,
    useCameraPermission,
    useCodeScanner,
} from "react-native-vision-camera";
import Colors from "@/constants/Colors";
import {
    MontserratBoldText,
    MontserratSemiText,
    MontserratText,
} from "@/components/StyledText";
import QRCode from "react-native-qrcode-svg";
import { Button, Spinner } from "tamagui";

import BackgroundImage from "@/assets/images/background.png";
import QRLogo from "@/assets/images/qr-logo.png";
import { useUserStore } from "@/stores/user";

const ScanPacientPage = () => {
    const { supaUser } = useUserStore();

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Monitorea mi cuenta de Inhalux usando el siguiente código: ${supaUser?.token}`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            console.log(error.message);
        }
    };

    return (
        <View style={styles.safeArea}>
            <ImageBackground
                source={BackgroundImage}
                style={styles.imageBackground}
            />

            <View style={{ flex: 1 }}>
                <View style={styles.upView}>
                    <MontserratBoldText
                        style={styles.title}
                    >{`Compartir \ntu cuenta`}</MontserratBoldText>
                    <MontserratSemiText style={styles.description}>
                        Muestra tu código QR o comparte el link
                    </MontserratSemiText>
                </View>

                <View style={styles.downView}>
                    <View style={styles.qrContent}>
                        <QRCode
                            value={supaUser?.token}
                            logo={QRLogo}
                            size={220}
                        />

                        <MontserratText style={styles.qrInfo}>
                            Cuando el código sea escaneado, se agregará en
                            automático a tu lista de monitores
                        </MontserratText>
                    </View>

                    <Button
                        onPress={onShare}
                        style={styles.loginButton}
                        borderRadius={32}
                        height={52}
                    >
                        <MontserratSemiText style={styles.loginText}>
                            Compartir link
                        </MontserratSemiText>
                    </Button>
                </View>
            </View>
        </View>
    );
};

export default ScanPacientPage;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: Colors.lightGrey,
    },
    imageBackground: {
        position: "absolute",
        resizeMode: "cover",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    content: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    upView: {
        flex: 0.3,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginTop: 80,
        paddingTop: 48,
        //paddingBottom: 24,
        paddingHorizontal: 24,
    },
    downView: {
        flex: 0.7,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: Colors.white,
        borderTopLeftRadius: 38,
        borderTopRightRadius: 38,
        paddingTop: "22%",
        paddingBottom: 12,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        lineHeight: 42,
    },
    subTitle: {
        fontSize: 12,
        color: Colors.darkGray,
    },
    description: {
        fontSize: 14,
        color: Colors.darkGray,
        lineHeight: 20,
    },
    qrContent: {
        width: "100%",
        height: "auto",
        marginBottom: 32,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 32,
    },
    qrInfo: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: "center",
        color: Colors.darkGray,
    },
    loginText: {
        fontSize: 16,
    },
    loginButton: {
        height: 60,
        backgroundColor: Colors.primary,
    },
});
