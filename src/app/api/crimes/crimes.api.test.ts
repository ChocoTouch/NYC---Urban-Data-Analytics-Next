import { createServer } from 'http';
import { GET } from '@/app/api/crimes/route'; 
import request from 'supertest'; 

import { prisma } from '@/lib/prisma';
import redis from '@/lib/redis';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    crime: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock('@/lib/redis', () => ({
  get: jest.fn(),
  setex: jest.fn(),
}));

const server = createServer((req, res) => {

  if (req.method === 'GET' && req.url === '/api/crimes') {
    GET().then(response => {
      res.statusCode = response.status;
      res.setHeader('Content-Type', 'application/json');
      response.json().then(data => res.end(JSON.stringify(data)));
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

describe('GET /api/crimes', () => {
    beforeAll(() => {
        server.listen(0, () => {
          const address = server.address();
          if (address && typeof address !== 'string') {
            const port = address.port;
            console.log(`Test server listening on port ${port}`);
          } else {
            throw new Error('Failed to start the server or invalid address');
          }
        });
      });

  afterAll(() => {
    server.close(); 
  });

  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it('devrait récupérer les crimes depuis le cache si disponibles', async () => {
    const mockCachedData = '[{"id": 1, "incidentDate": "2023-12-18T12:00:00Z", "offenseLevel": "Felony", "offenseDescription": "Robbery", "reportDate": "2023-12-18T12:00:00Z", "latitude": 40.7128, "longitude": -74.0060}]';

    (redis.get as jest.Mock).mockResolvedValueOnce(mockCachedData);

    const response = await request(server).get('/api/crimes');

    expect(response.status).toBe(200);
    expect(response.header['content-type']).toContain('application/json');
    expect(response.body).toEqual(JSON.parse(mockCachedData));
    expect(redis.get).toHaveBeenCalledWith('crimes_data');
  });

  it('devrait récupérer les crimes depuis la base de données et les mettre en cache', async () => {
    const mockCrimes = [
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

    (redis.get as jest.Mock).mockResolvedValueOnce(null);
    (prisma.crime.findMany as jest.Mock).mockResolvedValueOnce(mockCrimes);
    (redis.setex as jest.Mock).mockResolvedValueOnce('OK');

    const response = await request(server).get('/api/crimes');

    expect(response.status).toBe(200);
    expect(response.header['content-type']).toContain('application/json');
    expect(response.body).toEqual(mockCrimes);
    expect(redis.setex).toHaveBeenCalledWith('crimes_data', 3600, JSON.stringify(mockCrimes));
  });

  it('devrait retourner une erreur si la récupération des données échoue dans Redis', async () => {
    (redis.get as jest.Mock).mockRejectedValueOnce(new Error('Redis error'));

    const response = await request(server).get('/api/crimes');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Error fetching or saving crime data' });
  });

  it('devrait retourner une erreur si la récupération des données échoue dans Prisma', async () => {
    (redis.get as jest.Mock).mockResolvedValueOnce(null);
    (prisma.crime.findMany as jest.Mock).mockRejectedValueOnce(new Error('Prisma error'));

    const response = await request(server).get('/api/crimes');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Error fetching or saving crime data' });
  });
});