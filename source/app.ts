import express from "express";
import {addCourseRoutes} from "./routes/courses";
import {addTestRoutes} from "./routes/tests";
import {dataBase} from "./dataBase/db";

export const app = express();
export const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

addCourseRoutes(app,dataBase);
addTestRoutes(app,dataBase);