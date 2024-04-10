jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, waitForAsync, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import { CategoriesManagementService } from '../service/categories-management.service';

import { CategoriesManagementDeleteDialogComponent } from './quanLyTV-delete-dialog.component';

describe('User Management Delete Component', () => {
  let comp: CategoriesManagementDeleteDialogComponent;
  let fixture: ComponentFixture<CategoriesManagementDeleteDialogComponent>;
  let service: CategoriesManagementService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CategoriesManagementDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(CategoriesManagementDeleteDialogComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesManagementDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CategoriesManagementService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of({}));

        // WHEN
        comp.confirmDelete('user');
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith('user');
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));
  });
});
