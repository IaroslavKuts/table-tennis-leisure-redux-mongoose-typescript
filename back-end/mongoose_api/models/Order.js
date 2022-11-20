//ORM model for table `orders`

const { Schema } = require("mongoose");

const Order = new Schema({
  date_of_game: { type: String, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  payment: { type: Number, required: true },
});

module.exports = Order;
