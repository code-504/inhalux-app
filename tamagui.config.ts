import {config} from '@tamagui/config/v2';
import {createFont, createTamagui} from 'tamagui';

const montserratFace = {
  normal: {normal: 'Montserrat-Regular'},
  bold: {normal: 'Montserrat-Bold'},
  300: {normal: 'Montserrat-Regular'},
  500: {normal: 'Montserrat-Regular'},
  600: {normal: 'Montserrat-Semibold'},
  700: {normal: 'Montserrat-Semibold'},
  800: {normal: 'Montserrat-Bold'},
  900: {normal: 'Montserrat-Bold'},
};

const headingFont = createFont({
  size: config.fonts.heading.size,
  lineHeight: config.fonts.heading.lineHeight,
  weight: config.fonts.heading.weight,
  letterSpacing: config.fonts.heading.letterSpacing,
  face: montserratFace,
});

const bodyFont = createFont({
  size: config.fonts.body.size,
  lineHeight: config.fonts.body.lineHeight,
  weight: config.fonts.body.weight,
  letterSpacing: config.fonts.body.letterSpacing,
  face: montserratFace,
});

const appConfig = createTamagui({
  ...config,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
})

export type AppConfig = typeof appConfig
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}
export default appConfig