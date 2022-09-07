const express = require("express");

const mongoose = require("mongoose");

//const UserRoute = require("./routes/UserRoute");
const cors = require("cors");

const users = require("./api/users");

require('dotenv').config();

//Database
/*
const db = (module.exports = () => {
  try {
    mongoose.connect(
      process.env.DATABASE_URI,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => console.log("Database connected successfully")
    );
  } catch (error) {
    console.log("Database connection failed");
    console.log(error);
  }
});

db();
*/
//const mongoose = require ("mongoose");
//const dbUrl = "mongodb+srv://vx746v3eRvXpCeb4:vx746v3eRvXpCeb4@cluster0.lxut7l9.mongodb.net/auth_db?retryWrites=true&w=majority";

mongoose.connect(
  //dbUrl,
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Database connected successfully")
);

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Database Connected..."));


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", users);

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Server is running and up at port: ${port}`)
);
