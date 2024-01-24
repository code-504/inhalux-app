import Colors from '@/constants/Colors'
import { View, StyleSheet, ImageBackground, BackHandler, Pressable, Dimensions, Keyboard, Alert, NativeSyntheticEvent, TextInputChangeEventData, Share } from 'react-native';
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText';
import { BottomSheetBackdropProps, BottomSheetFlatList, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView, BottomSheetSectionList } from '@gorhom/bottom-sheet';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMonitor } from '@/context/MonitorProvider';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { useRelations } from '@/context/RelationsProvider';
import BlurredBackground from '@/components/BlurredBackground';
import { AlertDialog, Button, Input, XStack, YStack } from 'tamagui';
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
import AddIcon from "@/assets/icons/add.svg"
import TreatmentIcon from "@/assets/icons/prescriptions.svg"
import HistoryIcon from "@/assets/icons/history.svg"
import ShareOptionsIcon from "@/assets/icons/share_options.svg"
import TagSelect, { TabItem, Tag } from '@/components/TagSelect';
import HistorialSearch from '@/components/HistorialSearch';
import TreatmentCard from '@/components/Card/TreatmentCard';
import { FlatList } from 'react-native-gesture-handler';
import { useTreatment } from '@/context/TreatmentProvider';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { SwitchWithLabel } from '@/components/SwitchWithLabel';
import { TimePickerModal } from 'react-native-paper-dates';
import SingleChip from '@/components/Chip';

