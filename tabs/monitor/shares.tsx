import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText'
import HeaderAction from '@/components/HeaderAction'
import { Image } from 'expo-image'
import Colors from '@/constants/Colors'
import { Avatar, Input, ScrollView } from 'tamagui'

// Resources
import sharesBackground from "@/assets/images/shares-empty.png"
import AddIcon from "@/assets/icons/add.svg"
import SearchIcon from "@/assets/icons/search.svg"
import ContactCard from '@/components/Card/ContactCard'

const SharesTab = ({ list }: PacientsProps) => {

    const addPacient = () => {
        console.log("Hola")
    }

    return (
        <View>
            <HeaderAction 
                title="Lista de compartidos"
                subtitle="Personas con las que has compartido"
                Icon={AddIcon}
                action={addPacient}
            />

            {
                list.length >= 1 ? 
                (
                    <View style={styles.listView}>
                        <View style={styles.searchInputView}>
                            <Input style={styles.searchInput} id="search-in-shares" borderRadius="$10" borderWidth={1} placeholder="Buscar por nombre" />
                            <SearchIcon style={styles.searchIcon}/>
                        </View>

                        { 
                            list.map((item, index) => (
                                <ContactCard key={index} name={item.name} kindred={item.kindred} avatar={item.avatar} />
                            ))
                        }
                    </View>
                ) :
                (   
                    <View style={styles.emptyView}>
                        <Image style={styles.imageEmpy} source={sharesBackground} />

                        <MontserratText style={styles.infoText}>Comparte la información de tu inhaLux con los que más quieres</MontserratText>
                        <MontserratText style={styles.infoEmpty}>No has compartido tu inhaLux</MontserratText>
                    </View>
                )
            }
        </View>
    )
}

export default SharesTab

const styles = StyleSheet.create({
    emptyView: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
    },
    imageEmpy: {
        marginTop: 24,
        height: "100%",
        maxHeight: '20%',
    	aspectRatio: 1 / 1,
    },
    infoText: {
        textAlign: "center",
        width: "80%",
    },
    infoEmpty: {
        textAlign: "center",
        color: Colors.darkGray
    },
    listView: {
        display: "flex",
        flexDirection: "column",
    },
    searchInputView: {
        position: "relative"
    },
    searchInput: {
        marginTop: 12,
        marginBottom: 24,
        height: 56,
        paddingLeft: 24,
        paddingRight: 60,
        backgroundColor: Colors.white
    },
    searchIcon: {
        position: "absolute",
        top: "31%",
        right: 22
    }
})