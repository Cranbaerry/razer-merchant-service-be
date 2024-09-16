import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { request, stash } from 'pactum';
import { AppModule } from '~api/app.module';

export async function initNestBackendForTesting() {
  let app: INestApplication<any>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();

    app.use(helmet());
    app.enableCors({ credentials: true });
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ limit: '50mb', extended: true }));
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    const port = Number(process.env.PORT || 3001);
    await app.listen(port);

    request.setBaseUrl(await app.getUrl());
  });

  afterAll(async () => {
    await app.close();
  });
}

export function getDataMap(key: string) {
  const datamap = stash.getDataMap();
  return datamap[key];
}

export function updateDataMap(key: string, value: any) {
  stash.addDataMap({
    [key]: value,
  });
}
