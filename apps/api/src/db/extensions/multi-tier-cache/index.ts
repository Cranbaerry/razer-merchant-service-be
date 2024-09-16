import { Prisma } from '@prisma/client';
import { hash } from 'object-code';
import {
  CacheConfig,
  ModelExtension,
  CACHE_OPERATIONS,
  KeyGeneratorArgs,
  CacheOptions,
} from './type';
import { multiCaching, caching, MultiCache, Milliseconds } from 'cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisOptions } from 'ioredis';
import superjson from 'superjson';

const redisOpts: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  tls: {},
};

function generateKey(args: KeyGeneratorArgs): string {
  return hash(args).toString();
}

function parseConfig(config: CacheConfig): CacheOptions {
  let options: CacheOptions = {};
  if (typeof config === 'object') {
    options = config;
  } else if (typeof config === 'number') {
    options.ttl = config;
  }
  return options;
}

let cache: MultiCache;
const oneMinute = 60 * 1000;
async function getOrSet<T>(
  key: string,
  getter: () => Promise<T>,
  ttl: Milliseconds,
): Promise<T> {
  if (!cache) {
    const memoryCache = await caching('memory', {
      max: 10_000,
      ttl: oneMinute,
      refreshThreshold: oneMinute * 0.3,
    });
    const redisCache = await caching(redisStore, {
      keyPrefix: 'cache:',
      ...redisOpts,
      ttl: oneMinute,
      refreshThreshold: oneMinute * 0.3,
    });

    cache = multiCaching([memoryCache, redisCache]);
  }
  const cached = await cache.get(key);
  if (!cached) {
    const value = await getter();
    if (!value) return;
    await cache.set(key, superjson.stringify(value), ttl);
    return value;
  } else {
    return superjson.parse<T>(cached as string);
  }
}
export default () => {
  return Prisma.defineExtension({
    name: 'cache',
    model: {
      $allModels: {} as ModelExtension,
    },
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const prismaArgs = args as any;
          const useCache = !!(
            ['number', 'boolean', 'object'].includes(typeof prismaArgs.cache) &&
            prismaArgs.cache !== null &&
            (CACHE_OPERATIONS as ReadonlyArray<string>).includes(operation)
          );

          if (!useCache) return query(args);

          const queryArgs = {
            ...prismaArgs,
          };
          delete queryArgs.cache;
          const options = parseConfig(prismaArgs.cache as CacheConfig);

          const key: string =
            options.key || generateKey({ model, operation, args: queryArgs });
          const ttl = options.ttl || oneMinute;
          return await getOrSet(key, async () => await query(queryArgs), ttl);
        },
      },
    },
  });
};
