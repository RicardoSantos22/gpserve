import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { InjectS3 } from '../../providers/aws-s3.provider';

@Injectable()
export class AwsS3Service {
  logger = new Logger('AwsSdkService');
  S3_BUCKET: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectS3() private readonly s3Client: S3,
  ) {
    this.S3_BUCKET = this.configService.get<string>('s3.bucket');
  }

  public async getSignedDownloadUrl(
    fileName: string,
    expiration = 360000,
  ): Promise<string> {
    const params = {
      Bucket: this.S3_BUCKET,
      Key: fileName,
      Expires: expiration,
    };
    this.logger.debug(params);
    try {
      const signedRequest = await this.s3Client.getSignedUrlPromise(
        'getObject',
        params,
      );
      this.logger.log(`AWS Returned Data: ${signedRequest}`);
      return signedRequest;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getSignedUploadUrl(
    fileName: string,
    fileType = 'image/jpeg',
  ): Promise<{ signedRequest: string; url: string }> {
    const s3Params = {
      Bucket: this.S3_BUCKET,
      Key: fileName,
      ContentType: fileType,
      ACL: 'public-read', //anyone should be able to see image
    };
    try {
      const signedRequest = await this.s3Client.getSignedUrlPromise(
        'putObject',
        s3Params,
      );
      const url = `https://${this.S3_BUCKET}.s3.amazonaws.com/${fileName}`;
      this.logger.log(`AWS Returned Data: ${signedRequest}`);
      return {
        signedRequest,
        url,
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async uploadFile(
    fileName: string,
    buffer: any,
    isPublic: boolean,
  ): Promise<string> {
    const params = {
      // ACL: 'public-read',
      Bucket: this.S3_BUCKET,
      Body: buffer,
      Key: fileName,
    }; // Uploading image directly from server
    if (isPublic) {
      params['ACL'] = 'public-read';
    }
    try {
      const data = await this.s3Client
        .upload(params, {
          tags: [{ Key: 'Date', Value: Date.now().toString() }],
        })
        .promise();
      this.logger.log(`AWS Returned Data: ${JSON.stringify(data)}`);
      const url = data.Location;
      return url;
    } catch (err) {
      this.logger.error('Error ocurrio aqui');
      this.logger.error(err);
      throw err;
    }
  }


  public async uploadBeners(fileName: string, buffer: any, isPublic: boolean,): Promise<string> {


    const params = {
      // ACL: 'public-read',
      Bucket: 'estrenatuauto-public-assets',
      Body: buffer,
      Key: fileName,
    }; // Uploading image directly from server

    console.log(params)
    if (isPublic) {
      params['ACL'] = 'public-read';
    }
    try {
      const data = await this.s3Client
        .upload(params, {
          tags: [{ Key: 'Date', Value: Date.now().toString() }],
        })
        .promise();
      this.logger.log(`AWS Returned Data: ${JSON.stringify(data)}`);
      const url = data.Location;
      console.log(url)
      return url;
    } catch (err) {
      this.logger.error('Error ocurrio aqui');
      this.logger.error(err);
      throw err;
    }

  }


  public async deleteFile(fileName: string): Promise<boolean> {
    const params = {
      Bucket: this.S3_BUCKET,
      Key: fileName,
    }; // Uploading image directly from server
    try {
      await this.s3Client.deleteObject(params).promise();
      return true;
    } catch (err) {
      this.logger.error('Error when attempting to delete file from S3 Bucket');
      this.logger.error(err);
      throw err;
    }
  }

  public async deleteMultipleFiles(fileNames: string[]): Promise<boolean> {
    const promisesArray = [];
    for (const fileName of fileNames) {
      const params = {
        Bucket: this.S3_BUCKET,
        Key: fileName,
      };
      promisesArray.push(this.s3Client.deleteObject(params).promise());
    }
    try {
      const results = await Promise.all(promisesArray);
      this.logger.debug(results);
      return true;
    } catch (err) {
      this.logger.error('Error when attempting to delete files from S3 Bucket');
      this.logger.error(err);
      throw err;
    }
  }
}
