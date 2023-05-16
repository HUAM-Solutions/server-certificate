import express from "express";
import userRoutes from "./userRoutes.js";

const app = express();

app.use("/users", userRoutes);

export default app;
