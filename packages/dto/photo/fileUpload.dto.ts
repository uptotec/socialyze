export class FileUploadDto {
  photo: Express.MulterS3.File;
}

export class FilesUploadDto {
  photos: Array<Express.MulterS3.File>;
}
