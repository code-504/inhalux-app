import React, {
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    Platform,
    PermissionsAndroid,
    BackHandler,
} from "react-native";
import MapView, {
    Marker,
    Region,
    UserLocationChangeEvent,
} from "react-native-maps";
import { useSharedValue, useDerivedValue } from "react-native-reanimated";
import {
    BottomSheetModal,
    BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import BottomSheetView from "@/components/BottomSheetView";
import { MontserratBoldText } from "@/components/StyledText";
import { StatusBar } from "expo-status-bar";
import { Button, Spinner } from "tamagui";
import Colors from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    BottomInhaler,
    BottomInhalerList,
    BottomStores,
} from "@/components/BottomSheet/Location";
import { Inhalers } from "@/interfaces/Device";
import { useLocationStore } from "@/stores/location";
import {
    ButtonLocationState,
    InhalerMarkerProps,
    LocationPoints,
    MapProps,
    UbicateButtonProps,
} from "@/interfaces/Location";
import * as Location from "expo-location";
import mapStyle from "@/constants/mapStyle.json";

// Resources
import StoreIcon from "@/assets/icons/store.svg";
import LocationUnknowIcon from "@/assets/icons/location_searching.svg";
import LocationCurrentIcon from "@/assets/icons/my_location.svg";
import LocationDisabledIcon from "@/assets/icons/location_disabled.svg";
import { useFocusEffect, useNavigation } from "expo-router";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const TabTwoScreen = () => {
    // refs
    const mapRef = useRef<MapView>(null);
    const inhalerModalRef = useRef<BottomSheetModal>(null);
    const inhalerListModalRef = useRef<BottomSheetModal>(null);
    const storesModalRef = useRef<BottomSheetModal>(null);

    const handleUbicateInhaler = useCallback((item: Inhalers) => {
        inhalerListModalRef.current?.close();
        inhalerModalRef.current?.present();

        mapRef.current?.animateCamera({
            center: {
                latitude: item.latitude - 0.002,
                longitude: item.longitude,
            },
            zoom: 15,
        });
    }, []);

    const handleUbicateStore = useCallback(() => {
        storesModalRef.current?.collapse();
    }, []);

    const onCloseInhalerModal = () => {
        console.log("onCloseInhalerModal");
        inhalerListModalRef.current?.present();
        inhalerModalRef.current?.close();
    };

    const onCloseStoreModal = useCallback(() => {
        storesModalRef.current?.close();
        inhalerListModalRef.current?.present();
    }, []);

    const openStoreModal = () => {
        inhalerListModalRef.current?.close();
        storesModalRef.current?.present();
    };

    //#endregion

    //#region animated variables
    const animatedFloatingButtonIndex = useSharedValue<number>(0);
    const animatedFloatingButtonPosition =
        useSharedValue<number>(SCREEN_HEIGHT);

    const buttonAnimatedIndex = useDerivedValue(
        () => animatedFloatingButtonIndex.value
    );
    const buttonAnimatedPosition = useDerivedValue(
        () => animatedFloatingButtonPosition.value
    );
    //#endregion

    //#region effects
    useLayoutEffect(() => {
        requestAnimationFrame(() => inhalerListModalRef.current?.present());
    }, []);
    //#endregion

    console.log("re-render location");

    return (
        <>
            <BottomSheetModalProvider>
                <View style={styles.container}>
                    <Map
                        ref={mapRef}
                        inhalerListModalRef={inhalerListModalRef}
                    />

                    <BottomSheetView animatedPosition={buttonAnimatedPosition}>
                        <View style={styles.buttonView}>
                            {/*<UbicateButton MapViewRef={mapRef} />*/}

                            <Button
                                style={styles.storeButton}
                                size="$6"
                                borderRadius={1000}
                                onPress={openStoreModal}
                            >
                                <StoreIcon />
                                <MontserratBoldText>
                                    Buscar tiendas
                                </MontserratBoldText>
                            </Button>
                        </View>
                    </BottomSheetView>
                </View>

                <BottomInhalerList
                    ref={inhalerListModalRef}
                    onItemPress={handleUbicateInhaler}
                    buttonAnimatedIndex={buttonAnimatedIndex}
                    buttonAnimatedPosition={buttonAnimatedPosition}
                />
            </BottomSheetModalProvider>

            <BottomInhaler
                ref={inhalerModalRef}
                onClose={onCloseInhalerModal}
                buttonAnimatedIndex={buttonAnimatedIndex}
                buttonAnimatedPosition={buttonAnimatedPosition}
            />

            <BottomStores
                ref={storesModalRef}
                onItemPress={handleUbicateStore}
                onClose={onCloseStoreModal}
                buttonAnimatedIndex={buttonAnimatedIndex}
                buttonAnimatedPosition={buttonAnimatedPosition}
            />

            <StatusBar style="auto" backgroundColor="transparent" />
        </>
    );
};

