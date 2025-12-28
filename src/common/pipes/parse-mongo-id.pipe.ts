import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string) {
    // console.log('value & metadata', value, metadata);
    if (!isValidObjectId(value)) {
      throw new BadRequestException('Invalid ObjectId');
    }
    return value;
  }
}
