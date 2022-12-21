// CRUD functions for table `time_periods`
import mongoose_api from "../mongoose_api";
import { ITimePeriods } from "../mongoose_api/mongo_models_interfaces";
const Time_periods = mongoose_api.Time_periods;
const readTimePeriodsByIDs = async (chosenTimePeriods: string[]) => {
  let receivedTimePeriods = await Time_periods.find<ITimePeriods>(
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
export default timePeriodsController;
