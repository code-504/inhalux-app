import { View, ScrollView, Animated, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router';
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

interface ListItem {
    id: number;
    text: string;
}

const screenWidth = Dimensions.get("window").width - 48;

const MonitorViewPage = () => {

    const { monitor_id } = useLocalSearchParams();

    const [visible, setVisible] = useState(false);
    const kindredRef = useRef<BottomSheetModal>(null);

    const [data, setData] = useState<ListItem[]>([
        { id: 1, text: 'Papá' },
        { id: 2, text: 'Mamá' },
        { id: 3, text: 'Hermano/a' },
    ]);

    const [selectedId, setSelectedId] = useState<ListItem>();

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

    const handleSelectItem = (item: ListItem) => {
        setSelectedId(item);
        kindredRef.current?.close()
    };

    const renderItem = ({ item }: { item: ListItem }) => (
        <TouchableOpacity
          onPress={() => handleSelectItem(item)}
          style={{
            backgroundColor: selectedId?.id === item.id ? Colors.lightGrey : Colors.white,
            paddingHorizontal: 16,
            paddingVertical: 24,
            borderBottomWidth: 1,
            borderBottomColor: Colors.borderColor,
          }}
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
                                src={AvatarImg}
                            />
                            <Avatar.Fallback backgroundColor={Colors.dotsGray} />
                        </Avatar>

                        <View style={styles.avatarTextView}>
                            <MontserratSemiText style={styles.avatarName}>Jose Palacios Dávila</MontserratSemiText>
                        </View>
                        
                    </View>

                    <View style={styles.cardList}>
                        <View style={styles.cardItem}>
                            <View style={styles.cardTextView}>
                                <MontserratText style={styles.cardTitle}>Parentesco</MontserratText>
                                <MontserratBoldText style={styles.cardText}>{ selectedId?.text }</MontserratBoldText>
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
						<Button onPress={hideDialog} backgroundColor={Colors.redLight} color={Colors.red} borderRadius={100}>Dejar de compartir</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>

            <BottomSheetModal
                ref={kindredRef}
                snapPoints={["50%"]}
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