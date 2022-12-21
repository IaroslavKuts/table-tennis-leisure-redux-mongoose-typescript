import { Schema } from "mongoose";

import { IBasicWorkSchedule } from "../mongo_models_interfaces";
const basicWorkScheduleSchema: Schema = new Schema<IBasicWorkSchedule>({
  day_name: { type: String, required: true },
  day_id: { type: Number, required: true },
  open: { type: String, required: true },
  close: { type: String, required: true },
});

export default basicWorkScheduleSchema;
