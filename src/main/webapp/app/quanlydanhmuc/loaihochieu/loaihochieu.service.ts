import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { API_URL } from 'app/app.constants';
import { IPassport, Passport } from './loaihochieu.model';

@Injectable({ providedIn: 'root' })
export class PassportService {
  //private resourceUrl = this.applicationConfigService.getEndpointFor('api/DMQuocGia');

  private resourceUrl = API_URL + "/api/DMLoaiHoChieuVN";

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(passport: IPassport): Observable<IPassport> {
    passport.createdBy = JSON.parse(sessionStorage.getItem('jhi-userName'))
    return this.http.post<IPassport>(this.resourceUrl, passport);
  }

  update(passport: Passport): Observable<Passport> {
    passport.updatedBy = JSON.parse(sessionStorage.getItem('jhi-userName'))
    return this.http.put<Passport>(this.resourceUrl, passport);
  }

  find(id: number): Observable<Passport> {
    return this.http.get<Passport>(`${this.resourceUrl}/${id}`);
  }

  query(req?: Pagination): Observable<HttpResponse<Passport[]>> {
    const options = createRequestOption(req);
    return this.http.get<Passport[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  getLstPP(): Observable<HttpResponse<Passport[]>> {
    return this.http.get<Passport[]>(this.resourceUrl, { observe: 'response' });
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  // authorities(): Observable<string[]> {
  //   return this.http.get<string[]>(this.applicationConfigService.getEndpointFor('api/authorities'));
  // }
  getCurrentData(passportId: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${passportId}`);
  }

}
