import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DynamicForm } from './dynamic-form.model';

@Injectable()
export class DynamicFormService {
  constructor(private client: HttpClient) { }

  public getForm(): Observable<DynamicForm> {
    return this.client.get(`${environment.api}${environment.forms}`).pipe(map((data: any) => data.form as DynamicForm));
  }
}
