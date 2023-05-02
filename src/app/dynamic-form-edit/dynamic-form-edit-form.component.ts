import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicFormEditService } from '../shared/dynamic-form-edit.service';

@Component({
  selector: 'app-dynamic-form-edit-form',
  styles: [
    'mat-panel-description { display: flex; gap: 5px; flex-wrap: wrap; }',
    'footer { position: fixed; bottom: 10px; text-align: center; width: 100%; }',
  ],
  template: `<div [formGroup]="fg">
  <mat-tab-group [selectedIndex]="selectedTabIndex" (selectedIndexChange)="selectedTabIndex = $event">
    <mat-tab label="Form">
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
              <mat-label for="description">Subtitle</mat-label>
              <textarea matInput formControlName="subtitle" id="subtitle" type="text"></textarea>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <app-dynamic-form-edit-sections
        [fb]="fb"
        [fg]="fg"
        (raiseClickEditSection)="handleClickEditSection($event)"
      ></app-dynamic-form-edit-sections>
    </mat-tab>
    <mat-tab label="Section" *ngIf="selectedTabIndex > 0">
      <app-dynamic-form-edit-section
        [fb]="fb"
        [fg]="fg"
        [secEditIdx]="secEditIdx"
        (raiseClickEditQuestion)="handleClickEditQuestion($event)"
      ></app-dynamic-form-edit-section>
    </mat-tab>
    <mat-tab label="Question" *ngIf="selectedTabIndex > 1">
      <app-dynamic-form-edit-question 
        [fb]="fb" 
        [fg]="fg" 
        [secEditIdx]="secEditIdx" 
        [qEditIdx]="qEditIdx"
      ></app-dynamic-form-edit-question>
    </mat-tab>
  </mat-tab-group>
  </div>`
})
export class DynamicFormEditFormComponent {
  @Input() fg!: FormGroup;
  @Input() fb!: FormBuilder;

  protected secEditIdx: number = 0;
  protected qEditIdx: number = 0;
  protected selectedTabIndex: number = 0;
  
  constructor(protected dfeSvc: DynamicFormEditService) { }

  protected handleClickEditSection(secEditIdx: number): void {
    this.selectedTabIndex = 1;
    this.secEditIdx = secEditIdx;
  }

  protected handleClickEditQuestion(qEditIdx: number): void {
    this.qEditIdx = qEditIdx;
    this.selectedTabIndex = 2;
  }
}

