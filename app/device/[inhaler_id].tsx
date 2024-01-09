import { View, ImageBackground, StyleSheet, ScrollView, Animated } from 'react-native'
import Colors from '@/constants/Colors'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText'
import Card from '@/components/Card/Card'
import { Avatar, Button, Input } from 'tamagui'
import CardOptionsList from '@/components/Card/CardOptionsList'
import { BottomSheetBackdropProps, BottomSheetModal } from '@gorhom/bottom-sheet'
import { StatusBar } from 'expo-status-bar'
import { RefreshControl } from 'react-native-gesture-handler'
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import SimpleWeatherCard from '@/components/Card/SimpleWeatherCard'
import { Image } from 'expo-image';
import { inhalerProps } from '@/context/InhalerProvider'

// Resources
import BackgroundImage from "@/assets/images/background.png"
import AddIcon from "@/assets/icons/add.svg"
import SettingsIcon from "@/assets/icons/settings.svg"
import inhaler from "@/assets/images/inhaler-img.png"
import inhalerShadow from "@/assets/images/inhaler-shadow-img.png"
import BatteryIcon from "@/assets/icons/battery.svg"
import DoseIcon from "@/assets/icons/dose.svg"
import VolumenUpIcon from "@/assets/icons/volume_up.svg"
import TrackChangesIcon from "@/assets/icons/track_changes.svg"
import HelpIcon from "@/assets/icons/help.svg"
import AqIcon from "@/assets/icons/aq.svg"
import HumIcon from "@/assets/icons/humidity_percentage.svg"
import BlurredDeviceBackground from '@/components/blurredBackground/BlurredDeviceBackground'
import { Stack, router, useLocalSearchParams, useNavigation } from 'expo-router'
import { useInhalers } from '@/context/InhalerProvider'
import { supabase } from '@/services/supabase'
import SimpleHeader from '@/components/Headers/SimpleHeader'
import NormalHeader from '@/components/Headers/NormalHeader'

//	Resources
import InhalerBackground from "@/assets/images/inhaler_background.png"
import EditIcon from "@/assets/icons/edit.svg"
import BluetoothIcon from "@/assets/icons/bluetooth.svg"
import InhalerImage from "@/assets/images/inhaler-img.png"
import { BottomSheetProvider } from '@gorhom/bottom-sheet/lib/typescript/contexts'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BlurredBackgroundNew from '@/components/blurredBackground/BlurredBackgroundNew'
import PersonIcon from "@/assets/icons/person.svg"
import ShreIcon from "@/assets/icons/share.svg"
import PacientsTab from '@/tabs/monitor/pacients'
import SharesTab from '@/tabs/monitor/shares'
import { useRelations } from '@/context/RelationsProvider'
import TabBar from '@/components/TabBar'

