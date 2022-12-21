import sendMail from "./transporter";
import auxillary_functions from "../../auxillary_functions";
import { AggregationResult } from "../../controllers/controllers_interfaces";

export const sendVouchers = async (toUsers: AggregationResult[]) => {
  const result = transformUsersArray(toUsers);
  result.forEach(({ email, dates, amountOfVouchers }) => {
    let text = `Dear user, your orders on dates ${dates}
     were cancelled due to change of schedule. Use these vouchers as compensation: ${Array<number>(
       amountOfVouchers as number
     )
       .fill(0)
       .map((_) => auxillary_functions.generateNumber())}`;
    sendMail(email as string, "Cancellation of orders", text);
  });
};

const transformUsersArray = (users: AggregationResult[]) => {
  return users.map<Record<string, string | number | string[]>>(
    ({ email, orders }) => {
      const datesSet = (orders as Record<string, string>[]).reduce(
        (acc, { date_of_game }) => acc.add(date_of_game),
        new Set<string>()
      );
      return {
        email: email as string,
        dates: Array.from(datesSet),
        amountOfVouchers: (orders as Record<string, string>[]).length,
      };
    }
  );
};

export default { sendVouchers };
