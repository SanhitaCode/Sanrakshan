require("dotenv").config();

const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { PrismaClient } = require('@prisma/client'); // 👈 added

const app = require("./app");

// -------------------------------------------------------------
// 1. CORS for Express routes – allow your live frontend
// -------------------------------------------------------------
app.use(cors({
  origin: [
    "https://sanrakshan.netlify.app",
    "http://localhost:5500"
  ],
  credentials: true
}));

// -------------------------------------------------------------
// 2. TEST ENDPOINT – confirms backend is reachable
// -------------------------------------------------------------
app.get("/api/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "Backend is live and reachable!",
    timestamp: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// 3. DATABASE TEST ENDPOINT – verifies PostgreSQL connection
// -------------------------------------------------------------
app.get("/api/test-db", async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const userCount = await prisma.user.count();
    await prisma.$disconnect();
    res.json({ 
      success: true, 
      message: `DB connected! User count: ${userCount}`,
      database: process.env.DATABASE_URL ? 'configured' : 'missing'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// -------------------------------------------------------------
// 4. Your real API routes – add these when router files exist
// -------------------------------------------------------------
// const authRouter = require("./routes/auth");
// const alertsRouter = require("./routes/alerts");
// const sosRouter = require("./routes/sos");
// 
// app.use("/api/auth", authRouter);
// app.use("/api/alerts", alertsRouter);
// app.use("/api/sos", sosRouter);

// Create HTTP server
const server = http.createServer(app);

// Attach socket.io
const io = socketIo(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);
});

// Make io available inside controllers
app.set("io", io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});