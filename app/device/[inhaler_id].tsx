import { View, StyleSheet, ScrollView, Animated, Dimensions, Pressable } from 'react-native'
import Colors from '@/constants/Colors'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText'
import { Button, Spinner } from 'tamagui'
import BottomSheet, { BottomSheetBackdropProps, BottomSheetModal } from '@gorhom/bottom-sheet'
import { StatusBar } from 'expo-status-bar'
import { RefreshControl } from 'react-native-gesture-handler'
import { useCallback, useEffect, useMemo, useRef, useState, lazy, memo } from 'react'
import SimpleWeatherCard, { FillType } from '@/components/Card/SimpleWeatherCard'
import { Image } from 'expo-image';
import { inhalerProps } from '@/context/InhalerProvider'
import { BarChart, yAxisSides } from "react-native-gifted-charts";
import TabBar from '@/components/TabBar'
import { Stack, router, useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { useInhalers } from '@/context/InhalerProvider'
import { supabase } from '@/services/supabase'
import NormalHeader from '@/components/Headers/NormalHeader'
import * as NavigationBar from 'expo-navigation-bar';
import TabBarMultiple from '@/components/TabBarMultiple'
import { Dialog, Divider, Menu, Portal } from 'react-native-paper'
import Ripple from 'react-native-material-ripple'
import BlurredBackground from '@/components/BlurredBackground'

// Resources
import inhalerShadow from "@/assets/images/inhaler-shadow-img.png"
import BatteryIcon from "@/assets/icons/battery.svg"
import DoseIcon from "@/assets/icons/dose.svg"
import VolumenUpIcon from "@/assets/icons/volume_up.svg"
import TrackChangesIcon from "@/assets/icons/track_changes.svg"
import InhalerBackground from "@/assets/images/inhaler_background.png"
import BluetoothIcon from "@/assets/icons/bluetooth.svg"
import InhalerImage from "@/assets/images/inhaler-img.png"
import PillIcon from "@/assets/icons/pill.svg"
import InhalerIcon from "@/assets/icons/inhaler.svg";
import AirWareIcon from "@/assets/icons/airware.svg";
import HelpIcon from "@/assets/icons/help.svg"
import AqIcon from "@/assets/icons/aq.svg"
import HumIcon from "@/assets/icons/humidity_percentage.svg"
import CoIcon from "@/assets/icons/co.svg"
import TempIcon from "@/assets/icons/device_thermostat.svg"
import GasIcon from "@/assets/icons/gas_meter.svg"
import VOCIcon from "@/assets/icons/total_dissolved_solids.svg"
import MoreIcon from "@/assets/icons/more_vert.svg"
import AirUnit from "@/assets/icons/ac_unit.svg"
import ScanImage from "@/assets/images/inhaler-check.png"
import DatePicker from '@/components/DatePicker'
import { getDate } from '@/helpers/date'
import { useInhalerStore } from '@/stores/inhaler'
import { useInhalersData } from '@/api/inhaler'

NavigationBar.setBackgroundColorAsync("transparent")
NavigationBar.setButtonStyleAsync("dark")
NavigationBar.setPositionAsync("absolute");

const Page = () => {
  const [ refresh, setRefresh ] = useState<boolean>(false);
  const [scan, setScan] = useState<boolean>(false);

  const { inhaler_id } = useLocalSearchParams();
  //const { fetchSupaInhalerById } = useInhalers();
  const [item, setItem] = useState<inhalerProps | null>(null);
  //const [ isLoading, setIsLoading ] = useState<boolean>(false);
  //const {supaInhalers, setSupaInhalers} = useInhalers();

  const { supaInhalers, setSupaInhalers, setSupaInhalersFilterById } = useInhalerStore();
  const { data: idata } = useInhalersData();

  useEffect(() => {
	  console.log("inhalersData: ", idata);
	  
	  setSupaInhalers(idata);
  }, [idata])

  //const [ inhalerName, setInhalerName ] = useState<string>("");
  const router = useRouter();

  const scanModalRef = useRef<BottomSheetModal>(null);

  const scanSnapPoints = useMemo(
    () => [
      "70%",
    ],
    []
  );

	useEffect(() => {
		const foundInhaler = supaInhalers?.find((inhaler) => inhaler.id === inhaler_id);
		console.log("se uso filter");
		const clonedInhaler = { ...foundInhaler };
		setItem(clonedInhaler);
		//setInhalerName(foundInhaler.title);
	}, [inhaler_id, supaInhalers]);

	const pullRequest = useCallback(async () => {
		/*setRefresh(true);
		const interval = setInterval(() => {
		  setRefresh(false);
		}, 300);
		return () => clearInterval(interval);*/
	}, []);

	const handleDeleteInhaler = async() => {
		
		const { error } = await supabase
			.from('inhalers')
			.delete()
			.eq('id', inhaler_id)

		setSupaInhalersFilterById(supaInhalers, String(inhaler_id));

		setDialog(false);

		router.back();
	}

	// ref
	const bottomSheetRef = useRef<BottomSheetModal>(null);

	// callbacks
	const handleOpenPress = useCallback(() => {
		bottomSheetRef.current?.present();
	}, []);

	let scrollOffsetY = useRef(new Animated.Value(0)).current;

	const barData = [
		{value: 3, label: '27 nov'},
		{value: 7, label: '28 nov'},
		{value: 5, label: '29 nov'},
		{value: 12, label: '30 nov'},
	];

	const screenWidth = Dimensions.get("window").width - 48;

	const [visible, setVisible] = useState(false);

	const openMenu = () => setVisible(true);

	const closeMenu = () => setVisible(false);

	const [dialog, setDialog] = useState(false);

	const showDialog = () => {
		setVisible(false)
		setDialog(true);
	}

	const hideDialog = () => setDialog(false);

	const onDateChange = useCallback((dateRange: { start: string | null; end: string | null; }) => {
		console.log(dateRange)
	}, [])

	const handleOpenAnalysis = () => {
		scanModalRef.current?.present()
	}

  	return (
		<>
		<View style={styles.safeAre}>

			<Stack.Screen options={{
				header: () => 
					<NormalHeader title={ item?.title || "" } animHeaderValue={scrollOffsetY}>
						
						<Menu
							visible={visible}
							onDismiss={closeMenu}
							contentStyle={{ backgroundColor: Colors.white, borderRadius: 18 }}
							anchor={
								<Ripple style={{ overflow: "hidden", height: 64, width: 64, backgroundColor: Colors.white, borderRadius: 60, display: "flex", justifyContent: "center", alignItems: "center" }}  onPress={openMenu}>
									<MoreIcon />
								</Ripple>
							}>
							<Menu.Item leadingIcon="pencil" 
								onPress={() => {
										if (item) {
											setVisible(false);
											router.push({ pathname: "/device/edit_name", params: { name: item.id } })
										}
									}
								} 
								title="Editar" 
							/>
							<Divider />
							<Menu.Item leadingIcon="delete" onPress={showDialog} title="Eliminar" />
						</Menu>
					</NormalHeader>
			}} />
		
			<ScrollView style={styles.scrollView}
				refreshControl={
					<RefreshControl refreshing={refresh} onRefresh={pullRequest}></RefreshControl>
				}
				scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollOffsetY}}}],
                    {useNativeDriver: false}
                )}
				showsVerticalScrollIndicator={false}
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
							<Button style={styles.inhalerButtonPrimary} size="$6" borderRadius={'$radius.10'} height={64} onPress={handleOpenAnalysis}>
								<TrackChangesIcon />
								<MontserratSemiText>Análisis</MontserratSemiText>
							</Button>
						</View>
						
					</View>
				</View>

				<View style={styles.stadisticContent}>
					<View style={styles.stadisticView}>

					<MontserratSemiText style={styles.sectionTitle}>Estadísticas</MontserratSemiText>

					</View>

					<TabBar.TabBar headerPadding={24}>
						<TabBar.Item Icon={InhalerIcon} title='Inhalux' height={750}>
							<View style={stylesTab.content}>

								<View style={stylesTab.sectionView}>
									<View style={stylesTab.titleView}>
										<MontserratSemiText style={stylesTab.title}>Uso del inhalador</MontserratSemiText>
										<MontserratText style={stylesTab.description}>Ultima conexión hace 10 segundos</MontserratText>
									</View>

									<View style={stylesTab.oneBlock}>
										<SimpleWeatherCard Icon={PillIcon} color={Colors.greenLight} title='Inhalaciones desde la última recarga' value={132} type={FillType.outline} valueStyle={{ fontWeight: "bold", color: Colors.black }} />
									</View>
								</View>

								<View style={stylesTab.sectionView}>
									<View style={stylesTab.subtitleView}>
										<MontserratSemiText style={stylesTab.title}>Resumen de uso</MontserratSemiText>

										<DatePicker 
											onDateChange={onDateChange}
											startRange={getDate(-7)}
											endRange={getDate(0)}
										/>
									</View>

									<View>
										<View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
											<View style={{ marginTop: 14, width: 8, height: 8, borderRadius: 10, backgroundColor: "rgb(0, 106, 38)" }}></View>
											<View>
												<MontserratSemiText style={{ fontSize: 24 }}>10</MontserratSemiText>
												<MontserratText style={{ color: Colors.darkGray }}>Inhalaciones</MontserratText>
											</View>
										</View>
									</View>

									<View style={stylesTab.containerChart}>
						
										<BarChart
											data={barData}
											barWidth={42}
											cappedBars
											capColor={'rgb(0, 106, 38)'}
											capThickness={2}
											showGradient
											gradientColor={'rgba(0, 106, 38, 0.2)'}
											frontColor={'rgba(0, 106, 38, 0)'}
											width={screenWidth - 48}
											yAxisSide={yAxisSides.RIGHT}
											yAxisThickness={0}
											xAxisThickness={0}
											dashGap={15}
											dashWidth={7}
											maxValue={Math.max(...barData.map(item => item.value)) + 1}
											stepHeight={65}
											initialSpacing={30}
											spacing={35}
											noOfSections={5}
											rulesColor={Colors.borderColor}
											rulesThickness={1}
											disablePress
										/>
									</View>
								</View>
							</View>
						</TabBar.Item>

						<TabBar.Item Icon={AirWareIcon} title='Análisis' height={1325}>
							<View style={stylesTab.content}>
								<View style={stylesTab.sectionView}>
									<View style={stylesTab.titleContent}>
										<View style={stylesTab.titleView}>
											<MontserratSemiText style={stylesTab.title}>{`Información de\nla calidad del aire`}</MontserratSemiText>
											<MontserratText style={stylesTab.description}>Último análisis hace 1 minuto</MontserratText>
										</View>

										<Button style={stylesTab.grayButton} alignSelf="center" size="$6" circular onPress={handleOpenPress}>
											<HelpIcon fill={Colors.black} />
										</Button>
									</View>
								</View>

								<View style={stylesTab.sectionView}>
									<View style={stylesTab.twoBlock}>
										<SimpleWeatherCard Icon={AirUnit} color={Colors.blueLight} title="Estado del aire" calification="Excelente" type={FillType.outline} />
									</View>

									<View style={stylesTab.twoBlock}>
										<SimpleWeatherCard Icon={AqIcon} color={Colors.pink} title="Calidad del aire" calification="Buena" value={25} medition='ppm' type={FillType.outline} />
										<SimpleWeatherCard Icon={CoIcon} color={Colors.blueLight} title="Monóxido de carbono" calification="Excelente" value={300} medition='ppm' type={FillType.outline} />
									</View>

									<View style={stylesTab.twoBlock}>
										<SimpleWeatherCard Icon={GasIcon} color={Colors.purpleLight} title="Gas" calification="Regular" value={125} medition='ppm' type={FillType.outline} />
										<SimpleWeatherCard Icon={VOCIcon} color={Colors.greenLight} title="VOC" calification="Bueno" value={50} medition='ppm' type={FillType.outline} />
									</View>

									<View style={stylesTab.twoBlock}>
										<SimpleWeatherCard Icon={TempIcon} color={Colors.brownLight} title="Temperatura" calification="Regluar" value={25} medition='°C' type={FillType.outline} />
										<SimpleWeatherCard Icon={HumIcon} color={Colors.blueLight} title="Humedad" calification="Excelente" value={35} medition='%' type={FillType.outline} />
									</View>
								</View>

								<View style={stylesTab.sectionView}>
									<View style={stylesTab.titleView}>
										<MontserratSemiText style={stylesTab.title}>Resumen del análisis</MontserratSemiText>
									</View>

									<TabBarMultiple>
										<TabBarMultiple.Item title='Calidad del aire'>
											<BarChart
												data={barData}
												barWidth={42}
												cappedBars
												capColor={Colors.purple}
												capThickness={2}
												showGradient
												gradientColor={Colors.purpleLight}
												frontColor={'rgba(0, 0, 0, 0)'}
												width={screenWidth - 48}
												yAxisSide={yAxisSides.RIGHT}
												yAxisThickness={0}
												xAxisThickness={0}
												dashGap={15}
												dashWidth={7}
												maxValue={Math.max(...barData.map(item => item.value)) + 1}
												stepHeight={65}
												initialSpacing={30}
												spacing={35}
												noOfSections={5}
												rulesColor={Colors.borderColor}
												rulesThickness={1}
												disablePress
											/>
										</TabBarMultiple.Item>

										<TabBarMultiple.Item title='CO2'>
											<BarChart
												data={barData}
												barWidth={42}
												cappedBars
												capColor={Colors.blue}
												capThickness={2}
												showGradient
												gradientColor={Colors.blueLight}
												frontColor={'rgba(0, 0, 0, 0)'}
												width={screenWidth - 48}
												yAxisSide={yAxisSides.RIGHT}
												yAxisThickness={0}
												xAxisThickness={0}
												dashGap={15}
												dashWidth={7}
												maxValue={Math.max(...barData.map(item => item.value)) + 1}
												stepHeight={65}
												initialSpacing={30}
												spacing={35}
												noOfSections={5}
												rulesColor={Colors.borderColor}
												rulesThickness={1}
												disablePress
											/>
										</TabBarMultiple.Item>

										<TabBarMultiple.Item title='Gas'>

											<BarChart
												data={barData}
												barWidth={42}
												cappedBars
												capColor={Colors.purple}
												capThickness={2}
												showGradient
												gradientColor={Colors.pink}
												frontColor={'rgba(0, 0, 0, 0)'}
												width={screenWidth - 48}
												yAxisSide={yAxisSides.RIGHT}
												yAxisThickness={0}
												xAxisThickness={0}
												dashGap={15}
												dashWidth={7}
												maxValue={Math.max(...barData.map(item => item.value)) + 1}
												stepHeight={65}
												initialSpacing={30}
												spacing={35}
												noOfSections={5}
												rulesColor={Colors.borderColor}
												rulesThickness={1}
												disablePress
											/>
										</TabBarMultiple.Item>

										<TabBarMultiple.Item title='VOC'>

											<BarChart
												data={barData}
												barWidth={42}
												cappedBars
												capColor={Colors.green}
												capThickness={2}
												showGradient
												gradientColor={Colors.greenLight}
												frontColor={'rgba(0, 0, 0, 0)'}
												width={screenWidth - 48}
												yAxisSide={yAxisSides.RIGHT}
												yAxisThickness={0}
												xAxisThickness={0}
												dashGap={15}
												dashWidth={7}
												maxValue={Math.max(...barData.map(item => item.value)) + 1}
												stepHeight={65}
												initialSpacing={30}
												spacing={35}
												noOfSections={5}
												rulesColor={Colors.borderColor}
												rulesThickness={1}
												disablePress
											/>
										</TabBarMultiple.Item>

										<TabBarMultiple.Item title='Temperatura'>

											<BarChart
												data={barData}
												barWidth={42}
												cappedBars
												capColor={Colors.brown}
												capThickness={2}
												showGradient
												gradientColor={Colors.brownLight}
												frontColor={'rgba(0, 0, 0, 0)'}
												width={screenWidth - 48}
												yAxisSide={yAxisSides.RIGHT}
												yAxisThickness={0}
												xAxisThickness={0}
												dashGap={15}
												dashWidth={7}
												maxValue={Math.max(...barData.map(item => item.value)) + 1}
												stepHeight={65}
												initialSpacing={30}
												spacing={35}
												noOfSections={5}
												rulesColor={Colors.borderColor}
												rulesThickness={1}
												disablePress
											/>
										</TabBarMultiple.Item>

										<TabBarMultiple.Item title='Humedad'>

											<BarChart
												data={barData}
												barWidth={42}
												cappedBars
												capColor={Colors.blue}
												capThickness={2}
												showGradient
												gradientColor={Colors.cyanLight}
												frontColor={'rgba(0, 0, 0, 0)'}
												width={screenWidth - 48}
												yAxisSide={yAxisSides.RIGHT}
												yAxisThickness={0}
												xAxisThickness={0}
												dashGap={15}
												dashWidth={7}
												maxValue={Math.max(...barData.map(item => item.value)) + 1}
												stepHeight={65}
												initialSpacing={30}
												spacing={35}
												noOfSections={5}
												rulesColor={Colors.borderColor}
												rulesThickness={1}
												disablePress
											/>
										</TabBarMultiple.Item>
									</TabBarMultiple>
								</View>
							</View>
						</TabBar.Item>
					</TabBar.TabBar>
				</View>
			
				<Image style={styles.inahlerImageBackground} source={InhalerBackground} />

			</ScrollView> 

			<BottomSheetModal
				ref={scanModalRef}
				snapPoints={scanSnapPoints}
				enablePanDownToClose
				backdropComponent={(backdropProps: BottomSheetBackdropProps) => (
					<BlurredBackground
					  	{...backdropProps}
					  	appearsOnIndex={0}
					  	disappearsOnIndex={-1}
					  	pressBehavior={'collapse'}
					/>
				)}
			>
				<View style={stylesBottom.conainer}>

					{
						scan ? <View style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}><Spinner /></View>
						:
						<View style={stylesBottom.infoView}>
							<Image style={stylesBottom.image} source={ScanImage} />
							
							<View style={stylesBottom.infoTextView}>
								<MontserratBoldText style={stylesBottom.infoTitle}>Sostén tu inhalux</MontserratBoldText>
								<MontserratText style={stylesBottom.infoText}>Asegúrate de sostener de la siguiente forma tu inhaLux para tener una lectura apropiada.</MontserratText>
							</View>
						</View>
					}

					<Button style={stylesBottom.button} borderRadius={100} onPress={() => setScan(!scan)}><MontserratSemiText>Empezar escaneo</MontserratSemiText></Button>
				</View>
			</BottomSheetModal>

			<StatusBar style='auto' translucent={true} backgroundColor='transparent' />

			<Portal>
				<Dialog visible={dialog} onDismiss={hideDialog} style={{ backgroundColor: Colors.white }}>
					<Dialog.Title>Eliminar inhalador</Dialog.Title>
					<Dialog.Content>
					<MontserratText>Esta acción no se puede deshacer</MontserratText>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={hideDialog} backgroundColor={Colors.lightGrey} borderRadius={100}>Cancelar</Button>
						<Button onPress={handleDeleteInhaler} backgroundColor={Colors.redLight} color={Colors.red} borderRadius={100}>Eliminar</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</View>
		</>
  	)
}

