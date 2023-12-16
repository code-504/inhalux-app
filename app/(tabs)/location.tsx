import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet, Dimensions, Platform, PermissionsAndroid, BackHandler } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  TouchableOpacity,
  BottomSheetBackdropProps,
  BottomSheetModalProvider,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import BottomSheetView from '@/components/BottomSheetView';
import * as NavigationBar from 'expo-navigation-bar';

import * as Location from 'expo-location';
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import BlurredBackground from '@/components/blurredBackground/BlurredBackground';
import HeaderAction from '@/components/HeaderAction';
import { Avatar, Button } from 'tamagui';
import Colors from '@/constants/Colors';
import Ripple from 'react-native-material-ripple';

// Resources
import AddIcon from "@/assets/icons/add.svg"
import inhalerList from "@/assets/images/inhaler-list.png"
import StoreIcon from "@/assets/icons/store.svg"
import LocationUnknowIcon from "@/assets/icons/location_searching.svg"
import LocationCurrentIcon from "@/assets/icons/my_location.svg"
import LocationDisabledIcon from "@/assets/icons/location_disabled.svg"
import { FlashList } from '@shopify/flash-list';
import BlurredStoresBackground from '@/components/blurredBackground/BlurredStoresBackground';
import { useFocusEffect, useNavigation } from 'expo-router';
import { BottomSheetState } from '../../interfaces/location';
import BlurredBackgroundNew from '@/components/blurredBackground/BlurredBackgroundNew';
import BatteryIcon from "@/assets/icons/battery.svg"
import SoundIcon from "@/assets/icons/volume_up.svg"
import RouteIcon from "@/assets/icons/alt_route.svg"

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
NavigationBar.setBackgroundColorAsync("white");
NavigationBar.setButtonStyleAsync("dark");

