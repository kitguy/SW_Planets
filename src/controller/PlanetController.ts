import { Request, Response, Router } from 'express';
import PlanetDTO from '../model/PlanetDTO';
import { PlanetService } from '../service/PlanetService';
import log from '../util/log';
import { Controller } from './Controller';

export class PlanetController extends Controller {
  protected readonly path = '/planet';
  constructor(
    protected readonly router: Router,
    protected readonly planetService: PlanetService
    ) { super() }

  initializeRoutes =  (): void => {
    log.info(`Initializing routes...`);
    this.router.post(`${this.path}/load/:id`, this.loadAndSaveById);
    this.router.get(`${this.path}`, this.getAll);
    this.router.get(`${this.path}/:id`, this.getById);
    this.router.delete(`${this.path}/all`, this.deleteAllFromLocalDb);
    this.router.delete(`${this.path}/:id`, this.deleteById);
    this.router.post(`${this.path}/initialize`, this.initialize);
  }

  private initialize = async (req: Request, res: Response) => {
    const inserted = await this.planetService.initializeLocalDB();
    inserted > 0
      ? res.status(200).json(`Loaded ${inserted} planets from Open Star Wars API`)
      : res.status(500).json(`Planets could not be deleted`);
  }

  private deleteAllFromLocalDb = async (req: Request, res: Response) => {
    const resp = await this.planetService.deleteAllFromLocalDB();
    resp
      ? res.status(200).json('deleted all planets')
      : res.status(500).json(`Planets could not be deleted`);
  }

  private deleteById = async (req: Request, res: Response) => {
    const id = req.params.id;
    log.info(`Deleting planet by id ${id}`);
    const resp = await this.planetService.deleteById(id);
    resp
      ? res.status(200).json('ok')
      : res.status(500).json(`The ${id} Planet could not be deleted`);
  }

  private loadAndSaveById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      log.info(`Loading planet ${id} from Star wars open API to local DB`);
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
      log.info(`Fetching all planets from local DB`);
      const resp = await this.planetService.getAll();
      res.status(200).json(resp);
    }
  }

  private getById = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const resp = await this.planetService.getById(id);
    log.info(`Fetching Planet id: ${id} from local db `);
    return resp ? res.status(200).json(resp) : res.status(404).json(resp);
  }

}