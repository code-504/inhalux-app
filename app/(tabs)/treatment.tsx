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
import TagSelect, { Tag } from '@/components/TagSelect';
import HistorialSearch from '@/components/HistorialSearch';

// Resources
import BackgroundImage from "@/assets/images/background.png"
import HistoryIcon from "@/assets/icons/history.svg"
import TreatmentIcon from "@/assets/icons/prescriptions.svg"
import NotificationsIcon from "@/assets/icons/notifications.svg"
import AddIcon from "@/assets/icons/add.svg"
import ShareOptionsIcon from "@/assets/icons/share_options.svg"

export default function TabFourScreen() {

	const navigator = useNavigation();

	//refs
	const bottomListModalRef = useRef<BottomSheetModal>(null);
	const bottomIndex = useRef<number>(0);
	
	//variables
	const bottomSnapPoints = useMemo(() => ['72%', '100%'], []);
	
	const { bottom: bottomSafeArea, top: topSafeArea } = useSafeAreaInsets();
  const [selectedTreatment, setSelectedTreatment] = useState<Tag>({ label: "todo", value: "all" })

	// callbacks
	useFocusEffect(
		useCallback(() => {
      console.log("lalala")
      bottomListModalRef.current?.present();

		  const onBackPress = () => {
        if (bottomIndex.current === 1) {
          bottomListModalRef.current?.collapse();
        } else {
          if (navigator.canGoBack())
            navigator.goBack()
        }

        return true;
        };
	  
		  BackHandler.addEventListener(
			'hardwareBackPress', onBackPress
		  );
	  
		  return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress', onBackPress
        );
      }
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
						subtitle="Recuerda tus inhalaciones"
						Icon={AddIcon}
						action={()=> {}}
					/>
				</View>

				<BottomSheetModal
					ref={bottomListModalRef}
					key="BottomListSheet"
					name="BottomListSheet"
					index={0}
					topInset={topSafeArea}
					snapPoints={bottomSnapPoints}
					enablePanDownToClose={false}
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
						  name='Tratamiento'
						/>
					  )}
				>

					<TabBar.TabBar headerPadding={24}>
						<TabBar.Item Icon={TreatmentIcon} title='Tratamiento' height={(Dimensions.get("screen").height * 0.75) - bottomSafeArea + 12}>
							
              <MontserratSemiText>Hola</MontserratSemiText>
						</TabBar.Item>

						<TabBar.Item Icon={HistoryIcon} title='Historial' height={(Dimensions.get("screen").height * 0.75) - bottomSafeArea + 12}>
              <View style={stylesTab.content}>
                  <View>
                    <MontserratSemiText>Historial</MontserratSemiText>
                  </View>

                  <View>
                    <TagSelect 
                      tags={[
                        {label: "todo", value: "all"},
                        {label: "aceptado", value: "accepted"},
                        {label: "cancelado", value: "canceled"},
                        {label: "pendiente", value: "pending"},
                        {label: "rechazado", value: "denied"},
                      ]}
                      onTabChange={(index) => console.log(index)}
                    />
                  </View>

                  <HistorialSearch 
                      data={DATA}
                    />
                </View>	
						</TabBar.Item>
					</TabBar.TabBar>
				</BottomSheetModal>
			</BottomSheetModalProvider>
		</View>
	)
}

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
	titleView: {
		display: "flex",
		flexDirection: "column",
		gap: 16
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