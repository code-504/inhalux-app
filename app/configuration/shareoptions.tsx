import { View, StyleSheet, ImageBackground, Dimensions, Animated } from 'react-native'
import React, { useRef, useState } from 'react'
import Colors from '@/constants/Colors'
import { AlertDialog, Button, ScrollView } from 'tamagui'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText'
import { Stack, router } from 'expo-router'
import NormalHeader from '@/components/Headers/NormalHeader'
import OptionsList from '@/components/OptionsList'

// Resources
import BackgroundImage from "@/assets/images/background.png"
import RegenerateIcon from "@/assets/icons/key.svg"
import DeleteIcon from "@/assets/icons/delete_forever.svg"

const ShareOptionsPage = () => {
  
    const [openDialog, setOpenDialog] = useState({
        openOption1: false,
        openOption2: false
    });
    
    let scrollOffsetY = useRef(new Animated.Value(0)).current;

    const handleGenerateNewKey = () => {
        setOpenDialog({
            ...openDialog,
            openOption1: false
        })
    }

    const handleDeleteUsers = () => {
        setOpenDialog({
            ...openDialog,
            openOption2: false
        })
    }
    
    return (
        <View style={styles.safeArea}>
            <Stack.Screen options={{ header: () => <NormalHeader title="Opciones de compartir cuenta" animHeaderValue={scrollOffsetY} /> }} />
            <ImageBackground source={BackgroundImage} style={styles.imageBackground} />

            <ScrollView style={styles.content} 
                
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollOffsetY}}}],
                    {useNativeDriver: false}
                )}
            >

                <View style={{ minHeight: Dimensions.get('window').height - 73}}>
                    <View style={styles.upView}>
                        <MontserratSemiText style={styles.title}>Opciones de compartir cuenta</MontserratSemiText>
                    </View>

                    <View style={styles.downView}>
                        <OptionsList title="Cuenta">
                            <OptionsList.ItemView onPressFunction={() => setOpenDialog({ ...openDialog, openOption1: true })}>
                                <RegenerateIcon />
                                <OptionsList.TextView>
                                    <OptionsList.ItemText>Regenerar clave</OptionsList.ItemText>
                                    <OptionsList.ItemDescription>Consectetur adipiscing elit. In sagittis felis sed tempor.</OptionsList.ItemDescription>
                                </OptionsList.TextView>
                            </OptionsList.ItemView>

                            <OptionsList.ItemView onPressFunction={() => setOpenDialog({ ...openDialog, openOption2: true })}>
                                <DeleteIcon />
                                <OptionsList.TextView>
                                    <OptionsList.ItemText>Eliminar usuarios compartidos</OptionsList.ItemText>
                                    <OptionsList.ItemDescription>Consectetur adipiscing elit. In sagittis felis sed tempor.</OptionsList.ItemDescription>
                                </OptionsList.TextView>
                            </OptionsList.ItemView>
                        </OptionsList>
                    </View>
                </View>
            </ScrollView>

            <AlertDialog open={openDialog.openOption1}>

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
                            <AlertDialog.Title style={stylesDialog.titleDialog}>Genera nueva clave</AlertDialog.Title>
                            <AlertDialog.Description>
                                ¿Estás seguro de generar una nueva clave?
                            </AlertDialog.Description>
                        </View>

                        <View style={stylesDialog.buttonsView}>
                        <AlertDialog.Cancel asChild>
                            <Button onPress={() => setOpenDialog({ ...openDialog, openOption1: false })} backgroundColor={ Colors.white } borderRadius={1000}><MontserratSemiText>Cancelar</MontserratSemiText></Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                            <Button onPress={handleGenerateNewKey} backgroundColor={Colors.white} borderRadius={1000}><MontserratSemiText>Generar nueva clave</MontserratSemiText></Button>
                        </AlertDialog.Action>
                        </View>
                    </View>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog>

            <AlertDialog open={openDialog.openOption2}>

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
                            <AlertDialog.Title style={stylesDialog.titleDialog}>Eliminar usuarios compartidos</AlertDialog.Title>
                            <AlertDialog.Description>¿Estás seguro de eliminar a los usuarios?</AlertDialog.Description>
                        </View>

                        <View style={stylesDialog.buttonsView}>
                        <AlertDialog.Cancel asChild>
                            <Button onPress={() => setOpenDialog({ ...openDialog, openOption2: false })} backgroundColor={ Colors.white }>Cancelar</Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                            <Button onPress={handleDeleteUsers} backgroundColor={Colors.redLight} color={Colors.red}>Eliminar</Button>
                        </AlertDialog.Action>
                        </View>
                    </View>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog>
        </View>
    )
}

export default ShareOptionsPage

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
    },
    upView: {
        flex: 0.15,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        paddingTop: 48,
        paddingBottom: 24,
        paddingHorizontal: 24
    },
    downView: {
        flex: 0.85,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 38,
        borderTopRightRadius: 38,
        paddingVertical: 42
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