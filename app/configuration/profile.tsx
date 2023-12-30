import { View, Text, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, Dimensions, Image } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Colors from '@/constants/Colors'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText'
import { AlertDialog, Avatar, Button, Input, Label, ScrollView, XStack, YStack } from 'tamagui'
import { useAuth } from '@/context/Authprovider'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { BottomSheetBackdropProps, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import BlurredBackgroundNew from '@/components/blurredBackground/BlurredBackgroundNew'
import { Stack } from 'expo-router'

// Resources
import BackgroundImage from "@/assets/images/background.png"
import PictureIcon from "@/assets/icons/add_a_photo.svg"
import CameraIcon from "@/assets/icons/camera.svg"
import GaleryIcon from "@/assets/icons/imagesmode.svg"
import DeleteIcon from "@/assets/icons/delete_forever.svg"
import { handleErasePicture, handleTakePicture, handleUploadPicture } from '@/helpers/avatar'

const ProfilePage = () => {
  const { supaUser, setSupaUser } = useAuth();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [photoState, setPhotoState] = useState<boolean>(false);

  const width = useSharedValue(200); // Initial size of the image
  const photoModalRef  = useRef<BottomSheetModal>(null);
  
  const photoListSnapPoints = useMemo(
    () => [
      "22%",
    ],
    []
  );

  useEffect(() => {
    const keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    const keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    return () => {
      keyboardWillShowSub.remove();
      keyboardWillHideSub.remove();
    };
  }, []);

  const keyboardDidShow = () => {
    width.value = withTiming(100, {
      duration: 230,
      easing: Easing.inOut(Easing.quad),
    })
  };

  const keyboardDidHide = () => {
    width.value = withTiming(200, {
      duration: 230,
      easing: Easing.inOut(Easing.quad),
    })
  };

  const openModal = () => {
    Keyboard.dismiss()
    photoModalRef.current?.present()
  }

  const openPhoto = async () => {
    photoModalRef.current?.close();
    setPhotoState(true);

  }

  const handleBottomChange = async (index: number) => {
    if (index === -1 && photoState) {
      setPhotoState(false);
      await handleTakePicture(supaUser, setSupaUser);
    }
  }

  const openGalery = async () => {
    photoModalRef.current?.close();

    await handleUploadPicture(supaUser, setSupaUser);
  }

  const openDeleteDialog = () => {
    photoModalRef.current?.close();
    setOpenDialog(true)
  }

  const deletePhoto = async () => {
    setOpenDialog(false)

    await handleErasePicture(supaUser, setSupaUser);
  }

  /*const { subscribe, dispatch } = useTamagui();

  const keyboardDidShow = () => {
    imageSize.value = withTiming(30); // Adjust the size as needed
  };

  const keyboardDidHide = () => {
    imageSize.value = withTiming(50); // Adjust the size as needed
  };

  // Subscribe to keyboard events
  useEffect(() => {
    const showSub = subscribe('keyboardDidShow', keyboardDidShow);
    const hideSub = subscribe('keyboardDidHide', keyboardDidHide);

    return () => {
      showSub();
      hideSub();
    };
  }, []);*/
  
  return (
    <View style={styles.safeArea}>
      <ScrollView style={styles.content} contentContainerStyle={ { minHeight: "100%" } }>
      <ImageBackground source={BackgroundImage} style={styles.imageBackground} />

        <View style={{ minHeight: Dimensions.get('window').height - 73}}>
          <View style={styles.upView}>

            <View style={styles.avatarContent }>
              <View style={styles.avatarView}>
                <Image source={{ uri: supaUser?.avatar }} style={{
                  width: 220,
                  height: 220,
                  borderRadius: 1000
                }} />

                <Button circular size="$6" style={styles.pictureButton} onPress={openModal}>
                  <PictureIcon />
                </Button>
              </View>
              
              <MontserratText style={{ color: Colors.darkGray }} >Cambiar foto de perfil</MontserratText>
            </View>
          </View>
              
          <View style={styles.downView}>
            <View style={styles.inputContainerView}>
              <View style={styles.inputView}>
                <Label style={styles.inputLabel} htmlFor="email"><MontserratSemiText>Nombre</MontserratSemiText></Label>
                <Input
                  id="email"
                  borderRadius={32}
                  borderWidth={0}
                  value={supaUser?.name}
                  style={styles.input}
                />
              </View>
              <View style={styles.inputView}>
                <Label style={styles.inputLabel} htmlFor="password"><MontserratSemiText>Apellidos</MontserratSemiText></Label>
                <Input
                  id="password"
                  secureTextEntry={true}
                  borderRadius={32}
                  borderWidth={0}
                  paddingHorizontal={24}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.loginButtonView}>
              <Button style={styles.loginButton} borderRadius={32} height={52}>
                <MontserratSemiText style={styles.loginText}>Guardar cambios</MontserratSemiText>
              </Button>
            </View>
          </View>
          </View>
      </ScrollView>

      <BottomSheetModal
        ref={photoModalRef}
        key="PhotoListSheet"
        name="PhotoListSheet"
        index={0}
        snapPoints={photoListSnapPoints}
        enableOverDrag={false}
        onChange={handleBottomChange}
        backdropComponent={(backdropProps: BottomSheetBackdropProps) => (
          <BlurredBackgroundNew
            {...backdropProps}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            pressBehavior={"close"}
          />
        )}
      >
        <View style={stylesBottom.container}>
          <View style={stylesBottom.titleContent}>
            <MontserratBoldText style={stylesBottom.title}>Foto de perfil</MontserratBoldText>

            <Button circular backgroundColor="white" onPress={() => openDeleteDialog()}>
              <DeleteIcon />
            </Button>
          </View>

          <View style={stylesBottom.buttonsView}>
            <View style={stylesBottom.buttonContent}>
              <Button circular size="$6" onPress={() => openPhoto()}>
                <CameraIcon />
              </Button>

              <MontserratText>Cámara</MontserratText>
            </View>

            <View style={stylesBottom.buttonContent}>
              <Button circular size="$6" onPress={openGalery}>
                <GaleryIcon />
              </Button>

              <MontserratText>Galería</MontserratText>
            </View>
          </View>
        </View>
      </BottomSheetModal>

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
            <AlertDialog.Title style={stylesDialog.titleDialog}>Eliminar foto de perfil</AlertDialog.Title>
            <AlertDialog.Description>
              ¿Estás seguro de eliminar tu foto de perfil?
            </AlertDialog.Description>
            </View>

            <View style={stylesDialog.buttonsView}>
              <AlertDialog.Cancel asChild>
                <Button onPress={() => setOpenDialog(false)} backgroundColor={ Colors.white }>Cancelar</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button onPress={deletePhoto} backgroundColor={Colors.redLight} color={Colors.red}>Eliminar</Button>
              </AlertDialog.Action>
            </View>
          </View>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
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

const stylesBottom = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    paddingHorizontal: 24
  },
  titleContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    marginTop: 4,
    fontSize: 18
  },
  buttonsView: {
    display: "flex",
    flexDirection: "row",
    gap: 52
  },
  buttonContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8
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
    height: "100%",
  },
  upView: {
    flex: 0.8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    height: "100%",
  },
  downView: {
    flex: 0.2,
    height: "100%",
    backgroundColor: Colors.white,
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    paddingHorizontal: 24,
		paddingTop: 42
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
})
