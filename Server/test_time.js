const { buildTimetable } = require("./timetable");

const subjects = ["OS", "CN", "AI", "ML_Lab", "NSS"];
const days = 6;
const slots = 7;

for (let i = 0; i < 3; i++) {
  console.log(`\n\n--- SECTION ${i} ---`);
  const matrix = buildTimetable(subjects, days, slots);
  
  matrix.forEach(row => {
    console.log(row.join(" \t | \t "));
  });

  // Calculate occurrences
  let counts = {};
  matrix.forEach(row => {
    row.forEach(cell => {
      if (cell !== "SKIP") counts[cell] = (counts[cell] || 0) + 1;
    });
  });
  console.log("Counts:", counts);
}
