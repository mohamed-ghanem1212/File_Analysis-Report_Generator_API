declare global {
  namespace Express {
    export interface reqUser extends Request {
      user: {
        id: number;
        email: string;
        username: string;
        role: string;
      };
    }
  }
}
