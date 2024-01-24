import {
    View,
    ScrollView,
    Animated,
    StyleSheet,
    Dimensions,
    Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import NormalHeader from "@/components/Headers/NormalHeader";
import { Dialog, Divider, Menu, Portal } from "react-native-paper";
import Ripple from "react-native-material-ripple";
import Colors from "@/constants/Colors";
import { Avatar, Button } from "tamagui";
import AvatarImg from "@/assets/images/default_avatar.png";
import { MontserratSemiText, MontserratText } from "@/components/StyledText";
import TabBar from "@/components/TabBar";
import SimpleWeatherCard, {
    FillType,
} from "@/components/Card/SimpleWeatherCard";
import { BarChart, yAxisSides } from "react-native-gifted-charts";
import { supabase } from "@/services/supabase";
import { useAuth } from "@/context/Authprovider";
import { useRelations } from "@/context/RelationsProvider";
import {
    checkIfPacientHasTreatment,
    getHistorialData,
    getPacientInhalers,
} from "@/helpers/pacient_view";
import DatePicker from "@/components/DatePicker";
import { getDate } from "@/helpers/date";
import TagSelect, { Tag } from "@/components/TagSelect";
import HistorialSearch from "@/components/HistorialSearch";

// Resources
import MoreIcon from "@/assets/icons/more_vert.svg";
import InhalerIcon from "@/assets/icons/inhaler.svg";
import TreatmentIcon from "@/assets/icons/prescriptions.svg";
import PillIcon from "@/assets/icons/pill.svg";

const screenWidth = Dimensions.get("window").width - 48;

const PacientViewPage = () => {
    const { pacient_id, pacient_avatar, pacient_kindred, pacient_name } =
        useLocalSearchParams();

    const { supaUser } = useAuth();
    const { pacientState, setPacientState } = useRelations();
    const navigation = useNavigation();

    const [pacientInhalers, setPacientInhalers] = useState<any[]>([]);
    const [hasTreatment, setHasTreatment] = useState<boolean>(false);
    const [pacientHistorial, setPacientHistorial] = useState<any[]>([]);
    const [filteredHistorial, setFilteredHistorial] = useState<any[]>([]);

    const [selectedInhaler, setSelectedInhaler] = useState<any>({
        label: "todo",
        value: "all",
    });
    const [selectedTreatment, setSelectedTreatment] = useState<Tag>({
        label: "Todo",
        value: "3",
    });

    useEffect(() => {
        const getInhalers = async () => {
            const data = await getPacientInhalers(String(pacient_id));
            if (data) setPacientInhalers(data);
        }; //getInhalers
        const checkTreatment = async () => {
            const data = await checkIfPacientHasTreatment(String(pacient_id));
            if (data) {
                setHasTreatment(data);

                const historialData = await getHistorialData(
                    String(pacient_id)
                );
                console.log("historialData: ", historialData);
                setPacientHistorial(historialData);
                setSelectedTreatment({ label: "Todo", value: "3" });
            }
        }; //checkTreatment

        getInhalers();
        checkTreatment();
    }, []);

    useEffect(() => {
        console.log("Esta cambiando a: ", selectedTreatment.value);

        const newfilteredHistorial = pacientHistorial.map((day) => ({
            ...day,
            data: day.data.filter(
                (item: any) =>
                    selectedTreatment.value === "3" ||
                    item.type.toString() === selectedTreatment.value
            ),
        }));

        console.log("NUEVO: ", newfilteredHistorial);
        setFilteredHistorial(newfilteredHistorial);
    }, [selectedTreatment]);

    const [visible, setVisible] = useState(false);

    let scrollOffsetY = useRef(new Animated.Value(0)).current;

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const barData = [
        { value: 3, label: "27 nov" },
        { value: 7, label: "28 nov" },
        { value: 5, label: "29 nov" },
        { value: 12, label: "30 nov" },
    ];

    const DATA = [
        {
            title: "Hoy",
            data: [
                {
                    title: "Tratamiento aceptado",
                    message: "El tratamiento fue cumplido",
                    hour: "12:00 pm",
                    type: 0,
                },
                {
                    title: "Tratamiento no realizado",
                    message: "No se registró la inhalación",
                    hour: "1:00 pm",
                    type: 1,
                },
                {
                    title: "Pendiente",
                    message: "Tratamiento en espera",
                    hour: "7:00 pm",
                    type: 2,
                },
                {
                    title: "Cancelado",
                    message: "Se canceló el uso del inhalador",
                    hour: "8:00 pm",
                    type: 3,
                },
            ],
        },
        {
            title: "Ayer",
            data: [
                {
                    title: "Pendiente",
                    message: "Tratamiento en espera",
                    hour: "7:00 pm",
                    type: 2,
                },
                {
                    title: "Cancelado",
                    message: "Se canceló el uso del inhalador",
                    hour: "8:00 pm",
                    type: 3,
                },
            ],
        },
    ];

    const [dialog, setDialog] = useState(false);

    const showDialog = () => {
        setVisible(false);
        setDialog(true);
    };

    const hideDialog = () => setDialog(false);

    const deleteRelation = async () => {
        const { error } = await supabase
            .from("user_relations")
            .delete()
            .eq("fk_user_patient", pacient_id)
            .eq("fk_user_monitor", supaUser?.id);

        if (error) {
            console.log(error.message);
            Alert.alert("Algo salió mal...");
            return;
        }

        const updatedPacientState = pacientState.data.filter(
            (item) => item.id !== pacient_id
        );
        setPacientState({
            ...pacientState,
            filterText: "",
            data: updatedPacientState,
        });

        navigation.goBack();
    };

    const onDateChange = (dateRange: {
        start: string | null;
        end: string | null;
    }) => {
        //console.log(dateRange)
    };

    return (
        <View style={styles.safeAre}>
            <Stack.Screen
                options={{
                    header: () => (
                        <NormalHeader
                            title={"Nombre Paciente"}
                            animHeaderValue={scrollOffsetY}
                        >
                            <Menu
                                visible={visible}
                                onDismiss={closeMenu}
                                contentStyle={{
                                    backgroundColor: Colors.white,
                                    borderRadius: 18,
                                }}
                                anchor={
                                    <Ripple
                                        style={{
                                            overflow: "hidden",
                                            height: 64,
                                            width: 64,
                                            backgroundColor: Colors.white,
                                            borderRadius: 60,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                        onPress={openMenu}
                                    >
                                        <MoreIcon />
                                    </Ripple>
                                }
                            >
                                <Menu.Item
                                    onPress={showDialog}
                                    leadingIcon="logout"
                                    title="Dejar de monitorear"
                                />
                            </Menu>
                        </NormalHeader>
                    ),
                }}
            />

            <ScrollView
                style={styles.scrollView}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
                    { useNativeDriver: false }
                )}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.avatarView}>
                    <Avatar size="$14" circular>
                        <Avatar.Image
                            accessibilityLabel="user"
                            src={String(pacient_avatar)}
                        />
                        <Avatar.Fallback backgroundColor={Colors.dotsGray} />
                    </Avatar>

                    <View style={styles.avatarTextView}>
                        <MontserratSemiText style={styles.avatarName}>
                            {pacient_name}
                        </MontserratSemiText>
                        <MontserratText>{pacient_kindred}</MontserratText>
                    </View>
                </View>

                <TabBar.TabBar headerPadding={24}>
                    <TabBar.Item
                        title="Inhaladores"
                        Icon={InhalerIcon}
                        height={840}
                    >
                        {pacientInhalers.length > 0 ? (
                            <View style={stylesTab.content}>
                                <View style={stylesTab.sectionView}>
                                    <View style={stylesTab.titleView}>
                                        <MontserratSemiText
                                            style={stylesTab.title}
                                        >
                                            Uso del inhalador
                                        </MontserratSemiText>

                                        <TagSelect
                                            tags={[
                                                ...pacientInhalers.map(
                                                    (inhaler) => ({
                                                        label: inhaler.title,
                                                        value: inhaler.id,
                                                        time: inhaler.connection,
                                                        inhalations:
                                                            inhaler.pulsations,
                                                        battery:
                                                            inhaler.battery,
                                                    })
                                                ),
                                            ]}
                                            selected={selectedInhaler}
                                            setSelected={setSelectedInhaler}
                                        />

                                        <MontserratText
                                            style={stylesTab.description}
                                        >
                                            {`Ultima conexión ${selectedInhaler.time}, con un ${selectedInhaler.battery}% de batería`}
                                        </MontserratText>
                                    </View>

                                    <View style={stylesTab.oneBlock}>
                                        <SimpleWeatherCard
                                            Icon={PillIcon}
                                            color={Colors.greenLight}
                                            title="Inhalaciones desde la última recarga"
                                            value={selectedInhaler.inhalations}
                                            type={FillType.outline}
                                            valueStyle={{
                                                fontWeight: "bold",
                                                color: Colors.black,
                                            }}
                                        />
                                    </View>
                                </View>

                                <View style={stylesTab.sectionView}>
                                    <View style={stylesTab.subtitleView}>
                                        <MontserratSemiText
                                            style={stylesTab.title}
                                        >
                                            Resumen de uso
                                        </MontserratSemiText>

                                        <DatePicker
                                            onDateChange={onDateChange}
                                            startRange={getDate(-7)}
                                            endRange={getDate(0)}
                                        />
                                    </View>

                                    <View>
                                        <View
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                gap: 8,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    marginTop: 14,
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: 10,
                                                    backgroundColor:
                                                        "rgb(0, 106, 38)",
                                                }}
                                            ></View>
                                            <View>
                                                <MontserratSemiText
                                                    style={{ fontSize: 24 }}
                                                >
                                                    10
                                                </MontserratSemiText>
                                                <MontserratText
                                                    style={{
                                                        color: Colors.darkGray,
                                                    }}
                                                >
                                                    Inhalaciones
                                                </MontserratText>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={stylesTab.containerChart}>
                                        <BarChart
                                            data={barData}
                                            barWidth={42}
                                            cappedBars
                                            capColor={"rgb(0, 106, 38)"}
                                            capThickness={2}
                                            showGradient
                                            gradientColor={
                                                "rgba(0, 106, 38, 0.2)"
                                            }
                                            frontColor={"rgba(0, 106, 38, 0)"}
                                            width={screenWidth - 48}
                                            yAxisSide={yAxisSides.RIGHT}
                                            yAxisThickness={0}
                                            xAxisThickness={0}
                                            dashGap={15}
                                            dashWidth={7}
                                            maxValue={
                                                Math.max(
                                                    ...barData.map(
                                                        (item) => item.value
                                                    )
                                                ) + 1
                                            }
                                            stepHeight={65}
                                            initialSpacing={30}
                                            spacing={35}
                                            noOfSections={5}
                                            rulesColor={Colors.borderColor}
                                            rulesThickness={1}
                                            disablePress
                                        />
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <MontserratText style={{ color: Colors.darkGray }}>
                                ¡Tu paciente NO tiene inhaladores!
                            </MontserratText>
                        )}
                    </TabBar.Item>

                    <TabBar.Item
                        title="Tratamiento"
                        Icon={TreatmentIcon}
                        height={600}
                    >
                        <View style={stylesTab.content}>
                            <View>
                                <MontserratSemiText>
                                    Historial
                                </MontserratSemiText>
                            </View>

                            <TagSelect
                                tags={[
                                    { label: "Todo", value: "3" },
                                    { label: "Realizado", value: "0" },
                                    { label: "Omitido", value: "1" },
                                    { label: "Pendiente", value: "2" },
                                ]}
                            />

                            <HistorialSearch data={/*DATA*/ pacientHistorial} />
                        </View>
                    </TabBar.Item>
                </TabBar.TabBar>
            </ScrollView>

            <Portal>
                <Dialog
                    visible={dialog}
                    onDismiss={hideDialog}
                    style={{ backgroundColor: Colors.white }}
                >
                    <Dialog.Title>Dejar de monitorear</Dialog.Title>
                    <Dialog.Content>
                        <MontserratText>
                            Esta acción no se puede deshacer
                        </MontserratText>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            onPress={hideDialog}
                            backgroundColor={Colors.lightGrey}
                            borderRadius={100}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onPress={deleteRelation}
                            backgroundColor={Colors.redLight}
                            color={Colors.red}
                            borderRadius={100}
                        >
                            Dejar de monitorear
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

export default PacientViewPage;

const styles = StyleSheet.create({
    safeAre: {
        flex: 1,
        width: "100%",
        backgroundColor: Colors.white,
        paddingTop: 128,
    },
    scrollView: {
        width: "100%",
    },
    content: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        paddingHorizontal: 24,
    },
    avatarView: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 32,
        gap: 16,
    },
    avatarTextView: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: 4,
    },
    avatarName: {
        fontSize: 18,
    },
});

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
    subtitleView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    titleView: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    titleContent: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 18,
    },
    description: {
        fontSize: 14,
        color: Colors.darkGray,
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
    containerChart: {
        justifyContent: "center",
        alignItems: "center",
    },
    chart: {
        marginVertical: 8,
    },
    grayButton: {
        backgroundColor: Colors.lightGrey,
    },
});
