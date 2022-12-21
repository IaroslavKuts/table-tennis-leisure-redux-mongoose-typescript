import controllers from "../controllers";
import csrf from "csurf";
import { Router } from "express";
const csrfDefence = csrf({ cookie: { httpOnly: true } });

//End-points for functions declared in alteredWorkScheduleController.js
const alteredWorkScheduleRoutes = (router: Router) => {
  router.get(
    process.env.REACT_APP_READ_ALTERED_BLOCKED_DATES as string,
    controllers.readAlteredBlockedDates
  );
  router.post(
    process.env.REACT_APP_DELETE_ALTERED_WORK_SCHEDULE as string,
    csrfDefence,
    controllers.deleteAlteredWorkSchedule
  );
};

export default alteredWorkScheduleRoutes;
