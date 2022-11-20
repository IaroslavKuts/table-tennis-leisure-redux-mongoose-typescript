const auxillary_functions = require("../auxillary_functions");
const services = require("../services");
const { User, Order, Abonement, Person } = require("../mongoose_api");
const {
  createAlteredWorkSchedule,
} = require("./alteredWorkScheduleController");
const { updateScheduleOfCertainDay } = require("./basicWorkScheduleController");
// Admin Functions
//Each of them receive data from font-end and then return processed data back to front-end
//These function are of admin usage mostly
const readCustomersAbonements = async (request, response) => {
  const customersAbonements = await User.aggregate([
    {
      $lookup: {
        from: "abonements",
        localField: "abonement",
        foreignField: "_id",
        as: "abonement",
      },
    },
    {
      $group: {
        _id: "$abonement.name_of_abonement",
        y: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        x: {
          $arrayElemAt: ["$_id", 0],
        },
        y: 1,
      },
    },
  ]);
  const total = customersAbonements.reduce((acc, { y }) => acc + y, 0);
  console.log(customersAbonements, "customersAbonements");
  response.json(
    customersAbonements.map(({ x, y }) => {
      const percent = Math.round((y / total) * 100);
      return { x, y, text: `${percent}%` };
    })
  );
};

const readCustomersAges = async (request, response) => {
  const customersAges = await Person.aggregate([
    {
      $addFields: {
        dateISO: {
          $toDate: "$date_of_birth",
        },
      },
    },
    {
      $project: {
        _id: 0,
        age: {
          $dateDiff: {
            endDate: new Date(),
            startDate: "$dateISO",
            unit: "year",
          },
        },
      },
    },
    {
      $group: {
        _id: "$age",
        amount: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        x: "$_id",
        y: "$amount",
      },
    },
  ]);
  console.log(customersAges, "customersAges");
  response.json(
    customersAges.map((el) => {
      return { ...el, text: `Age: ${el.x}  Amount: ${el.y}` };
    })
  );
};

