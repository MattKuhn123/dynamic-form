import { NgModule, isDevMode } from '@angular/core';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';

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

import { AppComponent } from './app.component';
import { DynamicFormQuestionComponent } from './dynamic-form/dynamic-form-question.component';
import { DynamicFormEditComponent } from './dynamic-form-edit/dynamic-form-edit.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { EditQuestionKeyDialog } from './dynamic-form-edit/edit-question-key.component';
import { EditSectionKeyDialog } from './dynamic-form-edit/edit-section-key.component';
import { DynamicFormEditFormComponent } from './dynamic-form-edit/dynamic-form-edit-form.component';
import { DynamicFormEditQuestionComponent } from './dynamic-form-edit/dynamic-form-edit-question.component';
import { PresubmitDialogComponent } from './dynamic-form/presubmit-dialog.component';
import { DynamicFormEditListComponent } from './dynamic-form-list/dynamic-form-list.component';
import { DynamicFormEditQuestionsComponent } from './dynamic-form-edit/dynamic-form-edit-questions.component';
import { DynamicFormEditSectionConditionsComponent } from './dynamic-form-edit/dynamic-form-edit-section-conditions.component';
import { DynamicFormEditSectionComponent } from './dynamic-form-edit/dynamic-form-edit-section.component';
import { DynamicFormEditQuestionOptionsComponent } from './dynamic-form-edit/dynamic-form-edit-question-options.component';
import { DynamicFormEditQuestionConditionsComponent } from './dynamic-form-edit/dynamic-form-edit-question-conditions.component';
import { DynamicFormEditSectionsComponent } from './dynamic-form-edit/dynamic-form-edit-sections.component';

export const appRoute: Routes = [
  { path: '', component: DynamicFormEditListComponent },
  { path: 'edit', component: DynamicFormEditComponent },
  { path: 'test', component: DynamicFormComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    DynamicFormQuestionComponent,
    DynamicFormEditComponent,
    DynamicFormComponent,
    EditQuestionKeyDialog,
    EditSectionKeyDialog,
    DynamicFormEditFormComponent,
    DynamicFormEditQuestionComponent,
    PresubmitDialogComponent,
    DynamicFormEditListComponent,
    DynamicFormEditQuestionsComponent,
    DynamicFormEditSectionConditionsComponent,
    DynamicFormEditSectionComponent,
    DynamicFormEditQuestionOptionsComponent,
    DynamicFormEditQuestionConditionsComponent,
    DynamicFormEditSectionsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CKEditorModule,
    ClipboardModule,
    DragDropModule,
    FormsModule ,
    HttpClientModule,
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
    RouterModule.forRoot(appRoute),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
