import { Injectable } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';

@Injectable()
@Console()
export class CliService {
  @Command({ command: 'hello' })
  sayHello() {
    console.log('Hello World!');
  }
}
