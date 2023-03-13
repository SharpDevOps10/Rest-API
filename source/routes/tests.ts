import {Express} from "express";
import {DBType} from "../dataBase/db";
import {HTTP_STATUSES} from "./courses";

export const addTestRoutes = (app:Express, dataBase : DBType) => {
  app.delete('/__test__/data/' , (req,res) => {
    dataBase.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  });
}