const mongoose = require('mongoose');
const dotenv = require('dotenv');
const redis = require('./config/redis')
dotenv.config({ path: './config.env' });

const app = require('./app');

// Replace password if needed
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful');
  })
  .catch(err => {
    console.error('DB connection error:', err);
  });

  (async () => {
  try {
    const pong = await redis.ping();
    console.log("Redis:", pong);
  } catch (err) {
    console.error("Redis Ping Failed:", err.message);
  }
})();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
