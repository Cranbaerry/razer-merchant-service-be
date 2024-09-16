declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'prod' | 'dev';
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;

    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;

    S3_ACCESS_KEY_ID: string;
    S3_SECRET_ACCESS_KEY: string;
    S3_CDN_ENDPOINT: string;
    S3_CDN_URL: string;
    S3_CDN_BUCKET: string;

    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;
  }
}
