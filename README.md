**Age Calculator**

An Age Calculator web application that allows users to calculate their age based on their date of birth. Enter the day, month, and year of your birth, and click Submit to see your age displayed in years, months, and days.

1. Grabbing the DOM nodes
js
Copy
Edit
let inputDate  = document.getElementById("date");
let inputMonth = document.getElementById("month");
let inputYear  = document.getElementById("year");

let button  = document.querySelector(".btn");
let message = document.querySelector(".message");
getElementById and querySelector cache references to your three <input>s, the submit <button>, and the <p> where you’ll print errors or results.

Caching avoids repeated DOM lookups, which is slightly faster.

2. Wiring-up the click handler
js
Copy
Edit
button.addEventListener("click", ageCalculator);
When the user clicks Submit, the browser constructs a MouseEvent and calls your ageCalculator function.

Because you used defer in your <script> tag, you know these elements already exist when you bind this listener.

3. The ageCalculator function body
js
Copy
Edit
const ageCalculator = () => {
  // …
};
An arrow function that:

Reads & parses the inputs

Validates ranges & future dates

Calculates the difference in years, months, and days

Handles “borrowing” days/months correctly

Outputs the result or an error

Let’s unpack it in detail.

3.1 Parsing the inputs
js
Copy
Edit
let birthDate  = parseInt(inputDate.value,  10);
let birthMonth = parseInt(inputMonth.value, 10);
let birthYear  = parseInt(inputYear.value,  10);
.value is always a string.

parseInt(str, 10) converts it to a base-10 integer.

If the user left the field blank or typed non-digits, you’ll get NaN.

Passing 10 forces decimal parsing (avoids old octal quirks).

3.2 Basic validation
js
Copy
Edit
if (
  !birthDate  ||
  !birthMonth ||
  !birthYear  ||
  birthDate  < 1  ||
  birthDate  > 31 ||
  birthMonth < 1  ||
  birthMonth > 12 ||
  birthYear  < 1900 ||
  birthYear  > new Date().getFullYear()
) {
  message.style.color   = "red";
  message.textContent   = "Please enter a valid date, month (1–12), and year.";
  return;
}
!birthDate is true if birthDate is 0, NaN, null, undefined, or "".

Next you check ranges:

Days must be 1–31

Months 1–12

Years 1900–current year

If any test fails, you color the <p> red, show an error, and early return—no further computation.

3.3 Grabbing today’s date and checking for future births
js
Copy
Edit
let today       = new Date();
let todayDate   = today.getDate();             // 1–31
let todayMonth  = today.getMonth() + 1;        // 0–11 +1 → 1–12
let todayYear   = today.getFullYear();         // e.g. 2025

const birth = new Date(birthYear, birthMonth - 1, birthDate);
if (birth > today) {
  message.style.color = "red";
  message.textContent = "Your birthdate cannot be in the future!";
  return;
}
You build a Date for now and for the birth.

JavaScript quirk: months are zero-based (0 = Jan), so you subtract 1 when constructing.

Comparing two Date objects under the hood compares their millisecond timestamps. If the birth is after now, that’s invalid.

3.4 Computing raw year/month differences
js
Copy
Edit
let currentAgeYear  = todayYear  - birthYear;

let currentAgeMonth;
if (todayMonth >= birthMonth) {
  currentAgeMonth = todayMonth - birthMonth;
} else {
  currentAgeYear  -= 1;
  currentAgeMonth = 12 + todayMonth - birthMonth;
}
Years: simple subtraction.

Months:

If we’ve already passed the birth-month this calendar year, just subtract.

Otherwise, borrow one year (decrement currentAgeYear), then count months from last birthday: 12 + (todayMonth - birthMonth).

3.5 “Borrow-and-carry” for days
First you define a helper:

js
Copy
Edit
function getDaysInAMonth(year, month) {
  // Day = 0 rolls back to the last day of the previous month.
  return new Date(year, month, 0).getDate();
};
new Date(y, m, 0) → the “zeroth” day of month m is actually the last day of month m-1.

So getDaysInAMonth(2025, 5) returns 30 (April has 30 days), etc.

Then:

js
Copy
Edit
let currentAgeDate;
if (todayDate >= birthDate) {
  currentAgeDate = todayDate - birthDate;
} else {
  currentAgeMonth--;  // borrow a month
  currentAgeDate = getDaysInAMonth(birthYear, birthMonth)
                   + todayDate - birthDate;
}
If today’s day-of-month ≥ birth day, subtract directly.

Otherwise:

Borrow one month (decrement currentAgeMonth).

Count how many days from your last birth-day to today:

Full length of that birth-month (via getDaysInAMonth)

plus today’s date

minus the birth day

3.6 Final month-borrow check
js
Copy
Edit
if (currentAgeMonth < 0) {
  currentAgeMonth = 11;
  currentAgeYear--;
}
It’s possible that borrowing a day pushed currentAgeMonth negative (e.g. if currentAgeMonth was 0 and you borrowed).

In that rare case, you borrow one more year and set months to 11.

3.7 Displaying the result
js
Copy
Edit
message.textContent = `You are ${currentAgeYear} years, ${currentAgeMonth} months, 
                       ${currentAgeDate} days old`;
You no longer recolor it (it stays your default CSS color).

The template literal prints all three values in a human-readable sentence.

4. Putting it all together: a concrete example
Today: May 6, 2025

Birth: March 25, 1990

Parse → 25, 3, 1990

Validate → good

Compute raw

years = 2025−1990 = 35

months = 5−3 = 2

days = 6−25 = −19

Since days < 0 → borrow month

getDaysInAMonth(1990, 3) = 31 (March has 31 days)

currentAgeMonth = 2−1 = 1

currentAgeDate = 31 + 6 − 25 = 12

Months ≥ 0, so no further borrow.

Result: “You are 35 years, 1 months, 12 days old.”


