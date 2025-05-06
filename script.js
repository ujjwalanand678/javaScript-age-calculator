let inputDate = document.getElementById("date");
let inputMonth = document.getElementById("month");
let inputYear = document.getElementById("year");

let button = document.querySelector(".btn");
let message = document.querySelector(".message");

const ageCalculator = () => {
  // Parse input values as numbers
  let birthDate = parseInt(inputDate.value, 10);
  let birthMonth = parseInt(inputMonth.value, 10);
  let birthYear = parseInt(inputYear.value, 10);

  // Basic validation
  if (
    !birthDate ||
    !birthMonth ||
    !birthYear ||
    birthDate < 1 ||
    birthDate > 31 ||
    birthMonth < 1 ||
    birthMonth > 12 ||
    birthYear < 1900 ||
    birthYear > new Date().getFullYear()
  ) {
    message.style.color = "red";
    message.textContent = "Please enter a valid date, month (1–12), and year.";
    return;
  }

  let today = new Date();
  let todayDate = today.getDate();
  let todayMonth = today.getMonth() + 1; // month is zero-based (jan : 0)
  let todayYear = today.getFullYear();

  // Check for future birthdate
  const birth = new Date(birthYear, birthMonth - 1, birthDate);
  if (birth > today) {
    message.style.color = "red";
    message.textContent = "Your birthdate cannot be in the future!";
    return;
  }

  let currentAgeDate, currentAgeMonth, currentAgeYear;
  currentAgeYear = todayYear - birthYear;

  if (todayMonth >= birthMonth) {
    currentAgeMonth = todayMonth - birthMonth;
  } else {
    currentAgeYear = currentAgeYear - 1;
    currentAgeMonth = 12 + todayMonth - birthMonth;
  };

  function getDaysInAMonth(year,month){
    return new Date(year,month,0).getDate();
  };

  if (todayDate >= birthDate) {
    currentAgeDate = todayDate - birthDate;
  } else {
    currentAgeMonth--;
    currentAgeDate = getDaysInAMonth(birthYear,birthMonth) + todayDate - birthDate;
  };

  if (currentAgeMonth < 0){
    currentAgeMonth = 11;
    currentAgeYear--;
  };

  message.style.fontSize = "18px";
  message.textContent = `You are ${currentAgeYear} years, ${currentAgeMonth} months , 
                         ${currentAgeDate} days old.`
};

button.addEventListener("click", ageCalculator);
