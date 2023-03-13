import express from "express";
import {getCourseRouter} from "./routes/courses";
import {getTestRouter} from "./routes/tests";
import {dataBase} from "./dataBase/db";

export const app = express();
export const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

const coursesRouter = getCourseRouter(dataBase);
app.use('/courses',coursesRouter);
getTestRouter(app,dataBase);