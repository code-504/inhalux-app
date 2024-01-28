import { View, StyleSheet, ImageBackground, Dimensions, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Colors from '@/constants/Colors'
import { ScrollView } from 'tamagui'
import { MontserratSemiText } from '@/components/StyledText'
import NotificationsList from '@/components/NotificationsList'
import { Stack } from 'expo-router'
import NormalHeader from '@/components/Headers/NormalHeader'

// Resources
import BackgroundImage from "@/assets/images/background.png"

const NotificationsPage = () => {

    let scrollOffsetY = useRef(new Animated.Value(0)).current;
    
    return (
        <View style={styles.safeArea}>
            <Stack.Screen options={{ header: () => <NormalHeader title="Notificaciones" animHeaderValue={scrollOffsetY} /> }} />
            <ImageBackground source={BackgroundImage} style={styles.imageBackground} />

            <ScrollView style={styles.content} 
                
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollOffsetY}}}],
                    {useNativeDriver: false}
                )}
                contentContainerStyle={{ flexGrow: 1 }}
            >

                    <View style={styles.upView}>
                        <MontserratSemiText style={styles.title}>Notificaciones</MontserratSemiText>
                    </View>

                    <View style={styles.downView}>
                        <NotificationsList title="Opciones de notificaciones">
                            <NotificationsList.ItemView value={true}>
                                <NotificationsList.Title>Mostrar notificaciones locales del inhalador</NotificationsList.Title>
                                <NotificationsList.Description>Mostrar notificación cuando el dispositivo se ha desconectado o baja batería</NotificationsList.Description>
                            </NotificationsList.ItemView>

                            <NotificationsList.ItemView value={true}>
                                <NotificationsList.Title>Mostrar notificaciones de noticias ambientales</NotificationsList.Title>
                                <NotificationsList.Description>Se enviarán noticias relacionadas con medios ambientales</NotificationsList.Description>
                            </NotificationsList.ItemView>

                            <NotificationsList.ItemView value={true}>
                                <NotificationsList.Title>Mostrar notificaciones de los pacientes</NotificationsList.Title>
                                <NotificationsList.Description>Se enviarán noticias relacionadas con medios ambientales</NotificationsList.Description>
                            </NotificationsList.ItemView>
                            
                        </NotificationsList>
                    </View>
            </ScrollView>
        </View>
    )
}

export default NotificationsPage

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
        display: "flex",
        flexDirection: "column",
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
        paddingHorizontal: 24,
        height: "100%"
    },
    title: {
        fontSize: 32
    },
})