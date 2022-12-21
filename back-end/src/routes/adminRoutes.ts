import controllers from "../controllers";
import csrf from "csurf";
import { Router } from "express";
const csrfDefence = csrf({ cookie: { httpOnly: true } });
//End-points for functions declared in adminController.js
const adminRoutes = (router: Router) => {
  router.get(
    process.env.REACT_APP_READ_CUSTOMERS_ABONEMENTS as string,
    controllers.readCustomersAbonements
  );
  router.get(
    process.env.REACT_APP_READ_CUSTOMERS_AGES as string,
    controllers.readCustomersAges
  );
  router.get(
    process.env.REACT_APP_READ_PROFIT as string,
    controllers.readProfit
  );
  router.get(
    process.env.REACT_APP_READ_DAYS_LOAD as string,
    controllers.readDaysLoad
  );
  router.get(
    process.env.REACT_APP_READ_USERS_DATA_BY_PAYMENT as string,
    controllers.readUsersDataByPayment
  );
  router.get(
    process.env.REACT_APP_READ_USER_ORDERS_BY_PASSPORT as string,
    controllers.readUserOrdersByPassport
  );
  router.post(
    process.env
      .REACT_APP_UPDATE_CERTAIN_DAY_SCHEDULE_AND_SEND_VOUCHERS as string,
    csrfDefence,
    controllers.updateCertainDaySchedule
  );
  router.post(
    process.env.REACT_APP_CREATE_CERTAIN_DATE_SCHEDULE as string,
    csrfDefence,
    controllers.createCertainDateSchedule
  );
};

export default adminRoutes;
