
import express from "express";
import apiRouter from "./routes/api"
import { runWithRequest } from "./lib/utils/requestContext";
import path from "node:path";
import cookieParser from "cookie-parser";
import middleware from "./middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.set("trust proxy", true);

app.use((req, res, next) => {
  runWithRequest(req, () => next());
});

app.use("/api", apiRouter);

app.use(middleware);

const staticDir = path.join(process.cwd(), "pages");
app.use(express.static(staticDir));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

export default app;
