import { View, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Camera, Code, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import Colors from '@/constants/Colors';
import { MontserratBoldText, MontserratSemiText } from '@/components/StyledText';

import BackgroundImage from "@/assets/images/background.png"
import { Spinner } from 'tamagui';

const ScanPacientPage = () => {

    const device = useCameraDevice("back")
    const [isActive, setIsActive] = useState<boolean>(false);

    const checkPermission = async () => {
        const newCameraPermission = await Camera.requestCameraPermission();

        if (newCameraPermission == null) {
            console.log("no tiene permiso")
        }
    }

	useEffect (() => {
        checkPermission()

        const timer = setInterval(() => {
            setIsActive(true)
        }, 600)

        return () => {
            clearInterval(timer)
        }
	}, []);

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes: Code[]) => {
          console.log(`Scanned ${codes[0].value} codes!`)
        }
    })
    
    if (device == null) return <Spinner />
    

        return (
            <View style={styles.safeArea}>
			    <ImageBackground source={BackgroundImage} style={styles.imageBackground} />
					<View style={{ flex: 1 }}>
						<View style={styles.upView}>
							<MontserratBoldText style={styles.title}>{`Escanear \ncódigo QR`}</MontserratBoldText>
							<MontserratSemiText style={styles.description}>Escanea el código qr de tu paciente para poder vincularte a su cuenta</MontserratSemiText>
						</View>

						<View style={styles.downView}>
							<MontserratSemiText style={styles.subTitle}>Escanear dispositivo</MontserratSemiText>
							
                            <View style={{ position: "relative",width: "100%", height: "80%", borderRadius: 38, overflow: "hidden", marginBottom: 32 }}>
            
                                <Camera  
                                    style={StyleSheet.absoluteFill}
                                    device={device}
                                    isActive={isActive}
                                    codeScanner={codeScanner} 
                                />
                            </View>
						</View>
					</View>
		</View>
        )
}

export default ScanPacientPage


const styles = StyleSheet.create({
    safeArea: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
        backgroundColor: Colors.lightGrey
	},
    imageBackground: {
		position: "absolute",
		resizeMode: 'cover',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
	},
    content: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    upView: {
        flex: 0.3,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        paddingTop: 48,
        paddingBottom: 24,
        paddingHorizontal: 24
    },
    downView: {
        flex: 0.7,
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
        backgroundColor: Colors.white,
        borderTopLeftRadius: 38,
        borderTopRightRadius: 38,
        paddingTop: 42,
		paddingBottom: 12,
		paddingHorizontal: 24
    },
    title: {
        fontSize: 32,
        lineHeight: 42
    },
	subTitle: {
        fontSize: 12,
        color: Colors.darkGray
    },
    description: {
        fontSize: 14,
        color: Colors.darkGray,
        lineHeight: 20
    },
	loginText: {
		fontSize: 16,
	},
})