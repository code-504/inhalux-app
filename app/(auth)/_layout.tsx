import { Stack } from 'expo-router';

// Resources

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen name="login" options={{
                headerShown: false
            }} />
        </Stack>
    );
}