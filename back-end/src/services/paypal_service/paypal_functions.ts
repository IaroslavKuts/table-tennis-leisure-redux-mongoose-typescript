import paypal from "@paypal/checkout-server-sdk";
import mongoose_api from "../../mongoose_api";
const Time_periods = mongoose_api.Time_periods;
import { ITimePeriods } from "../../mongoose_api/mongo_models_interfaces";
import { Request, Response } from "express";
import { SandboxEnvironment } from "@paypal/checkout-server-sdk/lib/core/paypal_environment";
import { RequestBodyOrQuery } from "../../controllers/controllers_interfaces";
// const Evironment = ""? paypal.core.LiveEnvironment: paypal.core.SandboxEnvironment // меняется на основании инфы в .env

//PayPal Sandbox back-end order processing
const paypalClient = new paypal.core.PayPalHttpClient(
  new SandboxEnvironment(
    process.env.REACT_APP_PAYPAL_CLIENT_ID as string,
    process.env.REACT_APP_PAYPAL_CLIENT_SECRET as string
  )
);

const processPayPalOrder = async (
  request: Request<{}, {}, RequestBodyOrQuery>,
  response: Response
) => {
  const { chosenTimePeriods } = request.body;

  const chosenTimePeriodsFullInfo = await Time_periods.find<ITimePeriods>(
    {
      time_period_id: { $in: chosenTimePeriods },
    },
    "-_id -time_period_id"
  );
  const totalPrice =
    chosenTimePeriodsFullInfo.reduce((acc, { price }) => acc + price, 0) + "";
  const result = new paypal.orders.OrdersCreateRequest();
  result.prefer("return=representation");
  result.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "ILS",
          value: totalPrice,
          // breakdown: {
          //   item_total: { currency_code: "ILS", value: totalPrice },
          // },
        },
        items: chosenTimePeriodsFullInfo.map(
          ({ price, start_time, end_time }) => {
            return {
              name: `${start_time} - ${end_time}`,
              unit_amount: { currency_code: "ILS", value: price + "" },
              quantity: 1 + "",
              category: "DIGITAL_GOODS",
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
    if (e instanceof Error) response.status(500).json({ error: e.message });
  }
};

export default { processPayPalOrder };
