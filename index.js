import express, { json } from "express";
import apiRoutes from "./routes/apiRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(json());

app.get("/", async (req, res, next) => {
  res.json({ message: "API running..." });
});

app.use("/api", apiRoutes);

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }
  next(error);
});

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  } else {
    res.status(500).json({
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
