import { Injectable } from '@angular/core';
import { GetObjectCommand, GetObjectTaggingCommand, ListObjectsV2Command, PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service.stub';
import { DynamicFormEntry } from '../shared/dynamic-form-entry.model';
import { DynamicFormEntryListItem } from './dynamic-form-entry-list-item.model';
import { DynamicFormEditStorageService } from '../shared/dynamic-form-edit-storage.service';

@Injectable()
export class DynamicFormEntryStorageService {
  private bucket: S3Client;

  constructor(private auth: AuthService, private editStorage: DynamicFormEditStorageService) {
    this.bucket = new S3Client({
      credentials: {
        accessKeyId: environment.AWS_ACCESS_KEY_ID,
        secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
      },
      region: environment.AWS_REGION,
    });
  }

  public async putForm(dynamicFormEntry: DynamicFormEntry): Promise<PutObjectCommandOutput> {
    const command = new PutObjectCommand({
      Bucket: environment.AWS_BUCKET_ENTRIES,
      Key: dynamicFormEntry.entryUUID,
      Body: JSON.stringify(dynamicFormEntry),
      ACL: 'public-read',
      ContentType: 'json',
      Tagging: `user=${this.auth.user}&form=${dynamicFormEntry.editUUID}`,
    });

    return this.bucket.send(command);
  }

  public async getFormList(user: string | undefined, formUUID: string): Promise<DynamicFormEntryListItem[]> {
    const command = new ListObjectsV2Command({
      Bucket: environment.AWS_BUCKET_ENTRIES,
      MaxKeys: 100,
    });

    let isTruncated: any = true;
    let contents: DynamicFormEntryListItem[] = [];

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } = await this.bucket.send(command);
      if (Contents) {
        Contents.forEach(async (content) => {
          const command = new GetObjectTaggingCommand({
            Bucket: environment.AWS_BUCKET_ENTRIES,
            Key: content.Key,
          });

          const tagResponse = await this.bucket.send(command);
          if (!!tagResponse.TagSet) {
            const entryUser = tagResponse.TagSet?.find(tag => tag.Key === 'user')?.Value;
            const entryForm = tagResponse.TagSet?.find(tag => tag.Key === 'form')?.Value;
  
            const isUser: boolean = user === entryUser;
            const isForm: boolean = formUUID === entryForm;
            if (entryUser && entryForm && isUser && isForm) {
              const dynamicForm = await this.editStorage.getForm(entryForm);
              contents.push(new DynamicFormEntryListItem({
                title: dynamicForm.title,
                user: entryUser,
                date: content.LastModified,
                editUUID: entryForm,
                entryUUID: content.Key
              }));
            }
          }
        });
        isTruncated = IsTruncated;
        command.input.ContinuationToken = NextContinuationToken;
      }
    }

    return contents;
  }

  public async getForm(key: string): Promise<DynamicFormEntry> {
    if (!key) {
      return new DynamicFormEntry({});
    }

    const command = new GetObjectCommand({
      Bucket: environment.AWS_BUCKET_ENTRIES,
      Key: key
    });

    const output = await this.bucket.send(command);
    const jzon = await output.Body?.transformToString();
    const json: any = JSON.parse(jzon || "{}");
    return new DynamicFormEntry(json);
  }
}
