import TabBar from '@/components/TabBar';
import Colors from '@/constants/Colors'
import { View, StyleSheet, ImageBackground } from 'react-native';

// Resources
import BackgroundImage from "@/assets/images/background.png"
import PersonIcon from "@/assets/icons/person.svg"
import ShreIcon from "@/assets/icons/share.svg"
import { MontserratText } from '@/components/StyledText';
import PacientsTab from '@/tabs/monitor/pacients';
import SharesTab from '@/tabs/monitor/shares';

export default function Monitor() {

	/*const pacients:PacientsInfo[] = [
		{ 
			name: "Jorge Palacios Dávila",
			avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
			kindred: "Primo"
		},
		{ 
			name: "Susana Hernández Cortés",
			avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
			kindred: "Mamá"
		}
	]*/

	const pacients:PacientsInfo[] = []

	const tabs = [
		{
			name: 'Pacientes',
			Icon: PersonIcon,
			Component: <PacientsTab list={pacients} />
		},
		{
			name: 'Compartidos',
			Icon: ShreIcon,
			Component: <SharesTab list={pacients} />
		}
	]

  return (
    <View style={styles.viewArea}>
		<ImageBackground source={BackgroundImage} style={styles.imageBackground}>
			<View style={styles.container}>
				<TabBar tabs={tabs} />
			</View>
		</ImageBackground>
	</View>
  )
}

const styles = StyleSheet.create({
	viewArea: {
		flex: 1,
        backgroundColor: Colors.lightGrey
	},
	container: {
		paddingHorizontal: 24
	},
	imageBackground: {
		flex: 1,
		resizeMode: 'cover'
	},
})