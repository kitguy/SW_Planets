import { PlanetService } from '../../src/service/PlanetService';
import PlanetRepositoryMongoImpl from '../../src/repository/PlanetRepositoryMongoImpl';
import { IPlanetRepository } from '../../src/repository/IPlanetRepository';

jest.mock('swapi-node');
import * as swapi from 'swapi-node';
import { newFilm, newPlanet } from '../util/builders';

describe('PlanetService', () => {
  let planetService: PlanetService;
  let planetRepo: IPlanetRepository;

  beforeEach(() => {
    planetRepo = new PlanetRepositoryMongoImpl();
    planetService = new PlanetService(planetRepo);
  });

  describe('initializeLocalDB', () => {
    let getPlanetMock, getMock;
    beforeEach(() => {
      getPlanetMock = jest.spyOn(swapi, 'getPlanets');
      getMock = jest.spyOn(swapi, 'get');
    });

    it('calls insert 2 times if star wars api returns 2 records', async () => {
      getPlanetMock.mockResolvedValue({results: [newPlanet(), newPlanet()]})
      getMock.mockResolvedValue(newFilm());
      jest.spyOn(planetRepo, 'insertPlanet').mockResolvedValueOnce({ id: 1 });
      jest.spyOn(planetRepo, 'insertPlanet').mockResolvedValueOnce({ id: 1 });

      await planetService.initializeLocalDB();

      expect(planetRepo.insertPlanet).toHaveBeenCalledTimes(2);
    });
  });

  describe('deleteById', () => {
    it('returns true if deletedCount is equal to 1', async () => {
      jest.spyOn(planetRepo, 'deletePlanet').mockResolvedValueOnce({deletedCount: 1});
      const response = await planetService.deleteById('1');
      expect(response).toEqual(true);
    });

    it('returns false if deletedCount is different than 1', async () => {
      jest.spyOn(planetRepo, 'deletePlanet').mockResolvedValueOnce({deletedCount: 0});
      const response = await planetService.deleteById('1');
      expect(response).toEqual(false);
    });
  });

  describe('loadAndSaveById', () => {
    let getPlanetMock, getMock;
    beforeEach(() => {
      getPlanetMock = jest.spyOn(swapi, 'getPlanets');
      getMock = jest.spyOn(swapi, 'get');
    });

    it('throws error if planet already exists', async () => {
      jest.spyOn(planetRepo, 'exists').mockResolvedValueOnce(true);

      try {
        await planetService.loadAndSaveById(1);
        throw new Error('This should not be reached');
      } catch(e) {
        expect(e.status).toEqual(409);
        expect(e.message).toEqual(`Planet with Id ${1} already Exists`);
      }
    });

    it('throws error if planet does not exists by id', async () => {
      jest.spyOn(planetRepo, 'exists').mockResolvedValueOnce(false);
      getPlanetMock.mockRejectedValue({message: '404'});

      try {
        await planetService.loadAndSaveById(999);
        throw new Error('This should not be reached');
      } catch(e) {
        expect(e.status).toEqual(404);
        expect(e.message).toEqual(`Planet with Id 999 does not exist`);
      }
    });

    it('calls Star Wars API with ID', async () => {
      jest.spyOn(planetRepo, 'exists').mockResolvedValueOnce(false);
      getPlanetMock.mockResolvedValue(newPlanet());
      getMock.mockResolvedValue(newFilm());
      const insertMock = jest.spyOn(planetRepo, 'insertPlanet').mockResolvedValueOnce({ id: 1 });

      await planetService.loadAndSaveById(1);

      expect(getPlanetMock).toHaveBeenCalledTimes(1);
      expect(getPlanetMock).toHaveBeenCalledWith({ id: 1 });
      expect(getMock).toHaveBeenCalledTimes(2);
      expect(insertMock).toHaveBeenCalledTimes(1);
    });
  });
});