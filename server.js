const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// use JWT auth to secure the api

// api routes
app.use("/routes", require("./src/routes"));

mongoose
  .connect(
    "mongodb+srv://Noctis:noctis@cluster0-uhv24.mongodb.net/test?retryWrites=true&w=majority",
    {
      useCreateIndex: true,
      useNewUrlParser: true
    }
  )
  .then(() => console.log("Connected with DB"));

app.listen(3000, console.log("Server on"));
