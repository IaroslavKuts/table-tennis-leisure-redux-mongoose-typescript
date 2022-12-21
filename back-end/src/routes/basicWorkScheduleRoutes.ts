import controllers from "../controllers";
import csrf from "csurf";
import { Router } from "express";
const csrfDefence = csrf({ cookie: { httpOnly: true } });

//End-points for functions declared in basicWorkScheduleController.js
const basicWorkSchedulesRoutes = (router: Router) => {
  router.get(
    process.env.REACT_APP_READ_BASIC_DAYS_SCHEDULES as string,
    csrfDefence,
    controllers.readAllWorkSchedules
  );
};

export default basicWorkSchedulesRoutes;
