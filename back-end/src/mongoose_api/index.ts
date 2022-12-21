import mongoose from "mongoose";
import {
  IUser,
  IAbonement,
  IPerson,
  IOrder,
  IBasicWorkSchedule,
  IAlteredWorkSchedule,
  ITimePeriods,
} from "./mongo_models_interfaces";
import userSchema from "./models/User";
import abonementSchema from "./models/Abonement";
import personSchema from "./models/Person";
import orderSchema from "./models/Order";
import basic_work_scheduleSchema from "./models/Basic_work_schedule";
import altered_work_scheduleSchema from "./models/Altered_work_schedule";
import time_periodsSchema from "./models/TimePeriods";
//DataBase setting
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
  } catch (e) {
    console.log(e);
  }
};

export default {
  connectDB,
  User: mongoose.model<IUser>("user", userSchema),
  Abonement: mongoose.model<IAbonement>("abonement", abonementSchema),
  Person: mongoose.model<IPerson>("person", personSchema, "persons"),
  Order: mongoose.model<IOrder>("order", orderSchema),
  Basic_work_schedule: mongoose.model<IBasicWorkSchedule>(
    "basic_work_schedule",
    basic_work_scheduleSchema
  ),
  Altered_work_schedule: mongoose.model<IAlteredWorkSchedule>(
    "altered_work_schedule",
    altered_work_scheduleSchema
  ),
  Time_periods: mongoose.model<ITimePeriods>("time_period", time_periodsSchema),
};
