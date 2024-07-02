import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { UploadedFile } from 'express-fileupload'; // or your file upload library
import { FileValidators } from './Validators';

@Injectable()
export class ValidateFilePipe implements PipeTransform {
  constructor(private readonly fileValidators: FileValidators) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const file: UploadedFile = value;

    const maxSize = 100000; 
    const fileType = 'image/jpeg'; 

    // Validate file size
    const sizeValidationResult = this.fileValidators.validateMaxFileSize(file, maxSize);
    if (!sizeValidationResult.valid) {
      throw new BadRequestException(sizeValidationResult.message);
    }

    // Validate file type
    const typeValidationResult = this.fileValidators.validateFileType(file, fileType);
    if (!typeValidationResult.valid) {
      throw new BadRequestException(typeValidationResult.message);
    }

    return value;
  }
}
