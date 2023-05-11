import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormEditStorageService } from 'src/app/shared/dynamic-form-edit-storage.service';
import { DynamicFormEditListItem } from '../shared/dynamic-form-edit-list-item.model';
import { DeleteConfirmDialog } from './delete-confirm.dialog';
import { DynamicForm } from '../shared/dynamic-form.model';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-dynamic-form-edit-list',
  styles: [],
  template: `
  <mat-card>
    <mat-card-header>
      <mat-card-title>
        Available forms
      </mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <mat-list *ngIf="formList">
        <mat-list-item role="listitem" *ngFor="let form of formList; last as last">
          <span matListItemTitle>
            {{ form.title }}
            <button type="button" mat-icon-button matTooltip="edit" color="primary" (click)="onClickEdit(form.editUUID)">
              <mat-icon>edit</mat-icon>
            </button>
            <button type="button" mat-icon-button matTooltip="test" color="primary" (click)="onClickView(form.editUUID)">
              <mat-icon>science</mat-icon>
            </button>
            <button type="button" mat-icon-button matTooltip="delete" color="warn" (click)="onClickDelete(form.editUUID, form.title)">
              <mat-icon>delete</mat-icon>
            </button>
          </span>
          <mat-divider [inset]="true" *ngIf="!last"></mat-divider>
        </mat-list-item>
      </mat-list>
      <div *ngIf="!formList"> Please wait... </div>
    </mat-card-content>
    <mat-card-actions>
    <button type="button" mat-button color="primary" (click)="onClickAdd()">
        Add form
      </button>
    </mat-card-actions>
  </mat-card>
  `,
})
export class DynamicFormEditListComponent implements OnInit {
  formList!: DynamicFormEditListItem[];

  constructor(private editStorage: DynamicFormEditStorageService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void { this.init(); }
  
  protected onClickEdit(key: string): void { this.router.navigate(['/edit/single'], { queryParams: { key: key } }); }
  protected onClickView(key: string): void { this.router.navigate(['/entry/single'], { queryParams: { key: key } }); }
  protected async onClickDelete(key: string, title: string): Promise<void> {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, { data: { 
      key: `${title}`
    } });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.editStorage.deleteForm(key);
          await this.init();
          this.snackBar.open("Deleted!", "Ok");
        } catch(error) {
          this.snackBar.open("Failed!", "Ok");
        }
      }
    });
  }

  protected onClickAdd(): void {
    this.editStorage.putForm(new DynamicForm({
      editUUID: uuid(),
      title: 'My new form',
      subtitle: '',
      sections: []
    }))
  }

  private async init(): Promise<void> { this.formList = await this.editStorage.getFormList(); }
}
