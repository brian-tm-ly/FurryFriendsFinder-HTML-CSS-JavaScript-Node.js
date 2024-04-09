import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { dirname } from "path"; //import dirname from path module
import { fileURLToPath } from "url"; //import fileURLToPath from url module

//Create express app
const app = express();

//Set up port
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
app.use(express.static(path.join(__dirname, "public")));

//Route to get giveaway page
app.get("/giveaway", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "giveaway.html"));
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
    res.redirect("/"); // Redirect to homepage after logout
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
