import React from 'react'
import { Redirect } from 'expo-router'
import { useAuth } from '@/context/Authprovider'

import 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { usePushNotifications } from '@/hooks/usePushNotifications';

const index = () => {
  
  const auth = useAuth();
  const { expoPushToken } = usePushNotifications();
  //console.log("expoPushToken: ", expoPushToken);

  if (!auth.session) {
    return <Redirect href="/(auth)/login" />;
  }

  return  <Redirect href="/(tabs)/device" />;
}

export default gestureHandlerRootHOC(index)
