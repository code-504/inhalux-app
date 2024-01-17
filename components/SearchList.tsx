import { View, Text, StyleSheet, NativeSyntheticEvent, TextInputChangeEventData, TouchableOpacity, Pressable, TextInput } from 'react-native'
import React, {
    Dispatch,
    SetStateAction,
    memo,
    useEffect,
    useRef,
    useState
} from 'react'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText'
import HeaderAction from '@/components/HeaderAction'
import { Image } from 'expo-image'
import Colors from '@/constants/Colors'
import { Avatar, Input, ScrollView, Spinner } from 'tamagui'

// Resources
import CloseIcon from "@/assets/icons/close_search.svg"
import SearchIcon from "@/assets/icons/search.svg"
import { SearchListProps } from '@/interfaces/Monitor'

const SearchList = ({ title, state, setState, noData, ListData, placeHolder }: SearchListProps) => {

    const [hasData, setHasData] = useState<boolean>(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
    const [showQuit, setShowQuit] = useState<boolean>(false);
    const inputRef = useRef<TextInput>(null);

    const handleChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        if (e.nativeEvent.text)
            setShowQuit(true)
        else
            setShowQuit(false)

        setDebouncedSearchTerm(e.nativeEvent.text)
    }

    useEffect(() => {
        const timerId = setTimeout(() => {
            setState(prevState => ({
                ...prevState,
                filterText: debouncedSearchTerm || "",
            }));
        }, 400);
    
        // Limpia el temporizador en cada cambio de searchTerm
        return () => {
          clearTimeout(timerId);
        };
      }, [debouncedSearchTerm]);

    useEffect(() => {
        if (!state.data)
            setHasData(false)
        else
            setHasData(true)
    }, [])

    const clearInput = () => {
        setDebouncedSearchTerm("")
        setShowQuit(false)
        inputRef.current?.clear()
    }

    return (
        <View style={styles.content}>
            {
                hasData ? 
                (
                    <>
                    <View style={styles.listView}>

                        <View style={styles.searchInputView}>
                            { title && <MontserratSemiText style={styles.subTitle}>{title}</MontserratSemiText> }
                            <Input ref={inputRef} style={styles.searchInput} borderRadius="$10" borderWidth={0} placeholder={placeHolder ? placeHolder : ""} onChange={(value) => handleChange(value)} />
                            {
                                showQuit ? <CloseIcon style={styles.searchIcon} onTouchStart={clearInput}/> : <SearchIcon style={styles.searchIcon} />
                            }
                        </View>

                        {
                            state.loading && <Spinner />
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

export default memo(SearchList)

const styles = StyleSheet.create({
    content: {
        paddingTop: 16
    },
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
        position: "relative",
        marginTop: 12,
        marginBottom: 12,
        height: 64,
        paddingLeft: 24,
        paddingRight: 60,
        backgroundColor: Colors.lightGrey,
    },
    searchIcon: {
        position: "absolute",
        top: "46%",
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