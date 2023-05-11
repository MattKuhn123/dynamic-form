import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router'

import { MatButtonModule } from '@angular/material/button';
import { MAT_CARD_CONFIG, MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DynamicFormEntryQuestionComponent } from './dynamic-form-entry-question.component';
import { DynamicFormEntryComponent } from './dynamic-form-entry.component';
import { PresubmitDialogComponent } from './presubmit-dialog.component';
import { DynamicFormEntryListComponent } from './dynamic-form-entry-list.component';
import { DynamicFormEntryStorageService } from './dynamic-form-entry-storage.service';

const appRoute: Routes = [
  { path: 'list', component: DynamicFormEntryListComponent },
  { path: 'single', component: DynamicFormEntryComponent },
];

@NgModule({
  declarations: [
    DynamicFormEntryComponent,
    DynamicFormEntryQuestionComponent,
    PresubmitDialogComponent,
    DynamicFormEntryListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(appRoute),

    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTooltipModule,
  ],
  providers: [
    DynamicFormEntryStorageService,
    {
      provide: MAT_CARD_CONFIG,
      useValue: {
        appearance: 'outlined'
      }
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline'
      }
    }
  ]
})
export class DynamicFormEntryModule { }
