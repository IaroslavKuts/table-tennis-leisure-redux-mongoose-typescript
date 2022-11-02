import { createSlice } from "@reduxjs/toolkit";

const appSettingsSlice = createSlice({
  name: "appSettings",
  initialState: {
    dateOfGame: (() => {
      let today = new Date().toLocaleDateString().split("/");
      return `${today[2]}-${today[0]}-${today[1]}`;
    })(),
    currentColor: "#03C9D7",
    activeMenu: true,
    themeSettings: false,
    currentMode: "light",
    screenSize: undefined,
  },
  reducers: {
    setCurrentColor: (state, action) => {
      const { currentColor } = action.payload;
      state.currentColor = currentColor;
    },
    setDateOfGame: (state, action) => {
      const { dateOfGame } = action.payload;
      state.dateOfGame = dateOfGame;
    },
    setActiveMenu: (state, action) => {
      const { activeMenu } = action.payload;
      state.activeMenu = activeMenu;
    },
    setThemeSettings: (state, action) => {
      const { themeSettings } = action.payload;
      state.themeSettings = themeSettings;
    },
    setScreenSize: (state, action) => {
      const { screenSize } = action.payload;
      state.screenSize = screenSize;
    },
  },
});

export const {
  setCurrentColor,
  setDateOfGame,
  setActiveMenu,
  setThemeSettings,
  setScreenSize,
} = appSettingsSlice.actions;

export const selectCurrentColor = (state) => state.appSettings.currentColor;
export const selectDateOfGame = (state) => state.appSettings.dateOfGame;
export const selectActiveMenu = (state) => state.appSettings.activeMenu;
export const selectThemeSettings = (state) => state.appSettings.themeSettings;
export const selectScreenSize = (state) => state.appSettings.screenSize;

export default appSettingsSlice.reducer;
