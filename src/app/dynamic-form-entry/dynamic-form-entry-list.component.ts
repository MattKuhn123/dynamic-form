import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicFormEditStorageService } from 'src/app/shared/dynamic-form-edit-storage.service';

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
            {{ form }}
            <button type="button" mat-button matTooltip="view" color="primary" (click)="onClickView(form)">
              <mat-icon>edit</mat-icon>
            </button>
          </span>
        </mat-list-item>
      </mat-list>
    </mat-card-content>
  </mat-card>
  `
})
export class DynamicFormEntryListComponent implements OnInit {
  formList!: string[];

  constructor(private dfss: DynamicFormEditStorageService, private router: Router) { }

  ngOnInit(): void { this.init(); }
  
  protected onClickView(key: string): void { this.router.navigate(['/entry/single'], { queryParams: { key: key } }); }
  
  private async init(): Promise<void> { this.formList = await this.dfss.getFormList(); }
}
