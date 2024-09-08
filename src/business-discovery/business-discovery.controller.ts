import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { BusinessDiscoveryService } from './business-discovery.service';
import { BusinessResponse } from '../dto/business-response.dto';
import { DiscoverBusinessesDto } from '../dto/discover-businesses.dto';
import * as Joi from 'joi';

const discoverBusinessSchema = Joi.object({
  lat: Joi.number().required(),
  long: Joi.number().required(),
  limit: Joi.number().optional(),
  type: Joi.string().optional(),
});

@Controller('discovery')
export class BusinessDiscoveryController {
  constructor(
    private readonly businessDiscoveryService: BusinessDiscoveryService,
  ) {}

  @Get()
  public async discoverBusinesses(
    @Query() query: DiscoverBusinessesDto,
  ): Promise<BusinessResponse[]> {
    // IMPROVEMENT: Avoid SQL injection, validate query parameters
    const { error } = discoverBusinessSchema.validate(query);

    if (error) {
      throw new HttpException(error.details[0].message, HttpStatus.BAD_REQUEST);
    } else {
      return await this.businessDiscoveryService.findNearbyBusinesses(
        query.lat,
        query.long,
        query.limit,
        query.type,
      );
    }
  }
}
