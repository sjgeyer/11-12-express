'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import catRoutes from '../route/cat-router';

const app = express();
let server = null;

app.use(catRoutes);

app.all('*', (req, res) => {
  logger.log(logger.INFO, 'Returning 404 from catch-all route');
  return res.sendStatus(404);
});

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server is listening on PORT ${process.env.PORT}`);
      });
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is off');
      });
    });
};

export { startServer, stopServer };
