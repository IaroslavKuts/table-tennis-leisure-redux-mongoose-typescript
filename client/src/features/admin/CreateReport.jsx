import { useEffect, useState } from "react";

import { Table, ColorMapping, Bar, Pyramid, Doughnut } from "./Charts";
import { userGrid, ordersGrid, handleForm } from "../../data/dummy";
import uuid from "react-uuid";
import { useSelector } from "react-redux";
import { selectCurrentColor } from "../appSettingsSlice";
import {
  useGetProfitQuery,
  useGetDaysLoadQuery,
  useGetProfitByUsersQuery,
  useGetUsersAgesQuery,
  useGetUsersAbonementsQuery,
  useGetUserOrdersByPassportQuery,
} from "./createReportSlice";

//Component that helps to create different reports
const CreateReport = () => {
  const [{ start_date, end_date }, setDateRange] = useState({
    start_date: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .substring(0, 10),
    end_date: new Date().toISOString().substring(0, 10),
  });

  const [{ passport }, setPassport] = useState({ passport: "" });
  // my awful queries, but serves the purpose
  const queryArray = [
    useGetProfitQuery,
    useGetDaysLoadQuery,
    useGetProfitByUsersQuery,
    useGetUserOrdersByPassportQuery,
    useGetUsersAgesQuery,
    useGetUsersAbonementsQuery,
  ].map((query, i) => {
    if (i < 3) return query({ start_date, end_date });
    if (i === 3) return query(passport);
    if (i > 3) return query();
  });

  const currentColor = useSelector(selectCurrentColor);

  const [buttonsArray, setButtonsArray] = useState([
    { show: false, name: "Calculate profit" },
    { show: false, name: "Days' load" },
    { show: false, name: "Display profit gained from users" },
    { show: false, name: "Display users' orders by passport" },
    { show: false, name: "Display customers' ages" },
    { show: false, name: "Display users' abonements" },
  ]);

  useEffect(() => {
    setButtonsArray((prev) =>
      prev.map((el, i) => {
        const { name, show } = el;
        return {
          name,
          show,
          btn: (
            <>
              <div key={uuid()} className="flex flex-col md:flex-row ">
                <button
                  style={{ backgroundColor: currentColor }}
                  className="w-36 h-16 p-1 text-gray-100 mt-0.5 mx-1 hover:scale-105 ease-in duration-300"
                  onClick={(_) => {
                    handleShow(i);
                  }}
                >
                  {name}
                </button>
              </div>
            </>
          ),
        };
      })
    );
  }, [currentColor]);

  function handleSubmit(e) {
    e.preventDefault();
    const formProps = handleForm(e);
    formProps?.start_date && setDateRange(formProps);
    formProps?.passport && setPassport(formProps);
  }

  function handleShow(index) {
    setButtonsArray((prev) =>
      prev.map((el, i) => {
        return { ...el, show: index === i ? true : false };
      })
    );
  }

  return (
    <div className="flex flex-col m-2 md:m-10 mt-24 p-2 md:p-10 bg-zinc-100 rounded-3xl">
      <div className="flex flex-row">
        {/**Start-end date */}
        <form className="flex flex-row md:flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-col w-29 m-2">
            <label htmlFor="start_date">Start date</label>
            <input
              type="date"
              name="start_date"
              id="start_date"
              className="border bg-gray-200 p-2"
            />
          </div>
          <div className="flex flex-col w-29 m-2">
            <label htmlFor="end_date">End date</label>
            <input
              type="date"
              name="end_date"
              id="end_date"
              className="border  bg-gray-200 p-2"
            />
          </div>
          <button type="submit">Submit</button>
        </form>

        {buttonsArray.map(({ btn }) => btn)}
      </div>
      {queryArray.every(({ isLoading }) => isLoading) && <p>Loading</p>}
      {[Bar, ColorMapping, Table, Table, Pyramid, Doughnut].map(
        (Component, i) => {
          if (i === 2)
            return (
              <>
                {buttonsArray[i].show && queryArray[i].isSuccess && (
                  <Component dataToShow={queryArray[i].data} grid={userGrid} />
                )}
              </>
            );
          if (i === 3)
            return (
              <>
                {buttonsArray[i].show && queryArray[i].isSuccess && (
                  <>
                    <div className="flex flex-col md:flex-row flex justify-center">
                      <form
                        className="flex flex-col w-30 m-2"
                        onSubmit={handleSubmit}
                      >
                        <label htmlFor="passport">Passport</label>
                        <input
                          type="number"
                          id="passport"
                          name="passport"
                          className="border  bg-gray-200 p-2"
                        />
                        <button type="submit"> Submit</button>
                      </form>
                    </div>
                    <Component
                      dataToShow={queryArray[i].data}
                      grid={ordersGrid.filter(
                        (el) => el.field !== "payment_status"
                      )}
                    />
                  </>
                )}
              </>
            );
          return (
            <>
              {buttonsArray[i].show && queryArray[i].isSuccess && (
                <Component dataToShow={queryArray[i].data} />
              )}
            </>
          );
        }
      )}
    </div>
  );
};

export default CreateReport;
