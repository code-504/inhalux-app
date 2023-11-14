import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { useColorScheme, StyleSheet } from 'react-native';

import Colors from '@/constants/Colors'

// Resources
import InhalerIcon from "@/assets/icons/inhaler.svg";
import TreatmentIcon from "@/assets/icons/treatment.svg";
import MonitorIcon from "@/assets/icons/monitor.svg";
import LocationIcon from "@/assets/icons/location.svg";
import DeviceHeader from '@/components/Headers/DeviceHeader';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    ...styles.navigationStyle
                },
                tabBarShowLabel:false,
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            }}
            initialRouteName='device'
        >
            <Tabs.Screen
                name="device"
                options={{
                    header: () => <DeviceHeader />,
                    tabBarIcon: ({ color }) => <InhalerIcon name="code" fill={color}/>
                }}
            />
            <Tabs.Screen
                name="treatment"
                options={{
                    tabBarIcon: ({ color }) => <TreatmentIcon name="code" color={color} />,
                }}
            />
            <Tabs.Screen
                name="monitor"
                options={{
                    tabBarIcon: ({ color }) => <MonitorIcon name="code" color={color} />,
                }}
            />
            <Tabs.Screen
                name="location"
                options={{
                    tabBarIcon: ({ color }) => <LocationIcon name="code" color={color} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    navigationStyle: {
        height: 64,
        backgroundColor: "#fff",
        borderTopWidth: 0,
        elevation: 0
    }
})