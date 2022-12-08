import { Request, Response, Router } from 'express';
import { Controller } from './Controller';

export class PlanetController extends Controller {
  protected readonly path = '/planet';
  constructor(protected readonly router: Router) { super() }

  initializeRoutes =  (): void => {
    this.router.post(`${this.path}/load/:id`, this.loadAndSaveById);
    this.router.get(`${this.path}/`, this.getAll);
    this.router.get(`${this.path}/:name`, this.getByName);
    this.router.get(`${this.path}/:id`, this.getById);
    this.router.delete(`${this.path}/:id`, this.deleteById);
  }

  private deleteById = async (req: Request, res: Response) => {
    const id = req.params.id;
    throw new Error('Method not implemented.');
  }

  private getByName = async (req: Request, res: Response) => {
    const name = req.params.name;
    throw new Error('Method not implemented.');
  }

  private loadAndSaveById = async (req: Request, res: Response) => {
    const id = req.params.id;
    throw new Error('Method not implemented.');
  }

  private getAll = async (req: Request, res: Response) => {
    throw new Error('Method not implemented.');
  }

  private getById = async (req: Request, res: Response) => {
    const id = req.params.id;
    throw new Error('Method not implemented.');
  }

}