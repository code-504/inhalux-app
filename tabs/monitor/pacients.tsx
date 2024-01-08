import { View, Text, StyleSheet, NativeSyntheticEvent, TextInputChangeEventData, TouchableOpacity, Pressable } from 'react-native'
import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useState
} from 'react'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText'
import HeaderAction from '@/components/HeaderAction'
import { Image } from 'expo-image'
import Colors from '@/constants/Colors'
import { Avatar, Input, ScrollView, Spinner } from 'tamagui'

// Resources
import pacientBackground from "@/assets/images/pacients-empty.png"
import AddIcon from "@/assets/icons/add.svg"
import SearchIcon from "@/assets/icons/search.svg"
import ContactCardPatient from '@/components/Card/ContactCardPacients'
import { FlashList } from '@shopify/flash-list'
import { PacientsTabProps } from '@/interfaces/Monitor'

const PacientsTab = ({ pacientState, setPacientState, onFunction }: PacientsTabProps) => {

    const [hasData, setHasData] = useState<boolean>(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    const handleChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setDebouncedSearchTerm(e.nativeEvent.text)
    }

    useEffect(() => {
        setIsLoading(true);
        const timerId = setTimeout(() => {
            setPacientState(prevState => ({
                ...prevState,
                filterText: debouncedSearchTerm || "",
            }));
            setIsLoading(false)
        }, 400);
    
        // Limpia el temporizador en cada cambio de searchTerm
        return () => {
          clearTimeout(timerId);
        };
      }, [debouncedSearchTerm]);

    useEffect(() => {
        if (pacientState.data === null)
            setHasData(false)
        else
            setHasData(true)

    }, [])

    return (
        <View>
            {
                hasData ? 
                (
                    <>
                    <View style={styles.listView}>

                        <View style={styles.searchInputView}>
                            <MontserratSemiText style={styles.subTitle}>Buscar paciente</MontserratSemiText>
                            <Input style={styles.searchInput} id="search-in-pacients" borderRadius="$10" borderWidth={0} placeholder="Buscar por nombre" onChange={(value) => handleChange(value)} />
                            <SearchIcon style={styles.searchIcon}/>
                        </View>

                        {
                                isLoading && <Spinner />
                            }
                    </View>

                    <View style={styles.listContent}>
                        <FlashList 
                            data={pacientState.data}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => 
                                (<ContactCardPatient name={item.name} kindred={item.kindred} avatar={item.avatar} pending_state={item.pending_state} />)}
                            estimatedItemSize={96}
                        />
                    </View>
                    </>
                ) :
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
        marginTop: 0,
        paddingHorizontal: 24,
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
        height: 64,
        paddingLeft: 24,
        paddingRight: 60,
        backgroundColor: Colors.lightGrey,
    },
    searchIcon: {
        position: "absolute",
        top: "42%",
        right: 24
    },
    subTitle: {
        fontSize: 12,
        color: Colors.darkGray
    },
    headerView: {
        display: "flex",
        flexDirection: "column",
        paddingHorizontal: 24,
        marginBottom: 24
    },
})