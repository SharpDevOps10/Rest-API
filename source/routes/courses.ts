import {Express, Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types";
import {QueryCoursesModel} from "../models/QueryCoursesModel";
import {CourseViewModel} from "../models/CourseViewModel";
import {URIParamsCourseModel} from "../models/URIParamsCourseModel";
import {CreateCourseModel} from "../models/CreateCourseModel";
import {UpdateCourseModel} from "../models/UpdateCourseModel";
import {CourseType, DBType} from "../dataBase/db";

export const HTTP_STATUSES = {
  SUCCESS_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,
  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
};

export const getViewModel = (dbCourse: CourseType): CourseViewModel => {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
  }
}
export const addCourseRoutes = (app:Express, dataBase : DBType) => {
  app.get('/courses', (req : RequestWithQuery<QueryCoursesModel>,
                       res : Response<CourseViewModel[]>) => {
    let courseSelector = dataBase.courses;
    if (req.query.title) {
      courseSelector = courseSelector
        .filter((c) => c.title.indexOf(req.query.title) > -1 );
    }
    res.json(courseSelector.map(getViewModel));
  });
  app.get('/courses/:id', (req : RequestWithParams<URIParamsCourseModel>,
                           res:Response<CourseViewModel>) => {
    const foundCourse = dataBase.courses.find((uir) => uir.id === +req.params.id);
    if (!foundCourse) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }
    res.json(getViewModel(foundCourse));
  });
  app.get('/', (req, res) => {
    res.json({message :'Back-end'});
  });
  app.post('/courses', (req:RequestWithBody<CreateCourseModel>,
                        res:Response<CourseViewModel>) => {
    if (!req.body.title) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }
    const createdCourse : CourseType = {
      id: +(new Date()),
      title: req.body.title,
      studentsCount : 0
    };
    dataBase.courses.push(createdCourse);
    res.status(HTTP_STATUSES.CREATED_201).json(getViewModel(createdCourse));
  });
  app.delete('/courses/:id' , (req:RequestWithParams<URIParamsCourseModel>,
                               res) => {
    dataBase.courses = dataBase.courses.filter((uir) => uir.id !== +req.params.id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  });
  app.put('/courses/:id', (req:RequestWithParamsAndBody<URIParamsCourseModel,UpdateCourseModel>, res) => {
    if (!req.body.title) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }
    const foundCourse = dataBase.courses.find((uir) => uir.id === +req.params.id);
    if (!foundCourse) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }
    foundCourse.title = req.body.title;
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  });

};