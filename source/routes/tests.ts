import express, {} from "express";
import {DBType} from "../dataBase/db";
import {HTTP_STATUSES} from "../utils";


export const getTestRouter = (dataBase : DBType) => {
  const router = express.Router();
  router.delete('/data/' , (req,res) => {
    dataBase.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  });
  return router;
}