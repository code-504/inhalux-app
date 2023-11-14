import { StyleSheet, View } from 'react-native'
import React from 'react'

interface Props {
    children: JSX.Element
}

const CardBody = ({ children }:Props) => {
    return (
        <View style={ styles.bodyCard }>
            { children }
        </View>
    )
}

const styles = StyleSheet.create({
    bodyCard: {
        marginTop: 10
    }
})

export default CardBody