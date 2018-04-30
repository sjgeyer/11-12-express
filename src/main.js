'use strict';

import server from './lib/server';
import logger from './lib/logger';

server.start(process.env.PORT, () => logger.log(logger.INFO, `MAIN: listening on ${process.env.PORT}`));
