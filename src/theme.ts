const theme = {
  lightTheme: {
    bgColor: '#f5f6fa',
    textColor: '#2f3640',
    accentColor: '#9c88ff',
    cardBgColor: 'white',
    cardShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    hoverColor: '#e1e1e1',
    borderColor: '#dcdde1',
    buttonColor: '#dcdde1'
  },
  darkTheme: {
    bgColor: '#2f3640',
    textColor: '#f5f6fa',
    accentColor: '#9c88ff',
    cardBgColor: '#353b48',
    cardShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    hoverColor: '#4a4a4a',
    borderColor: '#4a4a4a',
    buttonColor: '#353b48'
  }
} as const;

export const lightTheme = theme.lightTheme;
export const darkTheme = theme.darkTheme; 