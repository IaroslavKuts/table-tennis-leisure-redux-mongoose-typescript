const { Schema } = require("mongoose");

const Abonement = new Schema({
  name_of_abonement: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});
module.exports = Abonement;
