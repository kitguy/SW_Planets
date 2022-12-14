import PlanetDTO from '../model/PlanetDTO';

export interface IPlanetRepository {
  deleteAllPlanets(): Promise<Boolean>;
  exists(id: number): Promise<Boolean>;
  insertPlanet(planet: PlanetDTO);
  deletePlanet(id: number);
  getPlanet(id: number): Promise<PlanetDTO>;
  getPlanetByName(name: string): Promise<PlanetDTO>;
  getPlanets(): Promise<PlanetDTO[]>;
}