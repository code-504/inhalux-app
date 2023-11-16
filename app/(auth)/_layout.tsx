import { Stack } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import Colors from '@/constants/Colors';
// Resources

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
export default function AuthLayout() {

    NavigationBar.setBackgroundColorAsync(Colors.white);
    NavigationBar.setButtonStyleAsync("dark");

    return (
        <Stack>
            <Stack.Screen name="login" options={{
                headerShown: false
            }} />
        </Stack>
    );
}