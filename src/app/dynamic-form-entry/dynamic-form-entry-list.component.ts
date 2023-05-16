import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormEditStorageService } from 'src/app/shared/dynamic-form-edit-storage.service';
import { DynamicFormEntryListItem } from './dynamic-form-entry-list-item.model';
import { DynamicFormEntryStorageService } from './dynamic-form-entry-storage.service';
import { AuthService } from '../auth.service.stub';
import { DynamicFormEditListItem } from '../shared/dynamic-form-edit-list-item.model';
import { DeleteConfirmDialog } from '../dynamic-form-edit/delete-confirm.dialog';

@Component({
  selector: 'app-dynamic-form-entry-list',
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
            <button type="button" mat-button matTooltip="view" color="primary" (click)="onClickView(form.editUUID)">
              <mat-icon>visibility</mat-icon>
            </button>
          </span>
          <mat-divider [inset]="true" *ngIf="!last"></mat-divider>
        </mat-list-item>
      </mat-list>
      <p *ngIf="!formList">Please wait...</p>
    </mat-card-content>
  </mat-card>

  <mat-card *ngIf="editUUID">
    <mat-card-header>
      <mat-card-title>
        Your entries
      </mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <mat-list>
        <mat-list-item role="listitem" *ngFor="let form of formEntryList; last as last">
          <span matListItemTitle>
            {{ form.title }}
            <button type="button" mat-icon-button matTooltip="edit" color="primary" (click)="onClickEdit(form)">
              <mat-icon>edit</mat-icon>
            </button>
            <button type="button" mat-icon-button matTooltip="delete" color="warn" (click)="onClickDelete(form)">
              <mat-icon>delete</mat-icon>
            </button>
          </span>
          <span matListItemMeta>
            <button type="button" mat-icon-button [matTooltip]="form.entryUUID">
              <mat-icon>list_alt</mat-icon>
            </button>
            <button type="button" mat-icon-button [matTooltip]="form.date.toString()">
              <mat-icon>edit_calendar</mat-icon>
            </button>
          </span>
          <mat-divider [inset]="true" *ngIf="!last"></mat-divider>
        </mat-list-item>
      </mat-list>
      <p *ngIf="!formEntryList">Please wait...</p>
      <p *ngIf="formEntryList && formEntryList.length === 0">You have not started any forms of this type</p>
    </mat-card-content>
    <mat-card-actions>
      <button type="button" mat-button matTooltip="edit" color="primary" (click)="onClickEdit(null)">
        Start new entry
      </button>
    </mat-card-actions>
  </mat-card>
  `
})
export class DynamicFormEntryListComponent implements OnInit {
  formList!: DynamicFormEditListItem[];
  editUUID: string = "";
  formEntryList!: DynamicFormEntryListItem[];

  constructor(private editStorage: DynamicFormEditStorageService,
    private entryStorage: DynamicFormEntryStorageService,
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void { this.init(); }
  
  protected async onClickView(editUUID: string): Promise<void> {
    this.editUUID = editUUID;
    this.formEntryList = await this.entryStorage.getFormList(this.editUUID, true);
  }
  
  protected onClickEdit(entry: DynamicFormEntryListItem | null): void {
    this.router.navigate(['/entry/single'], { queryParams: { key: this.editUUID, entryKey: entry?.entryUUID } });
  }

  protected async onClickDelete(entry: DynamicFormEntryListItem | null): Promise<void> {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, { data: { 
      key: `${entry?.title}`
    } });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          if (entry?.entryUUID) {
            await this.entryStorage.deleteForm(entry?.entryUUID);
            this.formEntryList = await this.entryStorage.getFormList(this.editUUID);
            this.snackBar.open("Deleted!", "Ok");
          }
        } catch (error) {
          this.snackBar.open("Failed!", "Ok");
        }
      }
    });
  }
  
  private async init(): Promise<void> { this.formList = await this.editStorage.getFormList(); }
}
