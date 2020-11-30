// import dependencies 
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

// create a port 
const PORT = process.env.PORT || 3000;

// create express app
const app = express();

// bring in middleware 
app.use(logger("dev"));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// connect the mongoose database 
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget-tracker", {
//   useNewUrlParser: true,
//   useFindAndModify: false
// });

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/budget-tracker',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);

// access to route folder
app.use(require("./routes/api.js"));

// PORT listener event
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});

