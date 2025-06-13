import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    bgColor: string;
    textColor: string;
    accentColor: string;
    cardBgColor: string;
    cardShadow: string;
    hoverColor: string;
    borderColor: string;
    buttonColor: string;
  }
} 