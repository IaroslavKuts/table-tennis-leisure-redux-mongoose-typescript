//ORM model for table `persons`
import { Schema } from "mongoose";

import { IPerson } from "../mongo_models_interfaces";
const personSchema: Schema = new Schema<IPerson>({
  first_name: {
    type: String,
    required: true,
  },
  surname: { type: String, required: true },
  passport: { type: String, required: true, unique: true },
  date_of_birth: { type: String, required: true },
  gender: { type: String, required: true },
});

export default personSchema;
