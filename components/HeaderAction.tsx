import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import { MontserratBoldText, MontserratText } from './StyledText'
import { Button } from 'tamagui'

const HeaderAction = ({ title, subtitle, Icon, action }: HeaderActionProps) => {
  return (
    <View style={styles.header}>
		<View style={styles.headerText}>
			<MontserratBoldText style={styles.headerTitleText}>{ title }</MontserratBoldText>
			<MontserratText style={styles.headerSubtitleText}>{ subtitle }</MontserratText>
		</View>
						
		<Button style={styles.addButton} alignSelf="center" size="$6" circular onPress={action}>
		    <Icon />
		</Button>
	</View>
  )
}

export default HeaderAction

const styles = StyleSheet.create({
    header: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 8
	},
	headerText: {
		display: "flex",
		flexDirection: "column",
	},
	headerTitleText: {
		fontSize: 18,
		marginBottom: 2
	},
	headerSubtitleText: {
		fontSize: 14,
		color: Colors.light.grayText
	},
	addButton: {
		backgroundColor: Colors.primary
	},
})