import { BootstrapConsole } from 'nestjs-console';
import { CliModule } from './cli.module';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const bootstrap = new BootstrapConsole({
  module: CliModule,
  useDecorators: true,
  contextOptions: {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  },
});
bootstrap.init().then(async (app) => {
  try {
    await app.init();
    await bootstrap.boot();
    await app.close();
    process.exit(0);
  } catch (e) {
    console.error(e);
    await app.close();
    process.exit(1);
  }
});
