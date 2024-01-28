import { BackHandler, StyleSheet } from "react-native";
import { useInhalersData } from "@/api/inhaler";
import BlurredBackground from "@/components/BlurredBackground";
import HeaderAction from "@/components/HeaderAction";
import {
    MontserratBoldText,
    MontserratSemiText,
    MontserratText,
} from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { Inhalers } from "@/interfaces/Device";
import { useLocationStore } from "@/stores/location";
import BottomSheet, {
    BottomSheetBackdropProps,
    BottomSheetFlatList,
    BottomSheetModal,
} from "@gorhom/bottom-sheet";
import {
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Pressable, View } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Button, Spinner } from "tamagui";
import {
    pharmacy,
    BottomSheetProps,
    BottomStoresProps,
} from "@/interfaces/Location";

import LocationOptionIcon from "@/assets/icons/location_gear.svg";
import inhalerList from "@/assets/images/inhaler-list.png";
import BatteryIcon from "@/assets/icons/battery.svg";
import SoundIcon from "@/assets/icons/volume_up.svg";
import RouteIcon from "@/assets/icons/alt_route.svg";
import CloseIcon from "@/assets/icons/close.svg";
import Ripple from "react-native-material-ripple";
import { stores } from "@/constants/Data";
import { useFocusEffect, useNavigation } from "expo-router";
import { Portal, PortalHost } from "@gorhom/portal";

type Ref = BottomSheet;

export const BottomInhalerList = memo(
    forwardRef<Ref, BottomSheetProps>(
        ({ buttonAnimatedPosition, buttonAnimatedIndex, onItemPress }, ref) => {
            const { bottom: bottomSafeArea, top: topSafeArea } =
                useSafeAreaInsets();

            const setInhaler = useLocationStore((state) => state.setInhaler);

            const setBottomSheetState = useLocationStore(
                (state) => state.setBottomSheetState
            );

            const inhalerListSnapPoints = useMemo(
                () => ["14%", "40%", "90%"],
                [bottomSafeArea]
            );

            useFocusEffect(
                useCallback(() => {
                    setBottomSheetState({
                        position: 108,
                        lockPosition: 614,
                        storeButtonVisible: false,
                        secondSheetActive: true,
                    });
                }, [])
            );

            //console.log("Bottom sheet");

            const { data } = useInhalersData();

            const ubicateInhaler = (item: Inhalers) => {
                setInhaler(item);

                setBottomSheetState({
                    position: 74,
                    lockPosition: 94,
                    storeButtonVisible: false,
                    secondSheetActive: true,
                });

                onItemPress && onItemPress(item);
            };

            const renderBackdrop = useCallback(
                (props: BottomSheetBackdropProps) => (
                    <BlurredBackground
                        {...props}
                        appearsOnIndex={2}
                        disappearsOnIndex={1}
                        pressBehavior={"none"}
                    />
                ),
                []
            );

            const renderItem = useCallback(
                ({ item }: { item: Inhalers }) => (
                    <Pressable onPress={() => ubicateInhaler(item)}>
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
                                    <MontserratSemiText
                                        style={stylesItem.textTitle}
                                    >
                                        {item.title}
                                    </MontserratSemiText>

                                    <View style={stylesItem.textDescription}>
                                        <MontserratText>
                                            {item.connection}
                                        </MontserratText>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                ),
                []
            );

            return (
                <BottomSheet
                    ref={ref}
                    key="BottomInhalerList"
                    topInset={topSafeArea}
                    snapPoints={inhalerListSnapPoints}
                    index={1}
                    enablePanDownToClose={false}
                    animatedPosition={buttonAnimatedPosition}
                    animatedIndex={buttonAnimatedIndex}
                    backdropComponent={renderBackdrop}
                >
                    <View style={styles.bottomSheetContainer}>
                        <View style={styles.headerContent}>
                            <HeaderAction
                                title="Ubicación"
                                subtitle="Encuentra tu inhaLux facilmente"
                                Icon={LocationOptionIcon}
                                color={Colors.lightGrey}
                                action={() => {}}
                            />
                        </View>
                        <BottomSheetFlatList
                            data={data}
                            keyExtractor={(item: any) => item.id}
                            renderItem={renderItem}
                        />
                    </View>
                </BottomSheet>
            );
        }
    )
);

type Ref2 = BottomSheet;

