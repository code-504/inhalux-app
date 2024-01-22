import { useState, useEffect, useRef, SetStateAction, Dispatch } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import uuid from 'react-native-uuid';

import { Platform } from "react-native";
import { checkInhalationState, createInhalationRegister, getTodayDate, updateInhalationRegister } from "@/helpers/usePushNotificationsHelper";
import { router } from "expo-router";

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
  schedulePushNotification?: Dispatch<SetStateAction<any[]>>;
  cancelAllNotifications?: Dispatch<SetStateAction<any[]>>;
}

export const usePushNotifications = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();

  const [notification, setNotification] = useState<Notifications.Notification | undefined>();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification");
        return;
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
      
    } else {
      alert("Must be using a physical device for Push notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  Notifications.setNotificationCategoryAsync("interactive", [
    {
      buttonTitle: "Omitir",
      identifier: "Omitido",
      options: {
        opensAppToForeground: false,
        isDestructive: true
      },
    },

    {
      buttonTitle: "Realizar",
      identifier: "Realizado",
      options: {
        opensAppToForeground: false,
        isDestructive: true
      },
    },
    
  ]);

  async function schedulePushNotification(day:any, hour:any, minute:any) {
    const todayFormatedDate = getTodayDate();
    const fechaActual: Date = new Date();
    const year = fechaActual.getFullYear();
    const month = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Sumamos 1 porque los meses van de 0 a 11
    const dia = fechaActual.getDate().toString().padStart(2, '0');
    const fechaFormateadaActual = `${year}-${month}-${dia}`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Inhalux - ¡Son la ${hour}:${minute < 10 ? "0"+minute : minute}!`,
        body: '¡Es hora de medicarse!',
        data: { day, hour, minute, todayDate: fechaFormateadaActual, todayFormatedDate: todayFormatedDate },
        vibrate: [0, 255, 255, 255],
        sound: "default",
        //categoryIdentifier: "interactive",
        autoDismiss: false,
        sticky: true,
      },
      trigger: {/*weekday: day, hour:hour, minute: minute, repeats: true*/seconds: 3}
    });
  }

  async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.dismissAllNotificationsAsync(); //Linea usada en el test
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      console.log("token: ", token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener(async(notification) => {
        setNotification(notification);
        // await createInhalationRegister(notification.request.identifier)
        console.log("Recibido: ", notification.request.content.data);

        /*
        setTimeout(async () => {
          await checkInhalationState(notification.request.identifier);
        }, 30000);*/
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(async(response) => {
        console.log("response ", response);

        router.push("/(tabs)/device");
        router.push({ pathname: "/configuration/treatment_register", params: { 
          notificationId: response.notification.request.identifier,
          notificationDay: response.notification.request.content.data.day,
          notificationHour: response.notification.request.content.data.hour,
          notificationMinute: response.notification.request.content.data.minute,
          todayDate: response.notification.request.content.data.todayDate,
          todayFormatedDate: response.notification.request.content.data.todayFormatedDate
        }});

        // if(response.actionIdentifier === "Realizado"){
        //   await updateInhalationRegister(response.notification.request.identifier, "Realizado");
        //   await Notifications.dismissAllNotificationsAsync();
        //   console.log("Soy el bueno");
        // } 
        // if(response.actionIdentifier === "Omitido"){
        //   await updateInhalationRegister(response.notification.request.identifier, "Omitido");
        //   await Notifications.dismissAllNotificationsAsync();
        //   console.log("Soy el malo");
        // } 
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );

      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  return {
    expoPushToken,
    notification,
    schedulePushNotification,
    cancelAllNotifications
  };

};