import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { CreateUserDto } from '../dtos/users.dto';
import { User } from '../entities/User.entity';
import { HttpException } from '../exceptions/HttpException';
import { DataStoredInToken, TokenData } from 'interfaces/auth.interface';
import { SECRET_KEY } from '../config/const.config';

class AuthService extends User {
  async signup(userData: CreateUserDto): Promise<User> {
    const findUser = await User.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const newData = { ...userData, role: { id: userData.role }, password: hashedPassword } as User;
    const createUserData = await User.create(newData).save();
    return createUserData;
  }

  async login(userData: CreateUserDto): Promise<{ cookie: string }> {
    const findUser = await User.createQueryBuilder().where({ email: userData.email }).addSelect("User.password").getOne();
    if (!findUser) throw new HttpException(409, "Email and Password not matching");

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "Email and Password not matching");

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);
    return { cookie };
  }

  createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY || '', { expiresIn }) };
  }

  createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
