import Colors from '@/constants/Colors'
import { View, StyleSheet, ImageBackground, BackHandler, Pressable, Dimensions, Keyboard, Alert, NativeSyntheticEvent, TextInputChangeEventData, Share } from 'react-native';
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText';
import { BottomSheetBackdropProps, BottomSheetFlatList, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMonitor } from '@/context/MonitorProvider';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { useRelations } from '@/context/RelationsProvider';
import BlurredBackground from '@/components/BlurredBackground';
import { AlertDialog, Button, Input } from 'tamagui';
import HeaderAction from '@/components/HeaderAction';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {useKeyboard} from '@react-native-community/hooks'
import { z } from 'zod';
import { useAuth } from '@/context/Authprovider';
import { supabase } from '@/services/supabase';
import TabBar from '@/components/TabBar';
import ContactCardPatient from '@/components/Card/ContactCardPacients';
import ContactCardShare from '@/components/Card/ContactCardShare';
import SearchList from '@/components/SearchList';
import UserHeader from '@/components/Headers/UserHeader';

// Resources
import BackgroundImage from "@/assets/images/background.png"
import PersonIcon from "@/assets/icons/person.svg"
import ShareIcon from "@/assets/icons/share.svg"
import QRScannerIcon from "@/assets/icons/qr_code_scanner.svg"
import LinkIcon from "@/assets/icons/link.svg"
import AddIcon from "@/assets/icons/add.svg"
import monitorBackground from "@/assets/images/shares-empty.png"
import pacientBackground from "@/assets/images/pacients-empty.png"
import ShareOptionsIcon from "@/assets/icons/share_options.svg"
import AddPersonIcon from "@/assets/icons/person_add.svg"

