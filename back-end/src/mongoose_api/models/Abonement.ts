import { Schema } from "mongoose";
import { IAbonement } from "../mongo_models_interfaces";

const abonementSchema: Schema = new Schema<IAbonement>({
  name_of_abonement: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});
export default abonementSchema;
