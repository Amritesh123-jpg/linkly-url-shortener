const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const redis = require("../config/redis");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,

  message: {
    status: "fail",
    message: "Too many requests from this IP, please try again after 15 minutes",
  },

  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
});

module.exports = limiter;