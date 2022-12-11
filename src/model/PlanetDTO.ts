import { model, Model, Schema } from 'mongoose';
import FilmDTO from './FilmDTO';

export default class PlanetDTO {
  constructor(readonly name: string, readonly climate: string, readonly terrain: string, readonly films: FilmDTO[]) {}
}

export class PlanetDTOWithId extends PlanetDTO {
  constructor(readonly id: number, readonly name: string, readonly climate: string, readonly terrain: string, readonly films: FilmDTO[]){
    super(name, climate, terrain, films);
  }
}

const planetSchema = new Schema<PlanetDTOWithId>(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    climate: { type: String, required: true },
    terrain: { type: String, required: true },
    films: [new Schema<FilmDTO>({
      title: String,  director: String,  release_date: String
    })],
  }
);

export const PlanetRecord: Model<PlanetDTO> = model<PlanetDTO>('planet', planetSchema);