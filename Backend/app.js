const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// ---- Routes & Controllers ----
const victimRoutes = require("./Routes/VictimRoutes");
const aidRoutes = require("./Routes/AidRoutes");
const damageRoutes = require("./Routes/DamageRoutes");
const { listAids } = require("./Controllers/AidController");
const damageCtrl = require("./Controllers/DamageController");

// ---- Config ----
const PORT = 5000;
const FRONTEND = "http://localhost:3000";

// **Use the proper MongoDB cluster connection string from Atlas**
const MONGO_URI =
  "mongodb+srv://admin:y59JHr1UwxN8ONkF@cluster0.bch8cu9.mongodb.net/safezone?retryWrites=true&w=majority";

// ---- App ----
const app = express();

// ---- Middleware ----
app.use(
  cors({
    origin: [FRONTEND, "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ---- Static Uploads ----
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const DAMAGE_UPLOAD_DIR = path.join(UPLOAD_DIR, "damage");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(DAMAGE_UPLOAD_DIR)) fs.mkdirSync(DAMAGE_UPLOAD_DIR, { recursive: true });
app.use("/uploads", express.static(UPLOAD_DIR));

// ---- Health Check ----
app.get("/health", (_req, res) => {
  const healthStatus = {
    ok: true,
    service: "backend",
    time: new Date().toISOString(),
    mongodb: {
      connected: isConnected,
      state: mongoose.connection.readyState,
      host: mongoose.connection.host || "unknown",
      port: mongoose.connection.port || "unknown"
    },
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };
  
  const statusCode = isConnected ? 200 : 503;
  res.status(statusCode).json(healthStatus);
});

// ---- MongoDB Connection Middleware ----
app.use((req, res, next) => {
  // Skip health check and static files
  if (req.path === '/health' || req.path.startsWith('/uploads')) {
    return next();
  }
  
  if (!isConnected) {
    return res.status(503).json({
      ok: false,
      message: "Database connection unavailable. Please try again later.",
      error: "SERVICE_UNAVAILABLE"
    });
  }
  
  next();
});

// ---- Routes ----
app.use("/victims", victimRoutes);
app.use("/aid", aidRoutes);
app.use("/damage", damageRoutes);

// Aliases
app.get("/aids", listAids);
app.get("/damages", damageCtrl.listDamages);

// ---- 404 Handler ----
app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Route not found" });
});

// ---- Error Handler ----
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    ok: false,
    message: err.message || "Server error",
  });
});

// ---- MongoDB Connection Configuration ----
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds timeout for server selection
  socketTimeoutMS: 45000, // 45 seconds timeout for socket operations
  connectTimeoutMS: 30000, // 30 seconds timeout for initial connection
  maxPoolSize: 10, // Maximum number of connections in the pool
  minPoolSize: 5, // Minimum number of connections in the pool
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  retryWrites: true,
  retryReads: true,
  // Handle DNS resolution issues
  family: 4, // Force IPv4 to avoid IPv6 DNS issues
};

// ---- MongoDB Connection Function ----
let isConnected = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 5000; // 5 seconds

async function connectToMongoDB() {
  try {
    console.log("🔄 Attempting to connect to MongoDB...");
    
    await mongoose.connect(MONGO_URI, mongooseOptions);
    
    isConnected = true;
    reconnectAttempts = 0;
    console.log("✅ Successfully connected to MongoDB Atlas");
    
    // Set up connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error("❌ MongoDB connection error:", err.message);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn("⚠️ MongoDB disconnected");
      isConnected = false;
      attemptReconnection();
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log("🔄 MongoDB reconnected");
      isConnected = true;
      reconnectAttempts = 0;
    });
    
    // Start the server only after successful connection
    startServer();
    
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    
    if (error.name === 'MongoServerSelectionError' || error.name === 'MongoNetworkError') {
      console.error("🌐 Network/DNS issue detected. Attempting reconnection...");
      attemptReconnection();
    } else {
      console.error("⚠️ Check your cluster name, credentials, and IP whitelist in MongoDB Atlas");
      process.exit(1);
    }
  }
}

// ---- Reconnection Logic ----
async function attemptReconnection() {
  if (reconnectAttempts >= maxReconnectAttempts) {
    console.error(`❌ Max reconnection attempts (${maxReconnectAttempts}) reached. Exiting...`);
    process.exit(1);
  }
  
  reconnectAttempts++;
  console.log(`🔄 Reconnection attempt ${reconnectAttempts}/${maxReconnectAttempts} in ${reconnectDelay/1000} seconds...`);
  
  setTimeout(async () => {
    try {
      await mongoose.connect(MONGO_URI, mongooseOptions);
      isConnected = true;
      reconnectAttempts = 0;
      console.log("✅ Successfully reconnected to MongoDB");
    } catch (error) {
      console.error(`❌ Reconnection attempt ${reconnectAttempts} failed:`, error.message);
      attemptReconnection();
    }
  }, reconnectDelay);
}

// ---- Start Server Function ----
function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  });
}

// ---- Initialize Connection ----
connectToMongoDB();

// ---- Global Error Listeners ----
process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
});
