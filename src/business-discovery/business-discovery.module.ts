import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessDiscoveryService } from './business-discovery.service';
import { BusinessDiscoveryController } from './business-discovery.controller';
import { Business } from '../entities/business.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Business])],
  providers: [BusinessDiscoveryService],
  controllers: [BusinessDiscoveryController],
})
export class BusinessDiscoveryModule {}
