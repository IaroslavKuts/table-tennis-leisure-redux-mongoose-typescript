import authController from "./authController";
import userController from "./userController";

import abonementController from "./abonementController";
import ordersController from "./ordersController";
import personController from "./personController";
import miscellaneousController from "./miscellaneousController";
import basicWorkScheduleController from "./basicWorkScheduleController";
import alteredWorkScheduleController from "./alteredWorkScheduleController";
import timePeriodsController from "./timePeriodsController";
import adminController from "./adminController";

const controllers = {
  ...authController,
  ...userController,
  ...abonementController,
  ...ordersController,
  ...personController,
  ...miscellaneousController,
  ...basicWorkScheduleController,
  ...alteredWorkScheduleController,
  ...timePeriodsController,
  ...adminController,
};

export default controllers;
