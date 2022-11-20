// CRUD functions for table `time_periods`
const { Time_periods } = require("../mongoose_api");
const readTimePeriodsByIDs = async (chosenTimePeriods) => {
  let receivedTimePeriods = await Time_periods.find(
    {
      time_period_id: { $in: chosenTimePeriods },
    },
    "-_id -_time_period_id"
  );

  // if (!receivedTimePeriods) {
  //   return response.status(400).send("!readTimePeriodPriceByID");
  // }

  return receivedTimePeriods;
};

const timePeriodsController = {
  readTimePeriodsByIDs,
};
module.exports = timePeriodsController;
