import React, { useState } from 'react'
import { Alert, ImageBackground, StyleSheet, View } from 'react-native'
import { supabase } from '@/services/supabase'
import { Button, Input, Label, Separator } from 'tamagui'
import { Link, Stack, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { z } from 'zod';

// Resources
import BackgroundImage from "@/assets/images/background.png"
import Colors from '@/constants/Colors'
import { MontserratBoldText, MontserratText, MontserratSemiText } from '@/components/StyledText'

export default function Login() {
	const [email, setEmail] = useState('')
	const [loading, setLoading] = useState(false)
	const [formErrors, setFormErrors] = useState({
		email: ""
	})

	const formSchema = z.object({
		email: z.string().email({ message: "Formato de correo inválido" })
	})

	const formData = {
		email
	}

	async function sendConfirmationEmail() {
		const validationResults = formSchema.safeParse(formData);

		if(!validationResults.success){
			const errors = validationResults.error.format()
			setFormErrors({
				...formErrors,
				email: errors.email ? errors.email._errors.join(",") : ""
			  });
			return;
		}else{
			setFormErrors({
				...formErrors,
				email: ""
			  });
		}
		
		setLoading(true);
		const { data, error } = await supabase.auth.resetPasswordForEmail(email)

		//console.log(data);
		//console.log(error);

		if(!error) Alert.alert("Checa tu correo para confirmar tus permisos");

		setLoading(false);
		router.push("/(auth)/login");
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<ImageBackground source={BackgroundImage} style={styles.imageBackground}>
				<View style={styles.topContainerView}>
					<View>
						<MontserratBoldText style={styles.topContainerTitle}>Recuperar Contraseña</MontserratBoldText>
						<MontserratText style={styles.topContainerInfo}>Indicanos tu dirección de correo electrónico para ayudarte a recuperarla</MontserratText>
					</View>
				</View>

				<View style={styles.bottomContainerView}>
					<View style={styles.inputContainerView}>
						<View style={styles.inputView}>
							<Label style={styles.inputLabel} htmlFor="email"><MontserratSemiText>Correo electrónico</MontserratSemiText></Label>
							<Input
								id="email_recovery"
								onChangeText={(text) => setEmail(text)}
								value={email}
								borderRadius={32}
								borderWidth={0}
								style={styles.input}
							/>
							{formErrors.email != "" && <MontserratText style={styles.errorMessage}>{formErrors.email}</MontserratText>}

						</View>
					</View>

					<View style={styles.loginButtonView}>
						<Button style={styles.loginButton} borderRadius={32} height={52}  disabled={loading} onPress={() => sendConfirmationEmail()}>
							<MontserratSemiText style={styles.loginText}>Enviar</MontserratSemiText>
						</Button>
					</View>

					<Separator marginVertical={48} />

					<View style={styles.createAccountView}>
						<Link href="/(auth)/login"><MontserratText style={styles.createAccountText}>Volver al Inicio</MontserratText></Link>
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
        marginTop: 15,
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
		backgroundColor: Colors.inputBackground,
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
		paddingVertical: 32,
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
	errorMessage: {
		fontSize: 10,
		textAlign: "center",
		marginBottom: 0,
		paddingBottom: 0
	}
})