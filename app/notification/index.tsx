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
import { useNotifications } from '@/context/NotificationsProvider'
import { getTitleByDate, groupByDate } from '@/helpers/notifications'

const NotificationScreen = () => {
  const { supaNotifications } = useNotifications();
  const groupedNotifications = groupByDate(supaNotifications);
  console.log("grouped", groupedNotifications);

  return (
    
      <View style={styles.safeArea}>
        {
          supaNotifications.length !== 0 
          ?
            <ImageBackground source={BackgroundImage} style={styles.imageBackground}>
            <ScrollView style={styles.scrollView}>
              <View style={styles.content}>
                
              {Object.entries(groupedNotifications).map(([date, notifications]) => (
                <CardOptionsList key={date} title={getTitleByDate(date)}>
                  {notifications.map((notification: any) => (
                    <CardOptionsList.ItemView key={notification.id}>
                      {/* Agrega tus iconos según la lógica de tu aplicación */}
                      <ShareIcon />
                      <CardOptionsList.ItemText>{notification.title}</CardOptionsList.ItemText>
                    </CardOptionsList.ItemView>
                  ))}
                </CardOptionsList>
              ))}

              </View>
            </ScrollView>
          </ImageBackground>
        :
          <View style={styles.noNotificationsView}>
            <MontserratText style={styles.noNotificationsText}>No tienes Notificaciones!</MontserratText>
          </View>
        }
        
      </View>
      
  )
}

export default NotificationScreen

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
    marginTop: 124,
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
  noNotificationsView: {
    minWidth: "100%",
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  noNotificationsText: {
    fontSize: 24,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginTop: -40,
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
  }
})