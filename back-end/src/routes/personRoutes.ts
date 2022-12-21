import controllers from "../controllers";
import csrf from "csurf";
import { Router } from "express";
const csrfDefence = csrf({ cookie: { httpOnly: true } });

//End-points for functions declared in personController.js
const personRoutes = (router: Router) => {
  router.post(
    process.env.REACT_APP_UPDATE_PERSON as string,
    csrfDefence,
    controllers.updatePerson
  );
};

export default personRoutes;
