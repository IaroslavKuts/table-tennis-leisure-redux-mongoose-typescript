const mongoose = require("mongoose");
const user = require("./models/User");
const abonement = require("./models/Abonement");
const person = require("./models/Person");
const order = require("./models/Order");
const basic_work_schedule = require("./models/Basic_work_schedule");
const altered_work_schedule = require("./models/Altered_work_schedule");
const time_periods = require("./models/TimePeriods");
//DataBase setting
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  connectDB,
  User: mongoose.model("user", user),
  Abonement: mongoose.model("abonement", abonement),
  Person: mongoose.model("person", person, "persons"),
  Order: mongoose.model("order", order),
  Basic_work_schedule: mongoose.model(
    "basic_work_schedule",
    basic_work_schedule
  ),
  Altered_work_schedule: mongoose.model(
    "altered_work_schedule",
    altered_work_schedule
  ),
  Time_periods: mongoose.model("time_period", time_periods),
};
