import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
    Camera,
    Code,
    useCameraDevice,
    useCameraPermission,
    useCodeScanner,
    VisionCameraProxy,
} from "react-native-vision-camera";
import Colors from "@/constants/Colors";
import {
    MontserratBoldText,
    MontserratSemiText,
} from "@/components/StyledText";

import BackgroundImage from "@/assets/images/background.png";
import { Spinner } from "tamagui";
import { useRelations } from "@/context/RelationsProvider";
import { supabase } from "@/services/supabase";
import { useUserStore } from "@/stores/user";
import { router } from "expo-router";

const ScanPacientPage = () => {
    const device = useCameraDevice("back");
    const [isActive, setIsActive] = useState<boolean>(false);
    const { pacientState, setPacientState } = useRelations();
    const { supaUser } = useUserStore();
    const [onLoading, setOnLoading] = useState(false);

    const checkPermission = async () => {
        const newCameraPermission = await Camera.requestCameraPermission();

        if (newCameraPermission == null) {
            console.log("no tiene permiso");
        }
    };

    useEffect(() => {
        checkPermission();

        const timer = setInterval(() => {
            setIsActive(true);
        }, 600);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const handleAddPatient = async (addCode: any) => {
        console.log("pacientState: ", pacientState);

        if (addCode === supaUser?.token) {
            //same code scenario
            Alert.alert("¡No puede agregarse a usted mismo!");
            router.back();
            return;
        }

        let { data: userNewRelation, error: userNewRelationError } =
            await supabase
                .from("users")
                .select("id, name, last_name, avatar")
                .eq("token", addCode);

        console.log(userNewRelation, userNewRelationError);
        if (userNewRelation === null || userNewRelation.length === 0) {
            //code doesn't exist scenario
            Alert.alert("¡El token proporcionado NO existe!");
            router.back();
            return;
        }

        let { data: relationAlreadyExists, error: relationAlreadyExistsError } =
            await supabase
                .from("user_relations")
                .select("*")
                .eq("fk_user_monitor", supaUser?.id)
                .eq("fk_user_patient", userNewRelation[0].id);

        if (
            relationAlreadyExists !== null &&
            relationAlreadyExists.length !== 0
        ) {
            //code doesn't exist scenario
            Alert.alert("¡Ya tienes a esta persona agregada!");
            router.back();
            return;
        }

        const { data, error } = await supabase
            .from("user_relations")
            .insert([
                {
                    fk_user_monitor: supaUser?.id,
                    fk_user_patient: userNewRelation[0].id,
                },
            ])
            .select();

        if (error) {
            //code doesn't exist scenario
            Alert.alert("¡Uh oh! Algo salió mal...");
            router.back();
            console.log(error);
            return;
        }

        setPacientState({
            ...pacientState,
            filterText: "",
            data: [
                ...pacientState.data,
                {
                    id: userNewRelation[0].id,
                    name:
                        userNewRelation[0].name +
                        (userNewRelation[0].last_name
                            ? " " + userNewRelation[0].last_name
                            : ""),
                    avatar: userNewRelation[0].avatar,
                    kindred: "Relativo",
                    pending_state: true,
                },
            ],
        });

        Alert.alert("¡Solicitud de Relación enviada!");
        router.back();
    }; //handleAddPatient

    const codeScanner = useCodeScanner({
        codeTypes: ["qr", "ean-13"],
        onCodeScanned: async (codes: Code[]) => {
            if (!onLoading) {
                setOnLoading(true);
                console.log(`Scanned ${codes[0].value} codes!`);
                await handleAddPatient(codes[0].value);
                //router.back();
            }
        },
    });

    if (device == null) return <Spinner />;

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
                    >{`Escanear \ncódigo QR`}</MontserratBoldText>
                    <MontserratSemiText style={styles.description}>
                        Escanea el código qr de tu paciente para poder
                        vincularte a su cuenta
                    </MontserratSemiText>
                </View>

                <View style={styles.downView}>
                    <MontserratSemiText style={styles.subTitle}>
                        Escanear Código QR
                    </MontserratSemiText>

                    <View
                        style={{
                            position: "relative",
                            width: "100%",
                            height: "80%",
                            borderRadius: 38,
                            overflow: "hidden",
                            marginBottom: 32,
                        }}
                    >
                        <Camera
                            style={StyleSheet.absoluteFill}
                            device={device}
                            isActive={isActive}
                            codeScanner={codeScanner}
                        />
                    </View>
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
        paddingTop: 42,
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
    loginText: {
        fontSize: 16,
    },
});
