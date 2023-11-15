import { ImageBackground, View, StyleSheet, Dimensions, Alert } from 'react-native'
import { Button, ScrollView, Switch } from 'tamagui'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '@/constants/Colors'
import Card from '@/components/Card/Card'
import { Image } from 'expo-image';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SimpleWeatherCard from '@/components/Card/SimpleWeatherCard'
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';

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
import { supabase } from '@/lib/supabase'

NavigationBar.setBackgroundColorAsync("white");
NavigationBar.setButtonStyleAsync("dark");

export default function TabOneScreen() {

    const [ switchDevice, setSwitchDevice ] = useState<boolean>(true);
	const [activeIndex, setActiveIndex] = React.useState(0);

	const data = [
		{ id: '1', title: 'Inhalador casa', connection: "Hace 2 días", battery: 50, dose: 20 },
		{ id: '2', title: 'Inhalador Jorge', connection: "Hace 5 días", battery: 35, dose: 80 },
		{ id: '3', title: 'Inhalador cajón', connection: "Hace 3 días", battery: 95, dose: 35 },
	];

	const { width: screenWidth } = Dimensions.get('window');
	
	const onSnapToItem = (index:number) => {
		setActiveIndex(index);
	};

	const doLogout = async () => {
		const { error } = await supabase.auth.signOut();

		if (error)
			Alert.alert("Error", error.message)
	}

	const renderItem = ({ item }: any) => (
		<Card style={styles.inahlerCard}>
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
			<ScrollView>
				<View style={styles.content}>
					<View style={styles.header}>
						<View style={styles.headerText}>
							<MontserratBoldText style={styles.headerTitleText}>Dispositivos</MontserratBoldText>
							<MontserratText style={styles.headerSubtitleText}>Información general</MontserratText>
						</View>
						
						<Button style={styles.addButton} alignSelf="center" size="$6" circular onPress={doLogout}>
							<AddIcon />
						</Button>
					</View>
					
					<View style={styles.carouselView}>
						<Carousel
							contentContainerCustomStyle={{ paddingTop: 25 }}
							data={data}
							renderItem={renderItem}
							sliderWidth={screenWidth - 48} // Ajusta según tus necesidades
							itemWidth={screenWidth - 48} // Ajusta según tus necesidades
							layout={'default'} // Esto indica el comportamiento de "scroll snap"
							onSnapToItem={onSnapToItem}
						/>
					</View>

					<View style={styles.dotsView}>
						<Pagination
							dotsLength={data.length}
							activeDotIndex={activeIndex}
							containerStyle={{ backgroundColor: 'transparent', paddingVertical: 8, gap: -5 }}
							dotStyle={{
								width: 8,
								height: 8,
								borderRadius: 5,
								backgroundColor: Colors.tint,
							}}
							inactiveDotStyle={{
								backgroundColor: Colors.dotsGray,
							}}
							inactiveDotOpacity={1}
							inactiveDotScale={1}
						/>
					</View>

					<View style={styles.timeView}>
						<View style={styles.timeTitleView}>
							<View style={styles.timeTitle}>
								<MontserratText style={styles.timeText}>Pronóstico del</MontserratText>
								<MontserratBoldText style={styles.timeText}>Tiempo</MontserratBoldText>
								<MontserratBoldText style={styles.timeLocationText}>En Guadalajara</MontserratBoldText>
							</View>

							<Button style={styles.whiteButton} alignSelf="center" size="$6" circular>
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
			</ImageBackground>
		</View>
		<StatusBar style="auto" backgroundColor={Colors.lightGrey} />
		</>
	)
}

const styles = StyleSheet.create({
    safeAre: {
        flex: 1,
        backgroundColor: Colors.lightGrey,
    },
	imageBackground: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
    	alignItems: 'center'
	},
    content: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 22,
		marginBottom: 24,
        paddingHorizontal: 24,
    },
	carouselView: {
		width: "100%",
	},
	carousel: {
		width: "100%"
	},
	header: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 8
	},
	headerText: {
		display: "flex",
		flexDirection: "column",
	},
	headerTitleText: {
		fontSize: 18,
		marginBottom: 4
	},
	headerSubtitleText: {
		fontSize: 14,
		color: Colors.light.grayText
	},
	addButton: {
		backgroundColor: Colors.primary
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
	dotsView: {
		marginVertical: 8
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