import { Module } from '@nestjs/common';
import { AwsS3Provider } from './providers/aws-s3.provider';
import { AwsS3Service } from './services/aws-s3/aws-s3.service';

@Module({
  providers: [
    AwsS3Provider,
    AwsS3Service
  ],
  exports: [AwsS3Service],
})
export class BucketModule {}
