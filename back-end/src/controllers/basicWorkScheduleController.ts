// CRUD functions for table `basicWorkSchedule`
import { IBasicWorkSchedule } from "../mongoose_api/mongo_models_interfaces";
import mongoose_api from "../mongoose_api";
import { Request, Response } from "express";
const Basic_work_schedule = mongoose_api.Basic_work_schedule;
const updateScheduleOfCertainDay = async (
  day_id: string,
  open: string,
  close: string
) => {
  await Basic_work_schedule.updateOne<IBasicWorkSchedule>(
    { day_id },
    {
      open,
      close,
    }
  );
};

const readWorkSchedule = async (
  day_id: number
): Promise<IBasicWorkSchedule | null> =>
  await Basic_work_schedule.findOne<IBasicWorkSchedule>({
    day_id,
  });

const readAllWorkSchedules = async (request: Request, response: Response) => {
  let receivedAllWorkSchedules: IBasicWorkSchedule[] =
    await Basic_work_schedule.find<IBasicWorkSchedule>({}, "-_id");

  if (!receivedAllWorkSchedules)
    return response.status(404).send({ msg: "Work schedules were not found" });
  response.json(receivedAllWorkSchedules);
};

const basicWorkScheduleController = {
  updateScheduleOfCertainDay,
  readWorkSchedule,
  readAllWorkSchedules,
};
export default basicWorkScheduleController;
