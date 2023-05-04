import { Injectable } from '@angular/core';
import { GetObjectCommand, PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { environment } from 'src/environments/environment';
import { DynamicForm } from '../shared/dynamic-form.model';

@Injectable()
export class DynamicFormEntryService {
  private bucket: S3Client;

  constructor() {
    this.bucket = new S3Client({
      credentials: {
        accessKeyId: environment.AWS_ACCESS_KEY_ID,
        secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
      },
      region: environment.AWS_REGION,
    });
  }

  public async putForm(dynamicForm: DynamicForm): Promise<PutObjectCommandOutput> {
    const command = new PutObjectCommand({
      Bucket: environment.AWS_BUCKET_ENTRIES,
      Key: dynamicForm.title,
      Body: JSON.stringify(dynamicForm),
      ACL: 'public-read',
      ContentType: 'json'
    });

    return this.bucket.send(command);
  }

  public async getForm(key: string): Promise<DynamicForm> {
    const command = new GetObjectCommand({
      Bucket: environment.AWS_BUCKET_ENTRIES,
      Key: key
    });

    const output = await this.bucket.send(command);
    const jzon = await output.Body?.transformToString();
    const json: any = JSON.parse(jzon || "{}");
    return new DynamicForm(json);
  }
}
