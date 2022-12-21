//ORM model for table `orders`

import { Schema } from "mongoose";

import { IOrder } from "../mongo_models_interfaces";
const orderSchema: Schema = new Schema<IOrder>({
  date_of_game: { type: String, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  payment: { type: Number, required: true },
});

export default orderSchema;
