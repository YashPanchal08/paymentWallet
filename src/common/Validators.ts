import { Injectable } from '@nestjs/common';
import { UploadedFile } from 'express-fileupload'; 

export class FileValidators {
  validateMaxFileSize(file: UploadedFile, maxSize: number): { valid: boolean; message: string } {
    if (file.size > maxSize) {
      return {
        valid: false,
        message: `File size exceeds maximum size of ${maxSize} bytes`,
      };
    }
    return { valid: true, message: '' };
  }

  validateFileType(file: UploadedFile, fileType: string): { valid: boolean; message: string } {
    if (file.mimetype !== fileType) {
      return {
        valid: false,
        message: `File type must be ${fileType}`,
      };
    }
    return { valid: true, message: '' };
  }
}