import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { MontserratBoldText, MontserratSemiText } from '../StyledText'
import Colors from '@/constants/Colors'

interface WeatherCardProps {
    Icon        : React.FunctionComponent<React.SVGAttributes<SVGElement>>
    color       : string
    title       : string
    calification: string
    value       : string
}

const SimpleWeatherCard = ({ Icon, color, title, calification, value }: WeatherCardProps) => {
  return (
    <View style={styles.card}>
        <View style={styles.cardIconView}>
            <View style={[styles.cardIcon, { backgroundColor: color }]}>
                <Icon />
            </View>
        </View>

        <View style={styles.cardTitleView}>
            <MontserratBoldText style={styles.cardTitle}>{ title }</MontserratBoldText>
        </View>

        <View style={styles.cardInfoView}>
            <MontserratSemiText style={styles.cardInfo}>{ calification }</MontserratSemiText>
            <MontserratSemiText style={styles.cardInfo}>{ value }</MontserratSemiText>
        </View>
    </View>
  )
}

export default SimpleWeatherCard

const styles = StyleSheet.create({
    card: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: 16,
        borderRadius: 28,
        backgroundColor: Colors.white
    },
    cardIconView: {
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: 12
    },
    cardIcon: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
        width: 32,
        height: 32,
    },
    cardTitleView: {
        width: "100%",
        marginBottom: 4
    },
    cardTitle: {
        fontSize: 14
    },
    cardInfoView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    cardInfo: {
        fontSize: 14,
        color: Colors.darkGray
    }
})