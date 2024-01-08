import TabBar from '@/components/TabBar';
import Colors from '@/constants/Colors'
import { View, StyleSheet, ImageBackground, BackHandler, Pressable, Dimensions, Keyboard, Alert } from 'react-native';

// Resources
import BackgroundImage from "@/assets/images/background.png"
import PersonIcon from "@/assets/icons/person.svg"
import ShreIcon from "@/assets/icons/share.svg"
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText';
import PacientsTab from '@/tabs/monitor/pacients';
import SharesTab from '@/tabs/monitor/shares';
import { BottomSheetBackdropProps, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
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
import HeaderAction from '@/components/HeaderAction';

// Resources
import QRScannerIcon from "@/assets/icons/qr_code_scanner.svg"
import LinkIcon from "@/assets/icons/link.svg"
import AddIcon from "@/assets/icons/add.svg"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {useKeyboard} from '@react-native-community/hooks'
import { z } from 'zod';
import { useAuth } from '@/context/Authprovider';
import { supabase } from '@/services/supabase';
import { useIsFocused } from '@react-navigation/native';

export default function TabThreeScreen() {

	const [openDialog, setOpenDialog] = useState({
		option1: false,
		option2: false
	});

	const [statusColor, setStatusColor] = useState<boolean>(false);

	const [addCode , setAddCode] = useState("");
	const [addCodeError, setAddCodeError] = useState("");
	const { supaUser } = useAuth();
	const { optionsOpen, setOptionsOpen } = useMonitor();
	const { pacientState, setPacientState, shareState, setShareState } = useRelations();
	const keyboardHook = useKeyboard();
	const navigator = useNavigation();

	const addPacientModalRef  = useRef<BottomSheetModal>(null);

	const formSchema = z.object({
		addCode: z.string().min(36, { message: "El código debe tener 36 carácteres" })
	})

	const formData = {
		addCode
	}
	const monitorListModalRef = useRef<BottomSheetModal>(null);
	const monitorIndex = useRef<number>(0);
	
	const addSnapPoints = useMemo(
		() => [
		"24%",
		],
		[]
	);

	// variables
	const { bottom: bottomSafeArea, top: topSafeArea } = useSafeAreaInsets();
	
	const monitorSnapPoints = useMemo(() => ['74%', '100%'], []);

	// callbacks
	const handleMonitorSheetChange = useCallback((index: number) => {
		monitorIndex.current = index;

		if (index === 0) 
			Keyboard.dismiss()
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

			monitorListModalRef.current?.present();

			return () => {
				addPacientModalRef.current?.close();
				monitorListModalRef.current?.collapse();
			};
		}, [])
	);

	useEffect(() => {
		if (!keyboardHook.keyboardShown) {
			Keyboard.dismiss()
		} else {
			monitorListModalRef.current?.expand()
		}
		
	}, [keyboardHook.keyboardShown])
		
	useFocusEffect(
		useCallback(() => {
		  const onBackPress = () => {

			if (monitorIndex.current === 1) {
				monitorListModalRef.current?.collapse();
			} else {
				if (navigator.canGoBack())
					navigator.goBack()
			}

			/*if (optionsOpen) {
				setOptionsOpen(false)
				addPacientModalRef.current?.close()
			} else
				if (navigator.canGoBack())
					navigator.goBack()*/

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
	);

	return (
		<View style={styles.viewArea}>

			<ImageBackground source={BackgroundImage} style={styles.imageBackground} />

			<BottomSheetModalProvider>

				<MonitorHeader />
					
				<View style={[ styles.container, styles.headerView]}>
					<HeaderAction 
						title="Monitoreo"
						subtitle="Comparte y mira la cuenta de otros"
						Icon={AddIcon}
						action={()=> console.log("Add")}
					/>
				</View>

				<BottomSheetModal
					ref={monitorListModalRef}
					key="MonitorListSheet"
					name="MonitorListSheet"
					index={0}
					topInset={topSafeArea}
					snapPoints={monitorSnapPoints}
					enablePanDownToClose={false}
					onChange={handleMonitorSheetChange}
					enableHandlePanningGesture={false}
					enableOverDrag={false}
					enableContentPanningGesture={false}
					handleIndicatorStyle={{ height: 0 }}
					backdropComponent={(backdropProps: BottomSheetBackdropProps) => (
						<BlurredBackgroundNew
						  {...backdropProps}
						  appearsOnIndex={1}
						  disappearsOnIndex={0}
						  backgroundColor={Colors.white}
						  opacity={1}
						  pressBehavior={'collapse'}
						/>
					  )}
				>

					<TabBar tabs={tabs} />

				</BottomSheetModal>
			</BottomSheetModalProvider>
				
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
		paddingHorizontal: 24,
	},
	headerView: {
		marginTop: 24
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
	  paddingHorizontal: 24,
	  paddingTop: 16
	},
	titleContent: {
	  display: "flex",
	  flexDirection: "row",
	  justifyContent: "space-between",
	  alignItems: "center"
	},
	title: {
		fontSize: 20,
		lineHeight: 26,
		marginBottom: 16
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
