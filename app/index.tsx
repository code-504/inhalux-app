import React from 'react'
import { Redirect } from 'expo-router'
import { useAuth } from '@/context/Authprovider'

import 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const index = () => {
  
  const auth = useAuth();

  if (!auth.session) {
    return <Redirect href="/(auth)/login" />;
  }

  return  <Redirect href="/(tabs)/device" />;
}

export default gestureHandlerRootHOC(index)
