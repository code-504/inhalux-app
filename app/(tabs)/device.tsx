import {
    ImageBackground,
    View,
    StyleSheet,
    Dimensions,
    Animated as AnimatedReact,
    Image,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Button, Input, ScrollView } from "tamagui";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import Colors from "@/constants/Colors";
import Card from "@/components/Card/Card";
import SimpleWeatherCard from "@/components/Card/SimpleWeatherCard";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { ExpandingDot } from "react-native-animated-pagination-dots";
import HeaderAction from "@/components/HeaderAction";
import Animated from "react-native-reanimated";
import { RefreshControl } from "react-native-gesture-handler";
import { useInhalers } from "@/context/InhalerProvider";
import { Tabs, router } from "expo-router";
import {
    BottomSheetBackdropProps,
    BottomSheetFlatList,
    BottomSheetModal,
} from "@gorhom/bottom-sheet";
import UserHeader from "@/components/Headers/UserHeader";
import BlurredBackground from "@/components/BlurredBackground";

// Resourses
import AddIcon from "@/assets/icons/add.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import inhaler from "@/assets/images/inhaler-img.png";
import {
    MontserratText,
    MontserratBoldText,
    MontserratSemiText,
} from "@/components/StyledText";
import BackgroundImage from "@/assets/images/background.png";
const IMAGE = Image.resolveAssetSource(inhaler).uri;
import inhalerShadow from "@/assets/images/inhaler-shadow-img.png";
import BatteryIcon from "@/assets/icons/battery.svg";
import DoseIcon from "@/assets/icons/dose.svg";
import VolumenUpIcon from "@/assets/icons/volume_up.svg";
import TrackChangesIcon from "@/assets/icons/track_changes.svg";
import HelpIcon from "@/assets/icons/help.svg";
import AqIcon from "@/assets/icons/aq.svg";
import HumIcon from "@/assets/icons/humidity_percentage.svg";
import PM2_5Icon from "@/assets/icons/blur_circular.svg";
import PM10Icon from "@/assets/icons/blur.svg";
import CoIcon from "@/assets/icons/co.svg";
import TempIcon from "@/assets/icons/device_thermostat.svg";
import NitroIcon from "@/assets/icons/circles_ext.svg";
import OzonoIcon from "@/assets/icons/radio_button_checked.svg";
import NotificationIcon from "@/assets/icons/notifications.svg";
import { useInhalersData } from "@/api/inhaler";
import { useInhalerStore } from "@/stores/inhaler";

NavigationBar.setBackgroundColorAsync("transparent");
NavigationBar.setButtonStyleAsync("dark");
NavigationBar.setPositionAsync("absolute");

