import { View, StyleSheet, ImageBackground, Dimensions, Animated, Alert } from 'react-native'
import React, { useRef } from 'react'
import Colors from '@/constants/Colors'
import { ScrollView } from 'tamagui'
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
import useBLE from '@/hooks/useBLE'

const PermissionsPage = () => {
    
    let scrollOffsetY = useRef(new Animated.Value(0)).current;

    const { 
		requestPermissions
	} = useBLE();

    const requestBLEPermission = async () => {
        console.log("hola")
        await requestPermissions()
    }

    const requestForegroundPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
    
        if (status !== 'granted') {
            console.log("No tiene permiso")
        } else {
            console.log("Si tiene permiso")
        }
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
                            <OptionsList.ItemView onPressFunction={requestBLEPermission}>
                                <BluetoothIcon />
                                <OptionsList.TextView>
                                    <OptionsList.ItemText>Permiso de bluetooth</OptionsList.ItemText>
                                    <OptionsList.ItemDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras accumsan.</OptionsList.ItemDescription>
                                </OptionsList.TextView>
                            </OptionsList.ItemView>

                            <OptionsList.ItemView onPressFunction={requestForegroundPermission}>
                                <LocationIcon />
                                <OptionsList.TextView>
                                    <OptionsList.ItemText>Permiso de ubicación</OptionsList.ItemText>
                                    <OptionsList.ItemDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras accumsan.</OptionsList.ItemDescription>
                                </OptionsList.TextView>
                            </OptionsList.ItemView>

                            <OptionsList.ItemView onPressFunction={() => {}}>
                                <BackgroundIcon />
                                <OptionsList.TextView>
                                    <OptionsList.ItemText>Permiso de ubicación en segundo plano</OptionsList.ItemText>
                                    <OptionsList.ItemDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras accumsan.</OptionsList.ItemDescription>
                                </OptionsList.TextView>
                            </OptionsList.ItemView>

                            <OptionsList.ItemView onPressFunction={() => {}}>
                                <NotificationIcon />
                                <OptionsList.TextView>
                                    <OptionsList.ItemText>Permiso de notificaciones</OptionsList.ItemText>
                                    <OptionsList.ItemDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras accumsan.</OptionsList.ItemDescription>
                                </OptionsList.TextView>
                            </OptionsList.ItemView>

                            <OptionsList.ItemView onPressFunction={() => {}}>
                                <CameraIcon />
                                <OptionsList.TextView>
                                    <OptionsList.ItemText>Permiso de camara</OptionsList.ItemText>
                                    <OptionsList.ItemDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras accumsan.</OptionsList.ItemDescription>
                                </OptionsList.TextView>
                            </OptionsList.ItemView>

                        </OptionsList>
                    </View>
            </ScrollView>
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