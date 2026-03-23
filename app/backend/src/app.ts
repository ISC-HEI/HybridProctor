
import express from "express";
import apiRouter from "./routes/api"
import path from "node:path";
import cookieParser from "cookie-parser";
import middleware from "./middleware";
import fs from "node:fs";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.set("trust proxy", true);

app.use("/api", apiRouter);

app.use(middleware);

const staticDir = path.join(process.cwd(), "pages");
const publicDir = path.join(process.cwd(), "public");

app.use(express.static(staticDir));
app.use(express.static(publicDir));

app.get(/^\/admin\/explorer(\/.*)?$/, (req, res, next) => {
  const explorerPagePath = path.join(staticDir, 'admin', 'explorer.html');
  res.sendFile(explorerPagePath, (err) => {
    if (err) {
      next();
    }
  });
});

app.get(/.*/, (req, res, next) => {
    const requestedPath = req.path;
    const filePath = path.join(staticDir, requestedPath);

    if (path.extname(requestedPath)) {
        return next();
    }

    const sendFile = (filePath: string) => {
        res.sendFile(filePath, err => {
            if (err) {
                next();
            }
        });
    };

    fs.stat(filePath, (err, stats) => {
        if (err) {
            if (err.code === "ENOENT") {
                const htmlFilePath = filePath + ".html";
                fs.stat(htmlFilePath, (err, stats) => {
                    if (err) {
                        if (err.code === "ENOENT") {
                            const fourOhFourPath = path.join(staticDir, "404.html");
                            fs.stat(fourOhFourPath, (err, stats) => {
                                if (err) {
                                    if (err.code === "ENOENT") {
                                        return next();
                                    }
                                    return next(err);
                                }
                                if (stats.isFile()) {
                                    sendFile(fourOhFourPath);
                                } else {
                                    next();
                                }
                            });
                        } else {
                            next(err);
                        }
                    } else if (stats.isFile()) {
                        sendFile(htmlFilePath);
                    } else {
                        next();
                    }
                });
            } else {
                next(err);
            }
        } else {
            if (stats.isDirectory()) {
                const indexFilePath = path.join(filePath, "index.html");
                fs.stat(indexFilePath, (err, stats) => {
                    if (err) {
                        if (err.code === "ENOENT") {
                            next();
                        } else {
                            next(err);
                        }
                    } else if (stats.isFile()) {
                        sendFile(indexFilePath);
                    } else {
                        next();
                    }
                });
            } else {
                sendFile(filePath);
            }
        }
    });
});



export default app;
