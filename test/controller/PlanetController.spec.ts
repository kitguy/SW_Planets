import express, { Router } from 'express';
import { PlanetController } from '../../src/controller/PlanetController';
import { PlanetService } from '../../src/service/PlanetService';
import supertest from 'supertest';
import { newPlanet } from '../util/builders';

describe('PlanetontrollerTest', () => {
  let controller: PlanetController;
  let router: Router;
  let planetService: PlanetService;
  beforeEach(() => {
    router = Router();
    planetService = new PlanetService(undefined as any);
    controller = new PlanetController(router, planetService);
    controller.initializeRoutes();
  });

  describe('deleteById', () => {
    it('calls planetService deleteById and returns 200 if anything is returned', (done) => {
      const deleteById = jest.spyOn(planetService, 'deleteById')
        .mockResolvedValueOnce({} as any);

        const app = express();
        app.use('/', router);
        supertest(app)
        .delete('/planet/6')
        .expect(200)
        .then((res) => {
          expect(deleteById).toHaveBeenCalledWith('6');
          expect(res.body).toEqual('ok');
          expect(res.header['content-type']).toContain('application/json');
          done();
        });
    });

    it('returns 404 if nothing was returned from the planetService deleteById', (done) => {
      const deleteById = jest.spyOn(planetService, 'deleteById')
        .mockResolvedValueOnce(undefined as any);

        const app = express();
        app.use('/', router);
        supertest(app)
        .delete('/planet/6')
        .expect(404)
        .then((res) => {
          expect(deleteById).toHaveBeenCalledWith('6');
          expect(res.body).toEqual('The 6 Planet could not be found');
          expect(res.header['content-type']).toContain('application/json');
          done();
        });
    });
  });

  describe('loadAndSaveById', () => {
    it('calls planetService loadAndSaveById and returns 200', (done) => {
      const loadAndSaveByIdMock = jest.spyOn(planetService, 'loadAndSaveById')
        .mockResolvedValueOnce({id: 1});

      const app = express();
      app.use('/', router);
      supertest(app)
      .post('/planet/load/1')
      .expect(200)
      .then((res) => {
        expect(loadAndSaveByIdMock).toHaveBeenCalledWith(1);
        expect(res.body).toEqual('Loaded Planet to Local DB. Id: 1');
        expect(res.header['content-type']).toContain('application/json');
        done();
      });
    });

    it('returns https status error if loadAndSaveById throws an error', (done) => {
      const loadAndSaveByIdMock = jest.spyOn(planetService, 'loadAndSaveById')
        .mockRejectedValueOnce({status: 409, message: 'conflicts'});

      const app = express();
      app.use('/', router);
      supertest(app)
      .post('/planet/load/1')
      .expect(409)
      .then((res) => {
        expect(loadAndSaveByIdMock).toHaveBeenCalledWith(1);
        expect(res.body).toEqual('conflicts');
        expect(res.header['content-type']).toContain('application/json');
        done();
      });
    });
  });

  describe('getById', () => {
    it('calls planetService getById and returns 200', (done) => {
      const returningPlanet = newPlanet();
      const getByIdMock = jest.spyOn(planetService, 'getById').mockResolvedValueOnce(returningPlanet);

      const app = express();
      app.use('/', router);
      supertest(app)
      .get('/planet/1')
      .expect(200)
      .expect(returningPlanet)
      .then((res) => {
        expect(getByIdMock).toHaveBeenCalledWith(1);
        expect(res.header['content-type']).toContain('application/json');
        done();
      });
    });

    it('returns 404 if no planet was found by Id', (done) => {
      const getByIdMock = jest.spyOn(planetService, 'getById').mockResolvedValueOnce(undefined as any);

      const app = express();
      app.use('/', router);
      supertest(app)
      .get('/planet/999')
      .expect(404)
      .then((res) => {
        expect(getByIdMock).toHaveBeenCalledWith(999);
        expect(res.header['content-type']).toContain('application/json');
        done();
      });
    });
  });

  describe('getAll', () => {

    it('calls planetService getByQuery if there is query params', (done) => {
      const planetsArray = [newPlanet()];
      const getByQueryMock = jest.spyOn(planetService, 'getByQuery').mockResolvedValueOnce(planetsArray);

      const app = express();
      app.use('/', router);
      supertest(app)
      .get('/planet')
      .query({
        name: '1',
      })
      .expect(200)
      .expect(planetsArray)
      .then((res) => {
        expect(getByQueryMock).toHaveBeenCalledWith({name: '1'});
        expect(res.header['content-type']).toContain('application/json');
        done();
      });
    });

    it('calls planetService getAll if there is no query params', (done) => {
      const planetsArray = [newPlanet()];
      const getAllMock = jest.spyOn(planetService, 'getAll').mockResolvedValueOnce(planetsArray);

      const app = express();
      app.use('/', router);
      supertest(app)
      .get('/planet')
      .expect(200)
      .expect(planetsArray)
      .then((res) => {
        expect(getAllMock).toHaveBeenCalled();
        expect(res.header['content-type']).toContain('application/json');
        done();
      });
    });

    it('returns 404 if there is no planet matching the query', (done) => {
      const getByQuery = jest.spyOn(planetService, 'getByQuery').mockResolvedValueOnce(undefined as any);

      const app = express();
      app.use('/', router);
      supertest(app)
      .get('/planet')
      .query({
        name: 'inexistent planet',
      })
      .expect(404)
      .then((res) => {
        expect(getByQuery).toHaveBeenCalled();
        expect(res.header['content-type']).toContain('application/json');
        done();
      });
    });
  });
});
