const { buildTimetable } = require("./timetable");

const subjects = ["OS", "CN", "AI", "ML_Lab", "NSS", "java"];
const days = 6;
const slots = 7;

let errors = 0;

for (let i = 0; i < 100000; i++) {
  const matrix = buildTimetable(subjects, days, slots);
  
  matrix.forEach((row, rowIndex) => {
    if (row.length !== 7) {
      console.error(`ERROR in Section ${i}, Row ${rowIndex}: array length is ${row.length}. Array: ${row.join(" | ")}`);
      errors++;
    }
  });
}

if (errors === 0) {
  console.log("SUCCESS! Ran 100,000 timetables, 600,000 days. No overflow CSS arrays found.");
} else {
  console.log(`FAILED. Found ${errors} CSS overflow bugs.`);
}
