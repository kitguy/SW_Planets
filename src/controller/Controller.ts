import { Router } from 'express';

export class Controller {
  protected path: string;
  protected router: Router;

  initializeRoutes = (): void => {};
}
