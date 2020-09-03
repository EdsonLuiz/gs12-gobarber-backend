import { ICacheProvider } from '../models/ICacheProvider';

type CacheData = {
  [key: string]: string;
};

export class FakeCacheProvider implements ICacheProvider {
  private cache: CacheData = {};

  public async save(key: string, value: string): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const recoveredData = this.cache[key];
    if (!recoveredData) {
      return null;
    }

    const parsedData = JSON.parse(recoveredData) as T;

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`),
    );

    keys.forEach(key => {
      delete this.cache[key];
    });
  }
}
