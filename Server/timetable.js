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

  const singleSubjects = subjects.filter(s => !isLabOrNSS(s));

  for (let d = 0; d < days; d++) {
    let row = [];
    
    // Create a pool for the day of subjects that haven't hit their weekly limit
    let validPool = subjects.filter(s => {
      if (isLabOrNSS(s)) return globalCounts[s] < 1;
      return true; // No strict limit for normal subjects
    });
    
    let pool = Random.shuffle(validPool);

    for (let s = 0; s < slots; s++) {

      // CSS GRID SAFETY MUST COMES FIRST:
      // If we are at slot 1, 3, or 6 (the slot right before Break, Lunch, or End of Day), 
      // we CANNOT use a double-slot class, otherwise colspan=2 breaks the grid.
      // Similarly, if s < 4, we CANNOT use NSS (must be after lunch).
      let mustBeSingle = (s === 1 || s === 3 || s + 1 >= slots);
      let cannotBeNSS = (s < 4);

      let subject = null;
      let subjectIsDouble = false;

      // Try to find a valid subject from the pool
      for (let i = 0; i < pool.length; i++) {
        let candidate = pool[i];
        let cIsDouble = isLabOrNSS(candidate);
        let cIsNSS = isNSS(candidate);

        if (mustBeSingle && cIsDouble) continue;
        if (cannotBeNSS && cIsNSS) continue;
        if (s > 0 && candidate === row[s - 1]) continue; // prevent horizontal dup
        if (d > 0 && candidate === matrix[d - 1]?.[s]) continue; // prevent vertical dup

        // Found a valid candidate!
        subject = candidate;
        subjectIsDouble = cIsDouble;
        pool.splice(i, 1);
        break;
      }

      // If we couldn't find a perfect candidate from the daily pool, grab one from the singles fallback
      if (!subject) {
        let fallbacks = Random.shuffle([...singleSubjects]);
        for (let fallback of fallbacks) {
           if (s > 0 && fallback === row[s - 1]) continue;
           if (d > 0 && fallback === matrix[d - 1]?.[s]) continue;
           subject = fallback;
           subjectIsDouble = false;
           break;
        }
        // If even fallbacks fail (extremely rare), just take the first single
        if (!subject) {
          subject = singleSubjects[Math.floor(Math.random() * singleSubjects.length)];
          subjectIsDouble = false;
        }
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