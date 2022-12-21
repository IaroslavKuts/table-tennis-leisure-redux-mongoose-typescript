import controllers from "../controllers";
import csrf from "csurf";
import { Router } from "express";
const csrfDefence = csrf({ cookie: { httpOnly: true } });

//End-points for functions declared in userController.js
const userRoutes = (router: Router) => {
  router.get(process.env.REACT_APP_READ_USER as string, controllers.readUser);
  router.post(
    process.env.REACT_APP_UPDATE_USER_DATA as string,
    csrfDefence,
    controllers.updateUserData
  );
};

export default userRoutes;
