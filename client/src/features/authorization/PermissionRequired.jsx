import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectUser } from "../user/userSlice";

//Component that is responsible for letting authenticated user to switch to
// every page the user has permission for
const PermissionRequired = ({ hasPermission, redirectPath = "/" }) => {
  console.log(`hasPermission ${hasPermission}`);
  if (!hasPermission) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default PermissionRequired;
