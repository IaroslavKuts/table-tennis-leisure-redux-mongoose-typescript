import controllers from "../controllers";
import csrf from "csurf";
import { Router } from "express";
const csrfDefence = csrf({ cookie: { httpOnly: true } });

//End-points for functions declared in ordersController.js
const ordersRoutes = (router: Router) => {
  router.post(
    process.env.REACT_APP_UPDATE_ORDERS as string,
    csrfDefence,
    controllers.updateOrder
  );
  router.get(
    process.env.REACT_APP_READ_ALL_ORDERS as string,
    controllers.readAllOrders
  );
  router.post(
    process.env.REACT_APP_DELETE_ORDER as string,
    csrfDefence,
    controllers.deleteOrder
  );
  router.post(
    process.env.REACT_APP_CREATE_ORDERS as string,
    csrfDefence,
    controllers.createOrders
  );
};

export default ordersRoutes;
