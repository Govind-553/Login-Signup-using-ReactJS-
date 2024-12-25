require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

// Mongoose Schema and Model
const registerSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const REGISTER = mongoose.model("REGISTER", registerSchema);

//........................................API ROUTES...........................................//
// Register API
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = new REGISTER({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

//login API
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await REGISTER.findOne({ email, password });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Failed to login" });
    }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
