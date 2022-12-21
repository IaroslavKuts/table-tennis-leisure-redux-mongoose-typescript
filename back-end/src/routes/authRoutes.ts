import controllers from "../controllers";
import csrf from "csurf";
import { Router } from "express";
const csrfDefence = csrf({ cookie: { httpOnly: true } });

//End-points for authentication functions (logInController.js, logoutController.js,refreshController.js)
const authRoutes = (router: Router) => {
  router.post(
    process.env.REACT_APP_LOGIN as string,
    csrfDefence,
    controllers.handleLogIn
  );
  router.get(process.env.REACT_APP_LOGOUT as string, controllers.handleLogout);
  router.get(
    process.env.REACT_APP_REFRESH_TOKEN as string,
    controllers.handleRefreshToken
  );
  router.post(
    process.env.REACT_APP_CREATE_USER as string,
    controllers.registrateUser
  );
  router.post(
    process.env.REACT_APP_RESTORE_PASSWORD as string,
    csrfDefence,
    controllers.restorePassword
  );
};
export default authRoutes;
