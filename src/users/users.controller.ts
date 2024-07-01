import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Headers,
  UseGuards,
  Inject,
  LoggerService,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-eamil.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './interfaces/userInfo';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
//import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
//import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
//import { Logger as WinstonLogger } from 'winston';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    @Inject(Logger)
    private readonly logger: LoggerService,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    this.printWinstonLog(dto);
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUserInfo(
    @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<UserInfo | string> {
    const jwtString = headers.authorization.split('Bearer ')[1];

    this.authService.verify(jwtString);

    return this.usersService.getUserInfo(userId);
  }

  private printWinstonLog(dto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (e) {
      this.logger.error('error: ' + JSON.stringify(dto), e.stack);
    }
    this.logger.warn('warn: ' + JSON.stringify(dto));
    this.logger.log('log: ' + JSON.stringify(dto));
    this.logger.verbose('verbose: ' + JSON.stringify(dto));
    this.logger.debug('debug: ' + JSON.stringify(dto));

    /*this.logger.error('error: ', dto);
    this.logger.warn('warn: ', dto);
    this.logger.info('info: ', dto);
    this.logger.http('http: ', dto);
    this.logger.verbose('verbose: ', dto);
    this.logger.debug('debug: ', dto);
    this.logger.silly('silly: ', dto);
    */
  }
}
