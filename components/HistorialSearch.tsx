import { View, Text, SectionList, StyleSheet } from 'react-native'
import React, { ReactNode } from 'react'
import TreatmentCard from './Card/TreatmentCard';

import PillCard from "@/assets/icons/pill_card.svg"
import Colors from '@/constants/Colors';
import { MontserratSemiText } from './StyledText';

interface HistorialSearchProps {
    data: any,
	renderSection ?: (data: any) => React.ReactNode
}

const HistorialSearch = ({ data, renderSection }: HistorialSearchProps) => {
    return (
		renderSection ? renderSection(data) :
        <SectionList
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            sections={data}
            keyExtractor={(item, index) => item + index}
            renderItem={({item}) => (
                <TreatmentCard 
                    title={item.title}
                    message={item.message}
                    hour={item.hour}
                    type={item.type}
                />
            )}
            ItemSeparatorComponent={() => (
                <View style={{ height: 16 }}></View>
            )}
            renderSectionHeader={({section: {title}}) => (
                <MontserratSemiText style={styles.header}>{title}</MontserratSemiText>
            )}
            stickySectionHeadersEnabled
            onEndReached={() => console.log("hola")}
        />
    );
}

export default HistorialSearch

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 64,
      marginHorizontal: 16,
    },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
    },
    header: {
      fontSize: 16,
      color: Colors.darkGray,
      backgroundColor: '#fff',
      paddingVertical: 16
    },
    title: {
      fontSize: 24,
    },
});