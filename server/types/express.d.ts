import { AzureToken } from '../middleware/auth';

declare global {
  namespace Express {
    interface Request {
      user?: AzureToken;
    }
  }
}

export {};
