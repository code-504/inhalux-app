import { View, StyleSheet } from 'react-native'
import Colors from '@/constants/Colors'
import { Button, Input } from 'tamagui'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { inhalerProps } from '@/context/InhalerProvider'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { useInhalers } from '@/context/InhalerProvider'
import { supabase } from '@/services/supabase'
import NormalHeader from '@/components/Headers/NormalHeader'
import * as NavigationBar from 'expo-navigation-bar';

// Resources
import SaveIcon from "@/assets/icons/save.svg"
import { SafeAreaView } from 'react-native-safe-area-context'
import { useInhalerStore } from '@/stores/inhaler'
import { useInhalersData } from '@/api/inhaler'

NavigationBar.setBackgroundColorAsync("transparent")
NavigationBar.setButtonStyleAsync("dark")
NavigationBar.setPositionAsync("absolute");

const EditDeviceNamePage = () => {
	const { name } = useLocalSearchParams();
	//const {supaInhalers, setSupaInhalers} = useInhalers();
	const { supaInhalers, setSupaInhalers, setSupaInhalersMapByName } = useInhalerStore();
	const { data: idata } = useInhalersData();

    useEffect(() => {
        //console.log("inhalersData: ", idata);
        
        setSupaInhalers(idata);
    }, [idata])

	const [inhalerName, setInhalerName] = useState<string>("");

	useEffect(() => {
		const foundInhaler = supaInhalers?.find(inhaler => inhaler.id === name);
		setInhalerName(foundInhaler.title);
	}, [idata])

	const handleUpdateInhaler = async() => {
		const { data, error } = await supabase
			.from('inhalers')
			.update({ name: inhalerName })
			.eq('id', name)
			.select()

		setSupaInhalersMapByName(supaInhalers, String(name), inhalerName);

		console.log("supaInhalers ANTES", supaInhalers);
		console.log("supaInhalers DESPUES", supaInhalers);
		
		if (router.canGoBack())
			router.back()
	}

  	return (
		<SafeAreaView style={styles.safeAre}>
			<Stack.Screen options={{
				header: () => 
					<NormalHeader title="Editar nombre">
						
						<Button alignSelf="center" size="$6" circular onPress={handleUpdateInhaler} backgroundColor={Colors.white}>
                            <SaveIcon />
                        </Button>
					</NormalHeader>
			}} />

			<Input style={styles.searchInput} id="inhaler-name" borderRadius="$10" borderWidth={0} placeholder="Nombre del dispositivo" value={inhalerName} onChange={(e) => setInhalerName(e.nativeEvent.text)} />

			<StatusBar style='auto' translucent={true} backgroundColor='transparent' />
		</SafeAreaView>
  	)
}

export default EditDeviceNamePage

const styles = StyleSheet.create({
    safeAre: {
        flex: 1,
		width: "100%",
		paddingTop: 104,
		paddingHorizontal: 24,
        backgroundColor: Colors.white,
    },
	searchInput: {
        marginTop: 12,
        marginBottom: 24,
        height: 64,
        paddingLeft: 24,
        paddingRight: 60,
        backgroundColor: Colors.lightGrey,
    },
})