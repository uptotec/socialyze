import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { PhotoModule } from './photo/photo.module';
import { SearchModule } from './search/search.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    AuthModule,
    // CacheModule.registerAsync<RedisClientOptions>({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     store: redisStore,
    //     isGlobal: true,
    //     ttl: 60 * 60,
    //     url: configService.get<string>('REDIS_URL'),
    //   }),
    // }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      isGlobal: true,
      ttl: 60 * 60,
      url: 'http://redis:6379',
    }),
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.NODE_ENV}`],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.zoho.com',
        secure: true,
        port: 465,
        auth: {
          user: 'uptotec@zohomail.com',
          pass: 't0M8QP5e2RqD',
        },
      },
      defaults: {
        from: 'Mahmoud Ashraf <uptotec@zohomail.com>',
      },
      preview: true,
    }),
    ProfileModule,
    PhotoModule,
    SearchModule,
  ],
})
export class AppModule {}
