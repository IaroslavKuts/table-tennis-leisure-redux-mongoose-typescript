const { Schema } = require("mongoose");
const AlteredWorkSchedule = new Schema({
  date: { type: String, required: true },
  open: { type: String, required: true },
  close: { type: String, required: true },
});

module.exports = AlteredWorkSchedule;
