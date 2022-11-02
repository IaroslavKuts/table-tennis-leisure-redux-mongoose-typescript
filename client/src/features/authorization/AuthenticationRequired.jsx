import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authorizationSlice";
import { useGetUserQuery } from "../user/userSlice";

const RequireAuthorization = () => {
  const accessToken = useSelector(selectCurrentToken);
  const location = useLocation();

  const { isLoading, isSuccess, isError } = useGetUserQuery(undefined, {
    skip: !accessToken,
  });
  console.log(`${isLoading} is loading`);
  console.log(`${isSuccess} is success`);

  if (accessToken && isSuccess) {
    console.log("entered token");
    return <Outlet />;
  }
  if (isLoading) return <p>Loading</p>;
  return <Navigate to="/" state={{ from: location }} replace />;
};
export default RequireAuthorization;
