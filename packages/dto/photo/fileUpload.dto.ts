import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  photo: Express.MulterS3.File;
}

export class FilesUploadDto {
  @ApiProperty({ type: 'file', format: 'binary' })
  photos: Array<Express.MulterS3.File>;
}
