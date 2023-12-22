import { View, Text, StyleSheet, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText'
import HeaderAction from '@/components/HeaderAction'
import { Image } from 'expo-image'
import Colors from '@/constants/Colors'
import { Avatar, Input, ScrollView, Spinner } from 'tamagui'

// Resources
import sharesBackground from "@/assets/images/shares-empty.png"
import AddIcon from "@/assets/icons/add.svg"
import SearchIcon from "@/assets/icons/search.svg"
import ContactCard from '@/components/Card/ContactCard'
import { SharesTabProps } from '@/interfaces/Monitor'
import { FlashList } from '@shopify/flash-list'

const SharesTab = ({ shareState, setShareState }: SharesTabProps) => {

    const [hasData, setHasData] = useState<boolean>(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    
    const addShare = () => {
        console.log("Hola")
    }

    const handleChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setDebouncedSearchTerm(e.nativeEvent.text)
    }

    useEffect(() => {
        setIsLoading(true);
        const timerId = setTimeout(() => {
            setShareState({
                ...shareState,
                filterText: debouncedSearchTerm || "",
            });
            setIsLoading(false)
        }, 400);
    
        // Limpia el temporizador en cada cambio de searchTerm
        return () => {
          clearTimeout(timerId);
        };
      }, [debouncedSearchTerm]);

    useEffect(() => {
        if (shareState.data.length === 0)
            setHasData(false)
        else
            setHasData(true)
    }, [])

    return (
        <View>
            <View style={styles.listView}>
            <HeaderAction 
                title="Lista de compartidos"
                subtitle="Compartiste tu inhaLux"
                Icon={AddIcon}
                action={addShare}
            />
            </View>

            {
                hasData ? 
                (
                    <>
                    <View style={styles.listView}>

                        <View style={styles.searchInputView}>
                            <Input style={styles.searchInput} id="search-in-shares" borderRadius="$10" borderWidth={1} placeholder="Buscar por nombre" onChange={(value) => handleChange(value)} />
                            <SearchIcon style={styles.searchIcon}/>
                        </View>

                        {
                                isLoading && <Spinner />
                            }
                    </View>

                    <View style={styles.listContent}>
                        <FlashList 
                            data={shareState.data}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => (<ContactCard name={item.name} kindred={item.kindred} avatar={item.avatar} />)}
                            estimatedItemSize={96}
                        />
                    </View>
                    </>
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
        paddingHorizontal: 24
    },
    listContent: {
        height: "100%"
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