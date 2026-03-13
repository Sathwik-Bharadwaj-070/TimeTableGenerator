import { useState, useEffect, useRef } from "react";
import "../App.css";
import html2pdf from "html2pdf.js";

const Random = { shuffle: (array) => {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}};

function TimetableGenerator() {
  const [branch, setBranch] = useState("CSE");
  const [sectionCount, setSectionCount] = useState(3);
  const [subjectInput, setSubjectInput] = useState("OS, CN, AI, ML_Lab, NSS");
  const [teachers, setTeachers] = useState({});
  const [dailySlotConfig, setDailySlotConfig] = useState([7, 7, 7, 7, 7, 4]); 
  const [timetable, setTimetable] = useState(null);

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const timings = ["9:15-10:05", "10:05-10:55", "11:10-12:00", "12:00-12:50", "1:50-2:40", "2:40-3:30", "3:30-4:20"];

  useEffect(() => {
    const subList = subjectInput.split(",").map(s => s.trim()).filter(s => s.length > 1);
    setTeachers(prev => {
      // Create a fresh dictionary that strictly only contains subjects currently in the input
      const updated = {};
      subList.forEach(s => { 
        updated[s] = prev[s] || ""; // Keep old teacher name if it exists, else blank
      });
      return updated;
    });
  }, [subjectInput]);

  const handleDownloadPDF = () => {
    const element = document.getElementById("timetable-results");
    element.classList.add("pdf-mode");
    const opt = {
      margin: 10,
      filename: `${branch}_Timetable.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }
    };
    html2pdf().set(opt).from(element).save().then(() => element.classList.remove("pdf-mode"));
  };

  const generateGlobalSchedule = async () => {
    const subjects = Object.keys(teachers);

    try {
      const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : 'https://timetablegenerator-1-znsh.onrender.com';
      
      const sectionsArr = Array.from(
        { length: sectionCount },
        (_, i) => `Section ${String.fromCharCode(65 + i)}`
      );

      let globalTimetables = {};

      // Generate a unique matrix for each section
      for (const sec of sectionsArr) {
        const res = await fetch(
          `${API_URL}/generate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              subjects,
              days: 6,
              slots: 7
            })
          }
        );
        const data = await res.json();
        globalTimetables[sec] = data.matrix;
      }

      setTimetable(globalTimetables);

    } catch (err) {

    console.error(err);
    alert("Failed to generate timetable");

  }

};

  const renderCell = (row, sIdx) => {
    if (sIdx >= row.length || row[sIdx] === "SKIP") return null;
    const sub = row[sIdx];
    const is2H = row[sIdx + 1] === "SKIP";
    let cls = sub?.toLowerCase().includes("lab") ? "lab-cell" : sub?.toLowerCase().includes("nss") ? "nss-cell" : "standard-cell";
    
    return (
      <td key={sIdx} colSpan={is2H ? 2 : 1} className={cls}>
        <div className="cell-sub">{sub}</div>
        <div className="cell-teacher">{teachers[sub] || "Staff"}</div>
      </td>
    );
  };

  return (
    <div className="app-container">
      <h1 className="main-title">{branch} Timetable Generator</h1>
      <div className="card">
        <div className="input-section">
          <div className="num-inputs-grid">
            <div className="field-group">
                <label className="field-label">Branch</label>
                <input className="branch-input" value={branch} onChange={e => setBranch(e.target.value)} />
            </div>
            <div className="field-group">
                <label className="field-label">Sections</label>
                <input type="number" value={sectionCount} onChange={e => setSectionCount(Number(e.target.value))} />
            </div>
          </div>
          <textarea className="subject-input" value={subjectInput} onChange={e => setSubjectInput(e.target.value)} />
          <div className="teacher-list">
            {Object.keys(teachers).map(sub => (
              <div key={sub} className="teacher-item">
                <span className="sub-badge">{sub}</span>
                <input placeholder="Teacher Name" value={teachers[sub]} onChange={e => setTeachers({...teachers, [sub]: e.target.value})} />
              </div>
            ))}
          </div>
        </div>
        <div className="config-section">
          <label className="field-label">Daily Periods</label>
          <div className="slot-config-grid">
            {dayNames.map((day, i) => (
              <div key={day} className="day-config-item">
                <span>{day}:</span>
                <input type="number" value={dailySlotConfig[i]} onChange={e => {
                  const n = [...dailySlotConfig]; n[i] = Number(e.target.value); setDailySlotConfig(n);
                }} />
              </div>
            ))}
          </div>
          <button className="generate-btn" onClick={generateGlobalSchedule}>Generate All Sections</button>
          
          <div className="secondary-btns">
            {timetable && <button className="pdf-btn" onClick={handleDownloadPDF}>Download PDF</button>}
            <button className="reset-btn" onClick={() => { setTimetable(null); setSubjectInput(""); }}>Reset All</button>
          </div>
        </div>
      </div>

      <div id="timetable-results">
        {timetable && Object.entries(timetable).map(([sec, mat]) => (
            <div key={sec} className="section-block">
            <h2 className="section-title">{branch} - {sec}</h2>
            <div className="table-container">
                <table className="timetable">
                <thead>
                    <tr>
                    <th>DAY</th>
                    <th>P1<br/><small>{timings[0]}</small></th>
                    <th>P2<br/><small>{timings[1]}</small></th>
                    <th className="break-header">BREAK<br/><small>10:55-11:10</small></th>
                    <th>P3<br/><small>{timings[2]}</small></th>
                    <th>P4<br/><small>{timings[3]}</small></th>
                    <th className="lunch-header">LUNCH<br/><small>12:50-1:50</small></th>
                    <th>P5<br/><small>{timings[4]}</small></th>
                    <th>P6<br/><small>{timings[5]}</small></th>
                    <th>P7<br/><small>{timings[6]}</small></th>
                    </tr>
                </thead>
                <tbody>
                    {mat.map((row, di) => (
                    <tr key={di}>
                        <td className="day-label">{dayNames[di]}</td>
                        {renderCell(row, 0)}{renderCell(row, 1)}

                        {di === 0 ? (
                        <td className="break-cell" rowSpan={mat.length}>
                            <div className="vertical-text">
                                BREAK <small className="strip-time">10:55-11:10</small>
                            </div>
                        </td>
                        ) : null}

                        {renderCell(row, 2)}{renderCell(row, 3)}

                        {di === 0 ? (
                        <td className="lunch-cell" rowSpan={mat.length}>
                            <div className="vertical-text">
                                LUNCH <small className="strip-time">12:50-1:50</small>
                            </div>
                        </td>
                        ) : null}

                        {renderCell(row, 4)}{renderCell(row, 5)}{renderCell(row, 6)}
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        ))}
      </div>
    </div>
  );
}
export default TimetableGenerator;