// CRUD functions for table `alteredWorkSchedule`
import { IAlteredWorkSchedule } from "../mongoose_api/mongo_models_interfaces";
import mongoose_api from "../mongoose_api";
import { Request, Response } from "express";
const Altered_work_schedule = mongoose_api.Altered_work_schedule;
const createAlteredWorkSchedule = async (
  date: string,
  open: string,
  close: string
): Promise<void> => {
  await Altered_work_schedule.create<IAlteredWorkSchedule>({
    date,
    open,
    close,
  });
};
const readAlteredWorkSchedule = async (
  date: string
): Promise<IAlteredWorkSchedule | null> =>
  await Altered_work_schedule.findOne<IAlteredWorkSchedule>({
    date,
  });

const readAlteredBlockedDates = async (
  request: Request,
  response: Response
) => {
  let receivedAlteredBlockedDates: Pick<IAlteredWorkSchedule, "date">[] =
    await Altered_work_schedule.find<IAlteredWorkSchedule>(
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

const deleteAlteredWorkSchedule = async (
  request: Request<{}, {}, Pick<IAlteredWorkSchedule, "date">>,
  response: Response
): Promise<void> => {
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
export default alteredWorkScheduleController;
