const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/leads", require("./routes/leadRoutes"));
const clientRoutes = require("./routes/ClientRoutes");
app.use("/clients", clientRoutes);
app.use("/users", require("./routes/userRoutes"));
app.use("/properties", require("./routes/propertyRoutes"));
app.use("/deals", require("./routes/dealRoutes"));

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/webhooks", require("./routes/webhookRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

app.get("/", (req, res) => {
  res.send("backend working");
});

app.listen(5001, () => {
  console.log("running in 5001");
});