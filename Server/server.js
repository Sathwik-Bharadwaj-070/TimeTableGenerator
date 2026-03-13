const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { buildTimetable } = require("./timetable");

const app = express();

/* ---------- CORS ---------- */

const cors = require("cors");

app.use(cors());

app.use(express.json());

/* ---------- MongoDB Connection ---------- */

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));

/* ---------- User Model ---------- */

const UserSchema = new mongoose.Schema({
username: String,
email: String,
password: String,
role: {
type: String,
default: "user"
}
});

const User = mongoose.model("User", UserSchema);

/* ---------- Signup ---------- */

app.post("/signup", async (req, res) => {

  try {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Signup failed" });

  }

});

/* ---------- Login ---------- */

app.post("/login", async (req, res) => {

const { email, password } = req.body;

try {


const user = await User.findOne({ email });

if (!user) {
  return res.status(404).json({ message: "User not found" });
}

const match = await bcrypt.compare(password, user.password);

if (!match) {
  return res.status(401).json({ message: "Wrong password" });
}

const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET || "secretkey",
  { expiresIn: "1d" }
);

res.json({
  token,
  role: user.role
});


} catch (err) {


console.error(err);
res.status(500).json({ message: "Login failed" });


}

});

/* ---------- Admin Users ---------- */

app.get("/users", async (req, res) => {

try {


const users = await User.find();
res.json(users);


} catch (err) {


res.status(500).json({ message: "Error fetching users" });


}

});

/* ---------- Update User ---------- */

app.put("/users/:id", async (req, res) => {

const { username, email } = req.body;

try {


await User.findByIdAndUpdate(
  req.params.id,
  { username, email }
);

res.json({ message: "User updated" });


} catch (err) {


res.status(500).json({ message: "Update failed" });


}

});

/* ---------- Delete User ---------- */

app.delete("/users/:id", async (req, res) => {

try {


await User.findByIdAndDelete(req.params.id);

res.json({ message: "User deleted" });


} catch (err) {


res.status(500).json({ message: "Delete failed" });


}

});

/* ---------- Timetable API ---------- */

app.post("/generate", (req, res) => {

try {


const { subjects, days, slots } = req.body;

const matrix = buildTimetable(subjects, days, slots);

res.json({ matrix });


} catch (err) {


res.status(500).json({ message: "Timetable generation failed" });


}

});

/* ---------- Serve Static React Built Files ---------- */
// In production, the client app is built into the ../client/dist folder
app.use(express.static(path.join(__dirname, "../client/dist")));

// For any route not matching an API request, send back the React index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

/* ---------- Start Server ---------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
