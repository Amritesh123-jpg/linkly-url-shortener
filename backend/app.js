const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const limiter = require("./middlewares/rateLimiter");
const mongoSanitize = require("./middlewares/mongoSanitize");
const { xss } = require("express-xss-sanitizer");
const hpp = require("hpp");
const compression = require("compression");
const cors = require("cors");

const globalErrorHandler = require("./controller/errorController");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const urlRoute = require("./routes/urlRoute");
const urlController = require("./controller/urlController");

const app = express();

/* ---------------- Security Middleware ---------------- */

app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000",
  "https://linkly-url-shortener.vercel.app",
];

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));


app.use(limiter);

app.use(express.json());

app.use(mongoSanitize);

app.use(xss());

app.use(
  hpp({
    whitelist: ["tag"],
  })
);

app.use(compression());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* ---------------- Routes ---------------- */

app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/url", urlRoute);

app.get("/:shortCode", urlController.redirectUrl);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Linkly Backend is running 🚀",
  });
});

console.log("app.js working");

/* ---------------- Error Handler ---------------- */

app.use(globalErrorHandler);

module.exports = app;