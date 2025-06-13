import { atom } from 'recoil';

export const isDarkModeState = atom({
  key: 'isDarkModeState', // unique ID
  default: false, // default value
}); 