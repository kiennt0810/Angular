import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalSignPropComponent } from './digital-sign-prop.component';

describe('DigitalSignPropComponent', () => {
  let component: DigitalSignPropComponent;
  let fixture: ComponentFixture<DigitalSignPropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DigitalSignPropComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DigitalSignPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
