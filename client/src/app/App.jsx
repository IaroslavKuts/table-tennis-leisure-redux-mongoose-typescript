import { Routes, Route } from "react-router-dom";
import "./App.css";

import Calendar from "../features/Calendar";
import {
  PermissionRequired,
  AuthenticationRequired,
  LogIn,
  SignUp,
  RestorePassword,
} from "../features/authorization";

import {
  ChooseAbonement,
  ContactUs,
  MyOrders,
  OrderTimeChoice,
  Payment,
  PersonalData,
  UserApp,
  PayPal2,
} from "../features/user";

import {
  AddAbonement,
  AdminApp,
  CreateReport,
  DayManagementCertainDay,
  DayManagementCertainDate,
} from "../features/admin";
import { useSelector } from "react-redux";
import { selectUserAuthorities } from "../features/authorization/authorizationSlice";

const App = () => {
  const authorities = useSelector(selectUserAuthorities);
  console.log(authorities);
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/RestorePassword" element={<RestorePassword />} />

      <Route element={<AuthenticationRequired />}>
        <Route
          element={
            <PermissionRequired hasPermission={authorities === "user"} />
          }
        >
          <Route path="/UserApp" element={<UserApp />}>
            <Route path="/UserApp/Calendar" element={<Calendar />} />
            <Route path="/UserApp/myOrders" element={<MyOrders />} />
            <Route path="/UserApp/payment" element={<Payment />} />
            <Route
              path="/UserApp/ChooseAbonement"
              element={<ChooseAbonement />}
            />
            <Route path="/UserApp/personalData" element={<PersonalData />} />
            <Route path="/UserApp/contactUs" element={<ContactUs />} />
            <Route path="/UserApp/PayPal" element={<PayPal2 />} />
          </Route>
        </Route>

        <Route
          element={
            <PermissionRequired hasPermission={authorities === "admin"} />
          }
        >
          <Route path="/AdminApp" element={<AdminApp />}>
            {" "}
            <Route path="/AdminApp/AddAbonement" element={<AddAbonement />} />
            <Route path="/AdminApp/CreateReport" element={<CreateReport />} />
            <Route
              path="/AdminApp/DayManagmentCertainDay"
              element={<DayManagementCertainDay />}
            />
            <Route
              path="/AdminApp/DayManagmentCertainDate"
              element={<DayManagementCertainDate />}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
