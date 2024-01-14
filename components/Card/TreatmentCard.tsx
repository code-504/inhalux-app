import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '../StyledText';

import OkIcon from "@/assets/icons/pill_card.svg"

export interface TreatmentCardProps {
    title   : string;
    message : string;
    hour    : string;
	type	: number;
}

interface TypeProps {
	Icon    : React.FunctionComponent<React.SVGAttributes<SVGElement>>;
	color	: string;
}

const TreatmentCard = ({ title, message, hour, type }: TreatmentCardProps) => {

	const iconList:TypeProps[] = [
		{
			color: Colors.greenLight,
			Icon: OkIcon
		},
		{
			color: Colors.redLight,
			Icon: OkIcon
		},
		{
			color: Colors.brownLight,
			Icon: OkIcon
		},
		{
			color: Colors.purpleLight,
			Icon: OkIcon
		}
	]

  return (
    <View style={styles.content}>
        <View style={styles.iconView}>
			<IconRender Icon={iconList[type].Icon} color={iconList[type].color} />
        </View>

        <View style={styles.textView}>
			<View style={styles.infoView}>
				<MontserratBoldText>{ title }</MontserratBoldText>
				<MontserratSemiText style={{ color: Colors.darkGray }}>{hour}</MontserratSemiText>
			</View>

			<MontserratText style={{ color: Colors.darkGray }}>{ message }</MontserratText>
        </View>
    </View>
  )
}

const IconRender = ({ Icon, color }: TypeProps) => (
	<View style={[styles.cardIcon, { backgroundColor: color }]}>				
    	<Icon />
    </View>
)

export default TreatmentCard

const styles = StyleSheet.create({
    content: {
        display: "flex",
		flexDirection: "row",
        borderWidth: 1,
        borderColor: Colors.borderColor,
        borderRadius: 28,
        width: "100%",
        padding: 16,
		gap: 16
    },
	iconView: {
		display: "flex",
		flexDirection: "column"
	},
	textView: {
		display: "flex",
		flexDirection: "column",
		gap: 8
	},
	infoView: {
		display: "flex",
		flexDirection: "column",
		gap: 4
	},
	cardIcon: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
        width: 32,
        height: 32,
    },
})