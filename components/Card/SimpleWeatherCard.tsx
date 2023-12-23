import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '../StyledText'
import Colors from '@/constants/Colors'

interface WeatherCardProps {
    Icon        : React.FunctionComponent<React.SVGAttributes<SVGElement>>
    color       : string
    title       : string
    calification: string
    value       : string
    medition   ?: string
}

const SimpleWeatherCard = ({ Icon, color, title, calification, value, medition }: WeatherCardProps) => {
    return (
        <View style={styles.card}>
            <View style={styles.cardIconView}>
                <View style={[styles.cardIcon, { backgroundColor: color }]}>
                    <Icon />
                </View>
            </View>

            <View>
                <View style={styles.cardTitleView}>
                    <MontserratText style={styles.cardTitle}>{ title }</MontserratText>
                </View>

                <View style={styles.cardInfoView}>
                    <MontserratSemiText style={styles.cardInfo}>{ calification }</MontserratSemiText>

                    <View style={styles.cardValueView}>
                        <MontserratText style={styles.cardValue}>{ value }</MontserratText>

                        {
                            medition && <MontserratText style={styles.cardMedition}>{ medition }</MontserratText>
                        }
                    </View>
                </View>
            </View>
        </View>
    )
}

export default SimpleWeatherCard

export const DoubleWeatherCard = () => {
    return (
        <View style={styles.card}>
            <View style={styles.cardIconView}>
                <View style={[styles.cardIcon, { backgroundColor: color }]}>
                    <Icon />
                </View>
            </View>

            <View>
                <View style={styles.cardTitleView}>
                    <MontserratText style={styles.cardTitle}>{ title }</MontserratText>
                </View>

                <View style={styles.cardInfoView}>
                    <MontserratSemiText style={styles.cardInfo}>{ calification }</MontserratSemiText>

                    <View style={styles.cardValueView}>
                        <MontserratText style={styles.cardValue}>{ value }</MontserratText>

                        {
                            medition && <MontserratText style={styles.cardMedition}>{ medition }</MontserratText>
                        }
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
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
    cardInfo: {
        fontSize: 14,
    },
    cardInfoView: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
        marginBottom: 2
    },
    cardValueView: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 4
    },
    cardValue: {
        fontSize: 14,
        color: Colors.textGrayMedium
    },
    cardMedition: {
        fontSize: 12,
        paddingBottom: 2,
        color: Colors.textGrayLight
    }
})