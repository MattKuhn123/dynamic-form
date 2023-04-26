import { NgModule, isDevMode } from '@angular/core';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { ClipboardModule } from '@angular/cdk/clipboard';
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
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppComponent } from './app.component';
import { DynamicFormQuestionComponent } from './dynamic-form/dynamic-form-question.component';
import { DynamicFormEditComponent } from './dynamic-form-edit/dynamic-form-edit.component';
import { DynamicFormComponent, PreSubmitDialog } from './dynamic-form/dynamic-form.component';
import { EditQuestionKeyDialog } from './dynamic-form-edit/edit-question-key.component';
import { EditSectionKeyDialog } from './dynamic-form-edit/edit-section-key.component';

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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ClipboardModule,
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
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatStepperModule,
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
