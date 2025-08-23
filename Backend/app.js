//iUJPCHVzeTuiNnsv

// app.js

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const router = require('./Routes/VictimRoutes');

// Middleware 
app.use(express.json());
app.use("/victims",router);

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:iUJPCHVzeTuiNnsv@cluster0.bch8cu9.mongodb.net/")
.then(() => 
    console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
    console.log("Server is running on port 5000");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});
