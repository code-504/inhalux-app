import { View, Text, StyleSheet } from 'react-native'
import inhalerList from "@/assets/images/inhaler-list.png"
import { Avatar } from 'tamagui'
import { MontserratSemiText, MontserratText } from '../StyledText'

export const UbicationInhalerItem = useCallback(
    ({ item }) => (
        <View style={styles.container}>
        <View style={styles.infoView}>
          <Avatar size="$6" circular>
              <Avatar.Image
                  accessibilityLabel="Inhaler"
                  src={inhalerList}
              />
              <Avatar.Fallback backgroundColor="white" />
          </Avatar>
  
          <View>
              <MontserratSemiText>{ item.title }</MontserratSemiText>
              <View>
                  <MontserratText>{ item.where }</MontserratText>
                  <MontserratText>{ item.when }</MontserratText>
              </View>
          </View>
        </View>
      </View>
    ),
    []
);

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        height: 64,
        width: "100%",
        paddingHorizontal: 16,
        borderBottomWidth: 2
    },
    infoView: {
        display: "flex",
        flexDirection: "row"
    }
})

function useCallback(arg0: ({ item }: { item: any; }) => import("react").JSX.Element, arg1: never[]) {
    throw new Error('Function not implemented.');
}
