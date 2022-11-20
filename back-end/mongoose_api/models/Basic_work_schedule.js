const { Schema, SchemaTypes } = require("mongoose");
const BasicWorkSchedule = new Schema({
  day_name: { type: String, required: true },
  day_id: { type: Number, required: true },
  open: { type: String, required: true },
  close: { type: String, required: true },
});

module.exports = BasicWorkSchedule;
