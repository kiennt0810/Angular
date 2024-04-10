import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalSignIconComponent } from './digital-sign-icon.component';

describe('DigitalSignIconComponent', () => {
  let component: DigitalSignIconComponent;
  let fixture: ComponentFixture<DigitalSignIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DigitalSignIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DigitalSignIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
