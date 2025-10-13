const connectDB = require('./db.js');

(async () => {
  await connectDB();
  process.exit(0); // Exit once connected successfully
})();