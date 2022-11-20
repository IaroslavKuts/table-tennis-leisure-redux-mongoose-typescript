import { alignFrozenEditForm } from "@syncfusion/ej2-react-grids";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { corsMaker } from "../../data/dummy";
import { selectCurrentColor } from "../appSettingsSlice";
import {
  useGetBasicDaysSchedulesQuery,
  useUpdateBasicDayScheduleMutation,
} from "../calendarApiSlice";

//Component that contains week days
// Administrator can change work hours or block/unblock each of days
const DayManagmentCertainDay = () => {
  const currentColor = useSelector(selectCurrentColor);
  const [chosenData, setChosenData] = useState(
    Array(7)
      .fill(0)
      .map((el, i) => ({ day_id: i, open: "", close: "" }))
  );

  const [updateBasicDaySchedule] = useUpdateBasicDayScheduleMutation();
  const {
    data: basicDaysSchedule,
    isSuccess: isSuccessBasicDaysSchedule,
    isError: isErrorBasicDaysSchedule,
    error: errorBasicDaysSchedule,
  } = useGetBasicDaysSchedulesQuery();

  const handleChange = ({ target }, index) => {
    setChosenData((prev) =>
      prev.map((el) =>
        el.day_id === index ? { ...el, [target.name]: target.value } : el
      )
    );
  };

  const handleBlockUnBlock = async (i) => {
    try {
      if (isDayBlocked(i)) {
        await updateBasicDaySchedule({
          day_id: i,
          open: "08:00",
          close: "17:00",
        }).unwrap();
      } else {
        await updateBasicDaySchedule({
          day_id: i,
          open: "-----",
          close: "-----",
        }).unwrap();
      }
    } catch (err) {
      console.log(err);
    }
  };
  const isDayBlocked = (i) => {
    return !!basicDaysSchedule.find(
      ({ day_id, open }) => day_id === i && open === "-----"
    );
  };

  const handleSubmit = async (i) => {
    try {
      await updateBasicDaySchedule({
        day_id: i,
        open: chosenData[i].open || basicDaysSchedule[i].open,
        close: chosenData[i].close || basicDaysSchedule[i].close,
      }).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mt-4 mb-4 flex flex-col items-center  bg-zinc-100  dark:bg-gray-800">
      {/**main box include boxes */}
      <div className="grid md:grid-cols-7 ">
        {isErrorBasicDaysSchedule && <p>{errorBasicDaysSchedule.message}</p>}
        {isSuccessBasicDaysSchedule &&
          basicDaysSchedule.map(({ open, close, day_id, day_name }) => {
            return (
              <div className="flex flex-col items-center bg-white text-slate-900 m-4 p-8 rounded-xl shadow-2xl relative">
                <p className="text-1xl font-bold py-4 flex">{day_name}</p>

                <select
                  value={
                    chosenData[day_id].open || basicDaysSchedule[day_id].open
                  }
                  className="my-4 border-solid "
                  name="open"
                  id="open"
                  onChange={(e) => handleChange(e, day_id)}
                >
                  {open === "-----" ? (
                    <option value={open}>{open}</option>
                  ) : (
                    Array(24)
                      .fill(0)
                      .map((el, i) => {
                        const t = i < 10 ? `0${i}:00` : `${i}:00`;
                        return <option value={t}>{t}</option>;
                      })
                  )}
                </select>
                <select
                  className="my-4"
                  name="close"
                  id="close"
                  value={
                    chosenData[day_id].close || basicDaysSchedule[day_id].close
                  }
                  onChange={(e) => handleChange(e, day_id)}
                >
                  {close === "-----" ? (
                    <option value={close}>{close}</option>
                  ) : (
                    Array(24)
                      .fill(0)
                      .map((el, i) => {
                        const t = i < 10 ? `0${i}:00` : `${i}:00`;
                        return <option value={t}>{t}</option>;
                      })
                  )}
                </select>
                <button
                  style={{ backgroundColor: currentColor }}
                  className="w-full py-4 my-4 text-white hover:scale-105 ease-in duration-300"
                  onClick={() => handleSubmit(day_id)}
                >
                  Submit
                </button>
                <button
                  style={{ backgroundColor: currentColor }}
                  className="w-full  py-4 my-4 text-white hover:scale-105 ease-in duration-300"
                  onClick={() => handleBlockUnBlock(day_id)}
                >
                  {isDayBlocked(day_id) ? "Unblock" : "Block"}
                </button>
              </div>
            );
          })}
        <div className="mt-4 mb-4 flex flex-col items-center  bg-zinc-100  dark:bg-gray-800">
          Tables
        </div>
      </div>
    </div>
  );
};

export default DayManagmentCertainDay;
