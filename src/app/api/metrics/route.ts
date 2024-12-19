import client from 'prom-client';

const register = new client.Registry();
client.collectDefaultMetrics({ register });

// const crimeCounter = new client.Counter({
//   name: 'crime_count',
//   help: 'Total number of crimes',
// });

// setInterval(() => {
//   crimeCounter.inc();
// }, 1000);

export async function GET() {
  const response = new Response(await register.metrics(), {
    headers: {
      'Content-Type': register.contentType,
    },
  });

  return response;
}
