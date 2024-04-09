//Before running the code, run the following command to install the required packages
//npm install express
//npm install body-parser
//Add "type": "module" to package.json to enable ES6 module syntax

import express from "express";
import bodyParser from "body-parser";
import path from "path"; //Require the path module
import session from "express-session";
import fs from "fs";
import cookieParser from "cookie-parser"; //Require the cookie-parser module
import moment from "moment-timezone"; //Require the moment-timezone module
import { dirname } from "path"; //import dirname from path module
import { fileURLToPath } from "url"; //import fileURLToPath from url module

//Exercise 1

const app = express();
const port = 3000;
//get the directory name of the current module
let __dirname = dirname(fileURLToPath(import.meta.url));

//set up middleware
app.use(bodyParser.urlencoded({ extended: true }));

//Question 1

//A) Function that takes a positive integer and returns sum of numbers 1 to N
function findSummation(n) {
  let sum = 0;
  //check if n is a number and positive
  if (typeof n !== "number" || n <= 0) {
    return false;
  } else {
    for (let i = 0; i < n; i++) {
      sum += i; //add i to sum
    }
  }
  return sum;
}

//B) Function that capitalizes the first and last letter of each word in a string
function uppercaseFirstandLast(str) {
  const pattern = /[^a-zA-Z\s/g]/; //regex pattern for non-alphabetic, non-white space characters
  let removedChars = str.match(pattern);
  let newStr = str.replace(pattern, ""); //remove non-alphabetic characters
  const words = newStr.split(" "); //split string into words
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    let firstLetter = word.charAt(0).toUpperCase(); //get first letter and capitalize
    let lastLetter = word.charAt(word.length - 1).toUpperCase(); //get last letter and capitalize
    let middle = word.slice(1, word.length - 1); //get middle of word
    words[i] = firstLetter + middle + lastLetter; //concatenate first, middle and last letter
  }
  let result = words.join(" "); //join words back to string
  if (removedChars) {
    result += removedChars.join(""); //add removed characters back to string
  }
  return result; //join words back to string
}

//C) Function that returns the average and median of an array of numbers
function findAverageAndMedian(numbers) {
  const sortedNumbers = numbers.sort(); //sort numbers
  let sum = sortedNumbers.reduce((acc, current) => acc + current);
  let length = sortedNumbers.length;
  let median;
  if (length % 2 === 0) {
    //check if length of array is even
    median = (sortedNumbers[length / 2 - 1] + sortedNumbers[length / 2]) / 2;
  } else {
    median = sortedNumbers[Math.floor(length / 2)];
  }
  const average = sum / length;
  return { average, median };
}

//D) Function that returns the first 4-digit number in the string, otherwise false
function find4Digits(str) {
  const digitsPattern = /\d{4}/; //regex pattern for 4 digits
  const match = str.match(digitsPattern); //match pattern in string
  if (match) {
    return parseFloat(match);
  } else {
    return false;
  }
}

//Route handling

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/findsummation", (req, res) => {
  const n = parseInt(req.body.integer);
  const sumResult = findSummation(n);
  res.send(`<b>Sum of numbers from 1 to ${n}: </b>` + `${sumResult}`);
});

app.post("/uppercasefirstandlast", (req, res) => {
  const str = req.body.string;
  const result = uppercaseFirstandLast(str);
  res.send(`<b>String with first and last letter capitalized: </b>` + result);
});

app.post("/findaverageandmedian", (req, res) => {
  //convert string of numbers to array of numbers
  const numbers = req.body.numbers.split(",").map(Number);
  const result = findAverageAndMedian(numbers);
  res.send(
    `<b>Average: </b>` +
      `${result.average}` +
      `<br>` +
      `<b>Median: </b>` +
      `${result.median}`
  );
});

app.post("/find4digits", (req, res) => {
  const str = req.body.str;
  const result = find4Digits(str);
  result
    ? res.send(`<b>First 4-digit number: </b>` + result)
    : res.send("No 4-digit number found.");
});

//Exercise 2

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

//Route to handle the /cookies URL
app.get("/cookies", (req, res) => {
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

//Exercise 3

function validateForm(str) {
  const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
  if (str.match(phonePattern)) {
    return true;
  } else {
    return false;
  }
}

app.post("/submitex3", (req, res) => {
  let phoneNum = req.body.phone;
  if (validateForm(phoneNum)) {
    res.send("Form submitted successfully");
  } else {
    res.send("Invalid phone number format");
  }
});

//Exercise 4

//Path to petstore directory
const petstoreDir = path.join(__dirname, "public/petstore");

//Path to data directory
const dataDir = path.join(__dirname, "data");

//Path to login file within data directory
const loginFilePath = path.join(dataDir, "login.txt");

//Path to pet file within data directory
const petFilePath = path.join(dataDir, "availablepets.txt");

//Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));

//Configure express app to use sessions
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

//Serve static files from public directory
app.use(express.static(path.join(__dirname, "public/petstore")));

//Route to get giveaway page
app.get("/giveaway", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "public/petstore", "giveaway.html"));
});

