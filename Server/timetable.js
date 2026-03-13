const Random = {
  randint: (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min,

  shuffle: (array) => {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
};

function buildTimetable(subjects, days, slots) {
  let matrix = [];
  
  // Track how many times each subject is placed globally across the week
  let globalCounts = {};
  subjects.forEach(s => globalCounts[s] = 0);

  // Helper to determine single vs double subjects
  const isLabOrNSS = (sub) => sub.toLowerCase().includes("lab") || sub.toLowerCase().includes("nss");
  const isNSS = (sub) => sub.toLowerCase().includes("nss");

  for (let d = 0; d < days; d++) {
    let row = [];
    
    // Create a pool for the day of subjects that haven't hit their weekly limit
    // Regular subjects: no limit (or arbitrarily high)
    // Lab / NSS: Max 1 per week
    let validPool = subjects.filter(s => {
      if (isLabOrNSS(s)) return globalCounts[s] < 1;
      return true; // No strict limit for normal subjects
    });
    
    let pool = Random.shuffle(validPool);

    for (let s = 0; s < slots; s++) {

      if (pool.length === 0) {
        // Refill pool
        validPool = subjects.filter(s => {
          if (isLabOrNSS(s)) return globalCounts[s] < 1;
          return true;
        });
        pool = Random.shuffle(validPool);
      }

      // If somehow pool is still empty, fallback to any normal subject
      if (pool.length === 0) {
        let singles = subjects.filter(x => !isLabOrNSS(x));
        pool = Random.shuffle([...singles]);
      }

      let subject = pool.shift();
      let subjectIsDouble = isLabOrNSS(subject);
      let subjectIsNSS = isNSS(subject);

      // Rule: NSS must be strictly AFTER lunch (Lunch is between slot 3 and 4, so slots 4, 5, 6)
      // If we pick NSS before slot 4, it's invalid
      if (subjectIsNSS && s < 4) {
        let singles = subjects.filter(x => !isNSS(x) && !isLabOrNSS(x));
        subject = singles[Random.randint(0, singles.length - 1)];
        // CRITICAL BUGFIX: Update all flags so it behaves strictly like a single subject
        subjectIsDouble = false;
        subjectIsNSS = false;
      }

      // Pre-existing Rule: Prevent double-slots from crossing Break (1) or Lunch (3) or end of day
      if (subjectIsDouble && (s === 1 || s === 3 || s + 1 >= slots)) {
        let singles = subjects.filter(x => !isLabOrNSS(x));
        if (singles.length > 0) {
          subject = singles[Random.randint(0, singles.length - 1)];
        }
        subjectIsDouble = false;
        subjectIsNSS = false;
      }

      // Prevent horizontal duplicates
      if (s > 0 && subject === row[s - 1]) {
        let alternatives = subjects.filter(x => x !== subject && !isLabOrNSS(x));
        if (alternatives.length > 0) subject = alternatives[Random.randint(0, alternatives.length - 1)];
        subjectIsDouble = false;
        subjectIsNSS = false;
      }

      // Prevent vertical duplicates
      if (d > 0 && subject === matrix[d - 1]?.[s]) {
        let alternatives = subjects.filter(x => x !== subject && !isLabOrNSS(x));
        if (alternatives.length > 0) subject = alternatives[Random.randint(0, alternatives.length - 1)];
        subjectIsDouble = false;
        subjectIsNSS = false;
      }

      // Place subject
      row.push(subject);
      globalCounts[subject] = (globalCounts[subject] || 0) + 1;

      if (subjectIsDouble) {
        row.push("SKIP");
        s++;
      }
    }

    matrix.push(row);
  }

  return matrix;
}

module.exports = { buildTimetable };