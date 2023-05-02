import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormEditSectionsComponent } from './dynamic-form-edit-sections.component';

describe('DynamicFormEditSectionsComponent', () => {
  let component: DynamicFormEditSectionsComponent;
  let fixture: ComponentFixture<DynamicFormEditSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicFormEditSectionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFormEditSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
