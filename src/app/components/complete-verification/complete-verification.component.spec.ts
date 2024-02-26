import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteVerificationComponent } from './complete-verification.component';

describe('CompleteVerificationComponent', () => {
  let component: CompleteVerificationComponent;
  let fixture: ComponentFixture<CompleteVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompleteVerificationComponent]
    });
    fixture = TestBed.createComponent(CompleteVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
