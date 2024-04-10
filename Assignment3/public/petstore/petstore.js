// Function to display the current date and time
function displayDateTime() {
  let currentDate = new Date(), // Create a new date object
    hours = currentDate.getHours(), // Get the current hour
    minutes = currentDate.getMinutes(), // Get the current minute
    seconds = currentDate.getSeconds(); // Get the current second
  const weekday = [
    // Array to store the names of the days
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const month = [
    // Array to store the names of the months
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // Add a leading zero to the hours, minutes, and seconds if they are less than 10
  hours = hours < 10 ? "0" + hours : hours; // If hours is less than 10, add a leading zero
  minutes = minutes < 10 ? "0" + minutes : minutes; // If minutes is less than 10, add a leading zero
  seconds = seconds < 10 ? "0" + seconds : seconds; // If seconds is less than 10, add a leading zero
  // Get the current day, month, and year
  currentDay = weekday[currentDate.getUTCDay()];
  currentMonth = month[currentDate.getUTCMonth()];
  currentYear = currentDate.getUTCFullYear();
  //Display the current date and time in the format "Day, Month Date, Year, Hours:Minutes:Seconds"
  text = `${currentDay}, ${currentMonth} ${currentYear}, ${hours}:${minutes}:${seconds}`;
  document.getElementById("date").innerHTML = text;
}
// Call the function displayDateTime every 1000 milliseconds
setInterval(displayDateTime, 1000);

// Function to validate the find a pet form
function validateFindForm() {
  //No need to validate pet type as it is drop down list
  //No need to validate suitablility as pet may not be suitable for any choice

  let breed = document.getElementById("breed"); // Get the breed input
  let dom = document.getElementById("findform"); // Get the form dom elemnts
  let genderChecked = false; // Variable to check if a gender choice is checked

  // Get the form dom elements
  for (i = 0; i < dom.gender.length; i++) {
    // Loop through to check if a dom element is checked
    if (dom.gender[i].checked) {
      genderChecked = true; //Set genderChecked to true
      break;
    }
  }

  const pattern = /^[a-zA-Z]+$/; // Regular expression for letters only
  const pattern2 = /^[0-9]+$/; // Regular expression for numbers only
  const pattern3 = /^[a-zA-Z0-9]+$/; // Regular expression for letters and numbers only to check if fields are empty

  //Check if all fields are entered correctly
  if (breed.value.match(pattern) && genderChecked) {
    alert("Thank you for submitting the form.");
    return true;
  } else {
    //Check if any fields are filled out
    if (!breed.value.match(pattern3) && !genderChecked) {
      alert("Please fill out all fields.");
      return false;
    } else {
      //Check if any breed is filled out with incorrect format
      if (!breed.value.match(pattern)) {
        alert("Please fill out the breed field with letters only.");
        return false;
      }
      // Check if gender is selected
      else if (!genderChecked) {
        alert("Please select a gender");
        return false;
      }
    }
  }
}

function validateGiveForm() {
  //No need to validate pet type as it is drop down list
  //No need to validate age as it is drop down list

  let breed = document.getElementById("breed"); // Get the breed input
  let dom = document.getElementById("giveawayform"); // Get the form dom elements
  let description = document.getElementById("description"); // Get the description input
  let ownerFirstName = document.getElementById("firstname"); // Get the owner first name input
  let ownerLastName = document.getElementById("lastname"); // Get the owner last name input
  let ownerEmail = document.getElementById("email"); // Get the owner email input
  let genderChecked = false;

  for (i = 0; i < dom.gender.length; i++) {
    if (dom.gender[i].checked) {
      genderChecked = true;
      break;
    }
  }

  //^[a-zA-Z0-9.!#$%&'*+/=?^_{|}~-]+ is the pattern to match the start of the email that can contain
  // any lowercase, uppercase, numbers, and special characters
  // @[a-zA-Z0-9-]+ is the pattern to match the domain of the email that can contain
  // any lowercase, uppercase, numbers, and hyphens
  // (?:\.[a-zA-Z0-9-]+)*$ is the pattern to match the top level domain of the email that can contain
  // any lowercase, uppercase, numbers, and hyphens. This pattern can be repeated 0 or more times
  const emailPattern =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const pattern = /^[a-zA-Z]+$/; // Regular expression for letters only
  const pattern2 = /^[a-zA-Z0-9]+$/; // Regular expression for letters and numbers only to check if fields are empty

  //Check if all fields are entered correctly
  if (
    breed.value.match(pattern) &&
    genderChecked &&
    description.value.trim() != "" &&
    ownerFirstName.value.match(pattern) &&
    ownerLastName.value.match(pattern) &&
    ownerEmail.value.match(emailPattern)
  ) {
    alert("Thank you for submitting the form.");
    return true;
  } else {
    //Check if any fields are filled out
    if (
      !breed.value.match(pattern2) &&
      !description.value.match(pattern2) &&
      !ownerFirstName.value.match(pattern2) &&
      !ownerLastName.value.match(pattern2) &&
      !ownerEmail.value.match(pattern2)
    ) {
      alert("Please fill out all fields.");
      return false;
    } else {
      //Check if any fields are filled out with incorrect format
      if (!breed.value.match(pattern)) {
        alert("Please fill out the breed field with letters only.");
        return false;
        //Check if a gender is checked
      } else if (!genderChecked) {
        alert("Please select a gender");
        return false;
        //Check if description field is filled out
      } else if (description.value.trim() === "") {
        alert("Please fill out the description.");
        return false;
        //Check if owner first name or last name field is filled out with incorrect format
      } else if (
        !(
          ownerFirstName.value.match(pattern) ||
          ownerLastName.value.match(pattern)
        )
      ) {
        alert(
          "Please fill out the owner first name or last name field with letters only."
        );
        return false;
        //Check if owner email field is filled out with incorrect format
      } else if (!ownerEmail.value.match(emailPattern)) {
        alert("Please fill out the email field with a valid email address.");
        return false;
      }
    }
  }
}
