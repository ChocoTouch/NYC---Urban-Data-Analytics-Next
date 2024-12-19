import { NextResponse } from 'next/server';
import axios from 'axios';
import { prisma } from '@/lib/prisma';
import redis from '@/lib/redis';

export async function GET() {
  try {

    const cacheKey = 'stations_data'; // Clé pour le cache Redis

    // Vérifier si les données sont déjà dans Redis
    const cachedStations = await redis.get(cacheKey);

    if (cachedStations) {
      console.log('Récupération des stations depuis le cache');
      return new NextResponse(cachedStations, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    const response = await axios.get(
      'https://api.citybik.es/v2/networks/citi-bike-nyc?fields=stations,id,name,latitude,longitude,free_bikes'
    );
    const stationsData = response.data.network.stations;
    for (const station of stationsData) {
      await prisma.station.upsert({
        where: { id: station.id },
        update: {
          name: station.name,
          latitude: station.latitude,
          longitude: station.longitude,
          freeBikes: station.free_bikes,
          emptySlots: station.empty_slots,
        },
        create: {
          id: station.id,
          name: station.name,
          latitude: station.latitude,
          longitude: station.longitude,
          freeBikes: station.free_bikes,
          emptySlots: station.empty_slots,
        },
      });
    }

    const stations = await prisma.station.findMany();

    if (!stations || stations.length === 0) {
      return NextResponse.json({ message: 'No stations found' }, { status: 404 });
    }

    await redis.setex(cacheKey, 3600, JSON.stringify(stations));

    return NextResponse.json(stations);
  } catch (error) {
    console.error('Error fetching or saving station data:', error);
    return NextResponse.json({ error: 'Error fetching or saving station data' }, { status: 500 });
  }
}