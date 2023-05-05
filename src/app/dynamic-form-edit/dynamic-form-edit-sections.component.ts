import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormSection } from '../shared/dynamic-form-section.model';
import { DynamicFormEditService } from './dynamic-form-edit.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DeleteConfirmDialog as DeleteConfirmDialog } from './delete-confirm.dialog';

@Component({
  selector: 'app-dynamic-form-edit-sections',
  styles: [],
  template: `
  <mat-card [formGroup]="fg">
    <mat-card-header>
      <mat-card-title>
        Sections
      </mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <div *ngIf="s.controls.length === 0">
        <div>
          <em>There are no sections in this form!</em>
        </div>
      </div>
      <mat-list formArrayName="sections" cdkDropList (cdkDropListDropped)="handleDropListDropped($event)">
        <mat-list-item role="listitem" *ngFor="let section of s.controls; let i = index; last as last" [formGroupName]="i" cdkDrag>
          <mat-icon matListItemIcon>drag_indicator</mat-icon>
          <span matListItemTitle>
            {{ dfeSvc.getSectionKey(s, i).getRawValue() }}
            <button type="button" mat-button matTooltip="edit" color="primary" (click)="onClickEditSection(i)"><mat-icon>edit</mat-icon></button>
            <button type="button" mat-button matTooltip="delete" color="warn" (click)="onClickRemoveSection(i)"><mat-icon>delete</mat-icon></button>
          </span>
          <span matListItemMeta>
            <button type="button" mat-button [matTooltip]="flatten(getSectionErrors(i))" color="warn" *ngIf="dfeSvc.getSection(s, i).invalid" ><mat-icon>error</mat-icon></button>
            <button type="button" mat-button matTooltip="list" *ngIf="dfeSvc.getSectionList(s, i).getRawValue()">
              <mat-icon>list_alt</mat-icon>
            </button>
            <button type="button" mat-button matTooltip="required" *ngIf="dfeSvc.getSectionRequired(s, i).getRawValue()">
              <mat-icon>emergency</mat-icon>
            </button>
            <button type="button" mat-button matTooltip="questions">
              <mat-icon [matBadge]="dfeSvc.getQuestions(s, i).length" matBadgeColor="primary" matBadgeOverlap="false" matBadgeSize="small">question_answer</mat-icon>
            </button>
            <button type="button" mat-button matTooltip="conditions" *ngIf="dfeSvc.getSectionConditions(s, i).length > 0">
              <mat-icon [matBadge]="dfeSvc.getSectionConditions(s, i).length" matBadgeColor="primary" matBadgeOverlap="false" matBadgeSize="small">rule</mat-icon>
            </button>
          </span>
          <mat-divider [inset]="true" *ngIf="!last"></mat-divider>
        </mat-list-item>
      </mat-list>
    </mat-card-content>
    <mat-card-actions>
      <button type="button" (click)="onClickAddSection()" mat-button color="primary">
        Add section
      </button>
    </mat-card-actions>
  </mat-card>
  `
})
export class DynamicFormEditSectionsComponent {
  @Input() fg!: FormGroup;
  @Input() fb!: FormBuilder;

  @Output() raiseClickEditSection: EventEmitter<number> = new EventEmitter<number>();

  get s(): FormArray { return this.fg.get("sections") as FormArray; }

  constructor(protected dfeSvc: DynamicFormEditService, private dialog: MatDialog) { }

  protected onClickEditSection(secEditIdx: number): void {
    this.raiseClickEditSection.emit(secEditIdx);
  }

  protected flatten(strings: string[]): string { return [... new Set(strings)].join(", "); }

  protected getSectionErrors(secIdx: number): string[] {
    const secForm: FormGroup = this.dfeSvc.getSection(this.s, secIdx);
    const errs: string[] = [];

    const formErrors: ValidationErrors | null | undefined = secForm?.errors;
    if (formErrors) {
      Object.keys(formErrors).forEach(keyError => {
        errs.push(keyError);
      });
    }

    Object.keys(secForm.controls).forEach(key => {
      const control = secForm.get(key);
      const controlErrors: ValidationErrors | null | undefined = control?.errors;
      if (controlErrors) {
        errs.push(key);
      }
    });

    return errs;
  }

  protected onClickAddSection(): void { this.s.push(this.dfeSvc.sectionToGroup(this.fb, new DynamicFormSection())); }
  protected onClickRemoveSection(secIdx: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, { data: { 
      key: this.dfeSvc.getSectionKey(this.s, secIdx).getRawValue()
    } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.s.removeAt(secIdx);
      }
    });
  }

  protected handleDropListDropped(event: CdkDragDrop<string[]>) { moveItemInArray(this.s.controls, event.previousIndex, event.currentIndex); }

}
