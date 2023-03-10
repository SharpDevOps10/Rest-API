import express , {Request, Response} from 'express';
export const app = express();
const port = 3003;
type CourseType = {
  id : number,
  title : string,
};
export const HTTP_STATUSES = {
  SUCCESS_200 : 200,
  CREATED_201 : 201,
  NO_CONTENT_204 : 204,
  BAD_REQUEST_400 : 400,
  NOT_FOUND_404 : 404,
};
const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

const dataBase : {courses : CourseType[]} = {
  courses:[
    {id : 1, title : 'front-end'},
    {id : 2, title: 'back-end'},
    {id : 3, title: 'automation qa'},
    {id : 4, title: 'devops'},
  ]
};
app.get('/courses', (req : Request <{},{},{},{title: string}>,
                     res : Response<CourseType[]>) => {
  let courseSelector = dataBase.courses;
  if (req.query.title) {
    courseSelector = courseSelector
      .filter((c) => c.title.indexOf(req.query.title) > -1 );
  }
  res.json(courseSelector);
});
app.get('/courses/:id', (req : Request<{id: string}>, res) => {
  const foundCourse = dataBase.courses.find((uir) => uir.id === +req.params.id);
  if (!foundCourse) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  res.json(foundCourse);
});
app.get('/', (req, res) => {
  res.json({message :'Back-end'});
});
app.post('/courses', (req:Request<{},{},{title : string}>,res:Response<CourseType>) => {
  if (!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }
  const createdCourse = {
    id: +(new Date()),
    title: req.body.title,
  };
  dataBase.courses.push(createdCourse);
  res.status(HTTP_STATUSES.CREATED_201).json(createdCourse);
});
app.delete('/courses/:id' , (req:Request<{id : string}>,res) => {
  dataBase.courses = dataBase.courses.filter((uir) => uir.id !== +req.params.id);
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
app.put('/courses/:id', (req:Request<{id : string},{},{title : string}>, res) => {
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
app.delete('/__test__/data/' , (req,res) => {
  dataBase.courses = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
app.listen(port, () => {
  console.log(`Example app listening on 1port ${port}`);
});