export default function TabThreeScreen() {

	const { supaUser } = useAuth();

	const [openDialog, setOpenDialog] = useState({
		option1: false,
		option2: false
	});
	const [addCode , setAddCode] = useState("");
	const [addCodeError, setAddCodeError] = useState("");

	const { pacientState, setPacientState, shareState, setShareState } = useRelations();
	const keyboardHook = useKeyboard();
	const navigator = useNavigation();

	const formSchema = z.object({
		addCode: z.string().min(36, { message: "El código debe tener 36 carácteres" })
	})

	const formData = {
		addCode
	}

	//refs
	const monitorListModalRef = useRef<BottomSheetModal>(null);
	const addPacientModalRef  = useRef<BottomSheetModal>(null);
	const bottomSheetRef = useRef<BottomSheetModal>(null); //El general
	const monitorIndex = useRef<number>(0);
	
	//variables
	const addSnapPoints = useMemo(() => ["25%",],[]);

	const generalSnapPoints = useMemo(() => ['30%',], []);

	const monitorSnapPoints = useMemo(() => ['72%', '100%'], []);
	
	const { bottom: bottomSafeArea, top: topSafeArea } = useSafeAreaInsets();

	// callbacks
	const handleMonitorSheetChange = useCallback((index: number) => {
		monitorIndex.current = index;

		if (index === 0) 
			Keyboard.dismiss()
	}, [])

	const handleOpenPress = () => {
		bottomSheetRef.current?.present();
	};

	const openAddPacientSheet = () => {
		bottomSheetRef.current?.dismiss();
		addPacientModalRef.current?.present();
		Keyboard.dismiss();
	}

	const openShareCodeSheet = () => {
		router.push("/monitor/share_link")
		bottomSheetRef.current?.close();
	}

	//Funcs
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
				id:  userNewRelation[0].id,
				name: userNewRelation[0].name + ( userNewRelation[0].last_name ? " " + userNewRelation[0].last_name : ""),
				avatar: userNewRelation[0].avatar,
				kindred: "Relativo", 
				pending_state: true
			}]
		})
		
		Alert.alert("¡Solicitud de Relación enviada!");
	}//handleAddPatient
	
	/*const pacients:PacientsInfo[] = []
	*/	

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
		if (keyboardHook.keyboardShown)
			monitorListModalRef.current?.expand()	
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

			return true;
		  };
	  
		  BackHandler.addEventListener(
			'hardwareBackPress', onBackPress
		  );
	  
		  return () =>
			BackHandler.removeEventListener(
			  'hardwareBackPress', onBackPress
			);
		}, [])
	);

	return (
		<View style={styles.viewArea}>
			<BottomSheetModalProvider>

				<ImageBackground source={BackgroundImage} style={styles.imageBackground} />

				<UserHeader showUserName={false} transparent>
					<Button onPress={() => router.push("/configuration/shareoptions")} backgroundColor={Colors.white} alignSelf="center" size="$6" circular>
						<ShareOptionsIcon />
					</Button>
				</UserHeader>
					
				<View style={[ styles.container, styles.headerView]}>
					<HeaderAction 
						title="Monitoreo"
						subtitle="Comparte y mira la cuenta de otros"
						Icon={AddIcon}
						action={()=> handleOpenPress()}
					/>
				</View>

				<BottomSheetModal
					keyboardBehavior='interactive'
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
					bottomInset={bottomSafeArea - 24}
					backdropComponent={(backdropProps: BottomSheetBackdropProps) => (
						<BlurredBackground
						  {...backdropProps}
						  appearsOnIndex={1}
						  disappearsOnIndex={0}
						  backgroundColor={Colors.white}
						  opacity={1}
						  pressBehavior={'collapse'}
						  name='Monitor'
						/>
					  )}
				>

					<TabBar.TabBar headerPadding={24}>
						<TabBar.Item Icon={PersonIcon} title='Pacientes' height={(Dimensions.get("screen").height * 0.75) - bottomSafeArea + 12}>
							
							<SearchList 
								title='Buscar paciente'
								placeHolder='Buscar por nombre'
								state={pacientState}
								setState={setPacientState}
								noData={{
									title: "No hay pacientes",
									BackgroundImage: pacientBackground,
									message: "Monitorea el inhalador de alguien más de forma rápida y segura"
								}}
								ListData={
									<BottomSheetFlatList 
										data={pacientState.data}
										keyExtractor={(_, i) => i.toString()}
										renderItem={({ item }) => (
												<ContactCardPatient 
													id={item.id} 
													name={item.name} 
													kindred={item.kindred} 
													avatar={item.avatar} 
													pending_state={item.pending_state} 
												/>
										)}
									/>
								}
							/>
						</TabBar.Item>

						<TabBar.Item Icon={ShareIcon} title='Monitores' height={(Dimensions.get("screen").height * 0.75) - bottomSafeArea + 12}>

							<SearchList 
								title='Buscar monitor'
								placeHolder='Buscar por nombre'
								state={shareState}
								setState={setShareState}
								noData={{
									title: "No hay monitores",
									BackgroundImage: monitorBackground,
									message: "Comparte la información de tu inhaLux con los que más quieres"
								}}
								ListData={
									<BottomSheetFlatList 
										data={shareState.data}
										keyExtractor={(_, i) => i.toString()}
										renderItem={({ item }) => 
										(<ContactCardShare id={item.id} name={item.name} kindred={item.kindred} avatar={item.avatar} pending_state={item.pending_state} />)}
									/>
								}
							/>
						</TabBar.Item>
					</TabBar.TabBar>
				</BottomSheetModal>
			</BottomSheetModalProvider>

			<BottomSheetModal
				ref={bottomSheetRef}
				snapPoints={generalSnapPoints}
				index={0}
				backdropComponent={(backdropProps: BottomSheetBackdropProps) => (
					<BlurredBackground
					  {...backdropProps}
					  appearsOnIndex={0}
					  disappearsOnIndex={-1}
					  backgroundColor={Colors.black}
					  pressBehavior={'close'}
					/>
				)}
			>
				<View style={stylesBottom.container}>
					<View style={stylesBottom.titleContent}>
						<MontserratSemiText style={stylesBottom.title}>¿Qué deseas hacer?</MontserratSemiText>
					</View>
					
					<View style={{ gap: 16 }}>
						<Button onPress={() => openShareCodeSheet()} backgroundColor={Colors.lightGrey} size="$6" borderRadius={'$radius.10'}>
							<ShareIcon />
							<MontserratSemiText style={{color: Colors.black}}>Compartir mi Cuenta</MontserratSemiText>
						</Button>
						<Button onPress={() => openAddPacientSheet()} backgroundColor={Colors.lightGrey} size="$6" borderRadius={'$radius.10'}>
							<AddPersonIcon />
							<MontserratSemiText>Agregar una Cuenta</MontserratSemiText>
						</Button>
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
					<BlurredBackground
						{...backdropProps}
						appearsOnIndex={0}
						disappearsOnIndex={-1}
						pressBehavior={"close"}
					/>
				)}
			>
				<View style={stylesBottom.container}>
					<View style={stylesBottom.titleContent}>
						<MontserratBoldText style={stylesBottom.title}>Agregar paciente usando...</MontserratBoldText>
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
									Usa el link que te mando tu relativo.
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
	addButton: {
		flex: 1,
		backgroundColor: Colors.primary,
		minHeight: 60
	},
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
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
		resizeMode: 'cover',
		justifyContent: 'center',
    	alignItems: 'center',
	},
})

const stylesBottom = StyleSheet.create({
	description: {
		fontSize: 14,
		lineHeight: 20,
		color: Colors.darkGray,
		marginBottom: 16
	},
	container: {
	  display: "flex",
	  flexDirection: "column",
	  gap: 16,
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
		marginBottom: 16,
		textAlign: "center"
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
