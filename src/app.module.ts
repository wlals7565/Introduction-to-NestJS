import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
//import * as winston from 'winston';
/*import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';*/

@Module({
  imports: [
    UsersModule,
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.production.env'
          : process.env.NODE_ENV === 'stage'
            ? '.stage.env'
            : '.development.env',
      validationSchema: validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 3306),
        username: configService.get<string>('DATABASE_USERNAME', 'root'),
        password: configService.get<string>('DATABASE_PASSWORD', ''),
        database: configService.get<string>('DATABASE_NAME', 'test'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        migrationsRun: false,
        migrations: [__dirname + '/**/migrations/*.js'],
        migrationsTableName: 'migration',
      }),
    }),
    /*WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('MyCustomLogging', {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),*/
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
