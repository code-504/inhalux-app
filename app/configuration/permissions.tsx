import { View, StyleSheet, ImageBackground, Dimensions, Animated, Alert, Linking } from 'react-native'
import React, { useRef, useState } from 'react'
import Colors from '@/constants/Colors'
import { AlertDialog, Button, ScrollView } from 'tamagui'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText'
import { Stack, router } from 'expo-router'
import NormalHeader from '@/components/Headers/NormalHeader'
import OptionsList from '@/components/OptionsList'
import * as Location from 'expo-location';

// Resources
import BackgroundImage from "@/assets/images/background.png"
import BluetoothIcon from "@/assets/icons/bluetooth_access.svg"
import LocationIcon from "@/assets/icons/location_on_access.svg"
import BackgroundIcon from "@/assets/icons/my_location_access.svg"
import NotificationIcon from "@/assets/icons/circle_notifications_access.svg"
import CameraIcon from "@/assets/icons/photo_camera_access.svg"
import * as Notifications from "expo-notifications";
import useBLE from '@/hooks/useBLE'
import { Camera } from 'react-native-vision-camera'

const PermissionsPage = () => {
    
    let scrollOffsetY = useRef(new Animated.Value(0)).current;

    const { requestPermissions } = useBLE();
    const [permissionSituation, setPermissionDialog] = useState(false);
    const [generalOpenDialog, setGeneralOpenDialog] = useState(false);
    const [backgroundLocationOpenDialog, setBackgroundLocationOpenDialog] = useState(false);

    const requestBluetoothPermissions = async () => {
        const permission = await requestPermissions();

        if(permission === true){ setPermissionDialog(true); setGeneralOpenDialog(true); }
        else if(permission === false){ setPermissionDialog(false); setGeneralOpenDialog(true); }
        
        console.log(permission);
    }

    const requestLocationForegroundPermissions = async() => {//Done
        const permission = await Location.getForegroundPermissionsAsync();

        if(permission.status === "granted"){ setPermissionDialog(true); setGeneralOpenDialog(true); }
        else if(permission.status === "denied"){ setPermissionDialog(false); setGeneralOpenDialog(true); }
        else await Location.requestForegroundPermissionsAsync();

        console.log(permission);
    }

    const requestLocationBackgroundPermissions = async() => {
        const permissionFg = await Location.getForegroundPermissionsAsync();

        if(permissionFg.status !== "granted"){
            setBackgroundLocationOpenDialog(true);
            return;
        }

        const permissionBg = await Location.getBackgroundPermissionsAsync();

        if(permissionBg.status === "granted"){ setPermissionDialog(true); setGeneralOpenDialog(true); }
        else if(permissionBg.status === "denied"){ setPermissionDialog(false); setGeneralOpenDialog(true); }
        else await Location.requestBackgroundPermissionsAsync();

        console.log(permissionBg);
    }

    const requestNotificationsPermissions = async() => {//Done
        const permission = await Notifications.getPermissionsAsync();

        if(permission.status === "granted"){ setPermissionDialog(true); setGeneralOpenDialog(true); }
        else if(permission.status === "denied"){ setPermissionDialog(false); setGeneralOpenDialog(true); }
        else await Location.requestForegroundPermissionsAsync();

        console.log(permission);
    }

    const requestCameraPermissions = async() => {//Done
        const permission = await Camera.getCameraPermissionStatus();

        if(permission === "granted"){ setPermissionDialog(true); setGeneralOpenDialog(true); }
        else if(permission === "denied"){ setPermissionDialog(false); setGeneralOpenDialog(true); }
        else await Camera.requestCameraPermission();

        console.log(permission);
    }
    
    return (
        <View style={styles.safeArea}>
            <Stack.Screen options={{ header: () => <NormalHeader title="Configurar permisos" animHeaderValue={scrollOffsetY} /> }} />
            <ImageBackground source={BackgroundImage} style={styles.imageBackground} />

            <ScrollView style={styles.content} 
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollOffsetY}}}],
                    {useNativeDriver: false}
                )}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >

                    <View style={styles.upView}>
                        <MontserratSemiText style={styles.title}>Configurar permisos</MontserratSemiText>
                    </View>

                    <View style={styles.downView}>
                        <OptionsList title="Lista de permisos">
                            <OptionsList.ItemView onPressFunction={requestBluetoothPermissions}>
                                <BluetoothIcon />
                                <OptionsList.TextView>
                                    <OptionsList.ItemText>Permiso de bluetooth</OptionsList.ItemText>
                                    <OptionsList.ItemDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras accumsan.</OptionsList.ItemDescription>
                                </OptionsList.TextView>
                            </OptionsList.ItemView>

                            <OptionsList.ItemView onPressFunction={requestLocationForegroundPermissions}>
                                <LocationIcon />
                                <OptionsList.TextView>
                                    <OptionsList.ItemText>Permiso de ubicación</OptionsList.ItemText>
                                    <OptionsList.ItemDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras accumsan.</OptionsList.ItemDescription>
                                </OptionsList.TextView>
                            </OptionsList.ItemView>

                            <OptionsList.ItemView onPressFunction={requestLocationBackgroundPermissions}>
                                <BackgroundIcon />
                                <OptionsList.TextView>
                                    <OptionsList.ItemText>Permiso de ubicación en segundo plano</OptionsList.ItemText>
                                    <OptionsList.ItemDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras accumsan.</OptionsList.ItemDescription>
                                </OptionsList.TextView>
                            </OptionsList.ItemView>

                            <OptionsList.ItemView onPressFunction={requestNotificationsPermissions}>
                                <NotificationIcon />
                                <OptionsList.TextView>
                                    <OptionsList.ItemText>Permiso de notificaciones</OptionsList.ItemText>
                                    <OptionsList.ItemDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras accumsan.</OptionsList.ItemDescription>
                                </OptionsList.TextView>
                            </OptionsList.ItemView>

                            <OptionsList.ItemView onPressFunction={requestCameraPermissions}>
                                <CameraIcon />
                                <OptionsList.TextView>
                                    <OptionsList.ItemText>Permiso de camara</OptionsList.ItemText>
                                    <OptionsList.ItemDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras accumsan.</OptionsList.ItemDescription>
                                </OptionsList.TextView>
                            </OptionsList.ItemView>

                        </OptionsList>
                    </View>
            </ScrollView>

            <AlertDialog open={backgroundLocationOpenDialog}>

                <AlertDialog.Portal>
                    <AlertDialog.Overlay
                        key="overlay"
                        animation="quick"
                        opacity={0.5}
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                        />
                        <AlertDialog.Content
                        bordered
                        elevate
                        key="content"
                        animation={[
                            'quick',
                            {
                            opacity: {
                                overshootClamping: true,
                            },
                            },
                        ]}
                        enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                        exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                        x={0}
                        scale={1}
                        opacity={1}
                        y={0}
                        borderRadius={24}
                        padding={24}
                        backgroundColor={Colors.white}
                    >
                    <View style={stylesDialog.content}>

                        <View>
                            <AlertDialog.Title style={stylesDialog.titleDialog}>
                                Permisos de Ubicación Requeridos
                            </AlertDialog.Title>
                            <AlertDialog.Description>
                                Antes de configurar estos permisos, asegurese de haber concedido los permisos de ubicación
                            </AlertDialog.Description>
                        </View>

                        <View style={stylesDialog.buttonsView}>
                            <AlertDialog.Action asChild>
                                <Button onPress={() => setBackgroundLocationOpenDialog(false) } backgroundColor={Colors.greenLight} color={Colors.green}>Aceptar</Button>
                            </AlertDialog.Action>
                        </View>
                    </View>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog>

            <AlertDialog open={generalOpenDialog}>

                <AlertDialog.Portal>
                    <AlertDialog.Overlay
                        key="overlay"
                        animation="quick"
                        opacity={0.5}
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                        />
                        <AlertDialog.Content
                        bordered
                        elevate
                        key="content"
                        animation={[
                            'quick',
                            {
                            opacity: {
                                overshootClamping: true,
                            },
                            },
                        ]}
                        enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                        exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                        x={0}
                        scale={1}
                        opacity={1}
                        y={0}
                        borderRadius={24}
                        padding={24}
                        backgroundColor={Colors.white}
                    >
                    <View style={stylesDialog.content}>

                        <View>
                            <AlertDialog.Title style={stylesDialog.titleDialog}>
                                {permissionSituation ? 'Permisos ya concedidos' : 'Permisos Revocados'}
                            </AlertDialog.Title>
                            <AlertDialog.Description>
                                {permissionSituation
                                ? `Parece que usted ya ha concedido los permisos para esta característica.\n\nSi quiere revocarlos, tendrá que hacerlo desde la configuración de su dispositivo. ¿Quiere ser redirigido?`
                                : `Parece que usted ha revocado los permisos para esta característica.\n\nSi quiere concederlos, tendrá que hacerlo desde la configuración de su dispositivo. ¿Quiere ser redirigido?`}
                            </AlertDialog.Description>
                        </View>

                        <View style={stylesDialog.buttonsView}>
                        <AlertDialog.Cancel asChild>
                            <Button onPress={() => setGeneralOpenDialog(false)}  backgroundColor={Colors.redLight} color={Colors.red}>Cancelar</Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                            <Button onPress={() => {Linking.openSettings(); setGeneralOpenDialog(false)}} backgroundColor={Colors.greenLight} color={Colors.green}>Aceptar</Button>
                        </AlertDialog.Action>
                        </View>
                    </View>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog>
        </View>
    )
}

export default PermissionsPage

const stylesDialog = StyleSheet.create({
    content: {
      display: "flex",
      flexDirection: "column",
      gap: 24
    },
    titleDialog: {
      fontSize: 20,
      lineHeight: 30,
      marginBottom:20
    },
    buttonsView: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 16
    }
})

const styles = StyleSheet.create({
    safeArea: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
        backgroundColor: Colors.lightGrey
	},
    imageBackground: {
		position: "absolute",
		resizeMode: 'cover',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
	},
    content: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    upView: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        gap: 12,
        paddingBottom: 48,
        height: 350,
        paddingHorizontal: 24,
    },
    downView: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 38,
        borderTopRightRadius: 38,
        paddingVertical: 42,
        height: "100%"
    },
    title: {
        fontSize: 32,
        lineHeight: 42
    },
    description: {
        fontSize: 14,
        color: Colors.darkGray,
        lineHeight: 24
    }
})