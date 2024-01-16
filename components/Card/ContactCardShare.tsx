import { View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import { Avatar, Button, AlertDialog } from 'tamagui'

// Resources
import ArrowIcon from "@/assets/icons/arrow_outward.svg"
import PendingIcon from "@/assets/icons/pendingIcon.svg"
import { StyleSheet } from 'react-native'
import Colors from '@/constants/Colors'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '../StyledText'
import Ripple from 'react-native-material-ripple'
import { ListMonitor } from '@/interfaces/Monitor'
import { useRelations } from '@/context/RelationsProvider'
import { supabase } from '@/services/supabase'
import { useAuth } from '@/context/Authprovider'
import { useRouter } from 'expo-router'

const ContactCardShare = ({ id, name, kindred, avatar, pending_state }: ListMonitor) => {
    const [openDialog, setOpenDialog] = useState(false);
    const {shareState, setShareState} = useRelations();
    const {supaUser} = useAuth();
    const router = useRouter();

    const handleAcceptUser = async() => {
        const { data, error } = await supabase
            .from('user_relations')
            .update({ pending_state: false })
            .eq('fk_user_monitor', id)
            .eq('fk_user_patient', supaUser?.id)
            .select()
        
        if(error){
            console.log(error.message);
            Alert.alert("Oops, algo salió mal...")
            setOpenDialog(false);
        }

        const newState = shareState.data.map(item => {
            if (item.id === id) {
              return {
                ...item,
                pending_state: false
              };
            }
            return item;
          });

        setShareState({
            ...shareState,
			filterText: "",
			data: newState
        })

        setOpenDialog(false);
    }

    const handleRejectUser = async() => {
        const { data, error } = await supabase
            .from('user_relations')
            .delete()
            .eq('fk_user_monitor', id)
            .eq('fk_user_patient', supaUser?.id)

        if(error){
            console.log(error.message);
            Alert.alert("Oops, algo salió mal...")
            setOpenDialog(false);
        }

        const newState = shareState.data.filter(item => item.id !== id);

        setShareState({
            ...shareState,
			filterText: "",
			data: newState
        })

        setOpenDialog(false);
    }

    return (
        <View>
            {pending_state 
                ?
                    <>
                        <Ripple style={styles.cardView} onPress={()=>setOpenDialog(true)}>
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
                                    <MontserratText>¡Nueva Solicitud Pendiente!</MontserratText>
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
                                            <AlertDialog.Title style={stylesDialog.titleDialog}>Nueva Solicitud</AlertDialog.Title>
                                            <AlertDialog.Description>
                                                {`El usuario ${name} quiere acceder a tus datos, ¿Lo aceptas como tu monitor?`}
                                            </AlertDialog.Description>
                                        </View>

                                        <View style={stylesDialog.buttonsView}>
                                            <AlertDialog.Cancel asChild>
                                                <Button onPress={() => handleRejectUser()} backgroundColor={Colors.redLight} color={Colors.red} borderRadius={1000}><MontserratSemiText>Rechazar</MontserratSemiText></Button>
                                            </AlertDialog.Cancel>
                                            <AlertDialog.Action asChild>
                                                <Button onPress={() => handleAcceptUser()} backgroundColor={Colors.greenLight} color={Colors.green} borderRadius={1000}><MontserratSemiText>Aceptar</MontserratSemiText></Button>
                                            </AlertDialog.Action>
                                        </View>
                                    </View>
                                    </AlertDialog.Content>
                                </AlertDialog.Portal>
                        </AlertDialog>
                    </>
                : 
                    <Ripple style={styles.cardView} onTouchEnd={() => 
                                router.push({ pathname: "/monitor/monitor_view", 
                                params: { 
                                    monitor_id: id,
                                    monitor_name: name,
                                    monitor_avatar: avatar,
                                    monitor_kindred: kindred    
                                }
                            })
                        }>
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

export default ContactCardShare

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