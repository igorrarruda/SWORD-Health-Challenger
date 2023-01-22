import { User } from '../entities/User.entity';
import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from 'interfaces/auth.interface';
import AuthService from '../services/auth.service';
import { CreateUserDto } from '../dtos/users.dto';

class AuthController {
  authService = new AuthService();

  signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData = await this.authService.signup(userData);

      res.status(201).json(signUpUserData);
    } catch (error) {
      next(error);
    }
  };

  logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const { cookie } = await this.authService.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  };

  logOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
