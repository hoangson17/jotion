import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Unique } from 'src/common/validators/email-unique';
import Hash from 'src/utils/hashing';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { DocumentController } from './document.controller';
import { Page } from 'src/entities/page.entity';
import { Block } from 'src/entities/block.entity';

@Module({
  controllers: [UsersController, AuthController, DocumentController],
  providers: [UsersService, Unique,Hash],
  imports: [TypeOrmModule.forFeature([User,Page,Block]),ConfigModule.forRoot({
    isGlobal: true,
  }),JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRED },
  })],
})
export class UsersModule {}
