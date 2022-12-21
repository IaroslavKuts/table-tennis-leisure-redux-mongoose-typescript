import { Schema } from "mongoose";

import { IAlteredWorkSchedule } from "../mongo_models_interfaces";
const alteredWorkScheduleSchema: Schema = new Schema<IAlteredWorkSchedule>({
  date: { type: String, required: true },
  open: { type: String, required: true },
  close: { type: String, required: true },
});

export default alteredWorkScheduleSchema;
