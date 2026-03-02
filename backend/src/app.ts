
import express from "express";
import apiRouter from "./routes/api"
import { runWithRequest } from "./lib/utils/requestContext";

const app = express();

app.use(express.json());

app.set("trust proxy", true);

app.use((req, res, next) => {
  runWithRequest(req, () => next());
});

app.use("/api", apiRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
