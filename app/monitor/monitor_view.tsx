import { View, ScrollView, Animated, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import NormalHeader from '@/components/Headers/NormalHeader';
import { Dialog, Divider, Menu, Portal } from 'react-native-paper';
import Ripple from 'react-native-material-ripple';
import Colors from '@/constants/Colors';
import { Avatar, Button } from 'tamagui';
import AvatarImg from "@/assets/images/default_avatar.png"
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText';
import TabBar from '@/components/TabBar';
import SimpleWeatherCard, { FillType } from '@/components/Card/SimpleWeatherCard';
import { BarChart, yAxisSides } from 'react-native-gifted-charts';
import { BottomSheetBackdropProps, BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet/';

// Resources
import WarningIcon from "@/assets/icons/warning.svg"
import EditIcon from "@/assets/icons/edit.svg"
import BlurredBackgroundNew from '@/components/blurredBackground/BlurredBackgroundNew';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/context/Authprovider';
import { useRelations } from '@/context/RelationsProvider';

interface ListItem {
    id: number;
    text: string;
}

const screenWidth = Dimensions.get("window").width - 48;

const MonitorViewPage = () => {

    const { 
		monitor_id,
		monitor_name,
		monitor_kindred,
		monitor_avatar, 
	} = useLocalSearchParams();

	const {supaUser} = useAuth();
	const {shareState, setShareState} = useRelations();
	const navigation = useNavigation();

    const [visible, setVisible] = useState(false);
    const kindredRef = useRef<BottomSheetModal>(null);

    const [data, setData] = useState<ListItem[]>([
        { id: 1, text: 'Padre' },
        { id: 2, text: 'Hijo' },
        { id: 3, text: 'Hermano' },
		{ id: 4, text: 'Abuelo' },
		{ id: 5, text: 'Nieto' },
		{ id: 6, text: 'Relativo' },
    ]);

    const [selectedKindred, setSelectedKindred] = useState<ListItem | string>(String(monitor_kindred));
	const [isLoading, setIsLoading] = useState(false);

    const openMenu = () => setVisible(true);

	const closeMenu = () => setVisible(false);
    
	const barData = [
		{value: 3, label: '27 nov'},
		{value: 7, label: '28 nov'},
		{value: 5, label: '29 nov'},
		{value: 12, label: '30 nov'},
	];

	const DATA = [
		{
		  title: 'Hoy',
		  data: [
			{
				title: "Tratamiento aceptado",
				message: "El tratamiento fue cumplido",
				hour: "12:00 pm",
				type: 0
			},
			{
				title: "Tratamiento no realizado",
				message: "No se registró la inhalación",
				hour: "1:00 pm",
				type: 1
			},
			{
				title: "Pendiente",
				message: "Tratamiento en espera",
				hour: "7:00 pm",
				type: 2
			},
			{
				title: "Cancelado",
				message: "Se canceló el uso del inhalador",
				hour: "8:00 pm",
				type: 3
			}
		  ],
		},{
			title: 'Ayer',
			data: [
			  {
				  title: "Pendiente",
				  message: "Tratamiento en espera",
				  hour: "7:00 pm",
				  type: 2
			  },
			  {
				  title: "Cancelado",
				  message: "Se canceló el uso del inhalador",
				  hour: "8:00 pm",
				  type: 3
			  }
			],
		  },
	  ];


	const [dialog, setDialog] = useState(false);

	const showDialog = () => {
		setVisible(false)
		setDialog(true);
	}

	const hideDialog = () => setDialog(false);

    const handleSelectItem = async(item: ListItem) => {
		setIsLoading(true);
		let patientKindred = "";

		switch (item.text) {
			case 'Padre':
			  patientKindred = "Hijo";
			  break;
			case 'Hijo':
			  patientKindred = "Padre";
			  break;
			case 'Hermano':
			  patientKindred = "Hermano";
			  break;
			case 'Abuelo':
				patientKindred = "Nieto";
				break;
			case 'Nieto':
			  patientKindred = "Abuelo";
			  break;
			default:
			  patientKindred = "Relativo";
			  break;
		  }

		const { data, error } = await supabase
			.from('user_relations')
			.update({ name_from_patient: item.text, name_from_monitor: patientKindred })
			.eq('fk_user_patient', supaUser?.id)
			.eq('fk_user_monitor', monitor_id)
			.select()
		
		if(error){
			console.log(error.message);
			return;
		}

		const updatedShareState = shareState.data.map(elem => {
			if (elem.id === monitor_id) {
			  return { ...elem, kindred: item.text };
			}
			return elem;
		  });
	    
		  setShareState({
            ...shareState,
			filterText: "",
			data: updatedShareState
        })
		
		console.log("monitor_kindred: ", monitor_kindred);
		console.log("patient_kindred: ", patientKindred);
        setSelectedKindred(item.text);
        kindredRef.current?.close()
		setIsLoading(false);
    };

	const deleteRelation = async() => {
		
		const { error } = await supabase
			.from('user_relations')
			.delete()
			.eq('fk_user_patient', supaUser?.id)
			.eq('fk_user_monitor', monitor_id)
		
		if(error){
			console.log(error.message);
			Alert.alert("Algo salió mal...");
			return;
		}

		const updatedShareState = shareState.data.filter(item => item.id !== monitor_id);
		setShareState({
            ...shareState,
			filterText: "",
			data: updatedShareState
        })

		navigation.goBack();
	}

    const renderItem = ({ item }: { item: ListItem }) => (
        <TouchableOpacity
          onPress={() => handleSelectItem(item)}
          style={{
            backgroundColor: selectedKindred?.id === item.id ? Colors.lightGrey : Colors.white,
            paddingHorizontal: 16,
            paddingVertical: 24,
            borderBottomWidth: 1,
            borderBottomColor: Colors.borderColor,
          }}
		  disabled={isLoading}
        >
          <MontserratText>{item.text}</MontserratText>
        </TouchableOpacity>
    );

    return (
        <View style={styles.safeAre}>

            <Stack.Screen options={{
                header: () => <NormalHeader positionHeader='absolute' title={ "Monitor" } />
            }} />
            
            <View style={styles.contentView}>
                <View>
                    <View style={styles.avatarView}>
                        <Avatar size="$14" circular>
                            <Avatar.Image
                                accessibilityLabel="user"
                                src={String(monitor_avatar)}
                            />
                            <Avatar.Fallback backgroundColor={Colors.dotsGray} />
                        </Avatar>

                        <View style={styles.avatarTextView}>
                            <MontserratSemiText style={styles.avatarName}>{monitor_name}</MontserratSemiText>
                        </View>
                        
                    </View>

                    <View style={styles.cardList}>
                        <View style={styles.cardItem}>
                            <View style={styles.cardTextView}>
                                <MontserratText style={styles.cardTitle}>Parentesco</MontserratText>
                                <MontserratBoldText style={styles.cardText}>{ String(selectedKindred) }</MontserratBoldText>
                            </View>

                            <Button circular size="$6" backgroundColor={Colors.white} onPress={() => kindredRef.current?.present()}>
                                <EditIcon />
                            </Button>
                        </View>

                        <View style={styles.cardItem}>
                            <View style={styles.cardTextView}>
                                <MontserratText style={styles.cardTitle}>Fecha de registro</MontserratText>
                                <MontserratBoldText style={styles.cardText}>12 Enero 2024</MontserratBoldText>
                            </View>
                        </View>
                    </View>

                </View>

                <View style={styles.buttonView}>
                    <Button size="$6" borderRadius={100} onTouchEnd={showDialog}>
                        <WarningIcon />
                        <MontserratSemiText>Desvincular cuenta</MontserratSemiText>
                    </Button>
                </View>
            </View>

			<Portal>
				<Dialog visible={dialog} onDismiss={hideDialog} style={{ backgroundColor: Colors.white }}>
					<Dialog.Title>Desvincular monitor</Dialog.Title>
					<Dialog.Content>
					<MontserratText>Esta acción no se puede deshacer</MontserratText>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={hideDialog} backgroundColor={Colors.lightGrey} borderRadius={100}>Cancelar</Button>
						<Button onPress={deleteRelation} backgroundColor={Colors.redLight} color={Colors.red} borderRadius={100}>Dejar de compartir</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>

            <BottomSheetModal
                ref={kindredRef}
                snapPoints={["75%"]}
                enablePanDownToClose
				backdropComponent={(backdropProps: BottomSheetBackdropProps) => (
					<BlurredBackgroundNew
					  	{...backdropProps}
					  	appearsOnIndex={0}
					  	disappearsOnIndex={-1}
					  	pressBehavior={'close'}
					/>
				)}
            >
                <MontserratSemiText style={styles.titleSheet}>Selecciona un elemento</MontserratSemiText>
                <BottomSheetFlatList 
                    data={data}
                    keyExtractor={(_, i) => i.toString()}
                    renderItem={renderItem}
                />
            </BottomSheetModal>
        </View>
    )
}

export default MonitorViewPage

const styles = StyleSheet.create({
    safeAre: {
        flex: 1,
		width: "100%",
        backgroundColor: Colors.white,
		paddingTop: 128
    },
	contentView: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingBottom: 32,
        height: "100%"
	},
	content: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		paddingHorizontal: 24,
	},
	avatarView: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 32,
		gap: 16
	},
	avatarTextView: {
		display: "flex",
		alignItems: "center",
		flexDirection: "column",
		gap: 4
	},
	avatarName: {
		fontSize: 18
	},
    cardList: {
        display: "flex",
        flexDirection: "column",
    },
    cardItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 1,
        height: 104
    },
    cardTextView: {
        display: "flex",
        flexDirection: "column",
        gap: 4
    },
    cardTitle: {
        fontSize: 14,
        color: Colors.darkGray
    },
    cardText: {
        fontSize: 16,
    },
    buttonView: {
        paddingHorizontal: 24
    },
    titleSheet: {
        paddingHorizontal: 24,
        paddingVertical: 24,
        fontSize: 16
    }
})

const stylesTab = StyleSheet.create({
	content: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
		paddingVertical: 24,
		paddingHorizontal: 24,
		gap: 32,
	},
	sectionView: {
		display: "flex",
		flexDirection: "column",
		gap: 16,
	},
	titleView: {
		display: "flex",
		flexDirection: "column",
		gap: 16
	},
	titleContent: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	title: {
		fontSize: 18
	},
	description: {
		fontSize: 14,
		color: Colors.darkGray
	},
	oneBlock: {
		display: "flex",
		flexDirection: "row",
		backgroundColor: Colors.white,
		borderRadius: 28,
		gap: 16
	},
	twoBlock: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 16
	},
	containerChart: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	chart: {
		marginVertical: 8,
	},
	grayButton: {
		backgroundColor: Colors.lightGrey
	},
})