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

const NotificationScreen = () => {
  return (
    <View style={styles.safeArea}>
      <ImageBackground source={BackgroundImage} style={styles.imageBackground}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>

            <CardOptionsList title="Hoy">
              <CardOptionsList.ItemView>
                <ShareIcon />
                <CardOptionsList.ItemText>Notificacaión prueba</CardOptionsList.ItemText>
              </CardOptionsList.ItemView>

              <CardOptionsList.ItemView>
                <ShareIcon />
                <CardOptionsList.ItemText>Notificacaión prueba</CardOptionsList.ItemText>
              </CardOptionsList.ItemView>
              <CardOptionsList.ItemView>
                <ShareIcon />
                <CardOptionsList.ItemText>Notificacaión prueba</CardOptionsList.ItemText>
              </CardOptionsList.ItemView>
            </CardOptionsList>

            <CardOptionsList title="Ayer">
              <CardOptionsList.ItemView>
                <ShareIcon />
                <CardOptionsList.ItemText>Notificacaión prueba</CardOptionsList.ItemText>
              </CardOptionsList.ItemView>

              <CardOptionsList.ItemView>
                <ShareIcon />
                <CardOptionsList.ItemText>Notificacaión prueba</CardOptionsList.ItemText>
              </CardOptionsList.ItemView>
              <CardOptionsList.ItemView>
                <ShareIcon />
                <CardOptionsList.ItemText>Notificacaión prueba</CardOptionsList.ItemText>
              </CardOptionsList.ItemView>
            </CardOptionsList>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  )
}

export default NotificationScreen

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