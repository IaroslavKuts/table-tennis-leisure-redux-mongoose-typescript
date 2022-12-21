import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import abonementRoutes from "./abonementRoutes";
import ordersRoutes from "./ordersRoutes";
import personRoutes from "./personRoutes";
import miscellaneousRoutes from "./miscellaneousRoutes";
import basicWorkScheduleRoutes from "./basicWorkScheduleRoutes";
import alteredWorkScheduleRoutes from "./alteredWorkScheduleRoutes";

import adminRoutes from "./adminRoutes";
import payPalRoutes from "./payPalRoutes";
import verifiers from "../middleware";
import { Router } from "express";
const router = Router();

const routersInitializer = (router: Router) => {
  authRoutes(router);
  router.use(verifiers.verifyJWT);
  userRoutes(router);
  abonementRoutes(router);
  ordersRoutes(router);
  personRoutes(router);
  miscellaneousRoutes(router);
  basicWorkScheduleRoutes(router);
  alteredWorkScheduleRoutes(router);
  // timePeriodsRoutes(router
  payPalRoutes(router);
  router.use(verifiers.isAdmin);
  adminRoutes(router);
};

routersInitializer(router);

export default router;