export default function TabOneScreen() {
    const scrollX = useRef(new AnimatedReact.Value(0)).current;
    const [refresh, setRefresh] = useState<boolean>(false);
    const { /* supaInhalers,*/ weatherData } = useInhalers();
    /*const [supaInhalers, setSupaInhalers] = useInhalerStore(
        (state) => [state.supaInhalers, state.setSupaInhalers],
        shallow
    );*/

    const { data } = useInhalersData();
    console.log("InhalersData: ", data);
    
    /*useEffect(() => {
        console.log("inhalersData: ", idata);

        setSupaInhalers(idata);
    }, [idata]);*/

    console.log("re-renders");

    const { width: screenWidth } = Dimensions.get("window");
    const SPACING = 12;
    const ITEM_WIDTH = screenWidth;

    const pullRequest = async () => {
        setRefresh(true);

        setRefresh(false);

        //return () => clearInterval(interval);
    };

    //console.log("DEVICE-DATA", data);

    // ref
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    // variables
    const snapPoints = useMemo(() => ["50%", "80%"], []);

    // callbacks
    const handleOpenPress = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);

    interface WeatherDataDescriptionProps {
        id: string;
        Icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
        color: string;
        title: string;
        description: string;
    }

    const WeatherDataDescription: WeatherDataDescriptionProps[] = [
        {
            id: "info-1",
            Icon: AqIcon,
            color: Colors.pink,
            title: "Calidad del aire",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
            id: "info-2",
            Icon: CoIcon,
            color: Colors.blueLight,
            title: "Monóxido de carbono",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
            id: "info-3",
            Icon: PM2_5Icon,
            color: Colors.redLight,
            title: "PM 2.5",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
            id: "info-4",
            Icon: PM10Icon,
            color: Colors.orangeLight,
            title: "PM 10",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
            id: "info-5",
            Icon: TempIcon,
            color: Colors.brownLight,
            title: "Temperatura",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
            id: "info-6",
            Icon: HumIcon,
            color: Colors.blueLight,
            title: "Humedad",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
            id: "info-7",
            Icon: NitroIcon,
            color: Colors.purpleLight,
            title: "Dióxido de nitrógeno",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
            id: "info-8",
            Icon: OzonoIcon,
            color: Colors.greenLight,
            title: "Ozono",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
    ];

    const renderInfoItem = useCallback(({ item }: any) => {
        return (
            <View style={stylesItem.container}>
                <View style={stylesItem.cardIconView}>
                    <View
                        style={[
                            stylesItem.cardIcon,
                            { backgroundColor: item.color },
                        ]}
                    >
                        <item.Icon />
                    </View>
                </View>

                <View style={stylesItem.textView}>
                    <MontserratSemiText style={stylesItem.textTitle}>
                        {item.title}
                    </MontserratSemiText>
                    <MontserratText style={stylesItem.textDescription}>
                        {item.description}
                    </MontserratText>
                </View>
            </View>
        );
    }, []);

    const RenderItem = ({ item }: any) => (
        <Card style={styles.inahlerCard} radius={44}>
            <View style={styles.inahlerCardView}>
                <View style={styles.inahlerCardContent}>
                    <View style={styles.inhalerCardLeft}>
                        <View style={styles.inahlerButton}>
                            <Button
                                style={styles.settingsButton}
                                alignSelf="center"
                                size="$6"
                                circular
                                onPress={() =>
                                    router.push(`/device/${item.id}`)
                                }
                            >
                                <SettingsIcon />
                            </Button>
                        </View>

                        <View style={styles.inahlerView}>
                            <View style={styles.inahlerTitleView}>
                                <MontserratBoldText style={styles.inahlerTitle}>
                                    {item.title}
                                </MontserratBoldText>
                                <MontserratText>
                                    {item.connection}
                                </MontserratText>
                            </View>

                            <View style={styles.inahlerStatus}>
                                <View style={styles.inahlerStatusInfo}>
                                    <BatteryIcon
                                        style={styles.inahlerStatusIcon}
                                    />
                                    <MontserratSemiText>
                                        {item.battery}%
                                    </MontserratSemiText>
                                </View>

                                <View style={styles.inahlerStatusInfo}>
                                    <DoseIcon
                                        style={styles.inahlerStatusIcon}
                                    />
                                    <MontserratSemiText>
                                        {item.dosis} dosis
                                    </MontserratSemiText>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.inhalerCardRight}>
                        <Animated.Image
                            style={styles.inahlerImage}
                            source={{ uri: IMAGE }}
                        />

                        {/*<Image style={styles.inahlerImage} source={inhaler} />*/}
                        <Image
                            style={styles.inahlerShadowImage}
                            source={inhalerShadow}
                        />
                    </View>
                </View>

                <View style={styles.inhalerButtonsView}>
                    <Button
                        style={styles.inhalerButton}
                        size="$6"
                        borderRadius={"$radius.10"}
                    >
                        <VolumenUpIcon />
                        <MontserratSemiText>Sonido</MontserratSemiText>
                    </Button>

                    <Button
                        style={styles.inhalerButton}
                        size="$6"
                        borderRadius={"$radius.10"}
                    >
                        <TrackChangesIcon />
                        <MontserratSemiText>Análisis</MontserratSemiText>
                    </Button>
                </View>
            </View>
        </Card>
    );

    return (
        <>
            <Tabs.Screen
                options={{
                    header: () => (
                        <UserHeader showUserName>
                            <Button
                                backgroundColor={Colors.white}
                                alignSelf="center"
                                size="$6"
                                circular
                                onPress={() => router.push("/notification/")}
                            >
                                <NotificationIcon />
                            </Button>
                        </UserHeader>
                    ),
                }}
            />

            <View style={styles.safeAre}>
                <ImageBackground
                    source={BackgroundImage}
                    style={styles.imageBackground}
                />
                <ScrollView
                    style={styles.scrollView}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={pullRequest}
                        ></RefreshControl>
                    }
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        <HeaderAction
                            title="Dispositivos"
                            subtitle="Información general"
                            Icon={AddIcon}
                            action={() => router.push("/device/search_device")}
                        />
                    </View>
                    {/* Inicio */}

                    {data && data.length > 0 ? (
                        <>
                            <View style={styles.carouselView}>
                                <FlashList
                                    data={data}
                                    keyExtractor={(item: any) => item.id}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    pagingEnabled
                                    decelerationRate={0}
                                    snapToInterval={ITEM_WIDTH}
                                    snapToAlignment={"center"}
                                    scrollEventThrottle={16}
                                    estimatedItemSize={ITEM_WIDTH}
                                    onScroll={AnimatedReact.event(
                                        [
                                            {
                                                nativeEvent: {
                                                    contentOffset: {
                                                        x: scrollX,
                                                    },
                                                },
                                            },
                                        ],
                                        {
                                            useNativeDriver: false,
                                        }
                                    )}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View
                                                style={{
                                                    width: ITEM_WIDTH,
                                                    marginTop: 20,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        marginHorizontal:
                                                            SPACING * 2,
                                                    }}
                                                >
                                                    <RenderItem item={item} />
                                                </View>
                                            </View>
                                        );
                                    }}
                                />
                                <View style={styles.dotContainer}>
                                    <ExpandingDot
                                        data={data}
                                        expandingDotWidth={30}
                                        scrollX={scrollX}
                                        inActiveDotOpacity={0.6}
                                        dotStyle={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 5,
                                            marginHorizontal: 5,
                                        }}
                                        inActiveDotColor={Colors.dotsGray}
                                        activeDotColor={Colors.tint}
                                        containerStyle={styles.dotsView}
                                    />
                                </View>
                            </View>
                        </>
                    ) : (
                        <View style={styles.noInhalersView}>
                            <MontserratText style={styles.timeText}>
                                No tienes Inhaladores!
                            </MontserratText>
                        </View>
                    )}

                    {/* Final */}
                    <View style={styles.content}>
                        <View style={styles.timeView}>
                            <View style={styles.timeTitleView}>
                                <View style={styles.timeTitle}>
                                    <MontserratText style={styles.timeText}>
                                        Pronóstico del
                                    </MontserratText>
                                    <MontserratBoldText style={styles.timeText}>
                                        Tiempo
                                    </MontserratBoldText>
                                    <MontserratSemiText
                                        style={styles.timeLocationText}
                                    >
                                        En {weatherData?.location}
                                    </MontserratSemiText>
                                </View>

                                <Button
                                    style={styles.whiteButton}
                                    alignSelf="center"
                                    size="$6"
                                    circular
                                    onPress={handleOpenPress}
                                >
                                    <HelpIcon fill={Colors.black} />
                                </Button>
                            </View>
                            {/* <SimpleWeatherCard Icon={HumIcon} color={Colors.cyan} title="Humedad" calification="Excelente" value="35%" /> */}
                            <View style={styles.weatherGrid}>
                                <View style={styles.twoBlock}>
                                    <SimpleWeatherCard
                                        Icon={AqIcon}
                                        color={Colors.pink}
                                        title="Calidad del aire"
                                        calification="Buena"
                                        value={weatherData?.aq}
                                        medition="us"
                                    />
                                    <SimpleWeatherCard
                                        Icon={CoIcon}
                                        color={Colors.blueLight}
                                        title="Monóxido de carbono"
                                        calification="Excelente"
                                        value={weatherData?.co}
                                        medition="(μg/m3)"
                                    />
                                </View>

                                <View style={styles.oneBlock}>
                                    <SimpleWeatherCard
                                        Icon={PM2_5Icon}
                                        color={Colors.redLight}
                                        title="PM 2.5"
                                        calification="Regular"
                                        value={weatherData?.pm2_5}
                                        medition="(μg/m3)"
                                    />
                                    <SimpleWeatherCard
                                        Icon={PM10Icon}
                                        color={Colors.orangeLight}
                                        title="PM 10"
                                        calification="Bueno"
                                        value={weatherData?.pm10}
                                        medition="(μg/m3)"
                                    />
                                </View>

                                <View style={styles.twoBlock}>
                                    <SimpleWeatherCard
                                        Icon={TempIcon}
                                        color={Colors.brownLight}
                                        title="Temperatura"
                                        calification="Regluar"
                                        value={weatherData?.temp}
                                        medition="°C"
                                    />
                                    <SimpleWeatherCard
                                        Icon={HumIcon}
                                        color={Colors.blueLight}
                                        title="Humedad"
                                        calification="Excelente"
                                        value={weatherData?.hum}
                                        medition="%"
                                    />
                                </View>

                                <View style={styles.twoBlock}>
                                    <SimpleWeatherCard
                                        Icon={NitroIcon}
                                        color={Colors.purpleLight}
                                        title="Dióxido de nitrógeno"
                                        calification="Regular"
                                        value={weatherData?.no2}
                                        medition="(μg/m3)"
                                    />
                                    <SimpleWeatherCard
                                        Icon={OzonoIcon}
                                        color={Colors.greenLight}
                                        title="Ozono"
                                        calification="Bueno"
                                        value={weatherData?.o3}
                                        medition="(μg/m3)"
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <BottomSheetModal
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    index={0}
                    backdropComponent={(
                        backdropProps: BottomSheetBackdropProps
                    ) => (
                        <BlurredBackground
                            {...backdropProps}
                            appearsOnIndex={1}
                            disappearsOnIndex={-1}
                            backgroundColor={Colors.black}
                            pressBehavior={"close"}
                        />
                    )}
                >
                    <View style={stylesBottom.container}>
                        <MontserratSemiText
                            style={stylesBottom.title}
                        >{`Información \nsobre la calidad del aire`}</MontserratSemiText>
                        <MontserratText style={stylesBottom.description}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit.
                        </MontserratText>
                    </View>

                    <BottomSheetFlatList
                        data={WeatherDataDescription}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={renderInfoItem}
                        contentContainerStyle={stylesBottom.container}
                    />
                </BottomSheetModal>
            </View>
            <StatusBar style="auto" backgroundColor="transparent" />
        </>
    );
}

