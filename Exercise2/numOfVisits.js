//Before running the code, run the following command to install the required packages
//npm install express
//npm install cookie-parser
//npm install moment-timezone
//Add "type": "module" to package.json to enable ES6 module syntax

import express from "express"; //Require the express module
import cookieParser from "cookie-parser"; //Require the cookie-parser module
import moment from "moment-timezone"; //Require the moment-timezone module
const app = express();
const port = 3000;
const cookieName = "numOfVisits";

//Using cookie-parser middleware
app.use(cookieParser());

//Middleware to count the number of visits
app.use((req, res, next) => {
  //If the cookie is not set, set it to 0
  let visits = parseInt(req.cookies[cookieName]) || 0;
  visits++; //Increment the number of visits
  //Set the cookie to the new value and set the expiration date to 1 day
  res.cookie(cookieName, visits, {
    httpOnly: true,
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  });
  //Store the number of visits in the request object
  req.visits = visits;
  //Continue with the request
  next();
});

//Route to handle the root URL
app.get("/", (req, res) => {
  //If it is the first time that the user is visiting the webpage
  if (req.visits == 1) {
    res.send("Welcome to my webpage! It is the first time that you are here.");
    //If the user has visited the webpage before
  } else {
    const lastVisit = moment().tz("EST").format("ddd MMM DD HH:mm:ss z YYYY");
    if (req.visits == 2) {
      res.send(
        `Hello, this is the ${req.visits}nd time that you are visiting my webpage.<br>
        <b>Last time you visited my webpage was on: ${lastVisit}<b>`
      );
    } else if (req.visits == 3) {
      res.send(
        `Hello, this is the ${req.visits}rd time that you are visiting my webpage.<br>
        <b>Last time you visited my webpage was on: ${lastVisit}<b>`
      );
    } else {
      res.send(
        `Hello, this is the ${req.visits}th time that you are visiting my webpage.<br>
      <b>Last time you visited my webpage was on: ${lastVisit}<b>`
      );
    }
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

//Error handler
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server is running on port ${port}`);
});
