import { GET } from './route';
import { prisma } from '@/lib/prisma';
import redis from '@/lib/redis';
import axios from 'axios';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    station: {
      upsert: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

jest.mock('@/lib/redis');
jest.mock('axios');

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const mockedRedis = redis as jest.Mocked<typeof redis>;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GET /stations', () => {

  afterAll(() => {
    if (mockedRedis.quit) {
      mockedRedis.quit(); 
    }
  });

  it('devrait récupérer les stations depuis l\'API et les enregistrer dans la base de données', async () => {

    mockedRedis.get.mockResolvedValueOnce(null);

    const mockedApiResponse = {
      data: {
        network: {
          stations: [
            {
              id: "1", 
              name: 'Station 1',
              latitude: 40.7128,
              longitude: -74.0060,
              free_bikes: 5,
              empty_slots: 3,
            },
          ],
        },
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockedApiResponse);

    (mockedPrisma.station.upsert as jest.Mock).mockResolvedValueOnce({
      id: "1", 
      name: 'Station 1',
      latitude: 40.7128,
      longitude: -74.0060,
      freeBikes: 5,
      emptySlots: 3,
    });

    (mockedPrisma.station.findMany as jest.Mock).mockResolvedValueOnce([{
      id: "1", name: 'Station 1', latitude: 40.7128, longitude: -74.0060, freeBikes: 5, emptySlots: 3
    }]);

    mockedRedis.setex.mockResolvedValueOnce('OK');

    const response = await GET();

    expect(mockedRedis.get).toHaveBeenCalledWith('stations_data');
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.citybik.es/v2/networks/citi-bike-nyc?fields=stations,id,name,latitude,longitude,free_bikes'
    );
    expect(mockedPrisma.station.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "1" },  
        update: expect.anything(),
        create: expect.anything(),
      })
    );
    expect(mockedRedis.setex).toHaveBeenCalledWith('stations_data', 3600, JSON.stringify([{
      id: "1", name: 'Station 1', latitude: 40.7128, longitude: -74.0060, freeBikes: 5, emptySlots: 3
    }]));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([{
      id: "1", name: 'Station 1', latitude: 40.7128, longitude: -74.0060, freeBikes: 5, emptySlots: 3
    }]);
  });

  it('devrait gérer les erreurs de Redis', async () => {

    mockedRedis.get.mockRejectedValueOnce(new Error('Redis error'));

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Error fetching or saving station data' });
  });

  it('devrait gérer les erreurs de Prisma', async () => {

    mockedRedis.get.mockResolvedValueOnce(null);

    (mockedPrisma.station.upsert as jest.Mock).mockRejectedValueOnce(new Error('Prisma error'));

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Error fetching or saving station data' });
  });
});