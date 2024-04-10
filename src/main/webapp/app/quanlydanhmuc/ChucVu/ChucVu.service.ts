import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { API_URL } from 'app/app.constants';
import { ChucVu, IChucVu } from './ChucVu.model';

@Injectable({ providedIn: 'root' })
export class ChucVuService {
  //private resourceUrl = this.applicationConfigService.getEndpointFor('api/DMQuocGia');

  private resourceUrl = API_URL + "/api/DMChucVu";

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(chucVu: ChucVu): Observable<ChucVu> {
    chucVu.createdBy = JSON.parse(sessionStorage.getItem('jhi-userName'))
    return this.http.post<ChucVu>(this.resourceUrl, chucVu);
  }

  update(chucVu: ChucVu): Observable<ChucVu> {
    chucVu.updatedBy = JSON.parse(sessionStorage.getItem('jhi-userName'))
    return this.http.put<ChucVu>(this.resourceUrl, chucVu);
  }

  find(id: number): Observable<ChucVu> {
    return this.http.get<ChucVu>(`${this.resourceUrl}/${id}`);
  }

  query(req?: Pagination): Observable<HttpResponse<ChucVu[]>> {
    const options = createRequestOption(req);
    return this.http.get<ChucVu[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  getLstChucVu(): Observable<HttpResponse<ChucVu[]>> {
    return this.http.get<ChucVu[]>(this.resourceUrl, { observe: 'response' });
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  // authorities(): Observable<string[]> {
  //   return this.http.get<string[]>(this.applicationConfigService.getEndpointFor('api/authorities'));
  // }
  getCurrentData(chucVuId: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${chucVuId}`);
  }

}
