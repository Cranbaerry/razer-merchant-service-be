import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { StorageService } from '~api/storage/storage.service';
import { UserWithoutPassword } from '~libs/entities';
import short from 'short-unique-id';
import { slugify } from '~libs/helpers';
import { GetUser } from '~api/decorators';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 3))
  async upload(
    @GetUser() user: UserWithoutPassword,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|pdf|doc|docx)/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 ** 2,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const uuid = new short({ length: 10 });

    const urls = await Promise.all(
      files.map(async (file) => {
        const fileName = file.originalname.split('.');

        const path = `${user.id}/${slugify(
          fileName[0],
        ).toLowerCase()}-${uuid()}.${fileName[1]}`;
        const url = `${process.env.S3_CDN_URL}/${path}`;

        await this.storageService.uploadBuffer(
          {
            storage: this.storageService.cdnStorage,
            url: process.env.S3_CDN_URL,
            bucket: process.env.S3_CDN_BUCKET,
            path: path,
            file: file.buffer,
            fileName: file.originalname,
          },
          true,
        );

        return url;
      }),
    );

    return urls;
  }
}
