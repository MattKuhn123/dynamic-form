import { Injectable } from '@angular/core';
import { GetObjectTaggingCommand, ListObjectsV2Command, PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { environment } from 'src/environments/environment';
import { DynamicForm } from '../shared/dynamic-form.model';
import { AuthService } from '../auth.service.stub';

@Injectable()
export class DynamicFormEntryService {
  private bucket: S3Client;

  constructor(private auth: AuthService) {
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
      Key: dynamicForm.entryUUID,
      Body: JSON.stringify(dynamicForm),
      ACL: 'public-read',
      ContentType: 'json',
      Tagging: `user=${this.auth.user}&form=${dynamicForm.title}`,
    });

    return this.bucket.send(command);
  }

  public async getFormList(user: string, form: string): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: environment.AWS_BUCKET_ENTRIES,
      MaxKeys: 100,
    });

    let isTruncated: any = true;
    let contents: string[] = [];

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } = await this.bucket.send(command);
      if (Contents) {
        const keys: string[] = Contents.map(c => c.Key || "");
        keys.forEach(async (key) => {
          const command = new GetObjectTaggingCommand({
            Bucket: environment.AWS_BUCKET_ENTRIES,
            Key: key,
          });

          const response = await this.bucket.send(command);
          if (!!response.TagSet) {
            const isUser: boolean = response.TagSet?.findIndex(tag => tag.Key === 'user' && tag.Value === user) > -1;
            const isForm: boolean = response.TagSet?.findIndex(tag => tag.Key === 'form' && tag.Value === form) > -1;
  
            if (isUser && isForm) {
              contents.push(key);
            }
          }
        });
        isTruncated = IsTruncated;
        command.input.ContinuationToken = NextContinuationToken;
      }
    }

    return contents;
  }
}
