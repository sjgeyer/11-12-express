'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Cat from '../model/cat';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();
const catRouter = new Router();

catRouter.post('/api/cats', jsonParser, (req, res, next) => {
  logger.log(logger.INFO, 'POST: processing a request');
  if (!req.body.name || !req.body.age || !req.body.favoriteFood || !req.body.color) {
    return next(new HttpErrors(400, 'POST: missing required properties'));
  }
  new Cat(req.body).save()
    .then((cat) => {
      logger.log(logger.INFO, 'POST: 200 status');
      return res.json(cat);
    })
    .catch(next);
  return undefined;
});

catRouter.get('/api/cats/:id?', (req, res, next) => {
  if (!req.params.id) {
    logger.log(logger.INFO, 'GET ALL: processing a request');
    Cat.find()
      .then((cats) => {
        logger.log(logger.INFO, 'GET ALL: 200 status');
        return res.json(cats);
      })
      .catch(next);
  } else {
    logger.log(logger.INFO, 'GET ONE: processing a request');
    Cat.findById(req.params.id)
      .then((cat) => {
        if (!cat) return next(new HttpErrors(404, 'GET ONE: cat not found'));
        logger.log(logger.INFO, 'GET ONE: 200 status');
        return res.json(cat);
      })
      .catch(next);
  }
});

catRouter.put('/api/cats/:id?', jsonParser, (req, res, next) => {
  if (!req.params.id) return next(new HttpErrors(400, 'PUT: no id passed'));
  logger.log(logger.INFO, 'PUT: processing a request');
  const options = { runValidators: true, new: true };
  return Cat.findByIdAndUpdate(req.params.id, req.body, options)
    .then((updatedCat) => {
      if (!updatedCat) return next(new HttpErrors(404, `PUT: cat not found at id ${req.params.id}`));
      logger.log(logger.INFO, 'PUT: 200 status');
      return res.json(updatedCat);
    })
    .catch(next);
});

catRouter.delete('/api/cats/:id?', (req, res, next) => {
  logger.log(logger.INFO, 'DELETE: processing a request');
  if (!req.params.id) return next(new HttpErrors(400, 'DELETE: no id passed'));
  Cat.findByIdAndRemove(req.params.id)
    .then(() => {
      logger.log(logger.INFO, 'DELETE: 204 status');
      return res.sendStatus(204);
    })
    .catch(next);
  return undefined;
});

export default catRouter;
