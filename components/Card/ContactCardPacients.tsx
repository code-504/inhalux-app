import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Avatar, AlertDialog, Button } from 'tamagui'
import { StyleSheet } from 'react-native'
import Colors from '@/constants/Colors'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '../StyledText'
import Ripple from 'react-native-material-ripple'
import { ListMonitor } from '@/interfaces/Monitor'
import { useRouter } from 'expo-router'

// Resources
import ArrowIcon from "@/assets/icons/arrow_outward.svg"
import PendingIcon from "@/assets/icons/pendingIcon.svg"

const ContactCardPatient = ({ id, name, kindred, avatar, pending_state }: ListMonitor) => {
    const [openDialog, setOpenDialog] = useState(false)
    const router = useRouter();
    
    return (
        <View>
            {pending_state 
                ?
                    <>
                        <Ripple style={styles.cardView} onPress={() => {setOpenDialog(true)}}>
                            <View style={styles.cardContent}>
                                <Avatar size="$5" circular style={styles.avatar}>
                                    <Avatar.Image
                                        accessibilityLabel="user"
                                        src={avatar}
                                    />
                                    <Avatar.Fallback backgroundColor={Colors.dotsGray} />
                                </Avatar>

                                <View style={styles.textView}>
                                    <MontserratBoldText style={styles.lightColor}>{ name }</MontserratBoldText>
                                    <MontserratText style={styles.lightColor}>{ "Solicitud Pendiente..." }</MontserratText>
                                </View>
                            </View>

                            <PendingIcon style={styles.arrowIcon} />
                        </Ripple>
                        
                        <AlertDialog open={openDialog}>

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
                                        <AlertDialog.Title style={stylesDialog.titleDialog}>Solicitud Pendiente</AlertDialog.Title>
                                        <AlertDialog.Description>
                                            Podrás acceder a la información de este usuario después de que él acepte tu solicitud.
                                        </AlertDialog.Description>
                                    </View>

                                    <View style={stylesDialog.buttonsView}>
                                        <AlertDialog.Action asChild>
                                            <Button onPress={() => setOpenDialog(false)} backgroundColor={Colors.white} borderRadius={1000}><MontserratSemiText>Aceptar</MontserratSemiText></Button>
                                        </AlertDialog.Action>
                                    </View>
                                </View>
                                </AlertDialog.Content>
                            </AlertDialog.Portal>
                        </AlertDialog>
                    </>
                : 
                    <Ripple style={styles.cardView} onTouchEnd={() => router.push({ pathname: "/monitor/pacient_view", 
                        params: { 
                            pacient_id: id,
                            pacient_name: name,
                            pacient_kindred: kindred,
                            pacient_avatar: avatar 
                        }})}
                    >
                        <View style={styles.cardContent}>
                            <Avatar size="$5" circular style={styles.avatar}>
                                <Avatar.Image
                                    accessibilityLabel="user"
                                    src={avatar}
                                />
                                <Avatar.Fallback backgroundColor={Colors.dotsGray} />
                            </Avatar>

                            <View style={styles.textView}>
                                <MontserratBoldText>{ name }</MontserratBoldText>
                                <MontserratText>{ kindred }</MontserratText>
                            </View>
                        </View>

                        <ArrowIcon style={styles.arrowIcon} />
                    </Ripple>

            }
        </View>
    )
}

export default ContactCardPatient

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
    cardView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        height: 96,
        //borderBottomWidth: 1,
        //borderBottomColor: Colors.dotsGray
    },
    cardContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        marginRight: 24
    },
    textView: {
        display: "flex",
        flexDirection: "column",
        gap: 2
    },
    arrowIcon: {
        paddingRight: 64
    },
    lightColor: {
        color: "#646464"
    }
})