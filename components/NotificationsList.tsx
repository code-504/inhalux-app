import { View, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { NotificationsListProps, NotificationsListText, NotificationsListView } from '@/interfaces/NotificationsList'
import { MontserratSemiText, MontserratText } from './StyledText'
import Colors from '@/constants/Colors'
import { Switch } from 'tamagui'

const NotificationsList = ({ title, children }: NotificationsListProps) => {
    return (
        <View style={styles.listContent}>
            <MontserratSemiText style={styles.subTitle}>{ title }</MontserratSemiText>
            <View style={styles.listView}>
                {
                    React.Children.map(children, (child, index) => (
                        <ItemView key={index} value={child.props.value}>
                            {child.props.children}
                        </ItemView>
                    ))
                }
            </View>
        </View>
    )
}

const ItemView = ({ children, value }: NotificationsListView) => {

    const [ switchValue, setSwitchValue ] = useState<boolean>(value);

    return (
        <View style={styles.itemView}>
            <View style={styles.itemText}>
                {children}
            </View>

            <View style={styles.itemAction}>
                <Switch onCheckedChange={(checked) => setSwitchValue(checked)} defaultChecked={value} backgroundColor={switchValue ? Colors.tint : Colors.darkGray} borderColor={switchValue ? Colors.tint : Colors.darkGray} borderWidth={2}>
                    <Switch.Thumb animation={'quick'} backgroundColor={Colors.white} />
                </Switch>
            </View>
        </View>
    )
}

const Title = ({ children }: NotificationsListText) => (
    <MontserratSemiText style={styles.title}>{ children }</MontserratSemiText>
)

const Description = ({ children }: NotificationsListText) => (
    <MontserratText style={styles.description}>{ children }</MontserratText>
)

NotificationsList.ItemView = ItemView;
NotificationsList.Title = Title;
NotificationsList.Description = Description;

export default NotificationsList

const styles = StyleSheet.create({
    listContent: {
        display: "flex",
        flexDirection: "column",
        gap: 32
    },
    subTitle: {
        fontSize: 12,
        color: Colors.darkGray
    },
    listView: {
        display: "flex",
        flexDirection: "column",
        gap: 44
    },
    itemView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    itemText: {
        flex: 0.65,
        display: "flex",
        flexDirection: "column",
        gap: 8
    },
    itemAction: {
        flex: 0.2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: 18,
        lineHeight: 24
    },
    description: {
        fontSize: 12,
        color: Colors.darkGray,
        lineHeight: 16
    }
})