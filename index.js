const express = require("express");

const session = require("express-session");
const cookieParser = require('cookie-parser');

const MongoDBStore = require('connect-mongodb-session')(session);

const mongoose = require("mongoose");

const cors = require("cors");

const users = require("./api/users");
const AuthRoute = require("./api/AuthRoute");

require('dotenv').config();

const MONGODB_URI = "mongodb+srv://vx746v3eRvXpCeb4:vx746v3eRvXpCeb4@cluster0.lxut7l9.mongodb.net/auth_db?retryWrites=true&w=majority";

mongoose.connect(
  //dbUrl,
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Database connected successfully")
);

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Database Connected..."));

//for storing session in mongodb
const mongoDBstore = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  databaseName: 'auth_db',
  collection: 'mySessions'
});

mongoDBstore.on('error', function(error) {
  console.log(error);
});

const app = express();

const SESSION_SECRET = "asdadksjflsdjkflaewiur3209905868dfjdodoeljdpow987jdfnkakqi2346dfsdfw";
app.use(session({
  name: 'mycookie',
  //secret: process.env.SESSION_SECRET,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: mongoDBstore,
  cookie:{
    //maxAge: 1000 * 60 * 60 * (1/360),// 0.5 hour
    maxAge: 1000 * 60 * 60 * 24, // one Day
    secure: 'auto'
  }
})); 

app.use(cors());
app.use(express.json());

app.use(cookieParser());

app.use(AuthRoute);
app.use("/api/users", users);


const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Server is running and up at port: ${port}`)
);