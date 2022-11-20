const paypal = require("@paypal/checkout-server-sdk");
require("dotenv").config();
const { Time_periods } = require("../../mongoose_api");
const {
  SandboxEnvironment,
} = require("@paypal/checkout-server-sdk/lib/core/paypal_environment");
// const Evironment = ""? paypal.core.LiveEnvironment: paypal.core.SandboxEnvironment // меняется на основании инфы в .env

//PayPal Sandbox back-end order processing
const paypalClient = new paypal.core.PayPalHttpClient(
  new SandboxEnvironment(
    process.env.REACT_APP_PAYPAL_CLIENT_ID,
    process.env.REACT_APP_PAYPAL_CLIENT_SECRET
  )
);

const processPayPalOrder = async (request, response) => {
  const { chosenTimePeriods } = request.body;

  const chosenTimePeriodsFullInfo = await Time_periods.find(
    {
      time_period_id: { $in: chosenTimePeriods },
    },
    "-_id -time_period_id"
  );
  const totalPrice = chosenTimePeriodsFullInfo.reduce(
    (acc, { price }) => acc + price,
    0
  );
  const result = new paypal.orders.OrdersCreateRequest();
  result.prefer("return=representation");
  result.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "ILS",
          value: totalPrice,
          breakdown: {
            item_total: { currency_code: "ILS", value: totalPrice },
          },
        },
        items: chosenTimePeriodsFullInfo.map(
          ({ price, start_time, end_time }) => {
            return {
              name: `${start_time} - ${end_time}`,
              unit_amount: { currency_code: "ILS", value: price },
              quantity: 1,
            };
          }
        ),
      },
    ],
  });
  // result.headers["PayPal-Mock-Response"] = {
  //   mock_application_codes: "CANNOT_BE_ZERO_OR_NEGATIVE",
  // };
  console.log(result);
  try {
    const order = await paypalClient.execute(result);
    console.log(order);
    response.json({ id: order.result.id });
  } catch (e) {
    response.status(500).json({ error: e.message });
  }
};

const payPal = { processPayPalOrder };
module.exports = payPal;
