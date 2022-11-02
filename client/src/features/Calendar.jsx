import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  Month,
  Inject,
  Resize,
} from "@syncfusion/ej2-react-schedule";
import "./Calendar.css";

import { Header } from "../common/components";
import { OrderTimeChoice } from "./user";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "./user/userSlice";
import {
  useGetBasicDaysSchedulesQuery,
  useGetBlockedDatesQuery,
  useGetBlockedDaysQuery,
  useGetUnavailableTimePeriodsQuery,
} from "./calendarApiSlice";
import { setDateOfGame } from "./appSettingsSlice";

//Components that represents Calendar which functionality depends on authorities of an user.
// Regular user and administrator will see different content in this component
const Calendar = (props) => {
  const dispatch = useDispatch();
  const { authorities } = useSelector(selectUser)[0];

  const {
    data: unavailableTimePeriods,
    isLoading: isLoadingTimePeriods,
    isSuccess: isSuccessTimePeriods,
    isError: isErrorTimePeriods,
    error: errorTimePeriods,
  } = useGetUnavailableTimePeriodsQuery();
  const {
    data: blockedDates,
    isLoading: isLoadingBlockedDates,
    isSuccess: isSuccessBlockedDates,
    isError: isErrorBlockedDates,
    error: errorBlockedDates,
  } = useGetBlockedDatesQuery();
  // const {
  //   data: blockedDays,
  //   isLoading: isLoadingBlockedDays,
  //   isSuccess: isSuccessBlockedDays,
  //   isError: isErrorBlockedDays,
  //   error: errorBlockedDays,
  // } = useGetBlockedDaysQuery();
  const {
    data: basicDaysSchedule,
    isLoading: isLoadingBasicDaysSchedule,
    isSuccess: isSuccessBasicDaysSchedule,
    isError: isErrorBasicDaysSchedule,
    error: errorBasicDaysSchedule,
  } = useGetBasicDaysSchedulesQuery();

  const editorTemplate = (args) => {
    let dateOfGame;
    if (args?.StartTime) {
      let day = args.StartTime.getDate();
      day = day < 10 ? `0${day}` : day;
      const month = args.StartTime.getMonth() + 1;
      const year = args.StartTime.getYear() + 1900;
      dateOfGame = `${year}-${month}-${day}`;
    }
    return <OrderTimeChoice dateOfGame={dateOfGame} />;
  };
  const onPopupOpen = (args) => {
    if (authorities === 2) {
      args.scheduleObj.cancel = true;
      let day = args.scheduleObj.data.StartTime.getDate();
      day = day < 10 ? `0${day}` : day;
      let month = args.scheduleObj.data.StartTime.getMonth() + 1;
      month = month < 10 ? `0${month}` : month;
      const year = args.scheduleObj.data.StartTime.getYear() + 1900;
      dispatch(setDateOfGame({ dateOfGame: `${year}-${month}-${day}` }));
    } else {
      if (
        args.scheduleObj.data.StartTime <= new Date() ||
        !!basicDaysSchedule.find(
          ({ day_id, open }) =>
            day_id === args.scheduleObj.data.StartTime.getDay() &&
            open === "-----"
        ) ||
        !!blockedDates.find(
          ({ date }) =>
            new Date(date).toLocaleDateString() ===
            args.scheduleObj.data.StartTime.toLocaleDateString()
        )
      ) {
        args.scheduleObj.cancel = true;
      }
    }
  };

  const onRenderCell = (args) => {
    authorities === 1 &&
      args.scheduleObj.date < new Date() &&
      args.scheduleObj.element.classList.add("e-disableCell");

    if (
      !!args.scheduleObj.date &&
      (!!basicDaysSchedule.find(
        ({ day_id, open }) =>
          day_id === args.scheduleObj.date.getDay() && open === "-----"
      ) ||
        !!blockedDates.find(
          ({ date }) =>
            new Date(date).toLocaleDateString() ===
            args.scheduleObj.date.toLocaleDateString()
        ))
    ) {
      args.scheduleObj.element.classList.add("e-disableCell");
    }
  };

  return (
    <div className="min-w-[50%] flex flex-col items-center m-4 md:m-4  p-2 md:p-10 bg-zinc-100 rounded-3xl">
      <Header title="Calendar" />
      {(isLoadingBlockedDates ||
        isLoadingBasicDaysSchedule ||
        isLoadingTimePeriods) && <p>Loading</p>}
      {(isErrorBlockedDates ||
        isErrorBasicDaysSchedule ||
        isErrorTimePeriods) && <p>{"Error"}</p>}
      {isSuccessTimePeriods &&
        isSuccessBlockedDates &&
        isSuccessBasicDaysSchedule && (
          <ScheduleComponent
            editorTemplate={(args) => editorTemplate(args)}
            renderCell={(scheduleObj) => onRenderCell({ scheduleObj })}
            popupOpen={(scheduleObj) => onPopupOpen({ scheduleObj })}
            showQuickInfo={false}
            height="650px"
            eventSettings={{
              dataSource: unavailableTimePeriods.map(
                ({ start_time_data_array, end_time_data_array }) => ({
                  StartTime: new Date(...start_time_data_array),
                  EndTime: new Date(...end_time_data_array),
                })
              ),
            }}
          >
            {/*to see custom view of calendar in header of calendar */}
            <ViewsDirective>
              {/*first option as default have week view too*/}
              {/*show week number in left of cal*/}
              <ViewDirective
                option="Month"
                showWeekNumber={true}
              ></ViewDirective>
              <ViewDirective
                option="Day"
                startHour="9:00"
                endHour="21:00"
              ></ViewDirective>
            </ViewsDirective>
            <Inject services={[Day, Week, Month, Resize]} />
          </ScheduleComponent>
        )}
    </div>
  );
};

export default Calendar;
