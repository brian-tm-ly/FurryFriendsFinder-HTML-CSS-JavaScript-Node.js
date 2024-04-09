//Before running the code, run the following command to install the required packages
//npm install express
//npm install body-parser
//Add "type": "module" to package.json to enable ES6 module syntax

import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path"; //import dirname from path module
import { fileURLToPath } from "url"; //import fileURLToPath from url module

//initialize express app and port
const app = express();
const port = 3000;

//get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

//set up middleware
app.use(bodyParser.urlencoded({ extended: true }));

function validateForm(str) {
  const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
  if (str.match(phonePattern)) {
    return true;
  } else {
    return false;
  }
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", (req, res) => {
  let phoneNum = req.body.phone;
  if (validateForm(phoneNum)) {
    res.send("Form submitted successfully");
  } else {
    res.send("Invalid phone number format");
  }
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server running at ${port}`);
});
