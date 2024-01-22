import { View, Text, SectionList, StyleSheet } from 'react-native'
import React, { ReactNode } from 'react'
import TreatmentCard from './Card/TreatmentCard';

import PillCard from "@/assets/icons/pill_card.svg"
import Colors from '@/constants/Colors';
import { MontserratSemiText } from './StyledText';

interface HistorialSearchProps {
    data: any,
}

const HistorialSearch = ({ data }: HistorialSearchProps) => {

    return (
        <SectionList
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                style={{ height: 800 }}
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
            >

            </SectionList>
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