//Post request to create account
app.post("/createaccount", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (isUsernameValid(username) && isPasswordValid(password)) {
    if (!isUsernameTaken(username)) {
      fs.appendFileSync(loginFilePath, `${username}:${password}\n`);
      res.send(
        "Account created successfully. Please login with your new account."
      );
    } else {
      res.send("Username is already taken. Please choose another username.");
    }
  } else if (!isUsernameValid(username) && !isPasswordValid(password)) {
    res.send(
      "Username must contain letters and numbers only." +
        " \nPassword must contain at least 4 characters and one letter and one number."
    );
  } else if (!isUsernameValid(username)) {
    res.send("Username must contain letters and numbers only.");
  } else if (!isPasswordValid(password)) {
    res.send(
      "Password must contain at least 4 characters and one letter and one number."
    );
  }
});

//Giveaway post route
app.post("/submitgiveaway", requireLogin, (req, res) => {
  //Get the form data from the request body
  const {
    pettype,
    breed,
    age,
    gender,
    behavior,
    description,
    ownerFN,
    ownerLN,
    email,
  } = req.body;

  //Read existing pet data
  const petData = fs.readFileSync(petFilePath, "utf8").trim();
  //Split the data by newline character and remove any empty lines
  const lines = petData.split("\n").filter((line) => line.trim() != "");

  //Get ID for new pet
  const id = lines.length + 1;

  //Create a string with the form data
  const data = `${id}:${pettype}:${breed}:${age}:${gender}:${behavior}:${description}:${ownerFN}:${ownerLN}:${email}\n`;

  //Append the data to the file
  fs.appendFileSync(petFilePath, data);

  //Send a response
  res.send("Pet submitted successfully");
});

//Login route

app.post("/login", (req, res) => {
  //Get username and password from request body
  const { username, password } = req.body;
  if (validateLogin(username, password)) {
    //Set user session
    req.session.user = username;
    res.redirect("/giveaway");
  } else {
    res.send("Invalid username or password. Please try again.");
  }
});

app.post("/findapet", (req, res) => {
  //Get the form data from the request body
  const { pettype, breed, age, gender, behavior } = req.body;
  //Read the pet data
  const petData = fs.readFileSync(petFilePath, "utf8");
  const lines = petData.split("\n");

  //Parse each line into an animal object and filter based on the form data
  const matchingAnimals = lines
    .map((line) => {
      const [
        id,
        type,
        breed,
        age,
        gender,
        behavior,
        description,
        ownerFN,
        ownerLN,
        email,
      ] = line.split(":");
      return { type, breed, age, gender, behavior };
    })
    .filter((animal) => {
      return (
        (!pettype || animal.type === pettype) &&
        (!breed || animal.breed.toLowerCase() === breed.toLowerCase()) &&
        (!age || animal.age === age) &&
        (!gender || animal.gender.toLowerCase() === gender.toLowerCase()) &&
        (!behavior || animal.behavior.toLowerCase() === behavior.toLowerCase())
      );
    });

  if (matchingAnimals.length > 0) {
    const response = matchingAnimals
      .map((animal) => {
        return `Type: ${animal.type}, Breed: ${animal.breed}, Age: ${animal.age} years, Gender: ${animal.gender}, Suitable with: ${animal.behavior} `;
      })
      .join("\n");
    res.send(response);
  } else {
    res.send("No pets found with the given criteria.");
  }
});

// Logout route
app.get("/logout", (req, res) => {
  // Clear session data to log out user
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/index.html"); // Redirect to petstore homepage after logout
  });
});

//Function to validate username
function isUsernameValid(username) {
  // Regular expression for username to contain letters and numbers only
  const userPattern = /^[a-zA-Z0-9]+$/;
  if (username.match(userPattern)) {
    return true;
  } else {
    return false;
  }
}

//Function to validate both username and password
function validateAccountCreation(username, password) {
  if (isUsernameValid(username) && isPasswordValid(password)) {
    return true;
  } else {
    return false;
  }
}

//Function to validate password
function isPasswordValid(password) {
  //Regular expression for password to contain at least 4 characters and one letter and one number
  const passPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
  if (password.match(passPattern)) {
    return true;
  } else {
    return false;
  }
}

//Function to check if username is taken
function isUsernameTaken(username) {
  //Read the login file
  const loginData = fs.readFileSync(loginFilePath, "utf8");
  //Split the data by newline character to check each line
  const lines = loginData.split("\n");
  //Loop through each line to check if the username is taken
  for (let line of lines) {
    //Split line by colon to get username
    const [existingUsername] = line.split(":");
    if (existingUsername === username) {
      return true;
    }
  }
  return false;
}

function validateLogin(username, password) {
  //Read the login file
  const loginData = fs.readFileSync(loginFilePath, "utf8");
  //Split the data by newline character to check each line
  const lines = loginData.split("\n");
  //Loop through each line to check if the username and password match
  for (let line of lines) {
    //Split line by colon to get username and password
    const [existingUsername, existingPassword] = line.split(":");
    if (existingUsername === username && existingPassword === password) {
      return true;
    }
  }
  return false; // Return false if no match is found
}

//Middleware to require login
function requireLogin(req, res, next) {
  //Check if the user is logged in
  if (req.session.user) {
    next();
  } else {
    //Redirect to login page if not logged in
    res.redirect("/login.html");
  }
}

//Error handler
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server is running on port ${port}`);
});
