//ORM model for table `time_periods`

import { Schema } from "mongoose";

import { ITimePeriods } from "../mongo_models_interfaces";
const timePeriodsSchema: Schema = new Schema<ITimePeriods>({
  time_period_id: { type: Number, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  price: { type: Number, required: true },
});

export default timePeriodsSchema;
