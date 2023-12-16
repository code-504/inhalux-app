import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { MontserratSemiText } from '../StyledText';
import Colors from '@/constants/Colors';
import Ripple from 'react-native-material-ripple';

interface CardOptionsListProps {
  title: string;
  children: React.ReactElement<ItemViewProps> | React.ReactElement<ItemViewProps>[];
}

interface ItemViewProps {
  children: React.ReactElement<ItemTextProps> | React.ReactElement<ItemTextProps>[];
  style?: StyleProp<ViewStyle>;
}

interface ItemTextProps {
  children: string;
}

export default function CardOptionsList({ title, children }: CardOptionsListProps) {
  const childrenArray = React.Children.toArray(children);
  const totalChildren = childrenArray.length;

  return (
    <View style={styles.container}>
      <MontserratSemiText style={styles.titleText}>{title}</MontserratSemiText>
      <View style={styles.viewList}>
        {React.Children.map(children, (child, index) => {
          const isFirst = index === 0;
          const isLast = index === totalChildren - 1;

          return React.cloneElement(child, {
            style: [
              styleItem.container,
              isFirst && styleItem.firstChild,
              isLast && styleItem.lastChild,
              child.props.style,
            ],
          });
        })}
      </View>
    </View>
  );
}

const ItemView = ({ children, style }: ItemViewProps) => (
    <View style={[styleItem.container, style]}>
        {children}
    </View>
);

const ItemText = ({ children }: ItemTextProps) => (
  <MontserratSemiText style={styleItemText.text}>
    {children}
  </MontserratSemiText>
);

CardOptionsList.ItemView = ItemView;
CardOptionsList.ItemText = ItemText;

const styles = StyleSheet.create({
    titleText: {
        fontSize: 16,
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
        gap: 20,
        paddingHorizontal: 24,
        paddingVertical: 24,
        backgroundColor: Colors.white,
    },
    firstChild: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24
    },
    lastChild: {
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24
    }
});

const styleItemText = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});
