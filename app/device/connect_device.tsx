import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import useBLE from '@/hooks/useBLE'
import { MontserratSemiText, MontserratText } from '@/components/StyledText'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from 'tamagui'
import Colors from '@/constants/Colors'

const ConnectDevice = () => {

  const { requestPermissions, allDevices, connectedDevice, scanForPeripherals, connectToDevice, disconnectFromDevice, heartRate } = useBLE()

  useEffect(() => {
    requestPermissions()
    scanForPeripherals()
  }, [])

  useEffect(() => {
    allDevices.map((item, index) => {
      console.log(item, "\n")
    }) 
  }, [allDevices])

  useEffect(() => {
    console.log("Values:", heartRate)
  }, [heartRate])

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View>
      <Text>Connect</Text>
      {
        allDevices.map((item, index) => (
          <View key={index}>
            <Button style={styles.inhalerButton} size="$6" borderRadius={'$radius.10'} onPress={() => connectToDevice(item)}>
              <MontserratSemiText>{ item.name }</MontserratSemiText>
            </Button>
          </View>
        ))
      }

      {
        connectedDevice && 
        <Button style={styles.inhalerButton} size="$6" borderRadius={'$radius.10'} onPress={() => disconnectFromDevice()}>
          <MontserratSemiText>Desconectar</MontserratSemiText>
        </Button>
      }
    </View>
    </SafeAreaView>
  )
}

export default ConnectDevice

const styles = StyleSheet.create({
  inhalerButton: {
		backgroundColor: Colors.secondary
	},
})