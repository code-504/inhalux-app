import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Stack, Tabs } from "expo-router";
import { useColorScheme, StyleSheet, View } from "react-native";
import Push from "../../components/Push";
import Colors from "@/constants/Colors";

// Resources
import InhalerIcon from "@/assets/icons/inhaler.svg";
import TreatmentIcon from "@/assets/icons/treatment.svg";
import MonitorIcon from "@/assets/icons/monitor.svg";
import LocationIcon from "@/assets/icons/location.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */

/*
function TabBarIcon(props: {
    Icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    color: string;
    focused: boolean;
    title: string;
}) {
    const Icon = props.Icon;
    const focused = props.focused;

    return (
        <View style={styles.tabBarIcon}>
            <Icon />
            {
                focused && <View style={styles.tabBarDot}></View>
            }
        </View>
    )
}*/

function TabBarIcon(props: {
    Icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    color: string;
    focused: boolean;
    title: string;
}) {
    const Icon = props.Icon;
    const focused = props.focused;
    const title = props.title;

    return (
        <View style={styles.tabBarIcon}>
            <View>
                <Icon fill={focused ? Colors.tint : "#272727"} />
            </View>

            <View
                style={[styles.tabBarDot, { opacity: focused ? 1 : 0 }]}
            ></View>
        </View>
    );
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { bottom: bottomSafeArea, top: topSafeArea } = useSafeAreaInsets();

    return (
        <>
            {/* <Push/> */}
            <BottomSheetModalProvider>
                <Tabs
                    screenOptions={{
                        tabBarStyle: {
                            ...styles.navigationStyle,
                            height: 72 + bottomSafeArea,
                        },
                        tabBarShowLabel: false,
                        tabBarActiveTintColor:
                            Colors[colorScheme ?? "light"].tint,
                        lazy: true,
                    }}
                    initialRouteName="device"
                >
                    <Tabs.Screen
                        name="device"
                        options={{
                            tabBarIcon: ({ color, focused }) => (
                                <TabBarIcon
                                    Icon={InhalerIcon}
                                    color={color}
                                    focused={focused}
                                    title="Dispositivo"
                                />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="treatment"
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ color, focused }) => (
                                <TabBarIcon
                                    Icon={TreatmentIcon}
                                    color={color}
                                    focused={focused}
                                    title="Tratamiento"
                                />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="monitor"
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ color, focused }) => (
                                <TabBarIcon
                                    Icon={MonitorIcon}
                                    color={color}
                                    focused={focused}
                                    title="Monitoreo"
                                />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="location"
                        options={{
                            header: () => null,
                            tabBarIcon: ({ color, focused }) => (
                                <TabBarIcon
                                    Icon={LocationIcon}
                                    color={color}
                                    focused={focused}
                                    title="Ubicación"
                                />
                            ),
                        }}
                    />
                </Tabs>
            </BottomSheetModalProvider>
        </>
    );
}

const styles = StyleSheet.create({
    navigationStyle: {
        paddingTop: 8,
        backgroundColor: Colors.white,
        borderTopWidth: 0,
        elevation: 0,
    },
    tabBarIcon: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
    },
    iconFocused: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: 50,
        paddingVertical: 4,
        borderRadius: 100,
        backgroundColor: Colors.primary,
    },
    iconNotFocused: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: 50,
        paddingVertical: 4,
        backgroundColor: Colors.white,
    },
    bottomText: {
        fontSize: 12,
    },
    tabBarDot: {
        width: 4,
        height: 4,
        borderRadius: 10,
        backgroundColor: Colors.tint,
    },
});