export const BottomInhaler = memo(
    forwardRef<Ref2, BottomSheetProps>(
        ({ buttonAnimatedIndex, buttonAnimatedPosition, onClose }, ref) => {
            const { bottom: bottomSafeArea, top: topSafeArea } =
                useSafeAreaInsets();

            const inhaler = useLocationStore((state) => state.inhaler);
            const setInhaler = useLocationStore((state) => state.setInhaler);
            const setBottomSheetState = useLocationStore(
                (state) => state.setBottomSheetState
            );
            const inhalerSnapPoints = useMemo(() => ["35%"], [bottomSafeArea]);

            const handleCloseButton = useCallback(() => {
                setInhaler(null);

                setBottomSheetState({
                    position: 108,
                    lockPosition: 614,
                    storeButtonVisible: false,
                    secondSheetActive: true,
                });

                onClose && onClose();
            }, []);

            //console.log("Bottom sheet 1 inhaler");

            /*useEffect(
                useCallback(() => {
                    const onBackPress2 = () => {
                        console.log("cuantos", bottomIndex);
                        if (inhaler) {
                            //console.log(bottomIndex.current);
                        } else if (navigation.canGoBack()) navigation.goBack();

                        console.log("lolo");
                        return true;
                    };

                    BackHandler.addEventListener(
                        "hardwareBackPress",
                        onBackPress2
                    );

                    return () =>
                        BackHandler.removeEventListener(
                            "hardwareBackPress",
                            onBackPress2
                        );
                }, [bottomIndex]),
                []
            );*/

            const renderItem = useCallback((item: Inhalers | null) => {
                if (!item) return <Spinner />;

                return (
                    <View style={stylesInhalerSheet.content}>
                        <View style={stylesInhalerSheet.titleView}>
                            <MontserratBoldText
                                style={stylesInhalerSheet.title}
                            >
                                {item.title}
                            </MontserratBoldText>
                            <MontserratText style={stylesInhalerSheet.address}>
                                {item.address}
                            </MontserratText>

                            <View style={stylesInhalerSheet.inahlerStatusInfo}>
                                <BatteryIcon
                                    style={stylesInhalerSheet.inahlerStatusIcon}
                                />
                                <MontserratSemiText>
                                    {item.battery}%
                                </MontserratSemiText>
                            </View>
                        </View>

                        <ButtonsView />
                    </View>
                );
            }, []);

            const ButtonsView = memo(() => {
                return (
                    <View style={stylesInhalerSheet.buttonsView}>
                        <Button
                            height="$11"
                            borderRadius={"$radius.10"}
                            style={stylesInhalerSheet.button}
                        >
                            <View style={stylesInhalerSheet.buttonTextView}>
                                <SoundIcon />
                                <MontserratBoldText>Sonido</MontserratBoldText>
                                <MontserratText>Desactivado</MontserratText>
                            </View>
                        </Button>
                        <Button
                            height="$11"
                            borderRadius={"$radius.10"}
                            style={stylesInhalerSheet.button}
                        >
                            <View style={stylesInhalerSheet.buttonTextView}>
                                <RouteIcon />
                                <MontserratBoldText>
                                    Distancia
                                </MontserratBoldText>
                                <MontserratText>5m altitud 5m</MontserratText>
                            </View>
                        </Button>
                    </View>
                );
            });

            return (
                <Portal>
                    <BottomSheet
                        ref={ref}
                        key="inhalerModalSheet"
                        snapPoints={inhalerSnapPoints}
                        index={-1}
                        enablePanDownToClose={false}
                        animatedPosition={buttonAnimatedPosition}
                        animatedIndex={buttonAnimatedIndex}
                        enableOverDrag={false}
                    >
                        <View style={styles.bottomSheetContainer}>
                            <Button
                                style={stylesInhalerSheet.closeButton}
                                circular
                                onPress={handleCloseButton}
                            >
                                <CloseIcon />
                            </Button>

                            <View style={styles.headerContent}>
                                {renderItem(inhaler)}
                            </View>
                        </View>
                    </BottomSheet>
                </Portal>
            );
        }
    )
);

