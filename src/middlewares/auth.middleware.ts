import { SECRET_KEY } from '../config/const.config';
import { User } from '../entities/User.entity';
import { HttpException } from '../exceptions/HttpException';
import { NextFunction, Response } from 'express';
import { DataStoredInToken, RequestWithUser } from 'interfaces/auth.interface';
import { verify } from 'jsonwebtoken';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization')!.split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey = SECRET_KEY || '';
      const { id } = (await verify(Authorization, secretKey)) as unknown as DataStoredInToken;
      const findUser = await User.findOne({ where: { id }, relations: { role: true } });

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