type MapRef = MapView;

const Map = memo(
    forwardRef<MapRef, MapProps>(({ inhalerListModalRef }, ref) => {
        const [initialLocation, setInitialLocation] = useState<Region>();
        const inhaler = useLocationStore((state) => state.inhaler);
        const pharmacies = useLocationStore((state) => state.pharmacies);

        const ubicationState = useLocationStore(
            (state) => state.ubicationState
        );

        const setUbicationState = useLocationStore(
            (state) => state.setUbicationState
        );

        const setLocation = useLocationStore((state) => state.setLocation);

        console.log("Map - re-render");

        const getPhoneLocation = useCallback(async () => {
            try {
                let value = await AsyncStorage.getItem("location").then(
                    (data) => {
                        return data ? (JSON.parse(data) as Region) : null;
                    }
                );

                setInitialLocation({
                    latitude: value?.latitude || 0,
                    longitude: value?.longitude || 0,
                    latitudeDelta: value?.latitudeDelta || 0.0922,
                    longitudeDelta: value?.longitudeDelta || 0.0421,
                });
            } catch (error) {
                setInitialLocation({
                    latitude: 0,
                    longitude: 0,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
            }
        }, []);

        useEffect(() => {
            getPhoneLocation();
        }, []);

        const handleRegionChange = async ({
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta,
        }: Region) => {
            try {
                const jsonValue = JSON.stringify({
                    latitude,
                    longitude,
                    latitudeDelta,
                    longitudeDelta,
                });

                await AsyncStorage.setItem("location", jsonValue);
            } catch (error) {
                console.log(error);
            }
        };

        const handleTouchStart = useCallback(async () => {
            inhalerListModalRef.current?.collapse();
        }, []);

        const handleUserLocationChange = (event: UserLocationChangeEvent) => {
            if (event.nativeEvent.coordinate) {
                setLocation({
                    latitude: event.nativeEvent.coordinate.latitude,
                    longitude: event.nativeEvent.coordinate.longitude,
                });
            }
        };

        const checkLocationPermission = useCallback(async () => {
            try {
                if (Platform.OS === "android") {
                    const granted = await Location.hasServicesEnabledAsync();

                    if (granted) {
                        setUbicationState(true);
                    } else {
                        //setLocation(null);
                        setUbicationState(false);
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }, []);

        useFocusEffect(
            useCallback(() => {
                checkLocationPermission();

                const intervalId = setInterval(checkLocationPermission, 10000);

                return () => {
                    clearInterval(intervalId);
                };
            }, [])
        );

        if (initialLocation)
            return (
                <MapView
                    ref={ref}
                    initialRegion={initialLocation}
                    style={styles.mapContainer}
                    showsUserLocation={ubicationState}
                    showsMyLocationButton={ubicationState}
                    mapPadding={{ top: 32, left: 0, bottom: 0, right: 0 }}
                    onRegionChange={handleRegionChange}
                    onTouchStart={handleTouchStart}
                    onUserLocationChange={handleUserLocationChange}
                    showsCompass={false}
                    showsBuildings={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                    loadingEnabled={true}
                    customMapStyle={mapStyle}
                    userLocationUpdateInterval={15000}
                >
                    {inhaler && (
                        <InhalerMarker
                            latitude={inhaler.latitude}
                            longitude={inhaler.longitude}
                        />
                    )}

                    {pharmacies &&
                        pharmacies.map((item, index) => (
                            <InhalerMarker
                                key={index}
                                latitude={item.geometry.location.lat}
                                longitude={item.geometry.location.lng}
                            />
                        ))}
                </MapView>
            );
    })
);

const InhalerMarker = memo(({ latitude, longitude }: InhalerMarkerProps) => {
    return (
        <Marker
            coordinate={{
                latitude: latitude,
                longitude: longitude,
            }}
            tracksViewChanges={false}
        />
    );
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
        justifyContent: "flex-end",
        gap: 16,
    },
    locationButton: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
    },
    ubicationButton: {
        alignSelf: "flex-end",
        backgroundColor: Colors.white,
    },
    storeButton: {
        alignSelf: "flex-end",
        backgroundColor: Colors.white,
    },
    locationButtonText: {
        color: "white",
    },
    bottomSheetContainer: {
        flex: 1,
    },
    headerContent: {
        marginBottom: 16,
        paddingHorizontal: 24,
    },
    headerText: {
        fontSize: 22,
    },
});

export default memo(TabTwoScreen);
