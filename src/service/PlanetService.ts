import * as swapi from 'swapi-node';
import FilmDTO from '../model/FilmDTO';
import PlanetDTO, { PlanetDTOWithId } from '../model/PlanetDTO';
import { IPlanetRepository } from '../repository/IPlanetRepository';
import log from '../util/log';

export class PlanetService {
  constructor(private readonly planetRepo: IPlanetRepository) { }

  initializeLocalDB = async() => {
    const planets = await this.getAllPlanetsFromAPI();

    let insertedPlanets = 0;
    for (let planet of planets) {
      await this.planetRepo.insertPlanet(planet);
      insertedPlanets += 1;
    }
    return insertedPlanets;
  }

  private getAllPlanetsFromAPI = async(): Promise<PlanetDTOWithId[]> => {
    let planetResponse = await swapi.getPlanets();
    let planets = planetResponse.results;
    const planetDtoWithId = new Array<PlanetDTOWithId>;
    let id = 1;
    for (let planet of planets) {
      const films: any[] = await Promise.all(planet.films.map(f => swapi.get(f)));
      const planetDTO: PlanetDTOWithId = new PlanetDTOWithId(id, planet.name, planet.climate, planet.terrain,
        films.map(f => new FilmDTO(f.title, f.director, f.release_date)));
      planetDtoWithId.push(planetDTO);
      id +=1;
    }

    while (!!planetResponse.next) {
      planetResponse = await swapi.get(planetResponse.next);
      let planets = planetResponse.results;
      for (let planet of planets) {
        const films: any[] = await Promise.all(planet.films.map(f => swapi.get(f)));
        const planetDTO: PlanetDTOWithId = new PlanetDTOWithId(id, planet.name, planet.climate, planet.terrain,
          films.map(f => new FilmDTO(f.title, f.director, f.release_date)));
        planetDtoWithId.push(planetDTO);
        id +=1;
      }
    }

    return planetDtoWithId;
  }

  deleteAllFromLocalDB = async() => {
    return await this.planetRepo.deleteAllPlanets()
  }

  deleteById = async(id: string) => {
    const response = await this.planetRepo.deletePlanet(parseInt(id));
    return response.deletedCount === 1;
  }

  getAll = async () => {
    return await this.planetRepo.getPlanets();
  }

  getById = async (id: number): Promise<PlanetDTO> => {
    return await this.planetRepo.getPlanet(id);
  }

  loadAndSaveById = async (id: number) => {
    if (await this.planetRepo.exists(id)) {
      throw { message: `Planet with Id ${id} already Exists`, status: 409 };
    } else {
      let planet;
      try {
         planet = await swapi.getPlanets({ id: id });
      } catch (e) {
        if (e.message === '404') {
          throw { message: `Planet with Id ${id} does not exist`, status: 404 };
        } else {
          throw { message: `Error when fetching plannet with Id ${id}: ${e.message}`, status: 500 };
        }
      }
      const films: any[] = await Promise.all(planet.films.map(f => swapi.get(f)));
      const planetDTO = new PlanetDTOWithId(id, planet.name, planet.climate, planet.terrain,
        films.map(f => new FilmDTO(f.title, f.director, f.release_date)))
      const response = await this.planetRepo.insertPlanet(planetDTO);
      return response;
    }
  }

  getByQuery = async(query): Promise<PlanetDTO[]> => {
    if (query.name) {
      log.info(`Fetching planet by name ${query.name} from local DB`);
      const planet = await this.planetRepo.getPlanetByName(query.name);
      return planet ? new Array(planet) : undefined;
    } else {
      throw new Error(`Query param not implemented ${query}`);
    }
  }
}
