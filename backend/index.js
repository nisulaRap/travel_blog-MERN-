require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const upload = require("./multer");
const fs = require("fs");
const path = require("path");

const { authenticateToken } = require("./utilities");

const User = require("./models/user_model");
const TravelBlog = require("./models/travelBlog_model");

mongoose.connect(config.connectionString);

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// Create Account
app.post("/create-account", async (req,res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(400).json({ error: true, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        fullName,
        email,
        password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    );

    return res.status(201).json({
        error: false,
        user: { fullName: user.fullName, email: user.email },
        accessToken,
        message: "Registration Successfil",
    });
});

// Login
app.post("/login", async (req,res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ email });
    if(!user){
        return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({ message: "Invalid Password" });
    }

    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    );

    return res.json({
        error: false,
        message: "Login Successful",
        user: { fullName: user.fullName, email: user.email },
        accessToken,
    });
});

// Get User
app.get("/get-user", authenticateToken, async (req,res) => {
   const { userId } = req.user;
   
   const isUser = await User.findOne({ _id: userId });

   if(!isUser){
    return res.sendStatus(401);
   }

   return res.json({
    user: isUser,
    message: "",
   });
});

// Add Travel Blog
app.post("/add-travel", authenticateToken, async (req,res) => {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user

    // Validate required fields
    if(!title || !story || !visitedLocation || !imageUrl || !visitedDate){
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    // Convert visitedDate from milliseconds to Date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try{
        const travelStory = new TravelBlog({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate: parsedVisitedDate,
        });

        await travelStory.save();
        res.status(201).json({ story: travelStory, message: 'Added Successfully' });
    }catch(error){
        res.status(400).json({ story: true, message: error.message });
    }
});

// Get All Travel Blog
app.get("/get-all-blogs", authenticateToken, async (req,res) => {
    const { userId } = req.user;

    try{
        const travelStories = await TravelBlog.find({ userId: userId }).sort({
            isFavourite: -1,
        });
        res.status(200).json({ stories: travelStories });
    }catch(error){
        res.status(500).json({ error: true, message: error.message });
    }
});

// Route to handle image upload
app.post("/image-upload", upload.single("image"), async (req,res) => {
    try{
        if(!req.file){
            return res.status(400).json({ error: true, message: "No image uploaded" });
        }

        const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;

        res.status(201).json({ imageUrl });
    }catch(error){
        res.status(500).json({ error: true, message: error.message });
    }
});

// Serve static files from the uploads and assets directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(8000);
module.exports = app;