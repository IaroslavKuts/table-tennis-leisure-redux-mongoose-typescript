import auxillary_functions from "../auxillary_functions";
import mongoose_api from "../mongoose_api";
import services from "../services";
import alteredWorkScheduleController from "./alteredWorkScheduleController";
import basicWorkScheduleController from "./basicWorkScheduleController";
import {
  IBasicWorkSchedule,
  ITimePeriods,
  IOrder,
} from "../mongoose_api/mongo_models_interfaces";
import { Request, Response } from "express";
import { RequestBodyOrQuery } from "./controllers_interfaces";
import { AggregationResult } from "./controllers_interfaces";
const Time_periods = mongoose_api.Time_periods;
const Order = mongoose_api.Order;

//Function that returns time_periods by DATE if argument `date` was passed,
const readWorkDaySchedule = async (date: string, day_id: number) => {
  const alteredWorkSchedule =
    await alteredWorkScheduleController.readAlteredWorkSchedule(date);
  if (!!alteredWorkSchedule) return alteredWorkSchedule;
  return await basicWorkScheduleController.readWorkSchedule(day_id);
};

const readFilteredTimePeriods = async (
  request: Request<{}, {}, {}, RequestBodyOrQuery>,
  response: Response
) => {
  const { dateOfGame } = request.query;

  if (dateOfGame !== undefined) {
    const day_id = new Date(dateOfGame).getDay();
    const { open, close } = (await readWorkDaySchedule(
      dateOfGame,
      day_id
    )) as Pick<IBasicWorkSchedule, "close" | "open">;
    const filteredTimePeriods = await Time_periods.find<ITimePeriods>(
      {
        $and: [{ start_time: { $gte: open } }, { end_time: { $lte: close } }],
      },
      "-price"
    );
    filteredTimePeriods.pop();

    response.json(filteredTimePeriods);
  }
};

const readUnavaliableTimePeriods = async (
  request: Request<{}, {}, {}, RequestBodyOrQuery>,
  response: Response
) => {
  const { dateOfGame } = request.query;
  const receivedTimePeriods = await Order.aggregate<AggregationResult>([
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
  const result = receivedTimePeriods.map((el) => ({
    start_time: (el["_id"] as Record<string, string>).start_time,
    amount: el.amount,
  }));

  if (!result)
    return response
      .status(404)
      .send({ msg: "Unavailable time periods were not found" });
  return response.json({
    unavailableTimePeriods: result,
  });
};

const sendUserComment = async (
  request: Request<{}, {}, RequestBodyOrQuery>,
  response: Response
) => {
  const { message } = request.body;
  const { email } = response.locals;
  if (message !== undefined && email !== undefined) {
    services.sendMail("tabletennisleisureNOREPLY@gmail.com", email, message);
  }
};

const miscellaneousController = {
  readFilteredTimePeriods,
  readUnavaliableTimePeriods,
  sendUserComment,
};
export default miscellaneousController;
