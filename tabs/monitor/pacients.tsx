import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { MontserratText } from '@/components/StyledText'
import HeaderAction from '@/components/HeaderAction'

// Resources
import pacientBackground from "@/assets/images/pacients-empty.png"
import AddIcon from "@/assets/icons/add.svg"
import { Image } from 'expo-image'
import Colors from '@/constants/Colors'

const PacientsTab = ({ list }: PacientsProps) => {

    const addPacient = () => {
        console.log("Hola")
    }

    return (
        <View>
            <HeaderAction 
                title="Lista de pacientes"
                subtitle="Información de sus inhaLux"
                Icon={AddIcon}
                action={addPacient}
            />

            {
                list.length >= 1 ? list.map((item, index) => (
                    <View key={index} >
                        <MontserratText>{ item.name }</MontserratText>
                    </View>
                )) :
                (
                    <View style={styles.emptyView}>
                        <Image style={styles.imageEmpy} source={pacientBackground} />

                        <MontserratText style={styles.infoText}>Monitorea el inhalador de alguien más de forma rápida y segura</MontserratText>
                        <MontserratText style={styles.infoEmpty}>No hay ningún paciente</MontserratText>
                    </View>
                )
            }
        </View>
    )
}

export default PacientsTab

const styles = StyleSheet.create({
    emptyView: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24
    },
    imageEmpy: {
        width: '100%',
    	aspectRatio: 1 / 1,
    },
    infoText: {
        textAlign: "center",
        width: "80%",
    },
    infoEmpty: {
        textAlign: "center",
        color: Colors.darkGray
    }
})