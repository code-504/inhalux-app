import { View, Text } from 'react-native'
import React from 'react'
import { Button } from 'tamagui'
import { usePushNotifications } from '@/hooks/usePushNotifications';

export default function TabFourScreen() {
  const { schedulePushNotification, cancelAllNotifications } = usePushNotifications();


  return (
    <View>
      <Button onPress={schedulePushNotification}>Poner Alarma</Button>
      <Button onPress={cancelAllNotifications}>Quitar Alarma</Button>
    </View>
  )
}