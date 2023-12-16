import { ImageBackground, View, StyleSheet, Dimensions, Alert, NativeSyntheticEvent, NativeScrollEvent, Animated, ViewToken } from 'react-native'
import { FlashList } from "@shopify/flash-list";
import { Button, ScrollView, Switch } from 'tamagui'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '@/constants/Colors'
import Card from '@/components/Card/Card'
import { Image } from 'expo-image';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SimpleWeatherCard from '@/components/Card/SimpleWeatherCard'
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import {ExpandingDot} from "react-native-animated-pagination-dots";
import { supabase } from '@/services/supabase'
import HeaderAction from '@/components/HeaderAction'

// Recursos
import { MontserratText, MontserratBoldText, MontserratSemiText } from '@/components/StyledText'
import BackgroundImage from "@/assets/images/background.png"

// Resourses
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
import { useAuth } from '@/context/Authprovider';
import { getInhalers } from '@/services/api/device';
import { RefreshControl } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import BlurredBackground from '@/components/blurredBackground/BlurredBackground';
import BlurredDeviceBackground from '@/components/blurredBackground/BlurredDeviceBackground';
import { useHeaderHeight } from '@react-navigation/elements';
import DeviceHeader from '@/components/Headers/DeviceHeader';
import { useInhalers } from '@/context/InhalerProvider';

NavigationBar.setBackgroundColorAsync(Colors.lightGrey);
NavigationBar.setButtonStyleAsync("dark");

export default function TabOneScreen() {

	const scrollX = useRef(new Animated.Value(0)).current
	const [ refresh, setRefresh ] = useState<boolean>(false);
	const { supaInhalers: data, setSupaInhalers } = useInhalers();
	//const [ data, setData ] = useState<any[]>([]);

	// const { session, } = useAuth();

	// const inhalerlist = async () => {
	// 	const inhalers = await getInhalers(session?.user.id);
		
	// 	if (inhalers)
	// 		setData(inhalers)
	// 	else
	// 		setData([])
	// }

	// useEffect(() => {
	// 	inhalerlist()
	// }, [])

	//console.log(pruebasData);

	const { width: screenWidth } = Dimensions.get('window');
	const SPACING = 12;
	const ITEM_WIDTH = screenWidth - 24;

	const doLogout = async () => {
		const { error } = await supabase.auth.signOut();

		if (error)
			Alert.alert("Error", error.message)
	}

	const pullRequest = async () => {
		setRefresh(true);

		//await inhalerlist();

		setRefresh(false)

		//return () => clearInterval(interval);
	}

	//console.log("DEVICE-DATA", data);

	// ref
	const bottomSheetRef = useRef<BottomSheetModal>(null);

	// variables
	const snapPoints = useMemo(() => ['50%', '80%'], []);
  
	// callbacks
	const handleOpenPress = useCallback(() => {
		bottomSheetRef.current?.present();
	}, []);

	const headerHeight = useHeaderHeight();

	const RenderItem = ({ item }: any) => (
		<Card style={styles.inahlerCard} radius={44}>
			<View style={styles.inahlerCardView}>
				<View style={styles.inahlerCardContent}>
					<View style={styles.inhalerCardLeft}>
						<View style={styles.inahlerButton}>
							<Button style={styles.settingsButton} alignSelf="center" size="$6" circular>
								<SettingsIcon />
							</Button>
						</View>

						<View style={styles.inahlerView}>
							<View style={styles.inahlerTitleView}>
								<MontserratBoldText style={styles.inahlerTitle}>{ item.title }</MontserratBoldText>
								<MontserratText>{ item.connection }</MontserratText>
							</View>

							<View style={styles.inahlerStatus}>
								<View style={styles.inahlerStatusInfo}>
									<BatteryIcon style={styles.inahlerStatusIcon} />
									<MontserratSemiText>{ item.battery }%</MontserratSemiText>
								</View>

								<View style={styles.inahlerStatusInfo}>
									<DoseIcon style={styles.inahlerStatusIcon} />
									<MontserratSemiText>{ item.dose } dosis</MontserratSemiText>
								</View>
							</View>
						</View>
					</View>

					<View style={styles.inhalerCardRight}>
						<Image style={styles.inahlerImage} source={inhaler} />
						<Image style={styles.inahlerShadowImage} source={inhalerShadow} />
					</View>
				</View>

				<View style={styles.inhalerButtonsView}>
					<Button style={styles.inhalerButton} size="$6" borderRadius={'$radius.10'}>
						<VolumenUpIcon />
						<MontserratSemiText>Sonido</MontserratSemiText>
					</Button>

					<Button style={styles.inhalerButton} size="$6" borderRadius={'$radius.10'}>
						<TrackChangesIcon />
						<MontserratSemiText>Análisis</MontserratSemiText>
					</Button>
				</View>
			</View>
		</Card>
	);

	return (
		<>
		<View style={styles.safeAre}>
			
			<ImageBackground source={BackgroundImage} style={styles.imageBackground}>
			<ScrollView style={styles.scrollView}
				refreshControl={
					<RefreshControl refreshing={refresh} onRefresh={pullRequest}></RefreshControl>
				}
			>
				<View style={styles.content}>
					<HeaderAction 
						title="Dispositivos"
						subtitle="Información general"
						Icon={AddIcon}
						action={doLogout}
					/>
				</View>
					{/* Inicio */}

					{
						data && data.length > 0 ? (
							<>
							<View style={styles.carouselView}>

								<FlashList 
									data={data}
									keyExtractor={(item: any) => item.id}
									horizontal
									showsHorizontalScrollIndicator={false}
									pagingEnabled
									decelerationRate={0}
									snapToInterval={ITEM_WIDTH}
									snapToAlignment={"center"}
									scrollEventThrottle={16}
									estimatedItemSize={ITEM_WIDTH}
									onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } }}], {
										useNativeDriver: false
									})}
									renderItem={({ item, index }) => {
										return (
											<View style={{ width: ITEM_WIDTH, marginTop: 20 }}>
												<View style={{ marginHorizontal: SPACING * 2 }}>
													<RenderItem item={ item } />
												</View>
											</View>
										);
									}}
								/>
								<View style={styles.dotContainer}>
									<ExpandingDot
											data={data}
											expandingDotWidth={30}
											scrollX={scrollX}
											inActiveDotOpacity={0.6}
											dotStyle={{
												width: 10,
												height: 10,
												borderRadius: 5,
												marginHorizontal: 5
											}}
											inActiveDotColor={Colors.dotsGray}
											activeDotColor={Colors.tint}
											containerStyle={styles.dotsView}
										/>
								</View>
							</View>
							</>
					) : (
							<View style={styles.noInhalersView}>
								<MontserratText style={styles.timeText}>No tienes Inhaladores!</MontserratText>
							</View>
				)}	
					
				{/* Final */}
				<View style={styles.content}>
					<View style={styles.timeView}>
						<View style={styles.timeTitleView}>
							<View style={styles.timeTitle}>
								<MontserratText style={styles.timeText}>Pronóstico del</MontserratText>
								<MontserratBoldText style={styles.timeText}>Tiempo</MontserratBoldText>
								<MontserratBoldText style={styles.timeLocationText}>En Guadalajara</MontserratBoldText>
							</View>

							<Button style={styles.whiteButton} alignSelf="center" size="$6" circular onPress={handleOpenPress}>
								<HelpIcon />
							</Button>
						</View>

						<View style={styles.twoBlock}>
							<SimpleWeatherCard Icon={AqIcon} color={Colors.pink} title="Calidad del aire" calification="Buena" value="25 ppm" />
							<SimpleWeatherCard Icon={HumIcon} color={Colors.cyan} title="Humedad" calification="Excelente" value="35%" />
						</View>
					</View>
				</View>
			</ScrollView>

			<BottomSheetModal
				ref={bottomSheetRef}
				key="PoiListSheet"
				name="PoiListSheet"
				index={0}
				snapPoints={snapPoints}
				enablePanDownToClose
				backdropComponent={BlurredDeviceBackground}
			>
				<View style={stylesBottom.container}>
					<View>
						<MontserratBoldText style={stylesBottom.title}>Información sobre la calidad del aire</MontserratBoldText>
						<MontserratText style={stylesBottom.infoText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</MontserratText>
					</View>
				</View>
			</BottomSheetModal>

			</ImageBackground>
		</View>
		<StatusBar style="auto" backgroundColor="transparent" />
		</>
	)
}

