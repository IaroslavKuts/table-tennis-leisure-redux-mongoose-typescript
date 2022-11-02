const { readWorkSchedule } = require("./basicWorkScheduleController");
const { readAlteredWorkSchedule } = require("./alteredWorkScheduleController");
const auxillary_functions = require("../auxillary_functions");
const DBManager = require("../sequelize");
const services = require("../services");
const { Op, fn, where, col, QueryTypes } = require("sequelize");
const { orders, users } = DBManager.models;

//Function that returns time_periods by DATE if argument `date` was passed,
const readWorkDaySchedule = async (date, day_id) => {
  date = auxillary_functions.SQLDateFormater(date);
  const alteredWorkSchedule = await readAlteredWorkSchedule(date);
  if (!!alteredWorkSchedule) return alteredWorkSchedule;
  return await readWorkSchedule(day_id);
};

const readFilteredTimePeriods = async (request, response) => {
  const { dateOfGame } = request.query;
  console.log(request.query, 1111111111111);
  if (dateOfGame !== "undefined") {
    let day_id = new Date(dateOfGame).getDay();

    const { open, close } = await readWorkDaySchedule(dateOfGame, day_id);
    const filteredTimePeriods = await DBManager.query(
      "SELECT time_periods.start_time,time_periods.end_time,time_periods.time_period_id , p.c " +
        "from `time_periods`LEFT " +
        "join (SELECT orders.start_time, count(orders.order_id) as c " +
        "from `orders` where date_of_game = :dateOfGame GROUP BY orders.date_of_game,orders.start_time,orders.end_time)  as p " +
        "ON p.start_time = time_periods.start_time " +
        "WHERE time_period_id BETWEEN " +
        "(SELECT time_period_id from `time_periods` WHERE start_time= :open) " +
        "AND (SELECT time_period_id from `time_periods` WHERE end_time= :close) ",
      { replacements: { dateOfGame, open, close }, type: QueryTypes.SELECT }
    );
    response.json(filteredTimePeriods);
  }
};

const readUnavaliableTimePeriods = async (request, response) => {
  let receivedOrders = await orders.findAll({
    raw: true,
    where: where(fn("CURDATE"), "<=", col("date_of_game")),
    group: ["date_of_game", "start_time", "end_time"],
    attributes: [
      "date_of_game",
      "start_time",
      "end_time",
      [fn("COUNT", col("order_id")), "c"],
    ],
    having: { c: { [Op.eq]: 5 } },
  });
  if (!receivedOrders)
    return response
      .status(404)
      .send({ msg: "Unavailable time periods were not found" });
  response.json(receivedOrders);
};

const sendUserComment = async (request, response) => {
  const { message } = request.body;
  const { email } = request;
  services.sendMail("tabletennisleisureNOREPLY@gmail.com", email, message);
};

const miscellaneousController = {
  readFilteredTimePeriods,
  readUnavaliableTimePeriods,
  sendUserComment,
};
module.exports = miscellaneousController;
