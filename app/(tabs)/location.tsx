import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet, Dimensions, Platform, PermissionsAndroid, BackHandler } from 'react-native';
import MapView, { Marker, Region, UserLocationChangeEvent } from 'react-native-maps';
import {
  useSharedValue,
  useDerivedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheetModal,
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
import HeaderAction from '@/components/HeaderAction';
import { Avatar, Button, Spinner } from 'tamagui';
import Colors from '@/constants/Colors';
import Ripple from 'react-native-material-ripple';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BlurredBackgroundNew from '@/components/blurredBackground/BlurredBackgroundNew';
import { stores } from '@/constants/Data';
import { useFocusEffect, useNavigation } from 'expo-router';
import { BottomSheetState, ButtonLocationState, InitLocation, LocationPermissions, LocationPoints, LocationType } from '../../interfaces/Location';
import * as Network from 'expo-network';

// Resources
import AddIcon from "@/assets/icons/add.svg"
import inhalerList from "@/assets/images/inhaler-list.png"
import StoreIcon from "@/assets/icons/store.svg"
import LocationUnknowIcon from "@/assets/icons/location_searching.svg"
import LocationCurrentIcon from "@/assets/icons/my_location.svg"
import LocationDisabledIcon from "@/assets/icons/location_disabled.svg"
import { FlashList } from '@shopify/flash-list';
import BatteryIcon from "@/assets/icons/battery.svg"
import SoundIcon from "@/assets/icons/volume_up.svg"
import RouteIcon from "@/assets/icons/alt_route.svg"
import CloseIcon from "@/assets/icons/close.svg"

import { GeofencingEventType } from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { supabase } from '@/services/supabase';
import { useInhalers } from '@/context/InhalerProvider';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
NavigationBar.setBackgroundColorAsync("white");
NavigationBar.setButtonStyleAsync("dark");

const TASK_NAME = "background-location"

const TabTwoScreen = () => {
  // refs
  const mapRef = useRef<MapView>(null);
  const inhalerListModalRef = useRef<BottomSheetModal>(null);
  const storesModalRef  = useRef<BottomSheetModal>(null);
  const inhalerModalRef  = useRef<BottomSheetModal>(null);

  const navigatorB = useNavigation()

  const [location, setLocation] = useState<Location.LocationObjectCoords>();
  const [pharmacies, setPharmacies] = useState([]);
  const [buttonState, setButtonState] = useState<ButtonLocationState>(ButtonLocationState.Inactive);
  const [isMapLoading, setIsMapLoading] = useState<boolean>(true);
  const [inhaler, setInhaler] = useState(null)
  const [initialLocation, setInitialLocation] = useState<Region>()
  const [permissionChange, setPermissionChange] = useState<boolean>(false);

  const [bottomSheetState, setBottomSheetState] = useState<BottomSheetState>({
    position: 162,
    lockPosition: 540,
    storeButtonVisible: true,
    secondSheetActive: false
  });

  const { supaInhalers } = useInhalers();
  
  const data:any[] = supaInhalers;
  /*[
    {
      id: 0,
      title: "Inhalador casa",
      where: "casa",
      connection: "Hace tres minutos",
      latitude: 20.608629422133586,
      longitude: -103.28179174462451,
      battery: 80,
      address: "Calle Salamanca, San Martín de Las Flores, San Pedro Tlaquepaque, Jalisco, 45625, México"
    },
    {
      id: 1,
      title: "Inhalador casa",
      where: "casa",
      connection: "Hace tres minutos",
      latitude: 20.702444918665606,
      longitude: -103.3888371168304,
      battery: 45,
      address: "C. Nueva Escocia 1885, 44630 Guadalajara, Jal."
    },
    {
      id: 2,
      title: "Inhalador casa",
      where: "casa",
      connection: "Hace tres minutos",
      latitude: 20.60994570626775,
      longitude: -103.28013467661216,
      battery: 32,
      address: "Teapan 132, San Pedrito, 45625 San Pedro Tlaquepaque, Jal."
    }
  ]*/
  
  const getPhoneLocation = async () => {
    try {
      setIsMapLoading(true)

      const granted = await Location.hasServicesEnabledAsync();

      if (!granted) {
        setButtonState(ButtonLocationState.Inactive)
      } else {
        setButtonState(ButtonLocationState.Active)
      }

      let value = await AsyncStorage.getItem('location').then((data) => {
        return data ? JSON.parse(data) as Region : null
      });

      setInitialLocation({
        latitude: value?.latitude || coords.latitude || 0,
        longitude: value?.longitude || coords.longitude || 0,
        latitudeDelta: value?.latitudeDelta || 0.0922,
        longitudeDelta: value?.longitudeDelta || 0.0421,
      })

      setIsMapLoading(false)
      
    } catch (error) {
      setInitialLocation({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })

      console.log(error)
      setIsMapLoading(false)
      setButtonState(ButtonLocationState.Inactive)
    }
  };

  const requestForegroundPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const granted = await Location.hasServicesEnabledAsync(); 

    if (status !== 'granted') {
      console.log("No tiene permiso")
      return {
        foregroundPermission: false,
        hasLocationEnabled: granted
      };
    } else {
      if (!permissionChange)
        setPermissionChange(true)

      return {
        foregroundPermission: true,
        hasLocationEnabled: granted
      };
    }
  }

  const getCurrentPosition = async () => {

    const { foregroundPermission, hasLocationEnabled } = await requestForegroundPermission();

    if (foregroundPermission && hasLocationEnabled)
      await Location.watchPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeInterval: 3000,
        distanceInterval: 8,
    }, ({ coords }) => {
      //console.log(coords)
      setLocation(coords)
    })
  }

  useEffect(() => {
    getPhoneLocation();
    inhalerListModalRef.current?.present();
  }, []);

  useEffect(() => {
    getCurrentPosition();
  }, [permissionChange]);

  const ubicateInhaler = async (id:number) => {
    const tempoInhaler = data.find(item => item.id === id);

    setInhaler(tempoInhaler)
    console.log("inhalerseteadoID: ", id);
    console.log("inhalerseteado: ", inhaler);
    

    mapRef.current?.animateCamera({
      center: {
        latitude: tempoInhaler.latitude - 0.002,
        longitude: tempoInhaler.longitude,
      },
      zoom: 15
    })

    /*
    console.log(data[id])

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${data[id].latitude}&lon=${data[id].longitude}`;
    
    await fetch(url).then(res=>res.json()).then(addressData=> {
      console.log(addressData.display_name)
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
    })*/
  }

  const getNearbyPharmacies = async () => {

    const { foregroundPermission, hasLocationEnabled } = await requestForegroundPermission();
    let errorRequest:boolean = false;

    if (!foregroundPermission || !hasLocationEnabled)
      return

    if (!location)
      return;

      setButtonState(ButtonLocationState.Active)

      mapRef.current?.animateCamera({
        center: {
          latitude: location.latitude - 0.009,
          longitude: location.longitude,
        },
        zoom: 15
      })

    storesModalRef.current?.present();
    inhalerListModalRef.current?.close()

    setBottomSheetState({
      ...bottomSheetState,
      position: 82,
      lockPosition: 140,
      storeButtonVisible: false,
      secondSheetActive: true
    })

    try {
      /*const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
          `location=${location.coords.latitude},${location.coords.longitude}` +
          `&radius=1000&type=pharmacy&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY}`
      );

      if (response.data && response.data.results) {
        console.log(response.data)
        setPharmacies(response.data.results);
      }*/
      setPharmacies(stores.results)
    } catch (error) {
      console.error('Error al obtener farmacias:', error);
    }
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

  const handleGetLocation = async () => {
    try {
      const { foregroundPermission, hasLocationEnabled } = await requestForegroundPermission();
      let errorRequest:boolean = false;

      if (!foregroundPermission || !hasLocationEnabled)
      return

      if (!location)
        return;

      if (buttonState === ButtonLocationState.Loading) return;
      
      setButtonState(ButtonLocationState.Loading)

      /*let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.error('Permiso de ubicación denegado');
        setButtonState(ButtonLocationState.Inactive)
        return;
      }

      let location = await Location.getCurrentPositionAsync({});*/
      mapRef.current?.animateCamera({
        center: {
          latitude: location.latitude - 0.005,
          longitude: location.longitude,
        },
        zoom: 15,
      })

      setButtonState(ButtonLocationState.Current)
      /*const place = await Location.reverseGeocodeAsync({
        latitude : location.coords.latitude,
        longitude : location.coords.longitude
      });

      console.log(place)*/
    
      // Ajustar el zoom del mapa manualmente
    } catch (error) {
      setButtonState(ButtonLocationState.Inactive)
      console.log(error)
    }
  };

  /*  useEffect(() => {
    console.log(permissionStatus)
    if (!permissionStatus)
      setIsLocated(0);

  }, [permissionStatus])*/

  const checkLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await Location.hasServicesEnabledAsync();
        if (!granted) {
          setButtonState(ButtonLocationState.Inactive)
        } else {
          setPermissionChange(true)
          
          if (buttonState !== ButtonLocationState.Loading)
          if (buttonState === ButtonLocationState.Inactive) 
            setButtonState(ButtonLocationState.Active)
        }
      }
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    // Establece un temporizador para realizar la verificación cada 5 segundos (ajusta según tus necesidades)
    const intervalId = setInterval(checkLocationPermission, 5000);

    // Limpia el temporizador al desmontar el componente
    return () => {
      clearInterval(intervalId);
    };
  }, [buttonState]);

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

    /*const { hasLocationEnabled } = await requestForegroundPermission();

    if (hasLocationEnabled) {
      //setButtonState(ButtonLocationState.Active)
    } else {
      //if (buttonState === ButtonLocationState.Active || ButtonLocationState.Current)
      //setButtonState(ButtonLocationState.Inactive)
    }

    //if (buttonState === ButtonLocationState.Current)
      //setButtonState(ButtonLocationState.Active) */ 
  }, []);

  const handleOpenPressLocate = useCallback((id:any) => {
    console.log(id)
    setButtonState(ButtonLocationState.Active)
    ubicateInhaler(id);

    setBottomSheetState({
      ...bottomSheetState,
      position: 82,
      storeButtonVisible: false,
      secondSheetActive: true
    })
		inhalerModalRef.current?.present();
    inhalerListModalRef.current?.dismiss();
	}, []);
  //#endregion

  //#region effects
  useLayoutEffect(() => {
    requestAnimationFrame(() => inhalerListModalRef.current?.present());
  }, []);
  //#endregion

  const handleCloseButton = () => {
    inhalerListModalRef.current?.present();
    inhalerModalRef.current?.dismiss();

    setInhaler(null)

    setBottomSheetState({
      ...bottomSheetState,
      position: 162,
      lockPosition: 540,
      storeButtonVisible: true,
      secondSheetActive: false
    })
  }

  const handleStoreItemPress = (item:any) => {
    setButtonState(ButtonLocationState.Active)
    storesModalRef.current?.collapse();

    mapRef.current?.animateCamera({
      center: {
        latitude: item.geometry.location.lat - 0.005,
        longitude: item.geometry.location.lng,
      },
    })
  }

  const handleRegionChange = async ({ latitude, longitude, latitudeDelta, longitudeDelta }: Region) => {
    try {
      const jsonValue = JSON.stringify({
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta
      });

      await AsyncStorage.setItem(
        'location',
        jsonValue
      );
    } catch (error) {
      console.log(error)
    }
  }

  const requestPermissions = async () => {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === 'granted') {
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === 'granted') {
        await Location.startLocationUpdatesAsync(TASK_NAME, {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000,
            distanceInterval: 15,
            pausesUpdatesAutomatically: true,
         });
      }
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (bottomSheetState.secondSheetActive) {
          inhalerListModalRef.current?.present();

          inhalerModalRef.current?.dismiss();
          storesModalRef.current?.dismiss();

          if (inhaler)
            setInhaler(null)

          if (pharmacies)
            setPharmacies([])

          setBottomSheetState({
            ...bottomSheetState,
            position: 162,
            lockPosition: 540,
            storeButtonVisible: true,
            secondSheetActive: false
          })

        } else {
          if (navigatorB.canGoBack())
            navigatorB.goBack()
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
                    <MontserratText>{ item.where ? item.where : "Casa" }</MontserratText>
                    <View style={stylesItem.dot}></View>
                    <MontserratText>{ item.connection }</MontserratText>
                </View>

            </View>
          </View>
        </View>
      </Ripple>
    ),
    []
);

