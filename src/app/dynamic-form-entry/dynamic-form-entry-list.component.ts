import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicFormEditStorageService } from 'src/app/shared/dynamic-form-edit-storage.service';
import { DynamicFormEntryListItem } from './dynamic-form-entry-list-item.model';
import { DynamicFormEntryStorageService } from './dynamic-form-entry-storage.service';
import { AuthService } from '../auth.service.stub';
import { DynamicFormEditListItem } from '../shared/dynamic-form-edit-list-item.model';

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
        <mat-list-item role="listitem" *ngFor="let form of formList">
          <span matListItemTitle>
            {{ form.title }}
            <button type="button" mat-button matTooltip="view" color="primary" (click)="onClickView(form.editUUID)">
              <mat-icon>visibility</mat-icon>
            </button>
          </span>
        </mat-list-item>
      </mat-list>
    </mat-card-content>
  </mat-card>

  <mat-card *ngIf="formUUID">
    <mat-card-header>
      <mat-card-title>
        Your entries
      </mat-card-title>
    </mat-card-header>
    <mat-card-content >
      <mat-list>
        <mat-list-item role="listitem" *ngFor="let form of formEntryList">
          <span matListItemTitle>
            {{ form.title }}
            {{ form.date.toLocaleDateString() }}
            <button type="button" mat-button matTooltip="edit" color="primary" (click)="onClickEdit(form)">
              <mat-icon>edit</mat-icon>
            </button>
          </span>
        </mat-list-item>
      </mat-list>
      <p *ngIf="formUUID && formEntryList && formEntryList.length === 0">You have not started any forms of this type</p>
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
  formUUID: string = "";
  formEntryList!: DynamicFormEntryListItem[];

  constructor(private editStorage: DynamicFormEditStorageService,
    private entryStorage: DynamicFormEntryStorageService,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit(): void { this.init(); }
  
  protected async onClickView(key: string): Promise<void> {
    this.formUUID = key;
    this.formEntryList = await this.entryStorage.getFormList(this.auth.user, key);
  }
  
  protected onClickEdit(entry: DynamicFormEntryListItem | null): void {
    this.router.navigate(['/entry/single'], { queryParams: { key: this.formUUID, entryKey: entry?.entryUUID } });
  }
  
  private async init(): Promise<void> { this.formList = await this.editStorage.getFormList(); }
}
