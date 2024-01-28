import { Text, TextProps } from './Themed';

export function MontserratText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Montserrat-Regular' }]} />;
}

export function MontserratSemiText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Montserrat-Semibold' }]} />;
}

export function MontserratBoldText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Montserrat-Bold' }]} />;
}