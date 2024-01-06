import TabBar from '@/components/TabBar';
import Colors from '@/constants/Colors'
import { View, StyleSheet, ImageBackground, BackHandler, Pressable, Dimensions, Keyboard, Alert } from 'react-native';

// Resources
import BackgroundImage from "@/assets/images/background.png"
import PersonIcon from "@/assets/icons/person.svg"
import ShreIcon from "@/assets/icons/share.svg"
import { MontserratBoldText, MontserratText } from '@/components/StyledText';
import PacientsTab from '@/tabs/monitor/pacients';
import SharesTab from '@/tabs/monitor/shares';
import { BottomSheetBackdropProps, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMonitor } from '@/context/MonitorProvider';
import BlurredDeviceBackground from '@/components/blurredBackground/BlurredDeviceBackground';
import BlurredMonitorBackground from '@/components/blurredBackground/BlurredMonitorBackground';
import { Link, Tabs, router, useFocusEffect, useNavigation } from 'expo-router';
import { useRelations } from '@/context/RelationsProvider';
import MonitorHeader from '@/components/Headers/MonitorHeader';
import BlurredBackgroundNew from '@/components/blurredBackground/BlurredBackgroundNew';
import { AlertDialog, Button, Input } from 'tamagui';
import { Camera, useCameraDevices } from "react-native-vision-camera"

// Resources
import QRScannerIcon from "@/assets/icons/qr_code_scanner.svg"
import LinkIcon from "@/assets/icons/link.svg"
import { useIsFocused } from '@react-navigation/native';
import { z } from 'zod';
import { useAuth } from '@/context/Authprovider';
import { supabase } from '@/services/supabase';

