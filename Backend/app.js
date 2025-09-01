const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const victimRoutes = require('./Routes/VictimRoutes');

const app = express();

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());

// Ensure uploads dir exists
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Serve uploaded files
app.use('/uploads', express.static(UPLOAD_DIR));

// API routes
app.use('/victims', victimRoutes);

/* ---------- DB ---------- */
const MONGO_URI = 'mongodb+srv://admin:y59JHr1UwxN8ONkF@cluster0.bch8cu9.mongodb.net/';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));
