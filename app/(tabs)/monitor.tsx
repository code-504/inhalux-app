import TabBar from '@/components/TabBar';
import Colors from '@/constants/Colors'
import { View, StyleSheet, ImageBackground, BackHandler, Pressable } from 'react-native';

// Resources
import BackgroundImage from "@/assets/images/background.png"
import PersonIcon from "@/assets/icons/person.svg"
import ShreIcon from "@/assets/icons/share.svg"
import { MontserratBoldText, MontserratText } from '@/components/StyledText';
import PacientsTab from '@/tabs/monitor/pacients';
import SharesTab from '@/tabs/monitor/shares';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useMonitor } from '@/context/MonitorProvider';
import BlurredDeviceBackground from '@/components/blurredBackground/BlurredDeviceBackground';
import BlurredMonitorBackground from '@/components/blurredBackground/BlurredMonitorBackground';
import { Link, Tabs, useFocusEffect, useNavigation } from 'expo-router';
import { useRelations } from '@/context/RelationsProvider';
import MonitorHeader from '@/components/Headers/MonitorHeader';

export default function TabThreeScreen() {

	const { optionsOpen, setOptionsOpen } = useMonitor();
	const { pacientState, setPacientState, shareState, setShareState } = useRelations();
	const navigator = useNavigation()
	
	const bottomSheetRef = useRef<BottomSheetModal>(null);

	// variables
	const snapPoints = useMemo(() => ['35%'], []);

	// callbacks
	const handleSheetChange = useCallback((index: number) => {
		if (index === -1)
			setOptionsOpen(false)
	}, [])
  
	useEffect(() => {
		if (optionsOpen)
			bottomSheetRef.current?.present();
		else
			bottomSheetRef.current?.close();
	}, [optionsOpen])

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

	const tabs = [
		{
			id: 1,
			name: 'Pacientes',
			Icon: PersonIcon,
			Component: <PacientsTab pacientState={pacientState} setPacientState={setPacientState} />
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
		  const onBackPress = () => {
			if (optionsOpen)
				setOptionsOpen(false)
			else
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
	);

	return (
		<View style={styles.viewArea}>
			<ImageBackground source={BackgroundImage} style={styles.imageBackground}>
			
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
			</ImageBackground>
		</View>
	)
}

const styles = StyleSheet.create({
	animatedView: {
        height: 64,
        backgroundColor: "red"
    },
	viewArea: {
		flex: 1,
        backgroundColor: Colors.lightGrey
	},
	container: {
		paddingHorizontal: 0
	},
	imageBackground: {
		flex: 1,
		resizeMode: 'cover'
	},
})

const stylesBottom = StyleSheet.create({
	container: {
		paddingTop: 16,
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