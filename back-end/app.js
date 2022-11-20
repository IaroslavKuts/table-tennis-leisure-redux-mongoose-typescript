require("dotenv").config({ path: `.env.${process.env.NODE_ENV}`.trim() });
const express = require("express");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connectDB } = require("./mongoose_api");
const mongoose = require("mongoose");
const app = express();
const csrfDefence = csrf({ cookie: { httpOnly: true } });
connectDB();
app.use(express.json());
app.use(cookieParser());

const whitelist = process.env.WHITELIST.split(" ");

const corsOptions = {
  origin: (origin, callback) => {
    console.log(origin);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.get(process.env.REACT_APP_CSRF, csrfDefence, function (req, res) {
  // pass the csrfToken to the view
  // res.render('send', { csrfToken: req.csrfToken() })
  res.send({ csrfToken: req.csrfToken() });
});

const routesInitialize = require("./routes");
app.use(routesInitialize);

app.use((request, response, next) => {
  const error = new Error("URL not found.");
  error.status = 404;
  next(error);
});

app.use((error, request, response, next) => {
  response
    .status(error.status || 500)
    .json({ error: { message: error.message } });
});
mongoose.connection.once("open", () => {
  console.log("Connected to mongodb atlas");
  app.listen(5000);
});
