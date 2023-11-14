import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '@/constants/Colors'

const CustomHeader = () => {

    return (
        <SafeAreaView style={ styles.safeAre }>
            <View style={styles.container}>
                <Text style={styles.text}>
                    Hola, Buenos días 👋
                </Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeAre: {
        flex: 1,
        backgroundColor: Colors.lightGrey
    },
    container: {
        height: 60,
        backgroundColor: Colors.lightGrey,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 16
    }
})

export default CustomHeader