const renderStoreItem = useCallback(
  ({ item }: any) => {

    return (
    <Ripple onPress={() => handleStoreItemPress(item)}>
      <View style={stylesStoreItem.container}>
        <View style={stylesStoreItem.infoView}>
          <MontserratSemiText style={stylesStoreItem.title}>{ item.name }</MontserratSemiText>
          <MontserratText style={stylesStoreItem.address}>{ String(item.vicinity).split(",")[0] }</MontserratText>
          {
            item.business_status !== "OPERATIONAL" ? (
              <MontserratSemiText style={stylesStoreItem.noService}>Farmacia fuera de servicio</MontserratSemiText>
            ) :
            item.opening_hours && (
              <MontserratSemiText style={item.opening_hours.open_now ? stylesStoreItem.isOpen : stylesStoreItem.isClose }>{ item.opening_hours.open_now ? "Abierto" : "Cerrado" }</MontserratSemiText>
            )
          }
        </View>
      </View>
    </Ripple>
    )
  },
  []
);

  return (
    <>
    <BottomSheetModalProvider>
    <View style={styles.container}>
      {
        !isMapLoading &&
        <MapView
          ref={mapRef}
          initialRegion={initialLocation}
          style={styles.mapContainer}
          onTouchStart={handleTouchStart}
          showsUserLocation={true}
          showsMyLocationButton={false}
          followsUserLocation={true}
          onRegionChange={handleRegionChange}
          showsPointsOfInterest={false}
          showsCompass={false}
          showsBuildings={false}
          rotateEnabled={false}
          pitchEnabled={false}
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
    }

      <BottomSheetView
        animatedIndex={buttonAnimatedIndex}
        animatedPosition={buttonAnimatedPosition}
        position={ bottomSheetState.position }
        lockPosition={ bottomSheetState.lockPosition }
      >
        <View style={styles.buttonView}>
          <Button style={styles.ubicationButton} onPress={handleGetLocation} alignSelf="center" size="$6" circular>
            { buttonState === ButtonLocationState.Loading ? <Spinner /> : buttonState === ButtonLocationState.Inactive ? <LocationDisabledIcon /> : buttonState === ButtonLocationState.Active ? <LocationUnknowIcon /> : buttonState === ButtonLocationState.Current && <LocationCurrentIcon /> }
          </Button>

          <Button style={[ styles.storeButton, { opacity: bottomSheetState.storeButtonVisible ? 1 : 0 }]} onPress={getNearbyPharmacies} size="$6" borderRadius={1000}>
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
              action={() => requestPermissions()}
            />
          </View>
            <BottomSheetFlatList
              data={data}
              keyExtractor={(item: any) => item.id}
              renderItem={renderItem}
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
            <MontserratBoldText style={styles.headerText}>Lista de tiendas</MontserratBoldText>
          </View>

          <BottomSheetFlatList
            data={pharmacies}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderStoreItem}
          />

          { /*<FlashList
              data={pharmacies}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderStoreItem}
              estimatedItemSize={96}
        />*/ }
        </View>
    </BottomSheetModal>

    <BottomSheetModal
        ref={inhalerModalRef}
        key="inhalerModalSheet"
        name="inhalerModalSheet"
        index={0}
        topInset={topSafeArea}
        snapPoints={inhalerSnapPoints}
        enablePanDownToClose={false}
        animatedPosition={buttonAnimatedPosition}
        animatedIndex={buttonAnimatedIndex}
        enableOverDrag={false}
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

          <Button style={stylesInhalerSheet.closeButton} circular onPress={() => handleCloseButton()}>
            <CloseIcon />
          </Button>

          <View style={styles.headerContent}>
            {
              inhaler && (
                <View style={stylesInhalerSheet.content}>
                  <View style={stylesInhalerSheet.titleView}>
                    <MontserratBoldText style={stylesInhalerSheet.title}>{ inhaler.title }</MontserratBoldText>
                    <MontserratText style={stylesInhalerSheet.address}>{ inhaler.address }</MontserratText>

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

TaskManager.defineTask(TASK_NAME, async ({ data: { locations }, error }) => {
  if (error) {
    console.log(error.message)
    return;
  }

  if (locations) {
    const { error: supabaseError } = await supabase.from("inhaler_ubication").update({ latitude: locations[0].coords.latitude, longitude: locations[0].coords.longitude }).eq("id", "78d0246e-9444-468b-8e2f-7d9c48b6bbfe")

    if (supabaseError)
      console.log(supabaseError)

    console.log('Received new locations', locations);
  }
 });


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
    marginBottom: 16,
    paddingHorizontal: 24
  },
  headerText: {
    fontSize: 22
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
    fontSize: 22
  },
  address: {
    fontSize: 14,
    lineHeight: 18,
    color: Colors.darkGray
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 24,
    zIndex: 200
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

const stylesStoreItem = StyleSheet.create({
  container: {
    width: "100%",
  },
  infoView: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minHeight: 96,
    gap: 4,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderColor: Colors.bottomBarGray,
    borderBottomWidth: 1
  },
  title: {
    fontSize: 16
  },
  address: {
    fontSize: 14,
    color: Colors.darkGray
  },
  noService: {
    color: Colors.black
  },
  isOpen: {
    color: Colors.green
  },
  isClose: {
    color: Colors.red
  }
})

//export default withModalProvider(TabTwoScreen);
export default TabTwoScreen;