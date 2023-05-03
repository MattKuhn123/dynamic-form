import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { S3Service } from 'src/app/shared/s3.service';

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
        <mat-list-item role="listitem"  *ngFor="let form of formList">
          <span matListItemTitle>
            {{ form }}
            <button type="button" mat-button matTooltip="edit" color="primary" (click)="onClickEdit(form)">
              <mat-icon>edit</mat-icon>
            </button>
            <button type="button" mat-button matTooltip="view" color="primary" (click)="onClickView(form)">
              <mat-icon>visibility</mat-icon>
            </button>
          </span>
        </mat-list-item>
      </mat-list>
    </mat-card-content>
  </mat-card>
  `,
})
export class DynamicFormListComponent implements OnInit {
  formList!: string[];

  constructor(private s3: S3Service, private router: Router) { }

  ngOnInit(): void {
    this.init();
  }
  
  private async init(): Promise<void> {
    this.formList = await this.s3.getFormList();
  }

  protected onClickEdit(key: string): void { this.router.navigate(['/edit'], { queryParams: { key: key } }); }
  protected onClickView(key: string): void { this.router.navigate(['/run'], { queryParams: { key: key } }); }
}
