import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DynamicForm } from './dynamic-form.model';
import { DynamicFormEditListItem } from './dynamic-form-edit-list-item.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormEditStorageService {
  private forms: DynamicForm[] = [];
  get tableName(): string { return 'FormEdit'; }

  constructor(private http: HttpClient) { }

  public async putForm(dynamicForm: DynamicForm): Promise<Object> {
    try {
      const result: Object = await firstValueFrom(this.http.post(`${environment.FORMEDIT_API}`, {
        TableName: this.tableName, 
        Item: dynamicForm
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      }));

      const idx: number = this.forms.findIndex(form => form.editUUID === dynamicForm.editUUID);
      if (idx > -1) {
        this.forms[idx] = dynamicForm;
      } else {
        this.forms.push(dynamicForm)
      }
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async getFormList(forceRefresh: boolean = false): Promise<DynamicFormEditListItem[]> {
    try {
      if (forceRefresh) {
        this.forms = [];
      }

      if (this.forms.length === 0) {
        const result: any = await firstValueFrom(this.http.get(`${environment.FORMEDIT_API}?TableName=${this.tableName}`));
        this.forms = result.Items as DynamicForm[];
      }
  
      return this.forms.map(form => {
        return new DynamicFormEditListItem({
          editUUID: form.editUUID,
          title: form.title
        });
      });
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  public async getForm(key: string): Promise<DynamicForm> {
    const form: DynamicForm = this.forms.find(f => f.editUUID === key)!;
    return form;
  }

  public async deleteForm(key: string) : Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`${environment.FORMEDIT_API}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          TableName: this.tableName,
          Key: { editUUID: key }
        }
      }));
      const idx: number = this.forms.findIndex(form => form.editUUID === key);
      this.forms.splice(idx, 1);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
