import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { PhotoModule } from './photo/photo.module';
import { SearchModule } from './search/search.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,

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
      template: {
        dir: __dirname + '/auth/emailTemplate',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),

    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ProfileModule,
    PhotoModule,
    SearchModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