export const BottomStores = memo(
    forwardRef<Ref, BottomStoresProps>(
        (
            {
                buttonAnimatedIndex,
                buttonAnimatedPosition,
                onItemPress,
                onClose,
            },
            ref
        ) => {
            const { bottom: bottomSafeArea, top: topSafeArea } =
                useSafeAreaInsets();

            const setBottomSheetState = useLocationStore(
                (state) => state.setBottomSheetState
            );

            const pharmacies = useLocationStore((state) => state.pharmacies);
            const setPharmacies = useLocationStore(
                (state) => state.setPharmacies
            );

            const storesListSnapPoints = useMemo(
                () => ["14%", "90%"],
                [bottomSafeArea]
            );

            //console.log("BottomStores - re-render");

            const getNearbyPharmacies = useCallback(async () => {
                try {
                    setPharmacies(stores.results);

                    setBottomSheetState({
                        lockPosition: 0,
                        position: 0 - bottomSafeArea,
                        storeButtonVisible: false,
                        secondSheetActive: true,
                    });
                } catch (error) {
                    console.error("Error al obtener farmacias:", error);
                }
            }, []);

            const handleSheetChange = useCallback(
                (index: number) => {
                    if (index === 1 && pharmacies === null)
                        getNearbyPharmacies();
                },
                [pharmacies]
            );

            const handleCloseButton = () => {
                setPharmacies(null);

                setBottomSheetState({
                    position: 108,
                    lockPosition: 614,
                    storeButtonVisible: false,
                    secondSheetActive: true,
                });

                onClose();
            };

            const renderBackdrop = useCallback(
                (props: BottomSheetBackdropProps) => (
                    <BlurredBackground
                        {...props}
                        appearsOnIndex={1}
                        disappearsOnIndex={0}
                        pressBehavior={"collapse"}
                    />
                ),
                []
            );

            /*useEffect(
                useCallback(() => {
                    const onBackPress = () => {
                        console.log(bottomIndex.current);
                        if (bottomIndex.current !== -1) handleCloseButton();
                        else if (navigation.canGoBack()) navigation.goBack();
                        console.log("lala");

                        return true;
                    };

                    BackHandler.addEventListener(
                        "hardwareBackPress",
                        onBackPress
                    );

                    return () =>
                        BackHandler.removeEventListener(
                            "hardwareBackPress",
                            onBackPress
                        );
                }, [bottomIndex.current])
            );*/

            const renderStoreItem = useCallback(({ item }: any) => {
                return (
                    <Ripple onPress={() => onItemPress(item)}>
                        <View style={stylesStoreItem.container}>
                            <View style={stylesStoreItem.infoView}>
                                <MontserratSemiText
                                    style={stylesStoreItem.title}
                                >
                                    {item.name}
                                </MontserratSemiText>
                                <MontserratText style={stylesStoreItem.address}>
                                    {String(item.vicinity).split(",")[0]}
                                </MontserratText>
                                {item.business_status !== "OPERATIONAL" ? (
                                    <MontserratSemiText
                                        style={stylesStoreItem.noService}
                                    >
                                        Farmacia fuera de servicio
                                    </MontserratSemiText>
                                ) : (
                                    item.opening_hours && (
                                        <MontserratSemiText
                                            style={
                                                item.opening_hours.open_now
                                                    ? stylesStoreItem.isOpen
                                                    : stylesStoreItem.isClose
                                            }
                                        >
                                            {item.opening_hours.open_now
                                                ? "Abierto"
                                                : "Cerrado"}
                                        </MontserratSemiText>
                                    )
                                )}
                            </View>
                        </View>
                    </Ripple>
                );
            }, []);

            return (
                <Portal>
                    <BottomSheet
                        ref={ref}
                        key="StoresListSheet"
                        onChange={handleSheetChange}
                        topInset={topSafeArea}
                        bottomInset={bottomSafeArea}
                        snapPoints={storesListSnapPoints}
                        index={-1}
                        enablePanDownToClose={false}
                        animatedPosition={buttonAnimatedPosition}
                        animatedIndex={buttonAnimatedIndex}
                        backdropComponent={renderBackdrop}
                    >
                        <View style={styles.bottomSheetContainer}>
                            <Button
                                style={stylesInhalerSheet.closeButton}
                                circular
                                onPress={handleCloseButton}
                            >
                                <CloseIcon />
                            </Button>

                            <View style={styles.headerContent}>
                                <MontserratBoldText style={styles.headerText}>
                                    Lista de tiendas
                                </MontserratBoldText>
                            </View>

                            <BottomSheetFlatList
                                data={pharmacies}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={renderStoreItem}
                            />
                        </View>
                    </BottomSheet>
                </Portal>
            );
        }
    )
);

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

const stylesItem = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: Colors.bottomBarGray,
    },
    infoView: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    textView: {
        display: "flex",
        flexDirection: "column",
        gap: 2,
    },
    textTitle: {
        fontSize: 16,
    },
    textDescription: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 1000,
        backgroundColor: Colors.dotsGray,
    },
});

const stylesInhalerSheet = StyleSheet.create({
    content: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    titleView: {
        marginTop: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    title: {
        fontSize: 22,
    },
    address: {
        fontSize: 14,
        lineHeight: 18,
        color: Colors.darkGray,
    },
    closeButton: {
        position: "absolute",
        top: 0,
        right: 24,
        zIndex: 200,
    },
    inahlerStatus: {
        display: "flex",
        flexDirection: "row",
    },
    inahlerStatusInfo: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginRight: 8,
    },
    inahlerStatusIcon: {
        marginRight: 4,
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
        backgroundColor: Colors.secondary,
    },
    buttonTextView: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
    },
});

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
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 16,
    },
    address: {
        fontSize: 14,
        color: Colors.darkGray,
    },
    noService: {
        color: Colors.black,
    },
    isOpen: {
        color: Colors.green,
    },
    isClose: {
        color: Colors.red,
    },
});
