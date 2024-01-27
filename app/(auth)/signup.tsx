import React, { useState } from 'react'
import { Alert, ImageBackground, StyleSheet, View } from 'react-native'
import { supabase } from '@/services/supabase'
import { Button, Input, Label, ScrollView, Separator } from 'tamagui'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText'
import { Link, Redirect, Stack, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { z } from 'zod';

// Resources
import BackgroundImage from "@/assets/images/background.png"
import Colors from '@/constants/Colors'
import GoogleIcon from "@/assets/icons/google-icon.svg"
import FacebookIcon from "@/assets/icons/facebook-icon.svg"

export default function Signup() {
	const router = useRouter();
	const [name, setName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [formErrors, setFormErrors] = useState({
		name: "",
		lastName: "",
		email: "",
		password: ""
	})

	const formSchema = z.object({
		name: z.string().min(1, { message: "El nombre del usuario es obligatorio" }),
		lastName: z.string().min(1, { message: "El apellido del usuario es obligatorio" }),
		email: z.string().email({ message: "Formato de correo inválido" }),
		password: z.string().min(8, { message: "La contraseña debe contener mínimo 8 carácteres" })
	})

	const formData = {
		name,
		lastName,
		email,
		password
	}

	const todayDate = () => {
        let fechaActual = new Date();

        let año = fechaActual.getFullYear();
        let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Se suma 1 al mes, ya que en JavaScript los meses van de 0 a 11
        let dia = fechaActual.getDate().toString().padStart(2, '0');

        let fechaFormateada = `${año}-${mes}-${dia}`;
        return fechaFormateada;
    }

	async function signUpWithEmail() {
		const validationResults = formSchema.safeParse(formData);

		if(!validationResults.success){
			const errors = validationResults.error.format()
			setFormErrors({
				...formErrors,
				name: errors.name ? errors.name._errors.join(",") : "",
				lastName: errors.lastName ? errors.lastName._errors.join(",") : "",
				email: errors.email ? errors.email._errors.join(",") : "",
				password: errors.password ? errors.password._errors.join(",") : "",
			  });
			return;
		}else{
			setFormErrors({
				...formErrors,
				name:  "",
				lastName: "",
				email: "",
				password: "",
			  });
		}

		setLoading(true)

		let { data: users, error:errorUsers } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)

        if(users && users.length > 0){
            Alert.alert("¡Esta cuenta ya esta registrada!")
			setLoading(false)
			return;
        }

		const {data: { session }, error: errorAuth} = await supabase.auth.signUp({
			email: email,
			password: password,
		})

		const today = todayDate();
		const { data: userData, error: userError } = await supabase
		.from('users')
		.update({ 
					name: name,
					last_name: lastName,
					created_at: today
				})
		.eq('email', email)
		.select()

		if(userError){
			console.log("userError:", userError);
			return;
		}

		console.log(userData);
		
		if (!session) Alert.alert('¡Checa tu correo electrónico para confirmar tu cuenta!')
		setLoading(false)
		router.replace('/(auth)/login');
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<ImageBackground source={BackgroundImage} style={styles.imageBackground}>
				<View style={styles.topContainerView}>
					<View>
						<MontserratBoldText style={styles.topContainerTitle}>Crear una cuenta</MontserratBoldText>
						<MontserratText style={styles.topContainerInfo}>Crea una cuenta para disfrutar tu InhaLux</MontserratText>
					</View>
				</View>

				<View style={styles.bottomContainerView}>
                    <ScrollView >
                        <View style={styles.inputContainerView}>
                            <View style={styles.inputView}>
                                <Label style={styles.inputLabel} htmlFor="nameSignup"><MontserratSemiText>Nombre</MontserratSemiText></Label>
                                <Input
                                    id="nameSignup"
                                    onChangeText={(text) => setName(text)}
                                    value={name}
                                    borderRadius={32}
                                    borderWidth={0}
                                    style={styles.input}
                                />
								{formErrors.name != "" && <MontserratText style={styles.errorMessage}>{formErrors.name}</MontserratText>}
                            </View>
                            <View style={styles.inputView}>
                                <Label style={styles.inputLabel} htmlFor="lastnameSignup"><MontserratSemiText>Apellidos</MontserratSemiText></Label>
                                <Input
                                    id="lastnameSignup"
                                    onChangeText={(text) => setLastName(text)}
                                    value={lastName}
                                    borderRadius={32}
                                    borderWidth={0}
                                    style={styles.input}
                                />
								{formErrors.lastName != "" && <MontserratText style={styles.errorMessage}>{formErrors.lastName}</MontserratText>}
                            </View>
                            <View style={styles.inputView}>
                                <Label style={styles.inputLabel} htmlFor="emailSignup"><MontserratSemiText>Correo electrónico</MontserratSemiText></Label>
                                <Input
                                    id="emailSignup"
                                    onChangeText={(text) => setEmail(text)}
                                    value={email}
                                    borderRadius={32}
                                    borderWidth={0}
                                    style={styles.input}
                                />
								{formErrors.email != "" && <MontserratText style={styles.errorMessage}>{formErrors.email}</MontserratText>}
                            </View>
                            <View style={styles.inputView}>
                                <Label style={styles.inputLabel} htmlFor="passwordSignup"><MontserratSemiText>Contraseña</MontserratSemiText></Label>
                                <Input
                                    id="passwordSignup"
                                    onChangeText={(text) => setPassword(text)}
                                    value={password}
                                    secureTextEntry={true}
                                    borderRadius={32}
                                    borderWidth={0}
                                    paddingHorizontal={24}
                                    style={styles.input}
                                />
								{formErrors.password != "" && <MontserratText style={styles.errorMessage}>{formErrors.password}</MontserratText>}
                            </View>
                        </View>

                        <View style={styles.loginButtonView}>
                            <Button style={styles.loginButton} borderRadius={32} height={52}  disabled={loading} onPress={() => signUpWithEmail()}>
                                <MontserratSemiText style={styles.loginText}>Crear cuenta</MontserratSemiText>
                            </Button>
                        </View>

                        <View style={styles.createAccountView}>
                            <Link href="/(auth)/login"><MontserratText style={styles.createAccountText}>¿Ya tienes una cuenta?</MontserratText>   <MontserratSemiText style={styles.createAccountButton}>Accede</MontserratSemiText></Link>
                        </View>
                    </ScrollView>
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
		backgroundColor: Colors.inputBackground
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
		fontSize: 16,
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