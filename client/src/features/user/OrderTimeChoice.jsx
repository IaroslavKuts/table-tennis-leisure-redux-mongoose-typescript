import { useState } from "react";
import { useSelector } from "react-redux";
import uuid from "react-uuid";
import { selectCurrentColor } from "../appSettingsSlice";
import {
  useGetTimePeriodsQuery,
  useGetUnavailableTimePeriodsQuery,
} from "../calendarApiSlice";

import PayPal2 from "./PayPal2";
import { selectUser } from "./userSlice";

//Component that gives to an user an option to place an order
const OrderTimeChoice = ({ dateOfGame }) => {
  const {
    data: filteredTimePeriodsData,
    isSuccess: isSuccessFilteredTimePeriods,
    isError: isErrorFilteredTimePeriods,
    error: errorFilteredTimePeriods,
  } = useGetTimePeriodsQuery(dateOfGame, { skip: !dateOfGame });
  const {
    data: unavailableTimePeriodsData,
    isSuccess: isSuccessUnavailableTimePeriods,
    isError: isErrorUnavailableTimePeriods,
    error: errorUnavailableTimePeriods,
  } = useGetUnavailableTimePeriodsQuery(dateOfGame, {
    skip: !dateOfGame,
  });
  const { orders } = useSelector(selectUser)[0];
  const [chosenTimePeriods, setChosenTimePeriods] = useState([]);
  const currentColor = useSelector(selectCurrentColor);

  const handleClick = (e) => {
    const time_period_id = e.target.name;

    if (!!chosenTimePeriods.find((el) => time_period_id == el)) {
      setChosenTimePeriods((prev) =>
        prev.filter((elem) => elem !== time_period_id)
      );
    } else {
      setChosenTimePeriods((prev) => [...prev, time_period_id]);
    }
  };

  const handleChosenPeriodBackGroundColor = ({
    time_period_id,
    start_Time,
  }) => {
    const { unavailableTimePeriods } = unavailableTimePeriodsData;
    if (
      unavailableTimePeriods.findIndex(
        ({ start_time, amount }) => start_time === start_Time && amount === 5
      ) !== -1
    )
      return "Grey";

    if (
      !!orders.find(
        ({ date_of_game, start_time }) =>
          date_of_game === dateOfGame && start_time === start_Time
      )
    )
      return "orange";
    return !!chosenTimePeriods.find((el) => time_period_id == el)
      ? "Black"
      : currentColor;
  };

  const handleDisableButton = ({ start_Time }) => {
    if (
      !!orders.find(
        ({ date_of_game, start_time }) =>
          date_of_game === dateOfGame && start_time === start_Time
      )
    )
      return true;
    // return c === 5;
  };

  return (
    <div className="min-w-full flex sm:flex-row  flex-col ">
      {/**left part of a page */}
      <div className="w-full flex flex-col pl-16 lg:w-2/5 text-center">
        <p className="text-4xl font-bold py-4 dark:text-white">Time periods</p>
        {isSuccessFilteredTimePeriods &&
          isSuccessUnavailableTimePeriods &&
          filteredTimePeriodsData.map(
            ({ start_time, end_time, time_period_id }) => {
              return (
                <button
                  style={{
                    backgroundColor: handleChosenPeriodBackGroundColor({
                      time_period_id,
                      start_Time: start_time,
                    }),
                  }}
                  name={time_period_id}
                  key={uuid()}
                  disabled={handleDisableButton({ start_Time: start_time })}
                  className="w-full shadow-xl shadow-gray-400 p-4 bg-slate-700 text-gray-100 mt-4 hover:scale-105 ease-in duration-300 "
                  onClick={(e) => handleClick(e, time_period_id)}
                >
                  {`${start_time}-${end_time}`}
                </button>
              );
            }
          )}
      </div>

      {/**right part */}
      <div className=" flex flex-col items-center w-full min-h-[50%] lg:w-3/5  ml-3 shadow-gray-400">
        <p className="text-4xl font-bold py-4 dark:text-white text-center">
          Order info
        </p>

        <div className=" w-full  lg:w-3/5  ml-3 shadow-xl shadow-gray-400 rounded-xl p-4 mt-10">
          <div>
            <span className="uppercase px-3 py-1 bg-indigo-200 text-indigo-900 rounded-2xl text-sm">
              {dateOfGame}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white dark:bg- text-slate-900  min-h-[50%] w-full  m-4 p-8 rounded-xl shadow-2xl relative hover:scale-105 ease-in duration-300">
              data about
            </div>
            <button
              style={{ backgroundColor: currentColor }}
              className="w-full p-4 bg-slate-700 text-gray-100 mt-4 hover:bg-slate-500  rounded-full"
              // onClick={handleClickToPayment}
            >
              Place order
            </button>
          </div>
        </div>
        <PayPal2
          chosenTimePeriods={chosenTimePeriods}
          disabled={chosenTimePeriods.length > 0}
          dateOfGame={dateOfGame}
        />
      </div>
    </div>
  );
};

export default OrderTimeChoice;
