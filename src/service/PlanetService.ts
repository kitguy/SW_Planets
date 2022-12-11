import * as swapi from 'swapi-node';
import FilmDTO from '../model/FilmDTO';
import PlanetDTO, { PlanetDTOWithId } from '../model/PlanetDTO';
import { IPlanetRepository } from '../repository/IPlanetRepository';

export class PlanetService {
  constructor(private readonly planetRepo: IPlanetRepository) { }

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
      const planet = await swapi.planets({ id: id });
      const films: any[] = await Promise.all(planet.films.map(f => swapi.get(f)));
      const planetDTO = new PlanetDTOWithId(id, planet.name, planet.climate, planet.terrain,
        films.map(f => new FilmDTO(f.title, f.director, f.release_date)))
      const response = await this.planetRepo.insertPlanet(planetDTO);
      return response;
    }
  }

  getByQuery = async(query): Promise<PlanetDTO[]> => {
    if (query.name) {
      const planet = await this.planetRepo.getPlanetByName(query.name);
      return planet ? new Array(planet) : undefined;
    } else {
      throw new Error(`Query param not implemented ${query}`);
    }
  }
}
