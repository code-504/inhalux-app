import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { ReactNode } from 'react'
import Colors from '@/constants/Colors'
import CardTitle from './CardTitle'
import CardBody from './CardBody'

interface Props {
    color?: string,
    radius?: number,
    style?: StyleProp<ViewStyle>
	children	: JSX.Element
}

const Card = ({ color, radius, children }:Props) => {
    
    const styles = StyleSheet.create({
        cardStyle: {
            width: '100%',
            paddingHorizontal: 16,
            paddingVertical: 18,
            borderRadius: radius ? radius : 38, 
            backgroundColor: color || Colors.light.background
        },
    });

	return (
		<View style={styles.cardStyle}>
			{ children }
		</View>
	)
}

Card.Title = CardTitle;
Card.Body = CardBody;

export default Card