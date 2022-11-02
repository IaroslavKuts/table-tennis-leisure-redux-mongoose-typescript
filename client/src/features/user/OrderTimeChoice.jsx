import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import uuid from "react-uuid";
import { selectCurrentColor } from "../appSettingsSlice";
import { useGetFilteredTimePeriodsQuery } from "../calendarApiSlice";
import { useGetUserOrdersQuery } from "./ordersSlice";

import PayPal2 from "./PayPal2";

//Component that gives to an user an option to place an order
const OrderTimeChoice = ({ dateOfGame }) => {
  const {
    data,
    isSuccess: filteredTimePeriodsSuccess,
    isError,
    error,
  } = useGetFilteredTimePeriodsQuery(dateOfGame);
  // not performant useGetUserOrdersQuery
  const { data: orders, isSuccess: userOrdersSuccess } =
    useGetUserOrdersQuery();
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
    c,
    time_period_id,
    start_Time,
  }) => {
    if (c === 5) return "Grey";
    // not performant useGetUserOrdersQuery
    if (
      !!Object.entries(orders.entities)
        .map(([id, order]) => order)
        .find(
          ({ date_of_game, start_time }) =>
            date_of_game === dateOfGame && start_time === start_Time
        )
    )
      return "orange";
    return !!chosenTimePeriods.find((el) => time_period_id == el)
      ? "Black"
      : currentColor;
  };

  const handleDisableButton = ({ c, start_Time }) => {
    // not performant useGetUserOrdersQuery
    if (
      !!Object.entries(orders.entities)
        .map(([id, order]) => order)
        .find(
          ({ date_of_game, start_time }) =>
            date_of_game === dateOfGame && start_time === start_Time
        )
    )
      return true;
    return c === 5;
  };

  return (
    <div className="min-w-full flex sm:flex-row  flex-col ">
      {/**left part of a page */}
      <div className="w-full flex flex-col pl-16 lg:w-2/5 text-center">
        <p className="text-4xl font-bold py-4 dark:text-white">Time periods</p>
        {isError && <p>{error}</p>}
        {filteredTimePeriodsSuccess &&
          userOrdersSuccess &&
          data.map(({ start_time, end_time, c, time_period_id }) => {
            return (
              <button
                style={{
                  backgroundColor: handleChosenPeriodBackGroundColor({
                    c,
                    time_period_id,
                    start_Time: start_time,
                  }),
                }}
                name={time_period_id}
                key={uuid()}
                disabled={handleDisableButton({ c, start_Time: start_time })}
                className="w-full shadow-xl shadow-gray-400 p-4 bg-slate-700 text-gray-100 mt-4 hover:scale-105 ease-in duration-300 "
                onClick={(e) => handleClick(e, time_period_id)}
              >
                {`${start_time}-${end_time}`}
              </button>
            );
          })}
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
        <PayPal2 chosenTimePeriods={chosenTimePeriods} />
      </div>
    </div>
  );
};

export default OrderTimeChoice;