const stylesItem = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        paddingVertical: 18,
        gap: 24,
    },
    cardIconView: {
        display: "flex",
        justifyContent: "flex-start",
    },
    cardIcon: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
        width: 32,
        height: 32,
    },
    textView: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    textTitle: {
        fontSize: 16,
    },
    textDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
});

const stylesBottom = StyleSheet.create({
    container: {
        paddingTop: 16,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 20,
        lineHeight: 26,
        marginBottom: 16,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: Colors.darkGray,
        marginBottom: 16,
    },
    infoText: {
        fontSize: 16,
        lineHeight: 22,
        color: Colors.darkGray,
    },
});

const styles = StyleSheet.create({
    safeAre: {
        flex: 1,
        width: "100%",
        backgroundColor: Colors.lightGrey,
    },
    imageBackground: {
        position: "absolute",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: "center",
    },
    scrollView: {
        width: "100%",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        marginTop: 24,
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
        borderRadius: 10,
    },
    carouselView: {
        width: "100%",
    },
    carousel: {
        width: "100%",
    },
    settingsButton: {
        backgroundColor: Colors.secondary,
    },
    whiteButton: {
        backgroundColor: Colors.white,
    },
    inahlerCard: {
        position: "relative",
    },
    inahlerCardView: {
        display: "flex",
        flexDirection: "column",
    },
    inahlerCardContent: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        height: 189,
    },
    inhalerCardLeft: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flex: 1,
    },
    inahlerButton: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    inahlerImage: {
        top: -55,
        left: 5,
        width: "96%",
        aspectRatio: 16 / 26,
        zIndex: 1,
    },
    inahlerShadowImage: {
        top: -280,
        left: -20,
        width: "96%",
        aspectRatio: 16 / 26,
        zIndex: 0,
    },
    inhalerCardRight: {
        position: "relative",
        flex: 1,
    },
    inahlerView: {
        width: "100%",
    },
    inahlerTitleView: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginBottom: 8,
    },
    inahlerTitle: {
        fontSize: 18,
        marginBottom: 8,
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
    inhalerButtonsView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
        gap: 8,
    },
    inhalerButton: {
        flex: 1,
        backgroundColor: Colors.secondary,
    },
    dotContainer: {
        justifyContent: "center",
        alignSelf: "center",
        height: 18,
    },
    dotsView: {
        top: 16,
    },
    timeView: {
        display: "flex",
        flexDirection: "column",
    },
    timeTitleView: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    timeTitle: {
        display: "flex",
    },
    timeText: {
        fontSize: 18,
    },
    timeLocationText: {
        marginTop: 8,
        fontSize: 14,
        color: Colors.darkGray,
    },
    weatherGrid: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    oneBlock: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: Colors.white,
        borderRadius: 28,
        gap: 16,
    },
    twoBlock: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 16,
    },
});
