// CRUD functions for table `alteredWorkSchedule`
const { Altered_work_schedule } = require("../mongoose_api");
const createAlteredWorkSchedule = async (date, open, close) => {
  await Altered_work_schedule.create({ date, open, close });
};
const readAlteredWorkSchedule = async (date) => {
  const result = await Altered_work_schedule.findOne({
    date,
  });
  return result;
};

const readAlteredBlockedDates = async (request, response) => {
  let receivedAlteredBlockedDates = await Altered_work_schedule.find(
    {
      open: "-----",
    },
    "-_id date"
  );
  if (!receivedAlteredBlockedDates)
    return response
      .status(404)
      .send({ msg: "Altered blocked dates were not found" });
  response.json(receivedAlteredBlockedDates);
};

const deleteAlteredWorkSchedule = async (request, response) => {
  const { date } = request.body;
  await Altered_work_schedule.deleteOne({ date });
  response.json({ message: "Altered date was deleted successfully" });
};

const alteredWorkScheduleController = {
  createAlteredWorkSchedule,
  readAlteredWorkSchedule,
  readAlteredBlockedDates,
  deleteAlteredWorkSchedule,
};
module.exports = alteredWorkScheduleController;
