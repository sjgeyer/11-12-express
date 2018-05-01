'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import Cat from '../model/cat';

const apiURL = `http://localhost:${process.env.PORT}/api/cats`;
const badApiURL = `http://localhost:${process.env.PORT}/api/INVALIDSCHEMA`;

const createMockCat = () => {
  return new Cat({
    name: faker.name.firstName(),
    color: faker.commerce.color(),
    favoriteFood: faker.random.word(1),
    age: faker.random.number(),
  }).save();
};

describe('/api/cats', () => {
  beforeAll(startServer);
  afterAll(() => {
    stopServer();
    Cat.remove({});
  });
  let testId = null;
  describe('POST /api/cats', () => {
    test('should respond with 200 status', () => {
      const catToPost = {
        name: faker.name.firstName(),
        color: faker.commerce.color(),
        favoriteFood: faker.random.word(),
        age: faker.random.number(),
      };
      return superagent.post(apiURL)
        .send(catToPost)
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.body.name).toEqual(catToPost.name);
          expect(res.body.color).toEqual(catToPost.color);
          expect(res.body.favoriteFood).toEqual(catToPost.favoriteFood);
          expect(res.body.age).toEqual(catToPost.age);
          testId = res.body._id;
        });
    });
    test('should respond with 400 status', () => {
      const catToPost = {
        color: faker.commerce.color(),
        favoriteFood: faker.random.word(),
        age: faker.random.number(),
      };
      return superagent.post(apiURL)
        .send(catToPost)
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(400);
        });
    });
  });

  describe('GET ONE /api/cats', () => {
    test('should respond with 200 status', () => {
      let testCat = null;
      return createMockCat()
        .then((cat) => {
          testCat = cat;
          return superagent.get(`${apiURL}/${cat._id}`);
        })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.body.name).toEqual(testCat.name);
          expect(res.body.color).toEqual(testCat.color);
          expect(res.body.favoriteFood).toEqual(testCat.favoriteFood);
          expect(res.body.age).toEqual(testCat.age);
        });
    });
    test('should respond with 404 if there is no note', () => {
      return superagent.get(`${apiURL}/INVALIDID`)
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('GET ALL /api/cats', () => {
    test('should respond with 200 status', () => {
      return superagent.get(`${apiURL}`)
        .then((res) => {
          expect(Array.isArray(res.body)).toEqual(true);
          expect(res.status).toEqual(200);
        });
    });
    test('should respond with 404 status', () => {
      return superagent.get(`${badApiURL}`)
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/cats', () => {
    test('should respond with 204 status', () => {
      return superagent.del(`${apiURL}/${testId}`)
        .then((res) => {
          expect(res.status).toEqual(204);
          expect(res.body).toEqual({});
        });
    });
    test('should respond with 404 if there is no note', () => {
      return superagent.del(`${apiURL}/INVALIDID`)
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(404);
        });
    });
    test('should respond with 400 if there is no id', () => {
      return superagent.del(`${apiURL}`)
        .then(Promise.reject)
        .catch((res) => {
          expect(res.status).toEqual(400);
        });
    });
  });
});
