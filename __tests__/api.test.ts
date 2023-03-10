import request from 'supertest';
import {app, HTTP_STATUSES} from "../source";
describe('/course' ,() => {
  beforeAll(async () => {
    await request(app).delete('/__test__/data/');
  });
  it('should return 200 and empty array' , async ()=>{
    await request(app).get('/courses').expect(HTTP_STATUSES.SUCCESS_200,[]);
  });
  it('should return 400 for not created course' , async ()=>{
    await request(app).get('/courses/999').expect(HTTP_STATUSES.NOT_FOUND_404);
  });
  it('shouldn`t create a course with incorrect input data' , async() =>{
    await request(app).post('/courses').send({title : ''})
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app).get('/courses').expect(HTTP_STATUSES.SUCCESS_200,[]);
  });
  let createdCourse : any = null;
  it('should create a course with correct input data' , async() =>{
    const createResponse = await request(app)
      .post('/courses')
      .send({title : 'dario-rerio course'})
      .expect(HTTP_STATUSES.CREATED_201);
    createdCourse = createResponse.body;
    expect(createdCourse).toEqual({
      id : expect.any(Number),
      title : 'dario-rerio course',
    })
    await request(app)
      .get('/courses/')
      .expect(HTTP_STATUSES.SUCCESS_200,[createdCourse]);
  });
  it('shouldn`t update a course with incorrect input data' , async() =>{
    await request(app)
      .put('/courses/' + createdCourse.id)
      .send({title : ''})
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(createdCourse).toEqual({
      id : expect.any(Number),
      title : 'dario-rerio course',
    })
    await request(app)
      .get('/courses/' + createdCourse.id)
      .expect(HTTP_STATUSES.SUCCESS_200,createdCourse);
  });
  let anotherCourse : any = null;
  it('shouldn`t update a course that does not exist ' , async() =>{
    await request(app)
      .put('/courses/' + -100)
      .send({title : 'good'})
      .expect(HTTP_STATUSES.NOT_FOUND_404);

    expect(createdCourse).toEqual({
      id : expect.any(Number),
      title : 'dario-rerio course',
    })
    await request(app)
      .get('/courses/' + createdCourse.id)
      .expect(HTTP_STATUSES.SUCCESS_200,createdCourse);
  });
  it('should update a course with correct input data ' , async() =>{
    await request(app)
      .put('/courses/' + createdCourse.id)
      .send({title : 'good new title'})
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app)
      .get('/courses/' + createdCourse.id)
      .expect(HTTP_STATUSES.SUCCESS_200, {
        ...createdCourse,
        title : 'good new title',
      });
    await request(app)
      .get('/courses/' + anotherCourse.id)
      .expect(HTTP_STATUSES.SUCCESS_200, anotherCourse);
  });
  it('create another course' , async() =>{
    const createResponse = await request(app)
      .post('/courses')
      .send({title : 'dario-rerio course 2'})
      .expect(HTTP_STATUSES.CREATED_201);
    anotherCourse = createResponse.body;
    expect(anotherCourse).toEqual({
      id : expect.any(Number),
      title : 'dario-rerio course 2',
    })
    await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.SUCCESS_200,[createdCourse, anotherCourse]);
  });
  it('should delete both courses ' , async() =>{
    await request(app)
      .delete('/courses/' + createdCourse.id)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app)
      .get('/courses/' + createdCourse.id)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
    await request(app)
      .delete('/courses/' + anotherCourse.id)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app)
      .get('/courses/' + anotherCourse.id)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
    await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.SUCCESS_200, []);
  })
})