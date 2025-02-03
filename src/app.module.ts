import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReceiptModule } from './receiptModule/receipt.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ReceiptModule,
    CacheModule.register({
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
