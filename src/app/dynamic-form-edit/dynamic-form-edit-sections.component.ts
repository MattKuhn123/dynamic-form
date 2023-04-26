import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormSection } from '../shared/dynamic-form-section.model';
import { EditSectionKeyDialog } from './edit-section-key.component';
import { DynamicFormEditService } from '../shared/dynamic-form-edit.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dynamic-form-edit-sections',
  styles: [
    'mat-panel-description { display: flex; gap: 5px; flex-wrap: wrap; }',
    'footer { position: fixed; bottom: 10px; text-align: center; width: 100%; }',
  ],
  template: `<div [formGroup]="fg">
  <mat-card>
    <mat-card-content>
      <mat-list formArrayName="sections" cdkDropList (cdkDropListDropped)="drop($event)">
        <mat-list-item role="listitem"*ngFor="let section of s.controls; let i = index" [formGroupName]="i" #secListItem cdkDrag>
          <mat-icon matListItemIcon>drag_indicator</mat-icon>
          <span matListItemTitle>
            Section {{ i+1 }}: {{ dfeSvc.getSectionKey(s, i).getRawValue() }}
            <button mat-button color="primary" (click)="onClickEditSection(i)"><mat-icon>edit</mat-icon></button>
            <button mat-button color="warn" (click)="onClickRemoveSection(i)"><mat-icon>delete</mat-icon></button>
            <button mat-button matTooltip="list" *ngIf="dfeSvc.getSectionList(s, i).getRawValue()">
                <mat-icon>list_alt</mat-icon>
            </button>
            <button mat-button matTooltip="not required" *ngIf="!dfeSvc.getSectionRequired(s, i).getRawValue()">
              <mat-icon>flaky</mat-icon>
            </button>
            <button mat-button matTooltip="questions">
              <mat-icon [matBadge]="dfeSvc.getQuestions(s, i).length" matBadgeColor="accent" matBadgeOverlap="false" matBadgeSize="small">question_answer</mat-icon>
            </button>
            <button mat-button matTooltip="conditions" *ngIf="dfeSvc.getSectionConditions(s, i).length > 0">
              <mat-icon [matBadge]="dfeSvc.getSectionConditions(s, i).length" matBadgeColor="accent" matBadgeOverlap="false" matBadgeSize="small">rule</mat-icon>
            </button>
          </span>
        </mat-list-item>
      </mat-list>
    </mat-card-content>
    <mat-card-actions>
      <button type="button" (click)="onClickAddSection()" mat-stroked-button color="primary">Add</button>
    </mat-card-actions>
  </mat-card>

  <mat-card>
    <mat-card-content>
      <mat-tab-group [formGroup]="secEdit">
        <mat-tab label="Properties">
          <div>
            <mat-form-field>
              <mat-label for="section-key">Key</mat-label>
              <input matInput formControlName="key" id="section-key" type="text"/>
              <mat-icon matSuffix color="primary" matTooltip="edit" (click)="onClickEditSectionKey(0)">edit</mat-icon>
            </mat-form-field>
          </div>
          <div>
            <mat-label for="section-required">
              <mat-checkbox formControlName="required" id="section-required"></mat-checkbox>
              Section is required
            </mat-label>
          </div>
          <div>
            <mat-label for="section-list">
              <mat-checkbox formControlName="list" id="section-list"></mat-checkbox>
              Section is list
            </mat-label>
          </div>
          <div>
            <mat-form-field>
              <mat-label for="section-description">Description</mat-label>
              <textarea matInput formControlName="description" id="section-description" type="text"></textarea>
            </mat-form-field>
          </div>
        </mat-tab>

        <mat-tab label="Questions">
          <app-dynamic-form-edit-questions [fb]="fb" [fg]="fg" [i]="0"></app-dynamic-form-edit-questions>
        </mat-tab>
        
        <mat-tab label="Conditions">
          <div *ngIf="secEditConditions.controls.length === 0">
            <div>
              <em>There are no conditions under which this section will be displayed, so it will always be displayed by default.</em>
            </div>
            <div>
              <button mat-button color="primary" (click)="onClickAddSectionCondition(0)">
                Add condition
              </button>
            </div>
          </div>

          <div *ngFor="let conditions of secEditConditions.controls; let doi = index" formArrayName="conditions">
            <div [formGroupName]="doi">
              <mat-form-field>
                <mat-label attr.for="conditions-{{doi}}-section">Section</mat-label>
                <mat-select id="conditions-{{doi}}-section" formControlName="section">
                  <mat-option *ngFor="let key of dfeSvc.getSectionsForSectionConditions(s)" [value]="key">{{ key }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field>
                <mat-label attr.for="conditions-{{doi}}-key">Question</mat-label>
                <mat-select id="conditions-{{doi}}-key" formControlName="key">
                  <mat-option *ngFor="let conditionalQuestion of dfeSvc.getQuestionsForConditions(s, this.getSectionConditionsSection(doi).getRawValue())" [value]="conditionalQuestion">
                    {{ conditionalQuestion }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field>
                <mat-label attr.for="conditions-{{doi}}-key">Value</mat-label>
                <mat-select id="conditions-{{doi}}-value" formControlName="value">
                  <mat-option *ngFor="let option of dfeSvc.getValuesForConditions(s, this.getSectionConditionsSection(doi).getRawValue(), this.getSectionConditionsQuestion(doi).getRawValue())" [value]="option.key">
                    {{ option.value }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <button mat-icon-button color="warn" (click)="onClickRemoveSectionCondition(doi)">
                <mat-icon>delete</mat-icon>
              </button>

              <button mat-icon-button color="primary" (click)="onClickAddSectionCondition(doi)">
                <mat-icon>add</mat-icon>
              </button>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-card-content>
  </mat-card>

  <!-- <mat-accordion formArrayName="sections" >
    <mat-expansion-panel *ngFor="let section of s.controls; let i = index" [formGroupName]="i" #secPanel>
      <mat-stepper orientation="horizontal">
        <mat-step formArrayName="conditions" [label]="dfeSvc.getSectionConditions(s, i).controls.length === 0 ? 'Section Conditions (None)' : 'Section Conditions'">
          <div *ngIf="dfeSvc.getSectionConditions(s, i).controls.length === 0">
            <div>
              <em>There are no conditions under which this section will be displayed, so it will always be displayed by default.</em>
            </div>
            <div>
              <button mat-button color="primary" (click)="onClickAddSectionCondition(i, 0)">
                Add condition
              </button>
            </div>
          </div>
          <div *ngFor="let conditions of dfeSvc.getSectionConditions(s, i).controls; let doi = index">
            <div [formGroupName]="doi">
              <mat-form-field>
                <mat-label attr.for="conditions-{{i}}-{{doi}}-section">Section</mat-label>
                <mat-select id="conditions-{{i}}-{{doi}}-section" formControlName="section">
                  <mat-option *ngFor="let key of dfeSvc.getSectionsForSectionConditions(s)" [value]="key">{{ key }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field>
                <mat-label attr.for="conditions-{{i}}-{{doi}}-key">Question</mat-label>
                <mat-select id="conditions-{{i}}-{{doi}}-key" formControlName="key">
                  <mat-option *ngFor="let conditionalQuestion of dfeSvc.getQuestionsForConditions(s, dfeSvc.getSectionConditionsSection(s, i, doi).getRawValue())" [value]="conditionalQuestion">
                    {{ conditionalQuestion }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field>
                <mat-label attr.for="conditions-{{i}}-{{doi}}-key">Value</mat-label>
                <mat-select id="conditions-{{i}}-{{doi}}-value" formControlName="value">
                  <mat-option *ngFor="let option of dfeSvc.getValuesForConditions(s, dfeSvc.getSectionConditionsSection(s, i, doi).getRawValue(), dfeSvc.getSectionConditionsQuestion(s, i, doi).getRawValue())" [value]="option.key">
                    {{ option.value }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <button mat-icon-button color="warn" (click)="onClickRemoveSectionCondition(i, doi)">
                <mat-icon>delete</mat-icon>
              </button>

              <button mat-icon-button color="primary" (click)="onClickAddSectionCondition(i, doi)">
                <mat-icon>add</mat-icon>
              </button>
            </div>
          </div>
        </mat-step>
      </mat-stepper>
    </mat-expansion-panel>
  </mat-accordion> -->
  </div>`
})
export class DynamicFormEditSectionsComponent {
  @Input() fg!: FormGroup;
  @Input() fb!: FormBuilder;
  get s(): FormArray { return this.fg.get("sections") as FormArray; }
  protected secEdit!: FormGroup;
  protected get secEditConditions(): FormArray { return this.secEdit.get("conditions") as FormArray; }

