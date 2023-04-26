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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppComponent } from './app.component';
import { DynamicFormQuestionComponent } from './dynamic-form/dynamic-form-question.component';
import { DynamicFormEditComponent } from './dynamic-form-edit/dynamic-form-edit.component';
import { DynamicFormComponent, PreSubmitDialog } from './dynamic-form/dynamic-form.component';
import { EditQuestionKeyDialog } from './dynamic-form-edit/edit-question-key.component';
import { EditSectionKeyDialog } from './dynamic-form-edit/edit-section-key.component';
import { DynamicFormEditSectionsComponent } from './dynamic-form-edit/dynamic-form-edit-sections.component';
import { DynamicFormEditQuestionsComponent } from './dynamic-form-edit/dynamic-form-edit-questions.component';

export const appRoute: Routes = [
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
    PreSubmitDialog,
    DynamicFormEditSectionsComponent,
    DynamicFormEditQuestionsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
