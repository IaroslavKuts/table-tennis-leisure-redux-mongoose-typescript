const auxillary_functions = require("../auxillary_functions");
const { Time_periods, Order } = require("../mongoose_api");
const services = require("../services");
const { readAlteredWorkSchedule } = require("./alteredWorkScheduleController");
const { readWorkSchedule } = require("./basicWorkScheduleController");

//Function that returns time_periods by DATE if argument `date` was passed,
const readWorkDaySchedule = async (date, day_id) => {
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
    const filteredTimePeriods = await Time_periods.find(
      {
        $and: [{ start_time: { $gte: open } }, { end_time: { $lte: close } }],
      },
      "-price"
    );
    filteredTimePeriods.pop();

    response.json(filteredTimePeriods);
  }
};

const readUnavaliableTimePeriods = async (request, response) => {
  const { dateOfGame } = request.query;
  let receivedTimePeriods = await Order.aggregate([
    {
      $match: {
        date_of_game: dateOfGame,
      },
    },
    {
      $group: {
        _id: { date: "$date_of_game", start_time: "$start_time" },
        amount: { $sum: 1 },
      },
    },

    { $project: { "_id.start_time": 1, amount: 1 } },
  ]);
  receivedTimePeriods = receivedTimePeriods.map((el) => ({
    amount: el.amount,
    start_time: el._id.start_time,
  }));

  if (!receivedTimePeriods)
    return response
      .status(404)
      .send({ msg: "Unavailable time periods were not found" });
  return response.json({
    unavailableTimePeriods: receivedTimePeriods,
  });
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
