import { View, ImageBackground, StyleSheet, ScrollView } from 'react-native'
import Colors from '@/constants/Colors'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText'
import Card from '@/components/Card/Card'
import { Avatar, Button } from 'tamagui'
import CardOptionsList from '@/components/Card/CardOptionsList'
import * as ImagePicker from "expo-image-picker"
// Resources
import BackgroundImage from "@/assets/images/background.png"
import ArrowBackIcon from "@/assets/icons/arrow_back_simple.svg"
import NotificationIcon from "@/assets/icons/notifications_active.svg"
import PasswordIcon from "@/assets/icons/encrypted.svg"
import LogoutIcon from "@/assets/icons/move_item.svg"
import ShareIcon from "@/assets/icons/share.svg"
import { useAuth } from '@/context/Authprovider'
import { err } from 'react-native-svg/lib/typescript/xml'
import { supabase } from '@/services/supabase'
import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system';

const ConfigurationScreen = () => {
  const { supaUser, setSupaUser } = useAuth();

  const handleTakePicture = async() => {

  }

  const handleUploadPicture = async() => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true
    }

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if(!result.canceled){
      const img = result.assets[0];
      const base64 = await FileSystem.readAsStringAsync(img.uri, {encoding: 'base64'});
      const filePath = `/public/${new Date().getTime()}.png`
      const contentType = 'image/png';

      if(supaUser?.avatar != "https://ckcwfpbvhbstslprlbgr.supabase.co/storage/v1/object/public/avatars/default_avatar.png?t=2023-12-19T02%3A43%3A15.423Z"){
      
      console.log("avatar", `public/${supaUser?.avatar.substring(supaUser?.avatar.lastIndexOf('/') + 1)}`);

        const { data, error } = await supabase
        .storage
        .from('avatars')
        .remove([`public/${supaUser?.avatar.substring(supaUser?.avatar.lastIndexOf('/') + 1)}`])
      
        console.log("dataDelete ",data);
        console.log("errorDelete ",error);
      }

      const { data, error } = await supabase.storage.from("avatars").upload(filePath, decode(base64), { contentType });

        console.log("data ",data);
        console.log("error ",error);

      const url = `https://ckcwfpbvhbstslprlbgr.supabase.co/storage/v1/object/public/avatars${filePath}`;
      setSupaUser({ ...supaUser, avatar: url});
 
      const { data: userData, error: errorData } = await supabase
        .from('users')
        .update({ avatar: url })
        .eq("id", supaUser?.id)
        .select()
        
    }

  }

  return (
    <View style={styles.safeArea}>
      <ImageBackground source={BackgroundImage} style={styles.imageBackground}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>

            <View>
              <MontserratSemiText style={styles.groupTitleText}>Editar perfil de usuario</MontserratSemiText>
              <Card radius={24}>
                <View style={styles.cardProflie}>
                  <View style={styles.cardProfileView}>
                    <Avatar size="$6" circular>
                      <Avatar.Image
                          accessibilityLabel="Cam"
                          src={supaUser?.avatar}
                        />
                      <Avatar.Fallback backgroundColor="$blue10" />
                    </Avatar>

                    <View style={styles.profileTextView}>
                      <MontserratBoldText style={styles.profileNameText}>{supaUser?.name}</MontserratBoldText>
                      <MontserratText style={styles.profileEmailText}>{supaUser?.email}</MontserratText>
                    </View>
                  </View>

                  <ArrowBackIcon />
                </View>
              </Card>
            </View>

            <View style={styles.twoBlock}>
              <Button style={styles.whiteButton} alignSelf="center" size="$6" onPress={handleUploadPicture}>Subir Foto</Button>
              <Button style={styles.whiteButton} alignSelf="center" size="$6" onPress={handleTakePicture}>Tomar Foto</Button>
            </View>

            <CardOptionsList title="Opciones de compartir">
              <CardOptionsList.ItemView>
                <ShareIcon />
                <CardOptionsList.ItemText>Compartir inhalador</CardOptionsList.ItemText>
              </CardOptionsList.ItemView>
            </CardOptionsList>

            <CardOptionsList title="Configuración general">
              <CardOptionsList.ItemView>
                <NotificationIcon />
                <CardOptionsList.ItemText>Notificaciones</CardOptionsList.ItemText>
              </CardOptionsList.ItemView>

              <CardOptionsList.ItemView>
                <PasswordIcon />
                <CardOptionsList.ItemText>Configurar contraseña</CardOptionsList.ItemText>
              </CardOptionsList.ItemView>
            </CardOptionsList>

            <CardOptionsList title="Sesión">
              <CardOptionsList.ItemView>
                <LogoutIcon />
                <CardOptionsList.ItemText>Cerrar sesión</CardOptionsList.ItemText>
              </CardOptionsList.ItemView>
            </CardOptionsList>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  )
}

export default ConfigurationScreen

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
    backgroundColor: Colors.lightGrey
	},
  imageBackground: {
		flex: 1,
		resizeMode: 'cover',
	},
  scrollView: {
		width: "100%"
	},
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    marginTop: 22,
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  groupTitleText: {
    fontSize: 16,
    marginBottom: 16
  },
  cardProflie: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cardProfileView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  profileTextView: {
    display: "flex",
    flexDirection: "column",
    gap: 4
  },
  profileNameText: {
    fontSize: 16
  },
  profileEmailText: {
    fontSize: 12
  },
  whiteButton: {
		backgroundColor: Colors.white
	},
  twoBlock: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 16
	},
})