export default function TabThreeScreen() {

	const [openDialog, setOpenDialog] = useState({
		option1: false,
		option2: false
	});

	const [addCode , setAddCode] = useState("");
	const [addCodeError, setAddCodeError] = useState("");
	const { supaUser } = useAuth();
	const { optionsOpen, setOptionsOpen } = useMonitor();
	const { pacientState, setPacientState, shareState, setShareState } = useRelations();
	const screenIsFocused = useIsFocused();
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const addPacientModalRef  = useRef<BottomSheetModal>(null);

	const formSchema = z.object({
		addCode: z.string().min(36, { message: "El código debe tener 36 carácteres" })
	})

	const formData = {
		addCode
	}
	
	const addSnapPoints = useMemo(
		() => [
		"24%",
		],
		[]
	);

	// variables
	const snapPoints = useMemo(() => ['35%'], []);

	// callbacks
	const handleSheetChange = useCallback((index: number) => {
		if (index === -1)
			setOptionsOpen(false)
	}, [])

	const handleAddPatient = async() => {
		console.log("pacientState: ", pacientState);
		
		const validationResults = formSchema.safeParse(formData);

		if(!validationResults.success){
			const errors = validationResults.error.format()
			setAddCodeError(
				errors.addCode ? errors.addCode._errors.join(",") : ""
			  );
			return;
		}
			
		setAddCodeError("");
		setAddCode("");
		setOpenDialog({ ...openDialog, option1: false });

		if(addCode === supaUser?.token){ //same code scenario
			Alert.alert("¡No puede agregarse a usted mismo!");
			return;
		}

		let { data: userNewRelation, error: userNewRelationError} = await supabase
			.from('users')
			.select("id, name, last_name, avatar")
			.eq('token', addCode)

		console.log(userNewRelation, userNewRelationError);
		if(userNewRelation === null || userNewRelation.length === 0){ //code doesn't exist scenario
			Alert.alert("¡El token proporcionado NO existe!");
			return;
		}
		
		let { data: relationAlreadyExists, error: relationAlreadyExistsError} = await supabase
			.from('user_relations')
			.select("*")
			.eq('fk_user_monitor', supaUser?.id)
			.eq('fk_user_patient', userNewRelation[0].id)

		if(relationAlreadyExists !== null && relationAlreadyExists.length !== 0){ //code doesn't exist scenario
			Alert.alert("¡Ya tienes a esta persona agregada!");
			return;
		}

		const { data, error } = await supabase
			.from('user_relations')
			.insert([
			{ fk_user_monitor: supaUser?.id, fk_user_patient: userNewRelation[0].id },
			])
			.select()
		
		if(error){ //code doesn't exist scenario
			Alert.alert("¡Uh oh! Algo salió mal...");
			console.log(error);
			return;
		}

		setPacientState({
			...pacientState,
			filterText: "",
			data: [ ...pacientState.data, {
				name: userNewRelation[0].name + ( userNewRelation[0].last_name ? " " + userNewRelation[0].last_name : ""),
				avatar: userNewRelation[0].avatar,
				kindred: "Relativo", 
				pending_state: true
			}]
		})
		
		Alert.alert("¡Solicitud de Relación enviada!");
	}//handleAddPatient

	/*const pacients:PacientsInfo[] = [
		{ 
			name: "Jorge Palacios Dávila",
			avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
			kindred: "Primo"
		},
		{ 
			name: "Susana Hernández Cortés",
			avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
			kindred: "Mamá"
		}
	]
	
	const pacients:PacientsInfo[] = []
	*/	

	const openAddPacientSheet = () => {
		addPacientModalRef.current?.present();
		Keyboard.dismiss();
		setOptionsOpen(true)
	}

	const tabs = [
		{
			id: 1,
			name: 'Pacientes',
			Icon: PersonIcon,
			Component: <PacientsTab pacientState={pacientState} setPacientState={setPacientState} onFunction={openAddPacientSheet} />
		},
		{
			id: 2,
			name: 'Compartidos',
			Icon: ShreIcon,
			Component: <SharesTab shareState={shareState} setShareState={setShareState} />
		}
	]

	useFocusEffect(
		useCallback(() => {
		  return () => {
			addPacientModalRef.current?.close();
			bottomSheetRef.current?.close();
		  };
		}, [])
	  );
		
	/*useFocusEffect(
		useCallback(() => {
		  const onBackPress = () => {
			if (optionsOpen) {
				setOptionsOpen(false)
				addPacientModalRef.current?.close()
			} else
				if (navigator.canGoBack())
					navigator.goBack()

			return true;
		  };
	  
		  BackHandler.addEventListener(
			'hardwareBackPress', onBackPress
		  );
	  
		  return () =>
			BackHandler.removeEventListener(
			  'hardwareBackPress', onBackPress
			);
		}, [optionsOpen])
	);*/

	return (
		<View style={styles.viewArea}>

			<ImageBackground source={BackgroundImage} style={styles.imageBackground} />
			
			<Tabs.Screen
				options={{
					header: () => <MonitorHeader />,
				}}
			/>

			<View style={styles.container}>
				<TabBar tabs={tabs} />
			</View>
				
			<BottomSheetModal
				ref={bottomSheetRef}
				key="OptionsList"
				name="OptionsList"
				index={0}
				enableContentPanningGesture={false}
				enableOverDrag={false}
				onChange={handleSheetChange}
				snapPoints={snapPoints}
				enablePanDownToClose
				backdropComponent={BlurredMonitorBackground}
			>
				<View style={stylesBottom.container}>
					<View>
						<MontserratBoldText style={stylesBottom.title}>Cambiar opciones de compartir</MontserratBoldText>
					</View>
				</View>
			</BottomSheetModal>


			<BottomSheetModal
				ref={addPacientModalRef}
				key="addPacientSheet"
				name="addPacientSheet"
				index={0}
				snapPoints={addSnapPoints}
				enableOverDrag={false}
				backdropComponent={(backdropProps: BottomSheetBackdropProps) => (
					<BlurredBackgroundNew
						{...backdropProps}
						appearsOnIndex={0}
						disappearsOnIndex={-1}
						pressBehavior={"close"}
					/>
				)}
			>
				<View style={stylesBottom.container}>
					<View style={stylesBottom.titleContent}>
						<MontserratBoldText style={stylesBottom.title}>Agregar paciente</MontserratBoldText>
					</View>

					<View style={stylesBottom.buttonsView}>
						<View style={stylesBottom.buttonContent}>
							<Button circular size="$6" onPress={() => { setOpenDialog({ ...openDialog, option1: true }); addPacientModalRef.current?.close(); }}>
								<LinkIcon />
							</Button>

							<MontserratText>Link</MontserratText>
						</View>

						<View style={stylesBottom.buttonContent}>
							<Button circular size="$6" onPress={() => router.push("/monitor/scan_pacient")}>
								<QRScannerIcon />
							</Button>

							<MontserratText>Código qr</MontserratText>
						</View>
					</View>
				</View>
			</BottomSheetModal>

			<AlertDialog open={openDialog.option1}>

					<AlertDialog.Portal>
						<AlertDialog.Overlay
							key="overlay"
							animation="quick"
							opacity={0.5}
							enterStyle={{ opacity: 0 }}
							exitStyle={{ opacity: 0 }}
						/>
						<AlertDialog.Content
							bordered
							elevate
							key="content"
							animation={[
								'quick',
								{
								opacity: {
									overshootClamping: true,
								},
								},
							]}
							enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
							exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
							x={0}
							scale={1}
							opacity={1}
							y={0}
							borderRadius={38}
							padding={24}
							backgroundColor={Colors.white}
						>

						<View style={stylesDialog.content}>

							<View>
								<AlertDialog.Title style={stylesDialog.titleDialog}>Link para agregar paciente</AlertDialog.Title>
								<AlertDialog.Description>
									Es el link que te mando la persona.
								</AlertDialog.Description>
								<Input
									id="test"
									borderRadius={32}
									borderWidth={0}
									secureTextEntry={true}
									placeholder='Colocalo aquí'
									style={stylesDialog.input}
									value={addCode}
									onChangeText={e => setAddCode(e)}
								/>
								{addCodeError != "" && <MontserratText style={styles.errorMessage}>{addCodeError}</MontserratText>}

							</View>

							<View style={stylesDialog.buttonsView}>
								<AlertDialog.Cancel asChild>
									<Button onPress={() => setOpenDialog({ ...openDialog, option1: false })} backgroundColor={ Colors.white }>Cancelar</Button>
								</AlertDialog.Cancel>
								<AlertDialog.Action asChild>
									<Button onPress={() => handleAddPatient()} backgroundColor={Colors.blueLight} color={Colors.black}>Agregar</Button>
								</AlertDialog.Action>
							</View>
						</View>
						</AlertDialog.Content>
					</AlertDialog.Portal>
				</AlertDialog>
		</View>
	)
}

