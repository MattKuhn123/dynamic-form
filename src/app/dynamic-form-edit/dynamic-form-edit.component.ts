import { Component, OnInit } from '@angular/core';
import { DynamicFormService } from '../shared/dynamic-form.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DynamicFormEditService } from '../shared/dynamic-form-edit.service';

@Component({
  selector: 'app-dynamic-form-edit',
  styles: [
    'mat-panel-description { display: flex; gap: 5px; flex-wrap: wrap; }',
    'footer { position: fixed; bottom: 10px; text-align: center; width: 100%; }',
  ],
  template: `
    <form *ngIf="fg" [formGroup]="fg">
      <mat-card>
        <mat-card-content>
          <div>
            <mat-form-field>
              <mat-label for="title">Title</mat-label>
              <input matInput formControlName="title" id="title" type="text" />
            </mat-form-field>
          </div>
          <div>
            <mat-form-field>
              <mat-label for="description">Description</mat-label>
              <textarea matInput formControlName="description" id="description" type="text"></textarea>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>
      
      <app-dynamic-form-edit-sections [fb]="fb" [fg]="fg"></app-dynamic-form-edit-sections>
    </form>
    <!-- <mat-card>
      <mat-card-content>
        <pre *ngIf="fg"> {{ stringified }} </pre>
      </mat-card-content>
    </mat-card> -->
    
    <mat-sidenav-container>
      <footer>
        <button mat-raised-button color="primary" *ngIf="fg" [cdkCopyToClipboard]="stringified" (click)="onClickSave()">Save</button>
      </footer>
    </mat-sidenav-container>
  `,
})
export class DynamicFormEditComponent implements OnInit {
  fg!: FormGroup;
  get stringified(): string { return JSON.stringify(this.fg.getRawValue(), null, 4); };
  get sections(): FormArray { return this.fg.get("sections") as FormArray; }
  
  constructor(private dfSvc: DynamicFormService, private dfeSvc: DynamicFormEditService, protected fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.dfSvc.getForm().subscribe(form => {
      this.fg = this.fb.group({
        title: this.fb.control(form.title || ""),
        description: this.fb.control(form.description || ""),
        sections: this.fb.array(form.sections.map(section => this.dfeSvc.sectionToGroup(this.fb, section)) || [])
      });
    });
  }

  protected onClickSave(): void {
    this.dfSvc.setForm(this.fg.getRawValue());
    this.snackBar.open("Saved!", "OK");
  }
}