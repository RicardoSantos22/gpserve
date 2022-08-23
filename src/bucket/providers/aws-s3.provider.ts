import * as AWS from 'aws-sdk';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const AWS_S3_TOKEN = 'AWS_S3_TOKEN';

export const AwsS3Provider = {
  provide: AWS_S3_TOKEN,
  useFactory: async (configService: ConfigService) => {
    console.log(configService.get('s3.region'));
    return new AWS.S3({
      signatureVersion: 'v4',
      region: configService.get('s3.region'),
      accessKeyId: configService.get('s3.accessKey'),
      secretAccessKey: configService.get('s3.secretKey'),
    });
  },
  inject: [ConfigService],
};

export function InjectS3(): ParameterDecorator {
  return Inject(AWS_S3_TOKEN);
}
