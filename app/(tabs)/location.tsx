import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet, Dimensions, Platform, PermissionsAndroid } from 'react-native';
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

// Resources
import AddIcon from "@/assets/icons/add.svg"
import inhalerList from "@/assets/images/inhaler-list.png"
import StoreIcon from "@/assets/icons/store.svg"
import LocationUnknowIcon from "@/assets/icons/location_searching.svg"
import LocationCurrentIcon from "@/assets/icons/my_location.svg"
import LocationDisabledIcon from "@/assets/icons/location_disabled.svg"

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
NavigationBar.setBackgroundColorAsync("white");
NavigationBar.setButtonStyleAsync("dark");

const TabTwoScreen = () => {
  // refs
  const mapRef = useRef<MapView>(null);
  const poiListModalRef = useRef<BottomSheetModal>(null);

  const [location, setLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [buttonState, setButtonState] = useState<number>(0);
  const buttonStateRef = useRef<number>(0);

  const data:any[] = [
    {
      id: 1,
      title: "Inhalador casa",
      where: "casa",
      when: "Hace tres minutos"
    },
    {
      id: 2,
      title: "Inhalador casa",
      where: "casa",
      when: "Hace tres minutos"
    },
    {
      id: 3,
      title: "Inhalador casa",
      where: "casa",
      when: "Hace tres minutos"
    }
  ]

  useEffect(() => {
    (async () => {
      /*let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.error('Permiso de ubicación denegado');
        return;
      }*/

      const granted = await Location.hasServicesEnabledAsync();

      if (granted) {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
        buttonStateRef.current = 1;
      } else {
        let location = await Location.getLastKnownPositionAsync({});
        setLocation(location?.coords);
        buttonStateRef.current = 0;
      }
    })();
  }, []);

  const getNearbyPharmacies = async () => {
    try {
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
    setLocation(location.coords);
  
    // Ajustar el zoom del mapa manualmente
    mapRef.current.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.02, // Ajusta según tus necesidades
      longitudeDelta: 0.02, // Ajusta según tus necesidades
    });
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
  const poiListSnapPoints = useMemo(
    () => [
      "14%",
      "40%",
      '90%',
    ],
    [bottomSafeArea]
  );
  //#endregion

  //#region animated variables
  const animatedPOIListIndex = useSharedValue<number>(0);
  const animatedPOIListPosition = useSharedValue<number>(SCREEN_HEIGHT);

  const weatherAnimatedIndex = useDerivedValue(() =>
    animatedPOIListIndex.value
  );
  const weatherAnimatedPosition = useDerivedValue(() =>
    animatedPOIListPosition.value
  );
  //#endregion

  //#region callbacks
  const handleTouchStart = useCallback(async () => {
    poiListModalRef.current?.collapse();

    const granted = await Location.hasServicesEnabledAsync();

    if (granted) {
      if (buttonState === 2)
        setButtonState(1)
    }
  }, []);
  //#endregion

  //#region effects
  useLayoutEffect(() => {
    requestAnimationFrame(() => poiListModalRef.current?.present());
  }, []);
  //#endregion

  const renderItem = useCallback(
    ({ item }: any) => (
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
        style={styles.mapContainer}
        onTouchStart={handleTouchStart}
        showsUserLocation={true}
        showsMyLocationButton={false}
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
    </MapView>

      <BottomSheetView
        animatedIndex={weatherAnimatedIndex}
        animatedPosition={weatherAnimatedPosition}
      >
        <View style={styles.buttonView}>
          <Button style={styles.ubicationButton} onPress={handleGetLocation} alignSelf="center" size="$6" circular>
            { buttonState === 0 ? <LocationDisabledIcon /> : buttonState === 1 ? <LocationUnknowIcon /> : buttonState === 2 && <LocationCurrentIcon /> }
          </Button>

          <Button style={styles.storeButton} onPress={getNearbyPharmacies} size="$6" borderRadius={1000}>
            <StoreIcon />
            <MontserratBoldText>Buscar tiendas</MontserratBoldText>
          </Button>
        </View>
      </BottomSheetView>
      
      <BottomSheetModal
        ref={poiListModalRef}
        key="PoiListSheet"
        name="PoiListSheet"
        index={1}
        topInset={topSafeArea}
        snapPoints={poiListSnapPoints}
        enablePanDownToClose={false}
        animatedPosition={animatedPOIListPosition}
        animatedIndex={animatedPOIListIndex}
        backdropComponent={BlurredBackground}
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
            <BottomSheetFlatList
            data={data}
            keyExtractor={(i) => i}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
          />
        </View>
      </BottomSheetModal>
    </View>
    </BottomSheetModalProvider>

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
  },
  contentContainer: {
    marginTop: 4
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

//export default withModalProvider(TabTwoScreen);
export default TabTwoScreen;