import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmDeleteDigitalCertificateComponent } from './modal-confirm-delete-digital-certificate.component';

describe('ModalConfirmDeleteDigitalCertificateComponent', () => {
  let component: ModalConfirmDeleteDigitalCertificateComponent;
  let fixture: ComponentFixture<ModalConfirmDeleteDigitalCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalConfirmDeleteDigitalCertificateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalConfirmDeleteDigitalCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
