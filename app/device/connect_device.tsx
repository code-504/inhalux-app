import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import useBLE from '@/hooks/useBLE'
import { MontserratText } from '@/components/StyledText'
import { SafeAreaView } from 'react-native-safe-area-context'

const ConnectDevice = () => {

  const { requestPermissions, allDevices, scanForPeripherals } = useBLE()

  useEffect(() => {
    requestPermissions()
    scanForPeripherals()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View>
      <Text>Connect</Text>
      {
        allDevices.map((item, index) => (
          <View key={index}>
            <MontserratText>{ item.name }</MontserratText>
          </View>
        ))
      }
    </View>
    </SafeAreaView>
  )
}

export default ConnectDevice