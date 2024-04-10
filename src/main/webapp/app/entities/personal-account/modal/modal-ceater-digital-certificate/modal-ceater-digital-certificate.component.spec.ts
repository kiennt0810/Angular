import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCeaterDigitalCertificateComponent } from './modal-ceater-digital-certificate.component';

describe('ModalCeaterDigitalCertificateComponent', () => {
  let component: ModalCeaterDigitalCertificateComponent;
  let fixture: ComponentFixture<ModalCeaterDigitalCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalCeaterDigitalCertificateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCeaterDigitalCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
