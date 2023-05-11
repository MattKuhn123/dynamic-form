import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service.stub';
import { DynamicFormEntry } from '../shared/dynamic-form-entry.model';
import { DynamicFormEntryListItem } from './dynamic-form-entry-list-item.model';
import { DynamicFormEditStorageService } from '../shared/dynamic-form-edit-storage.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DynamicFormEntryStorageService {
  private forms: DynamicFormEntry[] = [];
  get tableName(): string { return 'FormEntry'; }

  constructor(private auth: AuthService,
    private editStorage: DynamicFormEditStorageService,
    private http: HttpClient) { }

  public async putForm(dynamicFormEntry: DynamicFormEntry): Promise<Object> {
    try {
      dynamicFormEntry.lastAccessedDate = new Date();
      const result: Object = await firstValueFrom(this.http.post(`${environment.FORMENTRY_API}`, {
        TableName: this.tableName, 
        Item: dynamicFormEntry
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      }));

      const idx: number = this.forms.findIndex(form => form.entryUUID === dynamicFormEntry.entryUUID);
      if (idx > -1) {
        this.forms[idx] = dynamicFormEntry;
      } else {
        this.forms.push(dynamicFormEntry)
      }
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async getFormList(editUUID: string, forceRefresh: boolean = false): Promise<DynamicFormEntryListItem[]> {
    try {
      if (forceRefresh) {
        this.forms = [];
      }

      if (this.forms.length === 0) {
        const result: any = await firstValueFrom(this.http.get(`${environment.FORMENTRY_API}?TableName=${this.tableName}&User=${this.auth.user}`));
        this.forms = result.Items as DynamicFormEntry[];
      }
  
      const result: DynamicFormEntryListItem[] = await Promise.all(this.forms.map(async (form)=> {
        const title: string = (await this.editStorage.getFormList()).find(f => f.editUUID == editUUID)!.title;
        return new DynamicFormEntryListItem({
          editUUID: form.editUUID,
          entryUUID: form.entryUUID,
          title: title,
          user: this.auth.user,
          date: form.lastAccessedDate
        });
      }));

      return result;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  public async getForm(key: string): Promise<DynamicFormEntry> {
    const form: DynamicFormEntry | undefined = this.forms.find(f => f.entryUUID === key);
    if (form) {
      return form;
    }

    const newForm: DynamicFormEntry = new DynamicFormEntry({
      user: this.auth.user,
      lastAccessedDate: new Date()
    });
    this.forms.push(newForm);
    return newForm;
  }

  public async deleteForm(key: string) : Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`${environment.FORMENTRY_API}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          TableName: this.tableName,
          Key: { entryUUID: key }
        }
      }));
      const idx: number = this.forms.findIndex(form => form.entryUUID === key);
      this.forms.splice(idx, 1);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
