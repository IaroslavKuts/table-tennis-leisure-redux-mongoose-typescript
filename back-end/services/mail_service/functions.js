const sendMail = require("./transporter");
const auxillary_functions = require("../../auxillary_functions");

const sendVouchers = async (toUsers) => {
  toUsers = transformUsersArray(toUsers);
  toUsers.forEach(({ email, dates, amountOfVouchers }) => {
    let text = `Dear user, your orders on dates ${dates}
     were cancelled due to change of schedule. Use these vouchers as compensation: ${Array(
       amountOfVouchers
     )
       .fill()
       .map((_) => auxillary_functions.generateNumber())}`;
    sendMail(email, "Cancellation of orders", text);
  });
};

const transformUsersArray = (users) => {
  return users.map(({ email, orders }) => {
    const datesSet = orders.reduce(
      (acc, { date_of_game }) => acc.add(date_of_game),
      new Set()
    );
    return {
      email,
      dates: Array.from(datesSet),
      amountOfVouchers: orders.length,
    };
  });
};

const functions = { sendVouchers };
module.exports = functions;
