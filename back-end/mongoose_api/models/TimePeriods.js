//ORM model for table `time_periods`

const { Schema } = require("mongoose");

const TimePeriods = new Schema({
  time_period_id: { type: Number, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  price: { type: Number, required: true },
});

module.exports = TimePeriods;
