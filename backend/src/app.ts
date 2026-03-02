
import express from "express";
import apiRouter from "./routes/api"
import { runWithRequest } from "./lib/utils/requestContext";
import path from "node:path";

const app = express();

app.use(express.json());

app.set("trust proxy", true);

app.use((req, res, next) => {
  runWithRequest(req, () => next());
});

app.use("/api", apiRouter);

const staticDir = path.join(process.cwd(), "pages");
app.use(express.static(staticDir));

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
