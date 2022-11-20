// CRUD functions for table `basicWorkSchedule`
const { Basic_work_schedule } = require("../mongoose_api");
const updateScheduleOfCertainDay = async (day_id, open, close) => {
  await Basic_work_schedule.updateOne(
    { day_id },
    {
      open,
      close,
    }
  );
};

const readWorkSchedule = async (day_id) => {
  const result = await Basic_work_schedule.findOne({
    day_id,
  });
  return result;
};
const readAllWorkSchedules = async (request, response) => {
  let receivedAllWorkSchedules = await Basic_work_schedule.find({}, "-_id");

  if (!receivedAllWorkSchedules)
    return response.status(404).send({ msg: "Work schedules were not found" });
  response.json(receivedAllWorkSchedules);
};

const basicWorkScheduleController = {
  updateScheduleOfCertainDay,
  readWorkSchedule,
  readAllWorkSchedules,
};
module.exports = basicWorkScheduleController;
