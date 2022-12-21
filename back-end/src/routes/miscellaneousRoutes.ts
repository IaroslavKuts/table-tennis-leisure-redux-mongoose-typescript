import controllers from "../controllers";
import csrf from "csurf";
import { Router } from "express";
const csrfDefence = csrf({ cookie: { httpOnly: true } });

//End-points for functions declared in miscellaneousController.js
const miscellaneousRoutes = (router: Router) => {
  router.get(
    process.env.REACT_APP_READ_FILTERED_TIME_PERIODS as string,

    controllers.readFilteredTimePeriods
  );
  router.get(
    process.env.REACT_APP_READ_UNAVAILABLE_TIME_PERIODS as string,

    controllers.readUnavaliableTimePeriods
  );
  router.post(
    process.env.REACT_APP_SEND_USER_COMMENT as string,
    csrfDefence,
    controllers.sendUserComment
  );
};

export default miscellaneousRoutes;
