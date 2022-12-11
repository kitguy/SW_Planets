import express, { Router } from 'express';
import { PlanetController } from './controller/PlanetController';
import { PlanetService } from './service/PlanetService';
import mongoose, { connect } from 'mongoose';
import PlanetRepositoryMongoImpl from './repository/PlanetRepositoryMongoImpl';

const router = Router();
const app = express();
app.use('/', router)

mongoose.set('strictQuery', false);
const mongoDbConnectionString = 'mongodb://localhost:27017';
connect(mongoDbConnectionString).then(() => {
  const mongoPlanetRepo = new PlanetRepositoryMongoImpl();
  const planetService = new PlanetService(mongoPlanetRepo);
  const planetController = new PlanetController(router, planetService);
  planetController.initializeRoutes();
  app.listen(8080, () => { });
})
