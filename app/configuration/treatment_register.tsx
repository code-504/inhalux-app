import { MontserratBoldText, MontserratSemiText, MontserratText } from "@/components/StyledText";
import { router, useLocalSearchParams } from "expo-router";
import * as Notifications from "expo-notifications";
import { StyleSheet } from "react-native";
import { View } from "@/components/Themed";
import { Button } from "tamagui";
import { useEffect } from "react";
import { supabase } from "@/services/supabase";
import { createInhalationRegister, updateInhalationRegister } from "@/helpers/usePushNotificationsHelper";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

const treatment_register = () => {
  const { notificationId, notificationDay, notificationHour, notificationMinute, todayDate, todayFormatedDate } = useLocalSearchParams();

  useEffect(() => {
    isInhalationRegistered();
    console.log("hoy", todayDate);
  }, [])
  
  const isInhalationRegistered = async() => {
    let { data, error } = await supabase
      .from('historial')
      .select("*")
      .eq('id', notificationId)
      .single()
      
    if(!data){
      const hour = `${notificationHour}:${notificationMinute}`
      createInhalationRegister(String(notificationId), hour, todayDate);
    }  

    console.log("registered?: ", data);
  }//isRegistered
  
  const dismissNotification = async(action: string) => {
    updateInhalationRegister(String(notificationId), action);

    await Notifications.dismissNotificationAsync(String(notificationId));
    router.back();
  }//dismiss

  return (
    <SafeAreaView style={styles.safeArea}>
        <MontserratBoldText style={styles.title}>Registra tu inhalación</MontserratBoldText>
        <MontserratText style={styles.todayDate}>{todayFormatedDate}</MontserratText>
        <MontserratText style={styles.todayHour}>
          {`Hora: ${notificationHour}:${Number(notificationMinute) < 10 ? '0' + notificationMinute : notificationMinute}`}
        </MontserratText>

        <View style={styles.buttons}>
          <Button alignSelf="center" size="$6" style={styles.acceptButton} onPress={() => dismissNotification("Realizado")}>
                Realizar
          </Button>
          <Button alignSelf="center" size="$6" onPress={() => dismissNotification("Omitido")}>Omitir</Button>
        </View>
    </SafeAreaView>
  )
}

export default treatment_register;

const styles = StyleSheet.create({
  safeArea: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
	},
  title: {
    textAlign: "center",
    fontSize: 40,
    paddingTop: 125
  },
  todayDate: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 15
  },
  todayHour: {
    fontSize: 20,
    textAlign: "center"
  },
  buttons: {
    paddingTop:35
  },
  acceptButton: {
		marginBottom: 20,
		backgroundColor: Colors.primary
	}
})
