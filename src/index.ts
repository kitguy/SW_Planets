import express, { Router } from 'express';
import { PlanetController } from './controller/PlanetController';


const router = Router();
const app = express();
app.use('/', router)

const planetController = new PlanetController(router);
planetController.initializeRoutes();

app.listen(8080, () => {});