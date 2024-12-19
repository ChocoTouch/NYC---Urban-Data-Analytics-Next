
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import redis from '@/lib/redis';

export async function GET() {
  try {
    const cacheKey = 'crimes_data';
    const cachedCrimes = await redis.get(cacheKey);

    if (cachedCrimes) {
      console.log('Données des crimes récupérées depuis le cache');
      return new NextResponse(cachedCrimes, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const crimes = await prisma.crime.findMany({
      // take: 100,
      // orderBy: {
      //   incidentDate: 'desc',
      // },
    });

    await redis.setex(cacheKey, 3600, JSON.stringify(crimes));

    return new NextResponse(JSON.stringify(crimes), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching or saving crime data:',error);
    return NextResponse.json({ error: 'Error fetching or saving crime data' }, { status: 500 });
  }
}