import cacheConfig from '@config/cache';
import Redis, { Redis as RedisClient } from 'ioredis';
import { ICacheProvider } from '../models/ICacheProvider';

export class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: string): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const recoveredData = await this.client.get(key);

    if (!recoveredData) {
      return null;
    }

    const parsedData = JSON.parse(recoveredData) as T;

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {}

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);

    const pipeline = this.client.pipeline();
    keys.forEach(key => {
      pipeline.del(key);
    });

    await pipeline.exec();
    console.log(`invalidate prefix: ${prefix}`);
  }
}