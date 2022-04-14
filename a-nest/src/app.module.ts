import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';
import { UsersService } from './users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormcofig from '../ormconfig';
import { Users } from './entities/Users';
import { AuthModule } from './auth/auth.module';

@Module({
  // isGlobal: true이면 ConfigService를 쓸 수 있음
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    WorkspacesModule,
    ChannelsModule,
    DmsModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: ormcofig,
    }),
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule implements NestModule {
  // middleware들은 consumer에 연결
  configure(consumer: MiddlewareConsumer) {
    // routes 전체에 LoggerMiddleware를 적용
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
