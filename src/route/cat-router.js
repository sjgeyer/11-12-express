'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';

import Cat from '../model/cat';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();
const catRouter = new Router();

catRouter.post('/api/cats', jsonParser, (req, res) => {
  logger.log(logger.INFO, 'POST: processing a request');
  if (!req.body.name) {
    logger.log(logger.INFO, 'POST: 400 status (!req.body.name)');
    return res.sendStatus(400);
  }
  new Cat(req.body).save()
    .then((cat) => {
      logger.log(logger.INFO, 'POST: 200 status');
      return res.json(cat);
    })
    .catch((error) => {
      logger.log(logger.ERROR, '__POST_ERROR__: 500 status');
      logger.log(logger.ERROR, error);
      return res.sendStatus(500);
    });
  return undefined;
});

catRouter.get('/api/cats', (req, res) => {
  logger.log(logger.INFO, 'GET ALL: processing a request');
  Cat.find()
    .then((cats) => {
      logger.log(logger.INFO, 'GET ALL: 200 status');
      return res.json(cats);
    })
    .catch((error) => {
      logger.log(logger.ERROR, '__GET_ONE_ERROR__: 500 status');
      logger.log(logger.ERROR, error);
      return res.sendStatus(500);
    });
});

catRouter.get('/api/cats/:id', (req, res) => {
  logger.log(logger.INFO, 'GET ONE: processing a request');
  Cat.findById(req.params.id)
    .then((cat) => {
      if (!cat) {
        logger.log(logger.INFO, 'GET ONE: 404 status (!cat)');
        res.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET ONE: 200 status');
      return res.json(cat);
    })
    .catch((error) => {
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, `GET ONE: 404 status, error finding ${req.params.id}`);
        return res.sendStatus(404);
      }
      logger.log(logger.ERROR, '__GET_ONE_ERROR__: 500 status');
      logger.log(logger.ERROR, error);
      return res.sendStatus(500);
    });
});

catRouter.delete('/api/cats/:id', (req, res) => {
  logger.log(logger.INFO, 'DELETE: processing a request');
  if (!req.params.id) {
    logger.log(logger.INFO, 'DELETE: 400 status (!req.params.id)');
    return res.sendStatus(400);
  }
  Cat.findByIdAndRemove(req.params.id)
    .then((cat) => {
      if (!cat) {
        logger.log(logger.INFO, 'DELETE: 404 status (!cat)');
        return res.sendStatus(404);
      }
      logger.log(logger.INFO, 'DELETE: 204 status');
      return res.sendStatus(204);
    })
    .catch((error) => {
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, `DELETE: 404 status, error finding ${req.params.id}`);
        return res.sendStatus(404);
      }
      logger.log(logger.ERROR, '__DELETE_ERROR__: 500 status');
      logger.log(logger.ERROR, error);
      return res.sendStatus(500);
    });
  return undefined;
});

export default catRouter;
