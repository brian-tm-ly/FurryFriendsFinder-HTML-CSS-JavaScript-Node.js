import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path"; //import dirname from path module
import { fileURLToPath } from "url"; //import fileURLToPath from url module

const app = express();
const port = 3000;
//get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

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

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server running on port ${port}`);
});
