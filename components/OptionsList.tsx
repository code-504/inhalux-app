import React, { Dispatch, SetStateAction } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { MontserratSemiText, MontserratText } from './StyledText';
import Colors from '@/constants/Colors';
import Ripple from 'react-native-material-ripple';
import { Button } from 'tamagui';

interface CardOptionsListProps {
  title: string;
  children: React.ReactElement<ItemViewProps> | React.ReactElement<ItemViewProps>[];
}

interface ItemViewProps {
  children: React.ReactElement<ItemTextProps> | React.ReactElement<ItemTextProps>[];
  style?: StyleProp<ViewStyle>;
  onPressFunction ?: Dispatch<SetStateAction<any>>
}

interface ItemTextProps {
  children: string;
}

interface ItemDescriptionProps {
  children: React.ReactElement | React.ReactElement[];
}

export default function OptionsList({ title, children }: CardOptionsListProps) {
  return (
    <View style={styles.container}>
      <MontserratSemiText style={styles.titleText}>{title}</MontserratSemiText>
      <View style={styles.viewList}>
        { children }
      </View>
    </View>
  );
}

const ItemView = ({ children, style, onPressFunction }: ItemViewProps) => (
    <Ripple onPress={onPressFunction} style={[styleItem.container, style]}>
        {children}
    </Ripple>
);

const TextView = ({ children }: ItemDescriptionProps) => (
  <View style={styleItemText.content}>
    {children}
  </View>
)

const ItemText = ({ children }: ItemTextProps) => (
  <MontserratSemiText style={styleItemText.text}>
    {children}
  </MontserratSemiText>
);

const ItemDescription = ({ children }: ItemTextProps) => (
  <MontserratText style={styleItemText.description}>
    {children}
  </MontserratText>
)

OptionsList.ItemView = ItemView;
OptionsList.ItemText = ItemText;
OptionsList.ItemDescription = ItemDescription;
OptionsList.TextView = TextView;

const styles = StyleSheet.create({
    titleText: {
      paddingHorizontal: 24,
      fontSize: 12,
      color: Colors.darkGray
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
    },
    viewList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },
});

const styleItem = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: "flex-start",
        overflow: "hidden",
        gap: 24,
        paddingHorizontal: 24,
        paddingVertical: 24,
        backgroundColor: Colors.white,
    },
});

const styleItemText = StyleSheet.create({
  text: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.darkGray
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingRight: 64
  }
});