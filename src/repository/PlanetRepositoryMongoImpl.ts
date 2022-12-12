import FilmDTO from '../model/FilmDTO';
import PlanetDTO, { PlanetRecord } from '../model/PlanetDTO';
import { IPlanetRepository } from './IPlanetRepository';

export default class PlanetRepositoryMongoImpl implements IPlanetRepository {
  async deleteAllPlanets(): Promise<Boolean> {
    const deleteResponse = await PlanetRecord.deleteMany({});
    return deleteResponse.deletedCount > 0;
  }
  async exists(id: number): Promise<Boolean> {
    const response = await PlanetRecord.exists({id: id})
    return response
      ? true
      : false;
  }
  async getPlanetByName(name: string): Promise<PlanetDTO> {
    const p = await PlanetRecord.findOne({name: name});
    return this.mapToPlanetDTO(p);
  }
  async insertPlanet(planet: PlanetDTO) {
    const planetRecordDoc = await PlanetRecord.create(planet);
    return planetRecordDoc;
  }
  async deletePlanet(id: number) {
    return await PlanetRecord.deleteOne({id: id});
  }
  async getPlanet(id: number): Promise<PlanetDTO> {
    const p = await PlanetRecord.findOne({id: id});
    return this.mapToPlanetDTO(p);
  }

  async getPlanets(): Promise<PlanetDTO[]> {
    const planets = await PlanetRecord.find();
    return planets.map(p => this.mapToPlanetDTO(p));
  }

  private mapToPlanetDTO(p: any): PlanetDTO {
    return p
    ? new PlanetDTO(p.name, p.climate, p.terrain, p.films.map(f => new FilmDTO(f.title, f.director, f.release_date)))
    : undefined;
  }
}