import controllers from "../controllers";
import csrf from "csurf";
import { Router } from "express";
const csrfDefence = csrf({ cookie: { httpOnly: true } });

//End-points for functions declared in abonementController.js
const abonementRoutes = (router: Router) => {
  router.get(
    process.env.REACT_APP_READ_ALL_ABONEMENTS as string,
    controllers.readAllAbonements
  );
  router.post(
    process.env.REACT_APP_CREATE_ABONEMENT as string,
    csrfDefence,
    controllers.createAbonement
  );
};

export default abonementRoutes;