  constructor(protected dfeSvc: DynamicFormEditService, private dialog: MatDialog) { }
  
  ngOnInit(): void {
    this.secEdit = this.dfeSvc.getSection(this.s, 0);
  }

  protected onClickEditSectionKey(secIdx: number): void {
    const dialogRef = this.dialog.open(EditSectionKeyDialog, { data: { 
      secIdx: secIdx, 
      secKey: this.dfeSvc.getSectionKey(this.s, secIdx).getRawValue(), 
      invalid: (this.s.getRawValue() as DynamicFormSection[]).map(section => section.key) 
    } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dfeSvc.getSectionKey(this.s, secIdx).patchValue(result);
      }
    });
  }

  protected getSectionConditionsSection(dpdsIdx: number): FormControl { return this.secEditConditions.at(dpdsIdx).get("section") as FormControl; }
  protected getSectionConditionsQuestion(dpdsIdx: number): FormControl { return this.secEditConditions.at(dpdsIdx).get("key") as FormControl; }

  protected onClickAddSection(): void { this.s.push(this.dfeSvc.sectionToGroup(this.fb, new DynamicFormSection())); }
  protected onClickRemoveSection(secIdx: number): void { this.s.removeAt(secIdx); }
  protected onClickEditSection(secEditIdx: number): void { this.secEdit = this.dfeSvc.getSection(this.s, secEditIdx) }

  protected onClickAddSectionCondition(doIdx: number): void { this.secEditConditions.insert(doIdx, this.dfeSvc.sectionConditionsToGroup(this.fb, {key: "", section: "", value: ""})); }
  protected onClickRemoveSectionCondition(doi: number): void { this.secEditConditions.removeAt(doi); }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.s.controls, event.previousIndex, event.currentIndex);
  }
}

