import Redis from 'ioredis';

const redis = new Redis({
  host: 'redis', 
  port: Number(process.env.REDIS_PORT) || 6379, 
  password: process.env.REDIS_PASSWORD || 'your_redis_password', 
  db: 0,
});

export default redis;
