import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Business } from '../entities/business.entity';
import { getDistance } from 'geolib';
import { BusinessResponse } from '../dto/business-response.dto';

@Injectable()
export class BusinessDiscoveryService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
  ) {}

  /**
   * Public method to find nearby businesses based on a location, with optional limit and type
   *
   * @param {number} requestedLat - the latitude in the request
   * @param {number} requestedLon - the longitude in the request
   * @param {number} limit - the limit of businesses to return. If not provided, defaults to 10
   * @param {string} businessType - the type of business to filter by
   * @returns {Promise<BusinessResponse[]>} - a list of businesses with their distance from the requested location, sorted by distance
   */
  public async findNearbyBusinesses(
    requestedLat: number,
    requestedLon: number,
    limit?: number,
    businessType?: string,
  ): Promise<BusinessResponse[]> {
    // IMPROVEMENT: Use a more efficient query to get all businesses, instead of fetching all and filtering
    // We could perform a query to get all businesses within a certain radius of the user's location
    // But putting too much logic in the database query can make it harder to maintain and test
    // However, if the number of businesses is very large, it would be more efficient to do this in the database,
    // As well as limiting the results inside the query... but this is a small dataset so it's fine for now
    const businesses = await this.selectAllBusinesses(businessType);

    const orderedBusinesses = businesses
      .map((business) =>
        this.getBusinessDistanceInfo(business, requestedLat, requestedLon),
      )
      .sort((a, b) => a.distance - b.distance);

    return limit
      ? orderedBusinesses.splice(0, limit)
      : orderedBusinesses.splice(0, 10);
  }

  /**
   * Private method to calculate the distance between a business and a requested location returns the business info in expected format
   *
   * @param {Business} business - the business retrieved from the database
   * @param {number} requestedLat - the requested latitude
   * @param {number} requestedLon - the requested longitude
   * @returns {BusinessResponse} - the business info with the distance from the requested location
   */
  private getBusinessDistanceInfo(
    business: Business,
    requestedLat: number,
    requestedLon: number,
  ): BusinessResponse {
    // getDistance returns distance in meters - using geolib library
    const distance = getDistance(
      { latitude: requestedLat, longitude: requestedLon },
      { latitude: business.latitude, longitude: business.longitude },
    );

    return {
      name: business.name,
      latitude: business.latitude,
      longitude: business.longitude,
      distance,
    };
  }

  /**
   * Private method to get all businesses from the database, with optional filtering by type
   *
   * @param {string} businessType - the type of business to filter by
   * @returns {Promise<Business[]>} - a list of ALL businesses, filtered by type if provided
   */
  private async selectAllBusinesses(
    businessType?: string,
  ): Promise<Business[]> {
    let query = this.businessRepository.createQueryBuilder('businesses');

    if (businessType) {
      businessType = this.capitalizeFirstLetter(businessType);
      query = query.where('businesses.type = :type', { type: businessType });
      console.log('query', query.getQuery());
    }

    return await query.getMany();
  }

  /**
   * Private helper method to capitalize the first letter of a string, and lowercase the rest
   *
   * @param {string} string - the string to format
   * @returns {string} - the formatted string
   */
  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
}
