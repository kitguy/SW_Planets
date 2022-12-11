import express, { Router } from 'express';
import { PlanetController } from './controller/PlanetController';
import { PlanetService } from './service/PlanetService';
import mongoose, { connect } from 'mongoose';
import PlanetRepositoryMongoImpl from './repository/PlanetRepositoryMongoImpl';
import log from './util/log';

const router = Router();
const app = express();
app.use('/', router)

mongoose.set('strictQuery', false);
const mongoDbConnectionString = 'mongodb://localhost:27017';
log.info(`Connecting to mongoDB on port 27017...`);
connect(mongoDbConnectionString).then(() => {
  log.info(`Connected to mongoDB`);
  const mongoPlanetRepo = new PlanetRepositoryMongoImpl();
  const planetService = new PlanetService(mongoPlanetRepo);
  const planetController = new PlanetController(router, planetService);
  planetController.initializeRoutes();
  app.listen(8080, () => { });
  log.info(`Started server on port 8080...`);
})
