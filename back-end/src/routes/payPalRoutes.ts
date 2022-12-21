import services from "../services";
import csrf from "csurf";
import { Router } from "express";
const csrfDefence = csrf({ cookie: { httpOnly: true } });

//End-points for functions declared in paypal_service.js
const payPalRoutes = (router: Router) => {
  router.post(
    process.env.REACT_APP_PROCESS_PAY_PAL_ORDER as string,
    csrfDefence,
    services.processPayPalOrder
  );
};

export default payPalRoutes;