const stylesDialog = StyleSheet.create({
	content: {
	  display: "flex",
	  flexDirection: "column",
	  gap: 24
	},
	titleDialog: {
	  fontSize: 20,
	},
	buttonsView: {
	  display: "flex",
	  flexDirection: "row",
	  justifyContent: "flex-end",
	  gap: 16
	},
	input: {
		height: 60,
		backgroundColor: Colors.inputBackground,
        marginTop: 15
	},
})

const styles = StyleSheet.create({
	errorMessage: {
		fontSize: 10,
		textAlign: "center",
		marginBottom: 0,
		paddingBottom: 0
	},
	viewArea: {
		flex: 1,
        backgroundColor: Colors.lightGrey
	},
	container: {
		flex: 1,
		paddingHorizontal: 0,
	},
	imageBackground: {
		position: "absolute",
		resizeMode: 'cover',
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
		zIndex: -2
	},
})

const stylesBottom = StyleSheet.create({
	container: {
	  display: "flex",
	  flexDirection: "column",
	  gap: 32,
	  paddingHorizontal: 24
	},
	titleContent: {
	  display: "flex",
	  flexDirection: "row",
	  justifyContent: "space-between",
	  alignItems: "center"
	},
	title: {
	  marginTop: 4,
	  fontSize: 18
	},
	buttonsView: {
	  display: "flex",
	  flexDirection: "row",
	  gap: 52
	},
	buttonContent: {
	  display: "flex",
	  flexDirection: "column",
	  alignItems: "center",
	  gap: 8
	}
})
