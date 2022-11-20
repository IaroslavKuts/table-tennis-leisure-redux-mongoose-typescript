import { useSelector } from "react-redux";
import uuid from "react-uuid";

import { selectCurrentColor, selectDateOfGame } from "../appSettingsSlice";
import Calendar from "../Calendar";
import {
  useAddBlockedDateMutation,
  useDeleteBlockedDateMutation,
  useGetBlockedDatesQuery,
  useGetTimePeriodsQuery,
  useGetUnavailableTimePeriodsQuery,
} from "../calendarApiSlice";

const DayManagementCertainDate = () => {
  const currentColor = useSelector(selectCurrentColor);
  const dateOfGame = useSelector(selectDateOfGame);
  const [deleteBlockedDate] = useDeleteBlockedDateMutation();
  const [addBlockedDate] = useAddBlockedDateMutation();
  const { data, isSuccess, isError, error, refetch } =
    useGetTimePeriodsQuery(dateOfGame);
  const {
    data: unavailableTimePeriodsData,
    isSuccess: isSuccessUnavailableTimePeriods,
    isError: isErrorUnavailableTimePeriods,
    error: errorUnavailableTimePeriods,
  } = useGetUnavailableTimePeriodsQuery(dateOfGame, {
    skip: !dateOfGame,
  });
  const {
    data: blockedDates = [],
    isSuccess: isSuccessBlockedDates,
    isError: isErrorBlockedDates,
    error: errorBlockedDates,
  } = useGetBlockedDatesQuery();

  const handleTimePeriodBackGroundColor = (start_Time) => {
    const { unavailableTimePeriods } = unavailableTimePeriodsData;
    if (
      unavailableTimePeriods.findIndex(
        ({ start_time, amount }) => start_time === start_Time && amount === 5
      ) !== -1
    )
      return "Grey";

    return currentColor;
  };
  const handleBlockUnBlock = async () => {
    try {
      if (isDayBlocked() && blockedDates.length > 0) {
        await deleteBlockedDate({ date: dateOfGame }).unwrap();
      } else {
        await addBlockedDate({
          date: dateOfGame,
          open: "-----",
          close: "-----",
        }).unwrap();
      }
      refetch();
    } catch (err) {
      console.log(err);
    }
  };
  const isDayBlocked = () => {
    return !!blockedDates.find(({ date }) => date === dateOfGame);
  };

  return (
    <div className="flex flex-row sm:flex-col lg:flex-row">
      {isErrorBlockedDates && <p>{errorBlockedDates.message}</p>}
      {isSuccessBlockedDates && <Calendar />}
      {/**Side component with info day chosen in calendar*/}
      <div className=" min-w-[50%] bg-white text-slate-900 m-4 p-8 rounded-xl shadow-2xl relative">
        <div className="flex flex-row item-">
          <span className="uppercase px-3 py-1 bg-indigo-200 text-indigo-900 rounded-2xl text-sm">
            {dateOfGame}
          </span>
        </div>

        <div className="flex flex-row-2 ">
          <div className="flex flex-col  ml-10">
            <div className="flex flex-row space-x-4">
              <h2>Tables</h2>
              <h2>Time periods</h2>
            </div>
            {isError && <p>{error.message}</p>}
            {isSuccess &&
              isSuccessUnavailableTimePeriods &&
              data.map(({ start_time, end_time }) => {
                return (
                  <div key={uuid()} className="flex flex-row">
                    <p className="w-full p-1 mt-0.5">
                      {unavailableTimePeriodsData.unavailableTimePeriods.find(
                        (el) => el.start_time === start_time
                      )?.amount || 0}
                    </p>
                    <button
                      className="w-full p-1 bg-slate-700 hover:bg-slate-500 text-gray-100 mt-0.5"
                      style={{
                        backgroundColor:
                          handleTimePeriodBackGroundColor(start_time),
                      }}
                    >
                      {`${start_time}-${end_time}`}
                    </button>
                  </div>
                );
              })}
          </div>
          <div className="flex flex-col mx-8">
            {new Date(dateOfGame) > new Date() && (
              <button
                onClick={() => {
                  handleBlockUnBlock();
                }}
                style={{ backgroundColor: currentColor }}
                className="w-36 mx-auto rounded-xl py-4 my-4 text-white hover:border-green-600px-4 ease-in duration-300"
              >
                {isDayBlocked() ? "Unblock day" : "Block day"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayManagementCertainDate;
