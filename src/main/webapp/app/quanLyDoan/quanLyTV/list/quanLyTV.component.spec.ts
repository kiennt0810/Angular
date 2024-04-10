//jest.mock('app/core/auth/account.service');

import { ComponentFixture, TestBed, waitForAsync, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { QuanLyTVService } from '../service/quanLyTV.service';
import { QuanLyTV } from '../quanLyTV.model';
import { AccountService } from 'app/core/auth/account.service';

import { quanLyTVComponent } from './quanLyTV.component';

describe('User Management Component', () => {
  let comp: quanLyTVComponent;
  let fixture: ComponentFixture<quanLyTVComponent>;
  let service: QuanLyTVService;
  let mockAccountService: AccountService;
  const data = of({
    defaultSort: 'id,asc',
  });
  const queryParamMap = of(
    jest.requireActual('@angular/router').convertToParamMap({
      page: '1',
      size: '1',
      sort: 'id,desc',
    })
  );

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [quanLyTVComponent],
      providers: [{ provide: ActivatedRoute, useValue: { data, queryParamMap } }, AccountService],
    })
      .overrideTemplate(quanLyTVComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(quanLyTVComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(QuanLyTVService);
    mockAccountService = TestBed.inject(AccountService);
    mockAccountService.identity = jest.fn(() => of(null));
  });

  describe('OnInit', () => {
    it('Should call load all on init', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        const headers = new HttpHeaders().append('link', 'link;link');
        jest.spyOn(service, 'query').mockReturnValue(
          of(
            new HttpResponse({
              body: [],
              headers,
            })
          )
        );

        // WHEN
        comp.ngOnInit();
        tick(); // simulate async

        // THEN
        expect(service.query).toHaveBeenCalled();
        expect(comp.users?.[0]).toEqual(expect.objectContaining({ id: 123 }));
      })
    ));
  });

  describe('setActive', () => {
    it('Should update user and call load all', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        const headers = new HttpHeaders().append('link', 'link;link');
        const categories = null;
        jest.spyOn(service, 'query').mockReturnValue(
          of(
            new HttpResponse({
              body: [categories],
              headers,
            })
          )
        );
        jest.spyOn(service, 'update').mockReturnValue(of(categories));

        // WHEN
        comp.setActive(categories, true);
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith({ ...categories, activated: true });
        expect(service.query).toHaveBeenCalled();
        expect(comp.users?.[0]).toEqual(expect.objectContaining({ id: 123 }));
      })
    ));
  });
});
