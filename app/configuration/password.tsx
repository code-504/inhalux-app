import { View, Text, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, Dimensions, Alert, Animated } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Colors from '@/constants/Colors'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText'
import { AlertDialog, Avatar, Button, Input, Label, ScrollView, XStack, YStack } from 'tamagui'
import { useAuth } from '@/context/Authprovider'
import { supabase } from '@/services/supabase'
import { z } from 'zod'

// Resources
import BackgroundImage from "@/assets/images/background.png"
import NormalHeader from '@/components/Headers/NormalHeader'
import { Stack } from 'expo-router'

const ProfilePage = () => {

	let scrollOffsetY = useRef(new Animated.Value(0)).current;
	
	const { supaUser, setSupaUser } = useAuth();
	const [newPassword, setNewPassword] = useState<string>("");
	const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>("");
	const [mailConfirmCode, setMailConfirmCode] = useState<string>("");
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [formErrors, setFormErrors] = useState({
		newPassword: "",
		newPasswordConfirm: "",
	})

	const [dialogErrors, setDialogErrors] = useState({
		confirmCode: ""
	})

	const formSchema = z.object({
		newPassword: z.string().min(8, { message: "La contraseña debe contener mínimo 8 carácteres" }),
		newPasswordConfirm: z.string().min(8, { message: "La contraseña debe contener mínimo 8 carácteres" }),
	})

	const formSchemaDialog = z.object({
		confirmCode: z.string().min(6, { message: "El código debe ser de 6 caracteres" })
	})

	const formData = {
        newPassword,
        newPasswordConfirm
    }

    async function handleNewPassword() {
		const validationResults = formSchema.safeParse(formData);

		if (!validationResults.success) {
			const errors = validationResults.error.format();

			setFormErrors({
				newPassword: errors.newPassword ? errors.newPassword._errors.join(",") : "",
                newPasswordConfirm: errors.newPassword ? errors.newPassword._errors.join(",") : "",
			});

			return;
		} else {
			setFormErrors({
				newPassword: "",
                newPasswordConfirm: "",
			});
		}

        if (newPassword != newPasswordConfirm) {
            Alert.alert("Las contraseñas NO coinciden");
            return;
        }

        const { data: a, error: b } = await supabase.auth.reauthenticate();

        if (b == null) {
            setOpenDialog(true);
        } else {
            Alert.alert(b.message);
        }
	}

    const handleFinalStep = async(code: any) => {
        /*const formDataDialog = {
            code
        }

        const validationResults = formSchemaDialog.safeParse(formDataDialog);

		if(!validationResults.success){
			const errors = validationResults.error.format()
			setDialogErrors({
                confirmCode: errors.confirmCode ? errors.confirmCode._errors.join(",") : ""
			  });
			return;
		}else{
			setDialogErrors({
                confirmCode: ""
			});
		}*/

        const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
            nonce: code
        })

        if (error == null) {
            Alert.alert("Contraseña Actualizada Correctamente");
        } else {
            Alert.alert(error.message);
        }

        setOpenDialog(false);
    }

  	return (
		<View style={styles.safeArea}>
			<Stack.Screen options={{ header: () => <NormalHeader title="Configurar contraseña" animHeaderValue={scrollOffsetY} /> }} />
			<ImageBackground source={BackgroundImage} style={styles.imageBackground} />

			<ScrollView 
				style={styles.content}         
				scrollEventThrottle={16}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollOffsetY}}}],
					{useNativeDriver: false}
				)}
				contentContainerStyle={{ flex: 1 }}
			>
				<View style={styles.upView}>
						<MontserratSemiText style={styles.title}>Configurar contraseña</MontserratSemiText>
					</View>

					<View style={styles.downView}>
						<View style={styles.inputContainerView}>
							<View style={styles.inputView}>
								<Label style={styles.inputLabel} htmlFor="new_password"><MontserratSemiText>Nueva Contraseña</MontserratSemiText></Label>
								<Input
								id="new_password"
								borderRadius={32}
								borderWidth={0}
								secureTextEntry={true}
								onChange={(e) => setNewPassword(e.nativeEvent.text)}
								value={newPassword}
								placeholder='Tu nueva contraseña'
								style={styles.input}
								/>
								{formErrors.newPassword != "" && <MontserratText style={styles.errorMessage}>{formErrors.newPassword}</MontserratText>}
							</View>

							<View style={styles.inputView}>
								<Label style={styles.inputLabel} htmlFor="new_password_confirm"><MontserratSemiText>Confirmación de Contraseña</MontserratSemiText></Label>
								<Input
								id="new_password_confirm"
								borderRadius={32}
								borderWidth={0}
								secureTextEntry={true}
								onChange={(e) => setNewPasswordConfirm(e.nativeEvent.text)}
								value={newPasswordConfirm}
								placeholder='Vuelve a colocar tu Nueva Contraseña'
								style={styles.input}
								/>
								{formErrors.newPasswordConfirm != "" && <MontserratText style={styles.errorMessage}>{formErrors.newPasswordConfirm}</MontserratText>}
							</View>
						</View>

						<View style={styles.loginButtonView}>
							<Button onPress={handleNewPassword} style={styles.loginButton} borderRadius={32} height={52}>
								<MontserratSemiText style={styles.loginText}>Guardar cambios</MontserratSemiText>
							</Button>
						</View>
					</View>

				<AlertDialog open={openDialog}>

					<AlertDialog.Portal>
						<AlertDialog.Overlay
							key="overlay"
							animation="quick"
							opacity={0.5}
							enterStyle={{ opacity: 0 }}
							exitStyle={{ opacity: 0 }}
						/>
						<AlertDialog.Content
							bordered
							elevate
							key="content"
							animation={[
								'quick',
								{
								opacity: {
									overshootClamping: true,
								},
								},
							]}
							enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
							exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
							x={0}
							scale={1}
							opacity={1}
							y={0}
							borderRadius={38}
							padding={24}
							backgroundColor={Colors.white}
						>

						<View style={stylesDialog.content}>

							<View>
								<AlertDialog.Title style={stylesDialog.titleDialog}>Código de Confirmación</AlertDialog.Title>
								<AlertDialog.Description>
									Se te ha envíado un código de autenticación a tu correo
								</AlertDialog.Description>
								<Input
									id="test"
									borderRadius={32}
									borderWidth={0}
									secureTextEntry={true}
									onChange={(e) => setMailConfirmCode(e.nativeEvent.text)}
									value={mailConfirmCode}
									placeholder='Colocalo aquí'
									style={styles.dialogInput}
								/>
								{dialogErrors.confirmCode != "" && <MontserratText style={styles.errorMessage}>{dialogErrors.confirmCode}</MontserratText>}
							</View>

							<View style={stylesDialog.buttonsView}>
								<AlertDialog.Action asChild>
									<Button onPress={() => handleFinalStep(mailConfirmCode)} backgroundColor={Colors.primary} color={Colors.white}>Confirmar</Button>
								</AlertDialog.Action>
							</View>
						</View>
						</AlertDialog.Content>
					</AlertDialog.Portal>
				</AlertDialog>
			</ScrollView>
		</View>
  	)
}

export default ProfilePage

const stylesDialog = StyleSheet.create({
    content: {
      display: "flex",
      flexDirection: "column",
      gap: 24
    },
    titleDialog: {
      fontSize: 20,
    },
    buttonsView: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 16
    }
})

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
        flex: 0.35,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        gap: 12,
        paddingVertical: 48,
        paddingHorizontal: 24,
    },
    downView: {
        flex: 0.65,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 38,
        borderTopRightRadius: 38,
        paddingVertical: 42,
        paddingHorizontal: 24
    },
	title: {
        fontSize: 32,
        lineHeight: 42
    },
  avatarContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  avatarView: {
    position: "relative"
  },
  avatar: {
    borderWidth: 4, 
    borderColor: Colors.white,
  },
  pictureButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white
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
    dialogInput: {
		height: 60,
		backgroundColor: Colors.inputBackground,
        marginTop: 15
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
	errorMessage: {
		fontSize: 10,
		textAlign: "center",
		marginBottom: 0,
		paddingBottom: 0
	}
})
