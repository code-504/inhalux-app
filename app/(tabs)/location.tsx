import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
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
import { MontserratSemiText, MontserratText } from '@/components/StyledText';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import BlurredBackground from '@/components/blurredBackground/BlurredBackground';
import HeaderAction from '@/components/HeaderAction';
import { Avatar } from 'tamagui';

// Resources
import AddIcon from "@/assets/icons/add.svg"
import inhalerList from "@/assets/images/inhaler-list.png"
import Colors from '@/constants/Colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
NavigationBar.setBackgroundColorAsync("white");
NavigationBar.setButtonStyleAsync("dark");

const TabTwoScreen = () => {
  // refs
  const mapRef = useRef<MapView>(null);
  const poiListModalRef = useRef<BottomSheetModal>(null);

  const [location, setLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);

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
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permiso de ubicación denegado');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  const getNearbyPharmacies = async () => {
    try {
      console.log(location)
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
          `location=${location.latitude},${location.longitude}` +
          `&radius=1000&type=pharmacy&key=AIzaSyBYg_fWh5VFkhwufRkTJEjucgwGMQLJRs4`
      );

      if (response.data && response.data.results) {
        setPharmacies(response.data.results);
      }
    } catch (error) {
      console.error('Error al obtener farmacias:', error);
    }
  };

  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permiso de ubicación denegado');
      return;
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
  const handleTouchStart = useCallback(() => {
    poiListModalRef.current?.collapse();
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
          <TouchableOpacity style={styles.locationButton} onPress={handleGetLocation}>
            <MontserratText style={styles.locationButtonText}>Mi Ubicación</MontserratText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.locationButton} onPress={getNearbyPharmacies}>
            <MontserratText style={styles.locationButtonText}>tiendas</MontserratText>
          </TouchableOpacity>
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
    gap: 4
  },
  locationButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
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