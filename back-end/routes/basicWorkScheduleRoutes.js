const controllers = require("../controllers");

//End-points for functions declared in basicWorkScheduleController.js
const basicWorkSchedulesRoutes = (router) => {
  router.get(
    process.env.REACT_APP_READ_BASIC_DAYS_SCHEDULES,
    controllers.readAllWorkSchedules
  );
};

module.exports = basicWorkSchedulesRoutes;
