const mssql = require("mssql");
require("dotenv").config();

const devConfig = {
  user: "ahmad_mahmood",
  password: "daredevil@1996",
  database: "BugTracker",
  server: "localhost",
  port: 3001,
};

const pool = new mssql.ConnectionPool(devConfig);

// const connectToPool = async () => {
//   try {
//     const client = await mssql.connect(devConfig);
//     console.log("🚀 ~ file: db.js ~ line 20 ~ connectToPool ~ client", client);
//   } catch (error) {
//     console.log("🚀 ~ file: db.js ~ line 24 ~ connectToPool ~ error", error);
//   }
// };
// connectToPool();

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});
module.exports = pool;
