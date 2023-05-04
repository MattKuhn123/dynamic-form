import { Component, OnInit } from '@angular/core';
import { DynamicFormEditStorageService } from '../shared/dynamic-form-edit-storage.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DynamicFormEditService } from './dynamic-form-edit.service';
import { DynamicForm } from '../shared/dynamic-form.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dynamic-form-edit',
  styles: [
    'mat-panel-description { display: flex; gap: 5px; flex-wrap: wrap; }',
    'footer { position: fixed; bottom: 10px; text-align: center; width: 100%; }',
  ],
  template: `
    <form *ngIf="fg" [formGroup]="fg" (ngSubmit)="onSubmit()">      
      <app-dynamic-form-edit-form [fb]="fb" [fg]="fg"></app-dynamic-form-edit-form>
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
  
  constructor(private dfss: DynamicFormEditStorageService, private dfeSvc: DynamicFormEditService, protected fb: FormBuilder, private snackBar: MatSnackBar, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.init();
  }
  
  private async init(): Promise<void> {
    this.route.queryParams.subscribe((params: any) => {
      this.initForm(params.key)
    });
  }

  private async initForm(key: string): Promise<void> {
    try {
      const form: DynamicForm = await this.dfss.getForm(key);
      this.fg = this.fb.group({
        title: this.fb.control(form.title || ""),
        subtitle: this.fb.control(form.subtitle || ""),
        editUUID: this.fb.control(form.editUUID || ""),
        sections: this.fb.array(form.sections.map(section => this.dfeSvc.sectionToGroup(this.fb, section)) || [])
      });
    } catch (error) {
      console.log("ERROR", error);
    }
  }

  protected onSubmit(): void {
    if (!this.fg.valid) {
      this.snackBar.open("Please fix all issues", "OK");
      return;
    }

    this.dfss.putForm(this.fg.getRawValue());
    this.snackBar.open("Submitted!", "OK");
  }
}