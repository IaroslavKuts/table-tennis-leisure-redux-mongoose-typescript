import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { Navbar, Sidebar, ThemeSettings } from "../../common/components";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveMenu,
  selectCurrentColor,
  selectThemeSettings,
  setThemeSettings,
} from "../appSettingsSlice";
import { selectUser } from "../user/userSlice";
import { useGetAllAbonementsQuery } from "../user/abonementSlice";

//Main component that includes admin interface components
const AdminApp = () => {
  console.log("Admin app rendered");
  useGetAllAbonementsQuery();
  const dispatch = useDispatch();
  const activeMenu = useSelector(selectActiveMenu);
  const themeSettings = useSelector(selectThemeSettings);
  const currentColor = useSelector(selectCurrentColor);
  const { theme } = useSelector(selectUser)[0];

  return (
    <div className={theme}>
      <div className="flex relative dark:bg-main-dark-bg">
        <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
          <TooltipComponent content="Settings" position="Top">
            <button
              type="button"
              className="text-3xl white p-3 hover:drop-shadow-xl hover:bg-light-gray"
              style={{ background: currentColor, borderRadius: "50%" }}
              onClick={() =>
                dispatch(setThemeSettings({ themeSettings: true }))
              }
            >
              <FiSettings />
            </button>
          </TooltipComponent>
        </div>
        {activeMenu ? (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
            <Sidebar />
          </div>
        ) : (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <Sidebar />
          </div>
        )}
        <div
          className={
            //when it open or closed
            //we reduce a repeatetive code
            `dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
              activeMenu ? "md:ml-72" : "flex-2"
            }`
          }
        >
          {/*problem with rar */}
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
            <Navbar />
          </div>

          <div>
            {themeSettings && <ThemeSettings />}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApp;