const stylesBottom = StyleSheet.create({
	container: {
		paddingTop: 16,
		paddingHorizontal: 24
	},
	title: {
		fontSize: 26,
		lineHeight: 36,
		marginBottom: 16
	},
	infoText: {
		fontSize: 16,
		lineHeight: 22,
		color: Colors.darkGray
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
        display: 'flex',
        flexDirection: 'column',
        marginTop: 22,
		marginBottom: 12,
        paddingHorizontal: 24,
    },
	noInhalersView: {
		width: "100%",
		minHeight: 25,
		backgroundColor: "#FFF",
		textAlign: "center",
		paddingVertical: 40,
		paddingHorizontal: 60,
		borderRadius: 10
	},
	carouselView: {
		width: "100%",
	},
	carousel: {
		width: "100%"
	},
	settingsButton: {
		backgroundColor: Colors.secondary
	},
	whiteButton: {
		backgroundColor: Colors.white
	},
	inahlerCard: {
		position: "relative",
	},
	inahlerCardView: {
		display: "flex",
		flexDirection: "column"
	},
	inahlerCardContent: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		height: 215
	},
	inhalerCardLeft: {
		display: "flex",
		flexDirection: "column",
		justifyContent: 'space-between',
		flex: 1
	},
	inahlerButton: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start"
	},
	inahlerImage: {
		top: -55,
		left: -5,
		width: '100%',
    	aspectRatio: 16 / 26,
		zIndex: 1
	},
	inahlerShadowImage: {
		top: -270,
		left: -30,
		width: '100%',
    	aspectRatio: 16 / 26,
		zIndex: 0
	},
	inhalerCardRight: {
		position: "relative",
		flex: 1
	},
	inahlerView: {
		width: "100%"
	},
	inahlerTitleView: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
		marginBottom: 8
	},
	inahlerTitle: {
		fontSize: 18,
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
	inhalerButtonsView: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 16,
		gap: 8
	},
	inhalerButton: {
		flex: 1,
		backgroundColor: Colors.secondary
	},
	dotContainer: {
		justifyContent: 'center',
		alignSelf: 'center',
		height: 18
	},
	dotsView: {
		top: 16
	},
	timeView: {
		display: "flex",
		flexDirection: "column"
	},
	timeTitleView: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 16
	},
	timeTitle: {
		display: "flex",
	},
	timeText: {
		fontSize: 18
	},
	timeLocationText: {
		marginTop: 8,
		fontSize: 14,
		color: Colors.darkGray
	},
	twoBlock: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 16
	}
})