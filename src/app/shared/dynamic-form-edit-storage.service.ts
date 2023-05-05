import { Injectable } from '@angular/core';
import { DeleteObjectCommand, DeleteObjectCommandOutput, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { environment } from 'src/environments/environment';
import { DynamicForm } from './dynamic-form.model';
import { DynamicFormEditListItem } from './dynamic-form-edit-list-item.model';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormEditStorageService {
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
      Key: dynamicForm.editUUID,
      Body: JSON.stringify(dynamicForm),
      ACL: 'public-read',
      ContentType: 'json'
    });

    return this.bucket.send(command);
  }

  public async getFormList(): Promise<DynamicFormEditListItem[]> {
    const command = new ListObjectsV2Command({
      Bucket: environment.AWS_BUCKET,
      MaxKeys: 10,
    });

    let isTruncated: any = true;
    let contents: DynamicFormEditListItem[] = [];

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } = await this.bucket.send(command);
      if (Contents) {
        Contents.forEach(async (content) => {
          if (content.Key) {
            const form: DynamicForm = await this.getForm(content.Key);
            contents.push(new DynamicFormEditListItem({
              editUUID: content.Key,
              title: form.title
            }));
          }
        });
        isTruncated = IsTruncated;
        command.input.ContinuationToken = NextContinuationToken;
      }
    }

    return contents;
  }

  public async getForm(key: string): Promise<DynamicForm> {
    const command = new GetObjectCommand({
      Bucket: environment.AWS_BUCKET,
      Key: key
    });

    const output = await this.bucket.send(command);
    const jzon = await output.Body?.transformToString();
    const json: any = JSON.parse(jzon || "{}");
    return new DynamicForm(json);
  }

  public async deleteForm(key: string) : Promise<DeleteObjectCommandOutput> {
    const command = new DeleteObjectCommand({
      Bucket: environment.AWS_BUCKET,
      Key: key
    });

    const response = await this.bucket.send(command);
    return response;
  }
}