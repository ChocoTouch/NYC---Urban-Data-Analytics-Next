import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost', 
  port: 6379, 
  password: 'your_redis_password', 
  db: 0,
});

export default redis;
