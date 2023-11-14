import { Text, TextProps } from './Themed';

export function MontserratText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Montserrat' }]} />;
}

export function MontserratSemiText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Montserrat-Semi' }]} />;
}

export function MontserratBoldText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Montserrat-Bold' }]} />;
}