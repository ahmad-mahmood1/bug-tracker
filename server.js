const express = require("express");
const app = express();
const path = require("path");
const routes = require("./routes");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const cors = require("cors");
const res = require("express/lib/response");
const mssql = require("mssql");

app.use(express.json()); // middleware to acces req.body
app.use(express.urlencoded({ extended: false }));
//middleware to handle any CORS issues
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, token"
  );
  if (req.method === "options") {
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, PATCH");
    return res.status(200).json({});
  }
  next();
});

app.use(routes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "client/build")));
// }

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/build/index.html"));
// });

// app.get("/", function (req, res) {
//   var sql = require("mssql");

//   // config for your database
//   var config = {
//     user: "ahmad_mahmood",
//     password: "daredevil@1996",
//     server: "127.0.0.1",
//     database: "BugTracker",
//     port: 1433,
//     options: {
//       trustServerCertificate: true
//     }
//   };

//   // connect to your database
//   sql.connect(config, function (err) {
//     if (err) console.log(err);

//     // create Request object
//     var request = new sql.Request();

//     // query to the database and get the records
//     request.query("select * from roles", function (err, recordset) {
//       if (err) console.log(err);

//       // send records as a response
//       res.send(recordset);
//     });
//   });
// });

// app.listen(3001, () => {
//   console.log(`API Server now listening on port 3001`);
// });

const config = {
  user: "ahmad_mahmood",
  password: "daredevil@1996",
  server: "localhost",
  database: "BugTracker",
  options: {
    trustServerCertificate: true,
  },
};

const getRoles = async () => {
  try {
    const pool = await mssql.connect(config);
    const roles = await pool.request().query("SELECT * FROM Roles");
    return roles.recordsets;
  } catch (error) {
    console.log("🚀 ~ file: server.js ~ line 91 ~ getRoles ~ error", error);
  }
};

getRoles();
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`service is running on:: [${port}]`);
});