const Page = () => {
  const [ refresh, setRefresh ] = useState<boolean>(false);
  const { inhaler_id } = useLocalSearchParams();
  //const { fetchSupaInhalerById } = useInhalers();
  const [item, setItem] = useState<inhalerProps | null>(null);
  //const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const {supaInhalers, setSupaInhalers} = useInhalers();
  const [ inhalerName, setInhalerName ] = useState<string>("");
  const navigation = useNavigation();
  const { pacientState, setPacientState, shareState, setShareState } = useRelations();

  /*const getInhaler = async () => {
    setIsLoading(true)
    const inhaler = await fetchSupaInhalerById(String(inhaler_id));

    setItem(inhaler)
    setIsLoading(false);
  }*/

  useEffect(() => {
	const foundInhaler = supaInhalers?.find(inhaler => inhaler.id === inhaler_id);
	const clonedInhaler = {...foundInhaler};
	//console.log("found inhaler, ", foundInhaler);
	setItem(clonedInhaler);
	setInhalerName(foundInhaler.title);

	stadisticListModalRef.current?.present();
  }, [])

  	const pullRequest = async () => {
		setRefresh(true);

		const interval = setInterval(() => {
			setRefresh(false)
		}, 300)

		return () => clearInterval(interval);
	}

	const handleUpdateInhaler = async() => {
		const { data, error } = await supabase
			.from('inhalers')
			.update({ name: inhalerName })
			.eq('id', inhaler_id)
			.select()

		setItem((prevItem) => {
			if (prevItem) {
			  return { ...prevItem, title: inhalerName };
			}
			return prevItem;
		});

		setSupaInhalers(prevSupaInhalers => {
			return prevSupaInhalers.map((inhaler) =>
				inhaler.id === inhaler_id ? { ...inhaler, title: inhalerName } : inhaler
			);
		});

		console.log("supaInhalers ANTES", supaInhalers);
		console.log("item", item);
		console.log("supaInhalers DESPUES", supaInhalers);

	}

	const handleDeleteInhaler = async() => {
		
		const { error } = await supabase
			.from('inhalers')
			.delete()
			.eq('id', inhaler_id)

		setSupaInhalers((prevSupaInhalers) =>
			prevSupaInhalers.filter((inhaler) => inhaler.id !== inhaler_id)
		);

		navigation.navigate('(tabs)');
	}

	// ref
	const bottomSheetRef = useRef<BottomSheetModal>(null);

	// variables
	const snapPoints = useMemo(() => ['50%', '80%'], []);
  
	// callbacks
	const handleOpenPress = useCallback(() => {
		bottomSheetRef.current?.present();
	}, []);

	let scrollOffsetY = useRef(new Animated.Value(0)).current;

	const stadisticListModalRef = useRef<BottomSheetModal>(null);

	// variables
	const { bottom: bottomSafeArea, top: topSafeArea } = useSafeAreaInsets();
	const stadisticSnapPoints = useMemo(() => ['27%', '100%'], []);
	
	const tabs = [
		{
			id: 1,
			name: 'Pacientes',
			Icon: PersonIcon,
			Component: <PacientsTab pacientState={pacientState} setPacientState={setPacientState} onFunction={() => console.log("hola")} />
		},
		{
			id: 2,
			name: 'Compartidos',
			Icon: ShreIcon,
			Component: <SharesTab shareState={shareState} setShareState={setShareState} />
		}
	]

  	return (
		<>
		<View style={styles.safeAre}>

			<Stack.Screen options={{
				header: () => <NormalHeader title={ item?.title || "" } animHeaderValue={scrollOffsetY} />
			}} />
		
			<ScrollView style={styles.scrollView}
				refreshControl={
					<RefreshControl refreshing={refresh} onRefresh={pullRequest}></RefreshControl>
				}
				contentContainerStyle={{ flex: 1 }}

				scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollOffsetY}}}],
                    {useNativeDriver: false}
                )}
			>

				<View style={styles.content}>
					<View style={styles.inhalerTop}>
						<View style={styles.inhalerView}>
							<Image style={styles.inahlerImage} source={InhalerImage} />
							<Image style={styles.inahlerShadowImage} source={inhalerShadow} />	
						</View>
					</View>

					<View style={styles.inhalerInfoView}>
						<MontserratBoldText style={styles.inhalerTitle}>{ item?.title }</MontserratBoldText>
						<MontserratText style={styles.inhalerTime}>{ item?.connection }</MontserratText>

						<View style={styles.inahlerStatus}>
								<View style={styles.inahlerStatusInfo}>
									<BatteryIcon style={styles.inahlerStatusIcon} />
									<MontserratSemiText>{ item?.battery }%</MontserratSemiText>
								</View>

								<View style={styles.inahlerStatusInfo}>
									<DoseIcon style={styles.inahlerStatusIcon} />
									<MontserratSemiText>{ item?.dosis } dosis</MontserratSemiText>
								</View>
							</View>
					</View>

					<View style={styles.buttonView}>
						<View style={styles.inhalerButtonsView}>
							<Button style={styles.inhalerButton} size="$6" borderRadius={'$radius.10'}>
								<VolumenUpIcon />
								<MontserratSemiText>Sonido</MontserratSemiText>
							</Button>

							<Button style={styles.inhalerButton} size="$6" borderRadius={'$radius.10'}>
								<BluetoothIcon />
								<MontserratSemiText>Bluetooth</MontserratSemiText>
							</Button>
						</View>

						<View style={{ height: 64 }}>
							<Button style={styles.inhalerButtonPrimary} size="$6" borderRadius={'$radius.10'} height={64}>
								<TrackChangesIcon />
								<MontserratSemiText>Análisis</MontserratSemiText>
							</Button>
						</View>
						
					</View>
				</View>
				
				<BottomSheetModal
					ref={stadisticListModalRef}
					key="StadisticListSheet"
					name="StadisticListSheet"
					index={0}
					topInset={topSafeArea}
					snapPoints={stadisticSnapPoints}
					enablePanDownToClose={false}
					backdropComponent={(backdropProps: BottomSheetBackdropProps) => (
						<BlurredBackgroundNew
						  {...backdropProps}
						  appearsOnIndex={1}
						  disappearsOnIndex={0}
						  opacity={1}
						  backgroundColor={Colors.white}
						  pressBehavior={'collapse'}
						/>
					  )}
				>

					<View style={stylesBottom.container}>
						<MontserratSemiText style={stylesBottom.subTitle}>Estadísticas</MontserratSemiText>
					</View>

					
					<ScrollView
						automaticallyAdjustContentInsets={false}
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						directionalLockEnabled={true}
						bounces={false}
						scrollsToTop={false}
					>

						<View style={stylesBottom.card}>

						</View>

						<View style={stylesBottom.card}>

						</View>

						<View style={stylesBottom.card}>

						</View>

						<View style={stylesBottom.card}>

						</View>

						<View style={stylesBottom.card}>

						</View>

						<View style={stylesBottom.card}>

						</View>

						<View style={stylesBottom.card}>

						</View>

						<View style={stylesBottom.card}>

						</View>
					</ScrollView>

				</BottomSheetModal>
			
				<Image style={styles.inahlerImageBackground} source={InhalerBackground} />

			</ScrollView> 
			<StatusBar style='auto' translucent={true} />
		</View>
		</>
  	)
}

