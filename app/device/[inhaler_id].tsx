import { View, ImageBackground, StyleSheet, ScrollView } from 'react-native'
import Colors from '@/constants/Colors'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText'
import Card from '@/components/Card/Card'
import { Avatar, Button, Input } from 'tamagui'
import CardOptionsList from '@/components/Card/CardOptionsList'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
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
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useInhalers } from '@/context/InhalerProvider'
import { supabase } from '@/services/supabase'


const Page = () => {
  const [ refresh, setRefresh ] = useState<boolean>(false);
  const { inhaler_id } = useLocalSearchParams();
  //const { fetchSupaInhalerById } = useInhalers();
  const [item, setItem] = useState<inhalerProps | null>(null);
  //const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const {supaInhalers, setSupaInhalers} = useInhalers();
  const [ inhalerName, setInhalerName ] = useState<string>("");
  const navigation = useNavigation();

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

          { item ? <RenderItem item={item} /> : null }

		  <Input
			id="inhaler_name"
			onChangeText={(text) => setInhalerName(text)}
			value={inhalerName}
			borderRadius={32}
			borderWidth={0}
			style={styles.input}/>

			<View style={styles.twoBlock}>
				<Button style={styles.whiteButton} alignSelf="center" size="$6" onPress={handleUpdateInhaler}>Actualizar</Button>
				<Button style={styles.whiteButton} alignSelf="center" size="$6" onPress={handleDeleteInhaler}>Eliminar</Button>
			</View>

					<View style={styles.timeView}>
						<View style={styles.timeTitleView}>
							<View style={styles.timeTitle}>
								<MontserratSemiText style={styles.timeText}>Datos del último análisis</MontserratSemiText>
								<MontserratText style={styles.timeLocationText}>Hace 6 minutos</MontserratText>
							</View>

							<Button style={styles.whiteButton} alignSelf="center" size="$6" circular onPress={handleOpenPress}>
								<HelpIcon />
							</Button>
						</View>

            <View style={styles.rowBlock}>
              <View style={styles.twoBlock}>
                <SimpleWeatherCard Icon={AqIcon} color={Colors.pink} title="Calidad del aire" calification="Buena" value="25 ppm" />
                <SimpleWeatherCard Icon={HumIcon} color={Colors.cyan} title="Humedad" calification="Excelente" value="35%" />
              </View>
              
              <View>
                <SimpleWeatherCard Icon={HumIcon} color={Colors.cyan} title="Humedad" calification="Excelente" value="35%" />
              </View>
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

const RenderItem = ({ item }: any) => (
  <Card style={styles.inahlerCard} radius={44}>
    <View style={styles.inahlerCardView}>
      <View style={styles.inahlerCardContent}>
        <View style={styles.inhalerCardLeft}>
          <View style={styles.inahlerView}>
            <View style={styles.inahlerTitleView}>
              <MontserratBoldText style={styles.inahlerTitle}>{item.title}</MontserratBoldText>
              <MontserratText>{ item ? item.connection : "connection" }</MontserratText>
            </View>

            <View style={styles.inahlerStatus}>
              <View style={styles.inahlerStatusInfo}>
                <BatteryIcon style={styles.inahlerStatusIcon} />
                <MontserratSemiText>{item.batter}%</MontserratSemiText>
              </View>

              <View style={styles.inahlerStatusInfo}>
                <DoseIcon style={styles.inahlerStatusIcon} />
                <MontserratSemiText>{item.dosis} dosis</MontserratSemiText>
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

export default Page


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
    gap: 16,
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
		marginBottom: 8
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
		marginTop: 2,
		fontSize: 14,
		color: Colors.darkGray
	},
  rowBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 16
  },
	twoBlock: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 16
	},
	input: {
		height: 60,
		backgroundColor: "#fff",
		textAlign: "center"
	}
})