import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DynamicForm } from '../dynamic-form/dynamic-form.model';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  private unpersistedDynamicForm!: DynamicForm;
  
  constructor(private client: HttpClient) { }
  
  public getForm(): Observable<DynamicForm> {
    if (this.unpersistedDynamicForm) {
      console.log("using the temporary");
      return of(this.unpersistedDynamicForm);
    } else {
      console.log("using the original");
      return this.client.get(`${environment.api}${environment.forms}`).pipe(map((data: any) => data.form as DynamicForm));
    }

  }

  public setForm(unpersistedDynamicForm: DynamicForm): void {
    this.unpersistedDynamicForm = unpersistedDynamicForm;
  }
}