export default memo(Page)

const stylesBottom = StyleSheet.create({
	conainer: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 64,
		paddingHorizontal: 24,
		paddingVertical: 32,
	},
	image: {
		width: "80%",
		aspectRatio: 1 / 1
	},
	infoView: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: 32
	},
	infoTextView: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: 8
	},
	infoTitle: {
		fontSize: 20
	},
	infoText: {
		width: "100%",
		maxWidth: 320,
		textAlign: "center",
		fontSize: 14
	},
	button: {
		height: 60,
		width: "100%",
		backgroundColor: Colors.primary,
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
		flexDirection: "column",
		gap: 8
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

const styles = StyleSheet.create({
    safeAre: {
        flex: 1,
		width: "100%",
        backgroundColor: Colors.white,
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
		height: 400,
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
		fontSize: 24
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
		gap: 16
	},
	inhalerButton: {
		flex: 1,
		backgroundColor: Colors.secondary
	},
	inhalerButtonPrimary: {
		flex: 1,
		backgroundColor: Colors.primary,
		width: "100%",
		height: 56
	},
	stadisticContent: {
		borderRadius: 38,
		marginTop: 32,
		backgroundColor: Colors.white
	},
	stadisticView: {
		marginTop: 32,
		paddingHorizontal: 24
	},
	sectionTitle: {
		fontSize: 16
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
	},
})