export default function TabThreeScreen() {

	const navigator = useNavigation();

	//refs
	const monitorListModalRef = useRef<BottomSheetModal>(null);
	const addPacientModalRef  = useRef<BottomSheetModal>(null);
	const bottomSheetRef = useRef<BottomSheetModal>(null); //El general
	const monitorIndex = useRef<number>(0);
	
	//variables
	const monitorSnapPoints = useMemo(() => ['72%', '100%'], []);
	
	const { bottom: bottomSafeArea, top: topSafeArea } = useSafeAreaInsets();

	// callbacks
	const handleMonitorSheetChange = useCallback((index: number) => {
		monitorIndex.current = index;
	}, [])

	const handleOpenPress = () => {
		bottomSheetRef.current?.present();
	};

	useFocusEffect(
		useCallback(() => {

			monitorListModalRef.current?.present();

			return () => {
				addPacientModalRef.current?.close();
				monitorListModalRef.current?.collapse();
			};
		}, [])
	);

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

	const tags=[
		{label: "todo", value: "all"},
		{label: "aceptado", value: "accepted"},
		{label: "cancelado", value: "canceled"},
		{label: "pendiente", value: "pending"},
		{label: "rechazado", value: "denied"},
	]

  const { schedulePushNotification, cancelAllNotifications } = usePushNotifications();
  const { supaTreatment, setSupaTreatment } = useTreatment();
  const { supaUser } = useAuth();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [daysState, setDaysState] = useState<any[]>([])
  const [hoursState, setHoursState] = useState<any[]>([])

  useEffect(() => {
    if(supaTreatment===null) return;
    setDaysState(supaTreatment.days);
    setHoursState(supaTreatment.hours);
  }, [])

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const onDismiss = () => {
    hideDatePicker();
  }

  const onConfirm = ({ hours, minutes }) => {
      setDatePickerVisibility(false);
      if(hours == 0) hours = "00";
      if(minutes < 10) minutes = `0${minutes}`;
      if(minutes == 0) minutes = "00";
      const hora = `${hours}:${minutes}`;
      const nuevoArreglo = [...hoursState, hora]

      const indice = hoursState.indexOf(hora);

      if (indice !== -1) return;

      setHoursState(nuevoArreglo);

      console.log("supaTreatment: ", supaTreatment);
    }

  const handleDayPick = (day: any) => {
    let numeroDia;

    switch (day.toLowerCase()) {
      case 'domingo':
        numeroDia = 1;
        break;
      case 'lunes':
        numeroDia = 2;
        break;
      case 'martes':
        numeroDia = 3;
        break;
      case 'miércoles':
        numeroDia = 4;
        break;
      case 'jueves':
        numeroDia = 5;
        break;
      case 'viernes':
        numeroDia = 6;
        break;
      case 'sábado':
        numeroDia = 7;
        break;
      default:
        // Manejo de caso por si el día no coincide con ninguno de los anteriores
        console.log('Día no válido');
        numeroDia = -1; // Puedes ajustar este valor según tu lógica
    }

    const indice = daysState.indexOf(numeroDia);

    if (indice !== -1) {
      const nuevoArreglo = [...daysState];
      nuevoArreglo.splice(indice, 1);
      console.log(nuevoArreglo);
      setDaysState(nuevoArreglo);
    } else {
      const nuevoArreglo = [...daysState, numeroDia];
      console.log(nuevoArreglo);
      setDaysState(nuevoArreglo);    
    }
    
  }

  const handleAssignTreatment = async() => {
    if( daysState.length === 0 || hoursState.length === 0){
      Alert.alert("Por favor introduzca mínimo 1 día y 1 hora");
      return;
    }

    cancelAllNotifications();
    if(supaTreatment === null){
      setSupaTreatment({
        days: daysState,
        hours: hoursState,
      })

      const { data, error } = await supabase
        .from('treatment')
        .insert([
          { treatment: {days: daysState, hours: hoursState}, fk_user_id: supaUser?.id },
        ])
        .select()

        Alert.alert("¡Tratamiento Asignado!");
    }else{
      setSupaTreatment({
        days: daysState,
        hours: hoursState,
      })
      
      const { data, error } = await supabase
        .from('treatment')
        .update({ treatment: {days: daysState, hours: hoursState} })
        .eq('fk_user_id', supaUser?.id)
        .select()
        Alert.alert("¡Tratamiento Actualizado!");
    }

    hoursState.forEach(hour => {
      const [newHour, minute] = hour.split(':').map(Number);
      daysState.forEach(day => {
        schedulePushNotification(day, newHour, minute);
      });
    });
  }

  const handleRemoveTreatment = async() => {
    setSupaTreatment(null)
    setHoursState([]);
    setDaysState([]);

    const { error } = await supabase
      .from('treatment')
      .delete()
      .eq('fk_user_id', supaUser?.id)
        
    cancelAllNotifications();
    Alert.alert("¡Tratamiento Eliminado!");
  }

  const handleRemoveHour = (hourToRemove: any) => {
    setHoursState((prevHours) => prevHours.filter((hour) => hour !== hourToRemove));
  };

  const handleConfirm = (date: any) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

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
						title="Tratamiento"
						subtitle="Recuerde sus tomas"
						Icon={AddIcon}
						action={()=> handleOpenPress()}
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
						<TabBar.Item Icon={TreatmentIcon} title='Tratamiento' height={(Dimensions.get("screen").height * 0.75) - bottomSafeArea + 12}>
							<BottomSheetScrollView>
							<View style={stylesTab.content}>
								<MontserratBoldText style={styles.treatmentTitle}>
								{ supaTreatment == null ? "¡NO cuentas con tratamiento!" : "Tu tratamiento:"}
								</MontserratBoldText>
								<MontserratSemiText style={styles.daysTag}>Días:</MontserratSemiText>

								<YStack width={"100%"} alignItems="center" space="$3" $xs={{ marginVertical: 20 }}>
									<XStack space="$1" $xs={{ flexDirection: 'row'}}>
									<SwitchWithLabel size="$3" label="Lunes" handleDayPick={handleDayPick} checked={daysState.includes(2)}/>
									<SwitchWithLabel size="$3" label="Martes" handleDayPick={handleDayPick} checked={daysState.includes(3)}/>
									</XStack>
									<XStack space="$1" $xs={{ flexDirection: 'row'}}>
									<SwitchWithLabel size="$3" label="Miércoles" handleDayPick={handleDayPick} checked={daysState.includes(4)}/>
									<SwitchWithLabel size="$3" label="Jueves" handleDayPick={handleDayPick} checked={daysState.includes(5)}/>
									</XStack>
									<XStack space="$1" $xs={{ flexDirection: 'row'}}>
									<SwitchWithLabel size="$3" label="Viernes" handleDayPick={handleDayPick} checked={daysState.includes(6)}/>
									<SwitchWithLabel size="$3" label="Sábado" handleDayPick={handleDayPick} checked={daysState.includes(7)}/>
									</XStack>
									<XStack space="$1" $xs={{ flexDirection: 'row'}}>
									<SwitchWithLabel size="$3" label="Domingo" handleDayPick={handleDayPick} checked={daysState.includes(1)}/>
									</XStack>
								</YStack>

								<MontserratSemiText style={styles.hoursTag}>Horas:</MontserratSemiText>

								<View style={styles.flexView}>
									<Button onPress={showDatePicker} style={styles.hourButton} borderRadius={32} height={52}>
									<MontserratSemiText>Añadir Hora</MontserratSemiText>
									</Button>

									<TimePickerModal
										visible={isDatePickerVisible}
										onDismiss={onDismiss}
										onConfirm={onConfirm}
										hours={12}
										minutes={0}
									/>
								</View>

								<View style={{ flex: 1, flexDirection: "row", gap: 4, alignItems: 'center', justifyContent: 'center', minHeight: 40}}>
									{hoursState.map((hour, index) => (
									<SingleChip key={index} hour={hour} handleRemoveHour={handleRemoveHour} />
									))}
								</View>


								<Button onPress={handleAssignTreatment}>{ supaTreatment === null ? "Asignar " : "Actualizar " }Tratamiento</Button>
								{
									supaTreatment !== null &&
									<Button onPress={handleRemoveTreatment}>Eliminar Tratamiento</Button>
								}
							</View>
							</BottomSheetScrollView>
						</TabBar.Item>

						<TabBar.Item title='Historial' Icon={HistoryIcon} height={(Dimensions.get("screen").height * 0.75) - bottomSafeArea}>
							<View style={stylesTab.content}>
								<View>
									<MontserratSemiText>Historial</MontserratSemiText>
								</View>
								<TagSelect 
									tags={tags}
									renderTabs={(tags, handleTabPress, activeTab) => (
										<FlatList
											data={tags}
											style={{ width: "100%", height: 64 }}
											contentContainerStyle={styles.containerTabs}
											horizontal={true}
											showsHorizontalScrollIndicator={false} 
											renderItem={({ item, index}) => (
												<TabItem 
														key={index} 
														index={index} 
														activeTab={activeTab} 
														handleTabPress={handleTabPress} 
														label={item.label} 
													/>
											)} 
										/>
									)}
								/>	
							</View>	

							<HistorialSearch 
									data={DATA}
									renderSection={(data) => (
										<BottomSheetSectionList 
											nestedScrollEnabled
											showsVerticalScrollIndicator={false}
											sections={data}
											keyExtractor={(_, index) => index.toString()}
											renderItem={({item}) => (
												<TreatmentCard 
													title={item.title}
													message={item.message}
													hour={item.hour}
													type={item.type}
												/>
											)}
											ItemSeparatorComponent={() => (
												<View style={{ height: 16 }}></View>
											)}
											renderSectionHeader={({section: {title}}) => (
												<MontserratSemiText style={styles.header}>{title}</MontserratSemiText>
											)}
											
											onEndReached={() => console.log("hola")}
											contentContainerStyle={{ paddingHorizontal: 24 }}
										/>
									)}
								/>
						</TabBar.Item>
					</TabBar.TabBar>
				</BottomSheetModal>
			</BottomSheetModalProvider>
		</View>
	)
}

const styles = StyleSheet.create({
	treatmentTitle: {
		marginTop: 20,
		fontSize: 20
	},
	daysTag: {
		textAlign: "center",
		marginTop: 20,
	},
	hoursTag: {
		textAlign: "center",
	},
	hourButton: {
		marginTop: 20,
		marginBottom: 20,
		backgroundColor: Colors.primary,
		width: "50%",
	},
	flexView: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},
	header: {
		fontSize: 16,
		color: Colors.darkGray,
		backgroundColor: '#fff',
		paddingVertical: 16
	},
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
	containerTabs: {
		display: "flex",
		flexDirection: "row",
        height: 64,
		gap: 4,
        padding: 4,
        backgroundColor: Colors.lightGrey
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
	subtitleView: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	titleView: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
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
