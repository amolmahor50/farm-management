require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const dashboardRoutes = require("./routes/dashboard");
const expenseRoutes = require("./routes/expense");
const yieldRoutes = require("./routes/yield");
const loanRoutes = require("./routes/loan");
const taskRoutes = require("./routes/task");
const notificationRoutes = require("./routes/notification");
const reportRoutes = require("./routes/report");
const paymentRoutes = require("./routes/payment");
const marketRoutes = require("./routes/market");
const forumRoutes = require("./routes/forum");
const knowledgeRoutes = require("./routes/knowledge");
const expertRoutes = require("./routes/expert");
const insuranceRoutes = require("./routes/insurance");
const qrRoutes = require("./routes/qr");
const aiRoutes = require("./routes/ai");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Farm Management API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      user: "/api/user",
      dashboard: "/api/dashboard",
      expense: "/api/expenses",
      yield: "/api/yields",
      loan: "/api/loans",
      task: "/api/tasks",
      notification: "/api/notifications",
      report: "/api/reports",
      payment: "/api/payments",
      market: "/api/market",
      forum: "/api/forum",
      knowledge: "/api/knowledge",
      expert: "/api/experts",
      insurance: "/api/insurance",
      qr: "/api/qr",
      ai: "/api/ai",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/yields", yieldRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/experts", expertRoutes);
app.use("/api/insurance", insuranceRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/ai", aiRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;