export default Page


const stylesBottom = StyleSheet.create({
	container: {
		paddingTop: 12,
		paddingBottom: 24,
		paddingHorizontal: 24
	},
	subTitle: {
        fontSize: 12,
        color: Colors.darkGray
    },
	card: {
		width: 300,
		height: 300,
		backgroundColor: "red"
	}
})

const styles = StyleSheet.create({
    safeAre: {
        flex: 1,
		width: "100%",
        backgroundColor: Colors.lightGrey,
    },
	imageBackground: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
    	alignItems: 'center'
	},
	scrollView: {
		width: "100%"
	},
	content: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		paddingHorizontal: 24,
	},
	inahlerImageBackground: {
		position: "absolute",
		top: 0,
		left: "50%",
		transform: [
			{ translateX: -(300 / 2) },
			{ translateY: -(40) }
		],
		width: 300,
		height: 380,
    	//aspectRatio: 5 / 9,
		zIndex: -1
	},
	inhalerTop: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-end",
		alignItems: "center",
		height: "45%",
	},
	inhalerView: {
		position: "relative",
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "flex-end",
		height: 300
	},
	inahlerImage: {
		height: '90%',
    	aspectRatio: 16 / 26,
		zIndex: 2,
	},
	inahlerShadowImage: {
		position: "absolute",
		top: 45,
		left: -25,
		height: '90%',
    	aspectRatio: 16 / 26,
		zIndex: 1,
	},
	inhalerInfoView: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: 4,
		width: "100%",
	},
	inhalerTitle: {
		fontSize: 18
	},
	inhalerTime: {
		fontSize: 14
	},
	buttonView: {
		display: "flex",
		flexDirection: "column",
		gap: 16
	},
	inhalerButtonsView: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 16,
		gap: 8
	},
	inhalerButton: {
		flex: 1,
		backgroundColor: Colors.white
	},
	inhalerButtonPrimary: {
		flex: 1,
		backgroundColor: Colors.primary,
		width: "100%",
		height: 56
	},
	stateView: {
		display: "flex",
		flexDirection: "column",
		gap: 16,
		marginTop: 32
	},
	inahlerStatus: {
		display: "flex",
		flexDirection: "row",
	},
	inahlerStatusInfo: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		marginRight: 8
	},
	inahlerStatusIcon: {
		marginRight: 4
	}
})