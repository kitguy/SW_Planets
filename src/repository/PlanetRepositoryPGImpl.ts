import PlanetDTO from '../model/PlanetDTO';
import { IPlanetRepository } from './IPlanetRepository';
// import { Client } from 'ts-postgres';

export default class PlanetRepositoryPGImpl implements IPlanetRepository {

  // change this any to PG Client when implementing this
  constructor(private readonly postgres: any) { }

  exists(id: number): Promise<Boolean> {
    throw new Error('Method not implemented.');
  }

  getPlanetByName(name: string): Promise<PlanetDTO> {
    throw new Error('Method not implemented.');
  }

  async getPlanets(): Promise<PlanetDTO[]> {
    throw new Error('Method not implemented.');
  }

  async insertPlanet(planet: PlanetDTO) {
    // how to insert rows?
    // perhaps go to mongoDB?
    const stmt = await this.postgres.prepare('INSERT INTO PLANETS VALUES ($1)');
    const response = await stmt.execute([JSON.stringify(planet)]);
    console.log(JSON.stringify(response));
  }

  deletePlanet(id: number) {
    throw new Error('Method not implemented.');
  }

  async getPlanet(id: number): Promise<PlanetDTO> {
    throw new Error('Method not implemented.');
  }

}