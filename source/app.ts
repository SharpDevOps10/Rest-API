import express from "express";
import {getCourseRoutes} from "./routes/courses";
import {addTestRoutes} from "./routes/tests";
import {dataBase} from "./dataBase/db";

export const app = express();
export const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

const coursesRouter = getCourseRoutes(dataBase);
app.use('/courses',coursesRouter);
addTestRoutes(app,dataBase);