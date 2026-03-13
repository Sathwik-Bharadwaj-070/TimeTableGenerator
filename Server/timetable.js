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

  for (let d = 0; d < days; d++) {

    let row = [];
    let pool = Random.shuffle([...subjects]);

    for (let s = 0; s < slots; s++) {

      if (pool.length === 0) {
        pool = Random.shuffle([...subjects]);
      }

      let subject = pool.shift();

      // prevent horizontal duplicates
      if (s > 0 && subject === row[s - 1]) {

        const swapIndex = Random.randint(0, subjects.length - 1);
        subject = subjects[swapIndex];

      }

      // prevent vertical duplicates
      if (d > 0 && subject === matrix[d - 1]?.[s]) {

        const swapIndex = Random.randint(0, subjects.length - 1);
        subject = subjects[swapIndex];

      }

      let isDoubleSlot = subject.toLowerCase().includes("lab") || subject.toLowerCase().includes("nss");

      // PREVENT CSS GRID BREAKING:
      // Slots 1 and 3 cross the Break (1-2) and Lunch (3-4) periods.
      // We must not start a double slot here, or else colspan crosses the vertical rowspan column.
      if (isDoubleSlot && (s === 1 || s === 3 || s + 1 >= slots)) {
        let singles = subjects.filter(x => !(x.toLowerCase().includes("lab") || x.toLowerCase().includes("nss")));
        if (singles.length > 0) {
          subject = singles[Random.randint(0, singles.length - 1)];
        }
        isDoubleSlot = false; // Even if no single slot exists, force single slot to preserve UI
      }

      if (isDoubleSlot) {

        row.push(subject);
        row.push("SKIP");
        s++;
        
        continue;
      }

      row.push(subject);
    }

    matrix.push(row);
  }

  return matrix;
}

module.exports = { buildTimetable };