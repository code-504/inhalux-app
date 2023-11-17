import { View, Text } from 'react-native'
import React from 'react'
import { Avatar } from 'tamagui'

// Resources
import ArrowIcon from "@/assets/icons/arrow_outward.svg"
import { StyleSheet } from 'react-native'
import Colors from '@/constants/Colors'
import { MontserratBoldText, MontserratText } from '../StyledText'

const ContactCard = ({ name, kindred, avatar }:PacientsInfo) => {
    return (
        <View style={styles.cardView}>
            <View style={styles.cardContent}>
                <Avatar size="$5" circular style={styles.avatar}>
                    <Avatar.Image
                        accessibilityLabel="user"
                        src={avatar}
                    />
                    <Avatar.Fallback backgroundColor={Colors.dotsGray} />
                </Avatar>

                <View style={styles.textView}>
                    <MontserratBoldText>{ name }</MontserratBoldText>
                    <MontserratText>{ kindred }</MontserratText>
                </View>
            </View>

            <ArrowIcon style={styles.arrowIcon} />
        </View>
    )
}

export default ContactCard

const styles = StyleSheet.create({
    cardView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 2,
        height: 96,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dotsGray
    },
    cardContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        marginRight: 24
    },
    textView: {
        display: "flex",
        flexDirection: "column",
        gap: 2
    },
    arrowIcon: {
        paddingRight: 64
    }
})