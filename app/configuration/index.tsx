import { View, ImageBackground, StyleSheet, ScrollView } from 'react-native'
import Colors from '@/constants/Colors'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText'
import Card from '@/components/Card/Card'
import { Avatar } from 'tamagui'
import CardOptionsList from '@/components/Card/CardOptionsList'

// Resources
import BackgroundImage from "@/assets/images/background.png"
import ArrowBackIcon from "@/assets/icons/arrow_back_simple.svg"
import NotificationIcon from "@/assets/icons/notifications_active.svg"
import PasswordIcon from "@/assets/icons/encrypted.svg"
import LogoutIcon from "@/assets/icons/move_item.svg"
import ShareIcon from "@/assets/icons/share.svg"

const ConfigurationScreen = () => {
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
                          src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
                        />
                      <Avatar.Fallback backgroundColor="$blue10" />
                    </Avatar>

                    <View style={styles.profileTextView}>
                      <MontserratBoldText style={styles.profileNameText}>Jorge Ibarra Peña</MontserratBoldText>
                      <MontserratText style={styles.profileEmailText}>jorgeibarrapena9@gmail.com</MontserratText>
                    </View>
                  </View>

                  <ArrowBackIcon />
                </View>
              </Card>
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
  }
})