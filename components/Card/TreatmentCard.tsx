import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'

interface TreatmentCardProps {
    title   : string;
    message : string;
    Icon    : React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    date    : string;
    hour    : string;
}

const TreatmentCard = ({ title }: TreatmentCardProps) => {
  return (
    <View style={styles.content}>
        <View>
          
        </View>
    </View>
  )
}

export default TreatmentCard

const styles = StyleSheet.create({
    content: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        borderRadius: 28,
        width: "100%",
        padding: 16
    }
})