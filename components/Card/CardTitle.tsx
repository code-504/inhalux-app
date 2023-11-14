import { Text, StyleSheet } from 'react-native'
import React from 'react'

interface Props {
    children: JSX.Element
}

const CardTitle = ({ children }:Props) => {
    return (
        <Text style={ styles.titleText }>{ children }</Text>
    )
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: 20,
    }
})

export default CardTitle