import { Request, Response, Router } from 'express';
import PlanetDTO from '../model/PlanetDTO';
import { PlanetService } from '../service/PlanetService';
import { Controller } from './Controller';

export class PlanetController extends Controller {
  protected readonly path = '/planet';
  constructor(
    protected readonly router: Router,
    protected readonly planetService: PlanetService
    ) { super() }

  initializeRoutes =  (): void => {
    this.router.post(`${this.path}/load/:id`, this.loadAndSaveById);
    this.router.get(`${this.path}`, this.getAll);
    this.router.get(`${this.path}/:id`, this.getById);
    this.router.delete(`${this.path}/:id`, this.deleteById);
  }

  private deleteById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const resp = await this.planetService.deleteById(id);
    resp
      ? res.status(200).json('ok')
      : res.status(500).json(`The ${id} Planet could not be deleted`);
  }

  private loadAndSaveById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const response = await this.planetService.loadAndSaveById(parseInt(id));
      if (response.id) {
        res.status(200).json(`Loaded to DB. Id: ${response.id}`);
      }
      return;
    } catch (e) {
      if (e.status) {
        res.status(e.status).json(e.message);
      }
      return;
    }
  }

  private getAll = async (req: Request, res: Response) => {
    if (Object.keys(req.query).length > 0) {
      const resp = await this.planetService.getByQuery(req.query)
      resp ? res.status(200).json(resp) : res.status(404).json(undefined);
    } else {
      const resp = await this.planetService.getAll();
      res.status(200).json(resp);
    }
  }

  private getById = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const resp = await this.planetService.getById(id);
    return resp ? res.status(200).json(resp) : res.status(404).json(resp);
  }

}