const readProfit = async (request, response) => {
  let {
    start_date = new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .substring(0, 10),
    end_date = new Date().toISOString().substring(0, 10),
  } = request.query;
  console.log(`End ${end_date} Start ${start_date}`);
  const profit = await Order.aggregate([
    {
      $group: {
        _id: "$date_of_game",
        profit: {
          $sum: "$payment",
        },
      },
    },
    {
      $match: {
        $and: [
          {
            _id: {
              $gt: start_date,
            },
          },
          {
            _id: {
              $lt: end_date,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        x: "$_id",
        y: "$profit",
      },
    },
  ]);
  console.log(profit, "profit");
  response.json(profit);
};

const readDaysLoad = async (request, response) => {
  let {
    start_date = new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .substring(0, 10),
    end_date = new Date(),
  } = request.query;
  const daysLoad = await Order.aggregate([
    {
      $group: {
        _id: "$date_of_game",
        daysLoad: {
          $sum: 1,
        },
      },
    },
    {
      $match: {
        $and: [
          {
            _id: {
              $gt: start_date,
            },
          },
          {
            _id: {
              $lt: end_date,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        x: "$_id",
        y: "$daysLoad",
      },
    },
  ]);
  console.log(daysLoad, "daysLoad");
  response.json(daysLoad);
};

const readUsersDataByPayment = async (request, response) => {
  let {
    start_date = new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .substring(0, 10),
    end_date = new Date().toISOString().substring(0, 10),
  } = request.query;
  usersData = await User.aggregate([
    {
      $match: {
        authorities: "user",
      },
    },
    {
      $lookup: {
        from: "orders",
        localField: "orders",
        foreignField: "_id",
        as: "orders",
      },
    },
    {
      $lookup: {
        from: "persons",
        localField: "person",
        foreignField: "_id",
        as: "person",
      },
    },
    {
      $project: {
        _id: 0,
        email: 1,
        "person.first_name": 1,
        "person.surname": 1,
        orders: {
          $filter: {
            input: "$orders",
            as: "item",
            cond: {
              $and: [
                {
                  $gt: ["$$item.date_of_game", start_date],
                },
                {
                  $lt: ["$$item.date_of_game", end_date],
                },
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        email: 1,
        "person.first_name": 1,
        "person.surname": 1,
        profit: {
          $reduce: {
            input: "$orders",
            initialValue: 0,
            in: {
              $sum: ["$$value", "$$this.payment"],
            },
          },
        },
      },
    },
  ]);
  usersData = usersData.map(({ email, person, profit }) => ({
    email,
    profit,
    ...person[0],
  }));
  console.log(usersData, "usersData");
  response.json(usersData);
};

const readUserOrdersByPassport = async (request, response) => {
  const { passport = "" } = request.query;
  const user = await User.aggregate([
    {
      $lookup: {
        from: "persons",
        localField: "person",
        foreignField: "_id",
        as: "person",
      },
    },
    {
      $match: {
        "person.passport": passport,
      },
    },
    {
      $lookup: {
        from: "orders",
        localField: "orders",
        foreignField: "_id",
        as: "orders",
      },
    },
    {
      $unwind: {
        path: "$orders",
      },
    },
    {
      $project: {
        _id: 0,
        date_of_game: "$orders.date_of_game",
        start_time: "$orders.start_time",
        end_time: "$orders.end_time",
        payment: "$orders.payment",
      },
    },
  ]);

  response.json(user || []);
};

const updateCertainDaySchedule = async (request, response) => {
  let { day_id, open, close } = request.body;
  updateScheduleOfCertainDay(day_id, open, close);
  console.log(request.body);
  const dataToProcess = await User.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "orders",
        foreignField: "_id",
        as: "orders",
      },
    },
    {
      $project: {
        _id: 0,
        email: 1,
        orders: {
          $map: {
            input: "$orders",
            as: "item",
            in: {
              _id: "$$item._id",
              start_time: "$$item.start_time",
              end_time: "$$item.end_time",
              date_of_game: "$$item.date_of_game",
              isoDATE: {
                $toDate: "$$item.date_of_game",
              },
              day_id: {
                $subtract: [
                  {
                    $dayOfWeek: {
                      $toDate: "$$item.date_of_game",
                    },
                  },
                  1,
                ],
              },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        email: 1,
        orders: {
          $filter: {
            input: "$orders",
            as: "item",
            cond: {
              $and: [
                {
                  $eq: ["$$item.day_id", day_id],
                },
                {
                  $or: [
                    {
                      $lt: ["$$item.start_time", open],
                    },
                    {
                      $gt: ["$$item.start_time", close],
                    },
                  ],
                },
                {
                  $gt: ["$$item.isoDATE", new Date()],
                },
              ],
            },
          },
        },
      },
    },
    {
      $match: {
        orders: {
          $ne: [],
        },
      },
    },
  ]);

  if (dataToProcess.length > 0) {
    const ordersIds = dataToProcess
      .flatMap(({ orders }) => orders)
      .map(({ _id }) => _id);

    services.sendVouchers(dataToProcess);

    await Order.deleteMany({ _id: { $in: ordersIds } });
  }

  response.json({ message: "Day schedule was added successfully" });
};

const createCertainDateSchedule = async (request, response) => {
  const { date, open, close } = request.body;
  createAlteredWorkSchedule(date, open, close);
  const dataToProcess = await User.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "orders",
        foreignField: "_id",
        as: "orders",
      },
    },
    {
      $project: {
        _id: 0,
        email: 1,
        orders: {
          $filter: {
            input: "$orders",
            as: "item",
            cond: {
              $and: [
                {
                  $eq: ["$$item.date_of_game", date],
                },
                {
                  $or: [
                    {
                      $lt: ["$$item.start_time", open],
                    },
                    {
                      $gt: ["$$item.start_time", close],
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    },
    {
      $match: {
        orders: {
          $ne: [],
        },
      },
    },
  ]);
  if (dataToProcess.length > 0) {
    const ordersIds = dataToProcess
      .flatMap(({ orders }) => orders)
      .map(({ _id }) => _id);

    services.sendVouchers(dataToProcess);

    await Order.deleteMany({ _id: { $in: ordersIds } });
  }

  response.json({ message: "Altered schedule was added successfully" });
};

const adminController = {
  readCustomersAbonements,
  readCustomersAges,
  readProfit,
  readDaysLoad,
  readUsersDataByPayment,
  readUserOrdersByPassport,
  updateCertainDaySchedule,
  createCertainDateSchedule,
};
module.exports = adminController;