const TabTwoScreen = () => {
  // refs
  const mapRef = useRef<MapView>(null);
  const inhalerListModalRef = useRef<BottomSheetModal>(null);
  const storesModalRef  = useRef<BottomSheetModal>(null);
  const inhalerModalRef  = useRef<BottomSheetModal>(null);
  const buttonStateRef = useRef<number>(0);

  const navigator = useNavigation()

  const [location, setLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [buttonState, setButtonState] = useState<number>(0);
  const [isMapLoading, setIsMapLoading] = useState<boolean>(true);
  const [inhaler, setInhaler] = useState(null)

  const [bottomSheetState, setBottomSheetState] = useState<BottomSheetState>({
    position: 162,
    lockPosition: 540,
    storeButtonVisible: true,
    secondSheetActive: false
  });

  const data:any[] = [
    {
      id: 1,
      title: "Inhalador casa",
      where: "casa",
      when: "Hace tres minutos",
      latitude: 20.608629422133586,
      longitude: -103.28179174462451,
      battery: 80
    },
    {
      id: 2,
      title: "Inhalador casa",
      where: "casa",
      when: "Hace tres minutos",
      latitude: 20.608629422133586,
      longitude: -103.28179174462451,
      battery: 45
    },
    {
      id: 3,
      title: "Inhalador casa",
      where: "casa",
      when: "Hace tres minutos",
      latitude: 20.609493054084997,
      longitude: -103.28020924139345,
      battery: 32
    }
  ]

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') return;
      
      setIsMapLoading(true)

      const last = await Location.getLastKnownPositionAsync();
      console.log("the last", last)


      if (last) {
        setLocation(last.coords);
        buttonStateRef.current = 1;
      } else {
        const current = await Location.getCurrentPositionAsync();
        setLocation(current.coords);
        buttonStateRef.current = 0;
      }
      setIsMapLoading(false)
    } catch (error) {
      console.log(error);
      setIsMapLoading(false)
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const ubicateInhaler = async (id:number) => {

    console.log(data[id])

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${data[id].latitude}&lon=${data[id].longitude}`;
    
    await fetch(url).then(res=>res.json()).then(addressData=> {
      setInhaler({ 
        ...data[id],
        address: addressData.display_name
      })
    })

    mapRef.current?.animateCamera({
      center: {
        latitude: data[id].latitude - 0.002,
        longitude: data[id].longitude,
      },
      zoom: 15
    })
  }

  const getNearbyPharmacies = async () => {

    const granted = await Location.hasServicesEnabledAsync()

    if (!granted) return ;

    let location = await Location.getCurrentPositionAsync({});
    
    storesModalRef.current?.present();
    inhalerListModalRef.current?.close()

    setBottomSheetState({
      ...bottomSheetState,
      position: 82,
      lockPosition: 140,
      storeButtonVisible: false,
      secondSheetActive: true
    })

    mapRef.current?.animateCamera({
      center: {
        latitude: location.coords.latitude - 0.009,
        longitude: location.coords.longitude,
      },
      zoom: 15
    })
    /*try {
      console.log(location)
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
          `location=${location.latitude},${location.longitude}` +
          `&radius=1000&type=pharmacy&key=process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY`
      );

      if (response.data && response.data.results) {
        console.log(response.data)
        setPharmacies(response.data.results);
      }
    } catch (error) {
      console.error('Error al obtener farmacias:', error);
    }*/
  };

  /*const getNearbyPharmacies = async () => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/pharmacy.json?access_token=${process.env.EXPO_PUBLIC_MAPBOX_KEY}` +
          `&proximity=${location.longitude},${location.latitude}`
      );

      if (response.data && response.data.features) {
        const pharmaciesData = response.data.features.map((feature) => {
          return {
            name: feature.text,
            location: {
              latitude: feature.center[1],
              longitude: feature.center[0],
            },
          };
        });
        setPharmacies(pharmaciesData);
      }
    } catch (error) {
      console.error('Error al obtener farmacias:', error);
    }
  };*/

  const handleStoresIndexChange = async (index:number) => {
    if (index === 1) {
      const granted = await Location.hasServicesEnabledAsync()

      if (!granted) {
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({});

      mapRef.current?.animateCamera({
        center: {
          latitude: location.coords.latitude - 0.009,
          longitude: location.coords.longitude,
        },
        zoom: 15
      })
    }
  }

  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.error('Permiso de ubicación denegado');
      return;
    }

    const granted = await Location.hasServicesEnabledAsync();

    if (granted) {
      if (buttonStateRef.current === 0 || buttonStateRef.current === 1)
      buttonStateRef.current = 2
    }

    let location = await Location.getCurrentPositionAsync({});
  
    // Ajustar el zoom del mapa manualmente

    mapRef.current?.animateCamera({
      center: {
        latitude: location.coords.latitude - 0.005,
        longitude: location.coords.longitude,
      },
    })
  };

  /*  useEffect(() => {
    console.log(permissionStatus)
    if (!permissionStatus)
      setIsLocated(0);

  }, [permissionStatus])*/

  const checkLocationPermission = async () => {
    console.log("activado")
    try {
      if (Platform.OS === 'android') {
        const granted = await Location.hasServicesEnabledAsync();
        console.log( buttonStateRef.current)
        if (!granted) {
          buttonStateRef.current = 0;
        } else {
          if (buttonStateRef.current === 0)
            buttonStateRef.current = 1;
        }
      }
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    // Establece un temporizador para realizar la verificación cada 10 segundos (ajusta según tus necesidades)
    const intervalId = setInterval(checkLocationPermission, 10000);

    // Limpia el temporizador al desmontar el componente
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    console.log(buttonStateRef.current)
    setButtonState(buttonStateRef.current)
  }, [buttonStateRef.current])

  // hooks
  //const headerHeight = useHeaderHeight();
  const { bottom: bottomSafeArea, top: topSafeArea } = useSafeAreaInsets();

  //#region variables
  const inhalerListSnapPoints = useMemo(
    () => [
      "14%",
      "40%",
      '90%',
    ],
    [bottomSafeArea]
  );

  const inhalerSnapPoints = useMemo(
    () => [
      "35%",
    ],
    [bottomSafeArea]
  );

  const storesListSnapPoints = useMemo(
    () => [
      "14%",
      "67%",
      '90%',
    ],
    [bottomSafeArea]
  );
  //#endregion

  //#region animated variables
  const animatedFloatingButtonIndex = useSharedValue<number>(0);
  const animatedFloatingButtonPosition = useSharedValue<number>(SCREEN_HEIGHT);

  const buttonAnimatedIndex = useDerivedValue(() =>
    animatedFloatingButtonIndex.value
  );
  const buttonAnimatedPosition = useDerivedValue(() =>
    animatedFloatingButtonPosition.value
  );
  //#endregion

  //#region callbacks
  const handleTouchStart = useCallback(async () => {
    inhalerListModalRef.current?.collapse();

    const granted = await Location.hasServicesEnabledAsync();

    if (granted) {
      if (buttonState === 2)
        setButtonState(1)
    }
  }, []);

  const handleOpenPressLocate = useCallback((id:number) => {
    ubicateInhaler(id);

    setBottomSheetState({
      ...bottomSheetState,
      position: 82,
      storeButtonVisible: false,
      secondSheetActive: true
    })
		inhalerModalRef.current?.present();
    inhalerListModalRef.current?.close();
	}, []);
  //#endregion

  //#region effects
  useLayoutEffect(() => {
    requestAnimationFrame(() => inhalerListModalRef.current?.present());
  }, []);
  //#endregion

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (bottomSheetState.secondSheetActive) {
          inhalerListModalRef.current?.present();
          inhalerModalRef.current?.close();
          storesModalRef.current?.close();

          if (inhaler)
            setInhaler(null)

          setBottomSheetState({
            ...bottomSheetState,
            position: 162,
            lockPosition: 540,
            storeButtonVisible: true,
            secondSheetActive: false
          })

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
    }, [bottomSheetState.secondSheetActive])
  );
  
  const renderItem = useCallback(
    ({ item }: any) => (
      <Ripple onPress={() => handleOpenPressLocate(item.id)}>
        <View style={stylesItem.container}>
          <View style={stylesItem.infoView}>
            <Avatar size="$6" circular>
                <Avatar.Image
                    accessibilityLabel="Inhaler"
                    src={inhalerList}
                />
                <Avatar.Fallback backgroundColor="white" />
            </Avatar>
    
            <View style={stylesItem.textView}>
                <MontserratSemiText style={stylesItem.textTitle}>{ item.title }</MontserratSemiText>

                <View style={stylesItem.textDescription}>
                    <MontserratText>{ item.where }</MontserratText>
                    <View style={stylesItem.dot}></View>
                    <MontserratText>{ item.when }</MontserratText>
                </View>
            </View>
          </View>
        </View>
      </Ripple>
    ),
    []
);

  return (
    <>
    <BottomSheetModalProvider>
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        initialRegion={{
          latitude: location?.latitude || 0,
          longitude: location?.longitude || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        loadingEnabled={isMapLoading}
        style={styles.mapContainer}
        onTouchStart={handleTouchStart}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={true}
      >
        {pharmacies.map((pharmacy) => (
        <Marker
          key={pharmacy.place_id}
          coordinate={{
            latitude: pharmacy.geometry.location.lat,
            longitude: pharmacy.geometry.location.lng,
          }}
          title={pharmacy.name}
          description={pharmacy.vicinity}
        />
      ))}

      {inhaler && (
        <Marker
          coordinate={{
            latitude: inhaler.latitude,
            longitude: inhaler.longitude,
          }}
          title={inhaler.title}
        />
      )}
    </MapView>

      <BottomSheetView
        animatedIndex={buttonAnimatedIndex}
        animatedPosition={buttonAnimatedPosition}
        position={ bottomSheetState.position }
        lockPosition={ bottomSheetState.lockPosition }
      >
        <View style={styles.buttonView}>
          <Button style={styles.ubicationButton} onPress={handleGetLocation} alignSelf="center" size="$6" circular>
            { buttonState === 0 ? <LocationDisabledIcon /> : buttonState === 1 ? <LocationUnknowIcon /> : buttonState === 2 && <LocationCurrentIcon /> }
          </Button>

          <Button style={[ styles.storeButton, { opacity: bottomSheetState.storeButtonVisible ? 1 : 0, transition: "opacity 0.2s eas-in-out" }]} onPress={getNearbyPharmacies} size="$6" borderRadius={1000}>
            <StoreIcon />
            <MontserratBoldText>Buscar tiendas</MontserratBoldText>
          </Button>
        </View>
      </BottomSheetView>
      
      <BottomSheetModal
        ref={inhalerListModalRef}
        key="PoiListSheet"
        name="PoiListSheet"
        index={1}
        topInset={topSafeArea}
        snapPoints={inhalerListSnapPoints}
        enablePanDownToClose={false}
        animatedPosition={buttonAnimatedPosition}
        animatedIndex={buttonAnimatedIndex}
        backdropComponent={(backdropProps: BottomSheetBackdropProps) => (
          <BlurredBackgroundNew
            {...backdropProps}
            appearsOnIndex={2}
            disappearsOnIndex={1}
            pressBehavior={'collapse'}
          />
        )}
      >
        <View style={styles.bottomSheetContainer}>
          <View style={styles.headerContent}>
            <HeaderAction 
              title="Ubicación"
              subtitle="Encuentra tu inhaLux facilmente"
              Icon={AddIcon}
              action={() => null}
            />
          </View>
            <FlashList
              data={data}
              keyExtractor={(item: any) => item.id}
              renderItem={renderItem}
              estimatedItemSize={96}
            />
        </View>
      </BottomSheetModal>
    </View>
    </BottomSheetModalProvider>
    
    <BottomSheetModal
        ref={storesModalRef}
        key="StoresListSheet"
        name="StoresListSheet"
        index={1}
        onChange={handleStoresIndexChange}
        topInset={topSafeArea}
        snapPoints={storesListSnapPoints}
        enablePanDownToClose={false}
        animatedPosition={buttonAnimatedPosition}
        animatedIndex={buttonAnimatedIndex}
        backdropComponent={(backdropProps: BottomSheetBackdropProps) => (
          <BlurredBackgroundNew
            {...backdropProps}
            appearsOnIndex={2}
            disappearsOnIndex={1}
            pressBehavior={'collapse'}
          />
        )}
      >
        <View style={styles.bottomSheetContainer}>
          <View style={styles.headerContent}>
            <MontserratBoldText>lista de tiendas</MontserratBoldText>
          </View>

        </View>
    </BottomSheetModal>

    <BottomSheetModal
        ref={inhalerModalRef}
        key="LocateListSheet"
        name="LocateListSheet"
        index={0}
        topInset={topSafeArea}
        snapPoints={inhalerSnapPoints}
        enablePanDownToClose={false}
        animatedPosition={buttonAnimatedPosition}
        animatedIndex={buttonAnimatedIndex}
        backdropComponent={(backdropProps: BottomSheetBackdropProps) => (
          <BlurredBackgroundNew
            {...backdropProps}
            appearsOnIndex={1}
            disappearsOnIndex={0}
            pressBehavior={'collapse'}
          />
        )}
      >
        <View style={styles.bottomSheetContainer}>
          <View style={styles.headerContent}>
            {
              inhaler && (
                <View style={stylesInhalerSheet.content}>
                  <View style={stylesInhalerSheet.titleView}>
                    <MontserratBoldText style={stylesInhalerSheet.title}>{ inhaler.title }</MontserratBoldText>
                    <MontserratText  style={stylesInhalerSheet.address}>{ inhaler.address }</MontserratText>

                    <View style={stylesInhalerSheet.inahlerStatusInfo}>
                      <BatteryIcon style={stylesInhalerSheet.inahlerStatusIcon} />
                      <MontserratSemiText>{ inhaler.battery }%</MontserratSemiText>
                    </View>
                  </View>

                  <View style={stylesInhalerSheet.buttonsView}>
                    <Button height="$11" borderRadius={'$radius.10'} style={stylesInhalerSheet.button}>
                      <View style={stylesInhalerSheet.buttonTextView}>
                        <SoundIcon />
                        <MontserratBoldText>Sonido</MontserratBoldText>
                        <MontserratText>Desactivado</MontserratText>
                      </View>
                    </Button>
                    <Button height="$11" borderRadius={'$radius.10'} style={stylesInhalerSheet.button}>
                      <View style={stylesInhalerSheet.buttonTextView}>
                        <RouteIcon />
                        <MontserratBoldText>Distancia</MontserratBoldText>
                        <MontserratText>5m altitud 5m</MontserratText>
                      </View>
                    </Button>
                  </View>
                </View>
              )
            }
          </View>

        </View>
    </BottomSheetModal>

    <StatusBar style="auto" backgroundColor="transparent" />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 16,
  },
  buttonView: {
    display: "flex",
    flexDirection: "column",
    justifyContent: 'flex-end',
    gap: 16,

  },
  locationButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  ubicationButton: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.white
  },
  storeButton: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.white
  },
  locationButtonText: {
    color: 'white',
  },
  bottomSheetContainer: {
    flex: 1,
  },
  headerContent: {
    paddingHorizontal: 24
  }
});

const stylesItem = StyleSheet.create({
  container: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      paddingVertical: 18,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: Colors.bottomBarGray
  },
  infoView: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 16
  },
  textView: {
    display: "flex",
    flexDirection: "column",
    gap: 2
  },
  textTitle: {
    fontSize: 16
  },
  textDescription: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 1000,
    backgroundColor: Colors.dotsGray
  }
})


const stylesInhalerSheet = StyleSheet.create({
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 16
  },
  titleView: {
    marginTop: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  title: {
    fontSize: 24
  },
  address: {
    fontSize: 14,
    lineHeight: 18,
    color: Colors.darkGray
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
  buttonsView: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    gap: 16,
  },
  button: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    backgroundColor: Colors.secondary
  },
  buttonTextView: {
    display: "flex",
    flexDirection: "column",
    gap: 4
  }
})

//export default withModalProvider(TabTwoScreen);
export default TabTwoScreen;