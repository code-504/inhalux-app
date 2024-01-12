import { View, ScrollView, Animated, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router';
import NormalHeader from '@/components/Headers/NormalHeader';
import { Divider, Menu } from 'react-native-paper';
import Ripple from 'react-native-material-ripple';
import Colors from '@/constants/Colors';

import MoreIcon from "@/assets/icons/more_vert.svg"

const PacientViewPage = () => {

    const { pacient_id } = useLocalSearchParams();

    const [visible, setVisible] = useState(false);
    
    let scrollOffsetY = useRef(new Animated.Value(0)).current;
    
    const openMenu = () => setVisible(true);

	const closeMenu = () => setVisible(false);
    
    return (
        <View style={styles.safeAre}>

            <Stack.Screen options={{
                header: () => 
                    <NormalHeader title={ "Nombre Paciente" } animHeaderValue={scrollOffsetY}>
                            
                        <Menu
                            visible={visible}
                            onDismiss={closeMenu}
                            contentStyle={{ backgroundColor: Colors.white, borderRadius: 18 }}
                            anchor={
                                <Ripple style={{ overflow: "hidden", height: 64, width: 64, backgroundColor: Colors.white, borderRadius: 60, display: "flex", justifyContent: "center", alignItems: "center" }}  onPress={openMenu}>
                                    <MoreIcon />
                                </Ripple>
                            }>
                            <Menu.Item leadingIcon="pencil" title="Editar" />
                            <Divider />
                            <Menu.Item leadingIcon="delete" title="Eliminar" />
                        </Menu>
                    </NormalHeader>
            }} />
            
            <ScrollView style={styles.scrollView}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollOffsetY}}}],
                    {useNativeDriver: false}
                )}
                showsVerticalScrollIndicator={false}
            >
            </ScrollView>
        </View>
    )
}

export default PacientViewPage


const styles = StyleSheet.create({
    safeAre: {
        flex: 1,
		width: "100%",
        backgroundColor: Colors.white,
    },
	imageBackground: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
    	alignItems: 'center'
	},
	scrollView: {
		width: "100%"
	},
	content: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		paddingHorizontal: 24,
	},
	inahlerImageBackground: {
		position: "absolute",
		top: 0,
		left: "50%",
		transform: [
			{ translateX: -(300 / 2) },
			{ translateY: -(40) }
		],
		width: 300,
		height: 380,
    	//aspectRatio: 5 / 9,
		zIndex: -1
	},
	inhalerTop: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-end",
		alignItems: "center",
		height: 400,
	},
	inhalerView: {
		position: "relative",
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "flex-end",
		height: 300
	},
	inahlerImage: {
		height: '90%',
    	aspectRatio: 16 / 26,
		zIndex: 2,
	},
	inahlerShadowImage: {
		position: "absolute",
		top: 45,
		left: -25,
		height: '90%',
    	aspectRatio: 16 / 26,
		zIndex: 1,
	},
	inhalerInfoView: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: 4,
		width: "100%",
	},
	inhalerTitle: {
		fontSize: 24
	},
	inhalerTime: {
		fontSize: 14
	},
	buttonView: {
		display: "flex",
		flexDirection: "column",
		gap: 16
	},
	inhalerButtonsView: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 16,
		gap: 16
	},
	inhalerButton: {
		flex: 1,
		backgroundColor: Colors.secondary
	},
	inhalerButtonPrimary: {
		flex: 1,
		backgroundColor: Colors.primary,
		width: "100%",
		height: 56
	},
	stadisticContent: {
		borderRadius: 38,
		marginTop: 32,
		backgroundColor: Colors.white,
		paddingHorizontal: 24,
	},
	stadisticView: {
		marginTop: 32,
	},
	sectionTitle: {
		fontSize: 16
	},
	inahlerStatus: {
		display: "flex",
		flexDirection: "row",
	},
	inahlerStatusInfo: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		marginRight: 8
	},
	inahlerStatusIcon: {
		marginRight: 4
	},
})