import { GET } from './route';
import { prisma } from '@/lib/prisma';
import redis from '@/lib/redis';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    crime: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock('@/lib/redis');

describe('GET /crimes', () => {
  const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
  const mockedRedis = redis as jest.Mocked<typeof redis>;

  it('devrait récupérer les crimes depuis le cache si disponibles', async () => {

    mockedRedis.get.mockResolvedValueOnce('[{"id": 1, "incidentDate": "2023-12-18T12:00:00Z", "offenseLevel": "Felony", "offenseDescription": "Robbery", "reportDate": "2023-12-18T12:00:00Z", "latitude": 40.7128, "longitude": -74.0060}]');

    const response = await GET();

    expect(mockedRedis.get).toHaveBeenCalledWith('crimes_data');
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(await response.json()).toEqual([{
      id: 1,
      incidentDate: "2023-12-18T12:00:00Z",
      offenseLevel: "Felony",
      offenseDescription: "Robbery",
      reportDate: "2023-12-18T12:00:00Z",
      latitude: 40.7128,
      longitude: -74.0060
    }]);
  });

  it('devrait récupérer les crimes depuis la base de données et les mettre en cache', async () => {

    mockedRedis.get.mockResolvedValueOnce(null);

    const mockedCrimeData = [
      {
        id: 1,
        incidentDate: '2023-12-18T12:00:00Z',
        offenseLevel: 'Felony',
        offenseDescription: 'Robbery',
        reportDate: '2023-12-18T12:00:00Z',
        latitude: 40.7128,
        longitude: -74.0060,
      }
    ];

    (mockedPrisma.crime.findMany as jest.Mock).mockResolvedValueOnce(mockedCrimeData);

    mockedRedis.setex.mockResolvedValueOnce('OK');

    const response = await GET();

    expect(mockedRedis.get).toHaveBeenCalledWith('crimes_data');
    expect(mockedPrisma.crime.findMany).toHaveBeenCalled();
    expect(mockedRedis.setex).toHaveBeenCalledWith('crimes_data', 3600, JSON.stringify(mockedCrimeData));
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(await response.json()).toEqual(mockedCrimeData);
  });

  it('devrait retourner une erreur si la récupération des données échoue dans Redis', async () => {

    mockedRedis.get.mockRejectedValueOnce(new Error('Redis error'));

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Error fetching or saving crime data' });
  });

  it('devrait retourner une erreur si la récupération des données échoue dans Prisma', async () => {

    mockedRedis.get.mockResolvedValueOnce(null);

    (mockedPrisma.crime.findMany as jest.Mock).mockRejectedValueOnce(new Error('Prisma error'));

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Error fetching or saving crime data' });
  });
});