import { Component, OnInit } from '@angular/core';
import { DynamicFormService } from '../shared/dynamic-form.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DynamicFormEditService } from '../shared/dynamic-form-edit.service';

@Component({
  selector: 'app-dynamic-form-edit',
  styles: [
    'mat-panel-description { display: flex; gap: 5px; flex-wrap: wrap; }',
    'footer { position: fixed; bottom: 10px; text-align: center; width: 100%; }',
  ],
  template: `
    <form *ngIf="fg" [formGroup]="fg" (ngSubmit)="onSubmit()">      
      <app-dynamic-form-edit-sections [fb]="fb" [fg]="fg"></app-dynamic-form-edit-sections>

      <mat-sidenav-container>
        <footer>
          <button type="submit" mat-raised-button color="primary" *ngIf="fg" [cdkCopyToClipboard]="stringified">Submit</button>
        </footer>
      </mat-sidenav-container>
    </form>

    <mat-card>
      <mat-card-content>
        <mat-slide-toggle [formControl]="showJson">Show json</mat-slide-toggle>
        <pre *ngIf="fg && showJson.getRawValue()"> {{ stringified }} </pre>
      </mat-card-content>
    </mat-card>
  `,
})
export class DynamicFormEditComponent implements OnInit {
  fg!: FormGroup;
  get stringified(): string { return JSON.stringify(this.fg.getRawValue(), null, 4); };
  get sections(): FormArray { return this.fg.get("sections") as FormArray; }

  protected showJson: FormControl = new FormControl(false);
  
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

  protected onSubmit(): void {
    if (!this.fg.valid) {
      this.snackBar.open("Please fix all issues", "OK");
    }

    this.dfSvc.setForm(this.fg.getRawValue());
    this.snackBar.open("Submitted!", "OK");
  }
}