'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import Cat from '../model/cat';

const apiURL = `http://localhost:${process.env.PORT}/api/cats`;

// const createMockCat = () => {
//   return new Cat({
//     name: faker.name.firstName(),
//     color: faker.commerce.color(),
//     favoriteFood: faker.random.word(),
//     age: faker.random.number(),
//   }).save();
// };

describe('/api/cats', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Cat.remove({}));

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
});
