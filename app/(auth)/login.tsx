import React, { useState } from 'react'
import { Alert, ImageBackground, StyleSheet, View } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Button, Input, Label, Separator } from 'tamagui'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText'
import { Link, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

// Resources
import BackgroundImage from "@/assets/images/background.png"
import Colors from '@/constants/Colors'
import GoogleIcon from "@/assets/icons/google-icon.svg"
import FacebookIcon from "@/assets/icons/facebook-icon.svg"

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)

	async function signInWithEmail() {
		setLoading(true)
		const { error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		})

		if (error) Alert.alert(error.message)
			setLoading(false)
	}

	async function signUpWithEmail() {
		setLoading(true)
		const {
			data: { session },
			error,
		} = await supabase.auth.signUp({
			email: email,
			password: password,
		})

		if (error) Alert.alert(error.message)
		if (!session) Alert.alert('Please check your inbox for email verification!')
			setLoading(false)
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<ImageBackground source={BackgroundImage} style={styles.imageBackground}>
				<View style={styles.topContainerView}>
					<View>
						<MontserratBoldText style={styles.topContainerTitle}>Iniciar sesión</MontserratBoldText>
						<MontserratText style={styles.topContainerInfo}>Inicia sesión para usar tu inhaLux</MontserratText>
					</View>
				</View>

				<View style={styles.bottomContainerView}>
					<View style={styles.inputContainerView}>
						<View style={styles.inputView}>
							<Label style={styles.inputLabel} htmlFor="email"><MontserratSemiText>Correo electrónico</MontserratSemiText></Label>
							<Input
								id="email"
								onChangeText={(text) => setEmail(text)}
								value={email}
								borderRadius={32}
								borderWidth={0}
								paddingHorizontal={24}
								style={styles.input}
							/>
						</View>
						<View style={styles.inputView}>
							<Label style={styles.inputLabel} htmlFor="email"><MontserratSemiText>Contraseña</MontserratSemiText></Label>
							<Input
								onChangeText={(text) => setPassword(text)}
								value={password}
								secureTextEntry={true}
								borderRadius={32}
								borderWidth={0}
								paddingHorizontal={24}
								style={styles.input}
							/>
						</View>
					</View>

					<View style={styles.loginButtonView}>
						<Button style={styles.loginButton} borderRadius={32} height={52}  disabled={loading} onPress={() => signInWithEmail()}>
							<MontserratSemiText style={styles.loginText}>Iniciar sesión</MontserratSemiText>
						</Button>
					</View>

					<Separator marginVertical={48} />
	
					<View style={styles.buttonThirdView}>
						<Button style={styles.loginThirdButton} borderRadius={32} height={52}  disabled={loading} onPress={() => signInWithEmail()}>
							<GoogleIcon style={styles.buttonIcon} />
							<MontserratSemiText>Iniciar sesión con Google</MontserratSemiText>
						</Button>

						<Button style={styles.loginThirdButton} borderRadius={32} height={52}  disabled={loading} onPress={() => signInWithEmail()}>
							<FacebookIcon style={styles.buttonIcon} />
							<MontserratSemiText>Iniciar sesión con Facebook</MontserratSemiText>
						</Button>
					</View>

					<View style={styles.createAccountView}>
						<Link href="/signup"><MontserratText style={styles.createAccountText}>¿No tienes una cuenta?</MontserratText>   <MontserratSemiText style={styles.createAccountButton}>Crea una</MontserratSemiText></Link>
					</View>
				</View>
			</ImageBackground>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
	},
	imageBackground: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
		alignItems: 'center'
	},
	userLoginView: {
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightGrey
	},
	topContainerView: {
		flex: 0.2,
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},
	topContainerTitle: {
		textAlign: "center",
		marginBottom: 4,
		fontSize: 28
	},
	topContainerInfo: {
		textAlign: "center",
		fontSize: 16
	},
	inputContainerView: {
		display: "flex",
		flexDirection: "column",
		gap: 24
	},
	inputView: {
		display: "flex",
		flexDirection: "column",
		gap: 4
	},
	inputLabel: {
		marginLeft: 6,
		fontSize: 14
	},
	input: {
		height: 60,
	},
	loginButtonView: {
		marginTop: 32,
	},
	loginButton: {
		height: 60,
		backgroundColor: Colors.primary,
	},
	loginText: {
		fontSize: 16,
		color: Colors.buttonTextPrimary
	},
	buttonThirdView: {
		display: "flex",
		flexDirection: "column",
		gap: 16
	},
	loginThirdButton: {
		backgroundColor: Colors.buttonGray,
		height: 60
	},
	buttonIcon: {
		marginRight: 16
	},
	createAccountView: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-end",
		alignItems: "center",
		paddingVertical: 32
	},
	createAccountText: {
		fontSize: 16
	},
	createAccountButton: {
		fontSize: 16,
		color: Colors.buttonTextPrimary
	},
	bottomContainerView: {
		flex: 0.8,
		width: "100%",
		borderTopLeftRadius: 38,
		borderTopRightRadius: 38,
		paddingHorizontal: 24,
		paddingTop: 42,
		backgroundColor: Colors.white
	},
})