import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router'

import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { DynamicFormEditComponent } from './dynamic-form-edit.component';
import { DynamicFormEditFormComponent } from './dynamic-form-edit-form.component';
import { DynamicFormEditQuestionComponent } from './dynamic-form-edit-question.component';
import { DynamicFormEditQuestionsComponent } from './dynamic-form-edit-questions.component';
import { DynamicFormEditQuestionOptionsComponent } from './dynamic-form-edit-question-options.component';
import { DynamicFormEditQuestionConditionsComponent } from './dynamic-form-edit-question-conditions.component';
import { DynamicFormEditSectionComponent } from './dynamic-form-edit-section.component';
import { DynamicFormEditSectionsComponent } from './dynamic-form-edit-sections.component';
import { DynamicFormEditSectionConditionsComponent } from './dynamic-form-edit-section-conditions.component';

import { DynamicFormEditListComponent } from './dynamic-form-edit-list.component';

import { DynamicFormEditService } from './dynamic-form-edit.service';
import { DeleteConfirmDialog } from './delete-confirm.dialog';
import { EditQuestionKeyDialog } from './edit-question-key.dialog';
import { EditSectionKeyDialog } from './edit-section-key.dialog';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CKEditorModule } from 'ckeditor4-angular';

const appRoute: Routes = [
  { path: 'list', component: DynamicFormEditListComponent },
  { path: 'single', component: DynamicFormEditComponent }
]

@NgModule({
  declarations: [
    DynamicFormEditComponent,
    DynamicFormEditFormComponent,
    DynamicFormEditQuestionComponent,
    DynamicFormEditQuestionConditionsComponent,
    DynamicFormEditQuestionOptionsComponent,
    DynamicFormEditQuestionsComponent,
    DynamicFormEditSectionComponent,
    DynamicFormEditSectionConditionsComponent,
    DynamicFormEditSectionsComponent,
    
    DynamicFormEditListComponent,

    DeleteConfirmDialog,
    EditQuestionKeyDialog,
    EditSectionKeyDialog,
  ],
  imports: [
    CKEditorModule,
    ClipboardModule,
    CommonModule,
    DragDropModule,
    FormsModule,
    RouterModule.forChild(appRoute),

    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  providers: [
    DynamicFormEditService
  ]
})
export class DynamicFormEditModule { }
