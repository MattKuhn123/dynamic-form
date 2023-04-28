import { Injectable } from '@angular/core';
import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { environment } from 'src/environments/environment';
import { DynamicForm } from './dynamic-form.model';

@Injectable({
  providedIn: 'root'
})
export class S3Service {
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
      Bucket: environment.AWS_BUCKET,
      Key: dynamicForm.title,
      Body: JSON.stringify(dynamicForm),
      ACL: 'public-read',
      ContentType: 'json'
    });

    return this.bucket.send(command);
  }

  public async getFormList(): Promise<string[]>  {
    const command = new ListObjectsV2Command({
      Bucket: environment.AWS_BUCKET,
      MaxKeys: 10,
    });

    let isTruncated: any = true;
    let contents: string[] = [];

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } = await this.bucket.send(command);
      if (Contents) {
        const keys: string[] = Contents.map(c => c.Key || "");
        keys.forEach(key => contents.push(key));
        isTruncated = IsTruncated;
        command.input.ContinuationToken = NextContinuationToken;
      }
    }

    return contents;
  }

  public async getForm(key: string): Promise<DynamicForm> {
    await this.getFormList();

    const command = new GetObjectCommand({
      Bucket: environment.AWS_BUCKET,
      Key: key
    });

    const output = await this.bucket.send(command);
    const jzon = await output.Body?.transformToString();
    const json: any = JSON.parse(jzon || "{}");
    return new DynamicForm(json);
  }
}
