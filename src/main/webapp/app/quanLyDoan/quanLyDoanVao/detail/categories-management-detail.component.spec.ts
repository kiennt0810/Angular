import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Authority } from 'app/config/authority.constants';
import { DelegationIn } from '../doanVao.model';

import { CategoriesManagementDetailComponent } from './categories-management-detail.component';

describe('User Management Detail Component', () => {
  let comp: CategoriesManagementDetailComponent;
  let fixture: ComponentFixture<CategoriesManagementDetailComponent>;

  beforeEach(waitForAsync(() => {
    const pipe = new Date();
    TestBed.configureTestingModule({
      declarations: [CategoriesManagementDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ user: new DelegationIn(123, 'aaaaa', 'user', 'first', 'last', 'first@last.com', 'pipe', pipe) }),
          },
        },
      ],
    })
      .overrideTemplate(CategoriesManagementDetailComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesManagementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.user).toEqual(
        expect.objectContaining({
          stt: 123,
          login: 'user',
          maDoanVao: 'first',
          tenDoanVao: 'last',
          coQuan: 'first@last.com',
          quocGia: 'aaaaaaa',
          mDHD: 'en',
        })
      );
    });
  });
});
