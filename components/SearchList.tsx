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
import { SearchListProps } from '@/interfaces/Monitor'

const SearchList = ({ title, state, setState, noData, ListData, placeHolder }: SearchListProps) => {

    const [hasData, setHasData] = useState<boolean>(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    const handleChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setDebouncedSearchTerm(e.nativeEvent.text)
    }

    useEffect(() => {
        setIsLoading(true);
        const timerId = setTimeout(() => {
            setState(prevState => ({
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
        if (state.data === null)
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
                            { title && <MontserratSemiText style={styles.subTitle}>{title}</MontserratSemiText> }
                            <Input style={styles.searchInput} borderRadius="$10" borderWidth={0} placeholder={placeHolder ? placeHolder : ""} onChange={(value) => handleChange(value)} />
                            <SearchIcon style={styles.searchIcon}/>
                        </View>

                        {
                            isLoading && <Spinner />
                        }
                    </View>

                    <View style={styles.listContent}>
                        {
                            ListData
                        }
                    </View>
                    </>
                ) :
                (   
                    <View style={styles.emptyView}>
                        <Image style={styles.imageEmpy} source={noData.BackgroundImage} />

                        { noData && <MontserratText style={styles.infoText}>{noData.message}</MontserratText> }
                        <MontserratText style={styles.infoEmpty}>{noData.title}</MontserratText>
                    </View>
                )
            }
        </View>
    )
}

export default SearchList

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