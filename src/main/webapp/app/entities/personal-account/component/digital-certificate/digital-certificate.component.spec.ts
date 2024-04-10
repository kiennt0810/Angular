import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalCertificateComponent } from './digital-certificate.component';

describe('DigitalCertificateComponent', () => {
  let component: DigitalCertificateComponent;
  let fixture: ComponentFixture<DigitalCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DigitalCertificateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DigitalCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
