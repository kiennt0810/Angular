import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { API_URL } from 'app/app.constants';
import { Brand } from './Brand.model';

@Injectable({ providedIn: 'root' })
export class BrandService {

  private resourceUrl = API_URL + "/api/Brand";

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(obj: Brand): Observable<Brand> {
    return this.http.post<Brand>(this.resourceUrl, obj);
  }

  update(obj: Brand): Observable<Brand> {
    return this.http.put<Brand>(this.resourceUrl, obj);
  }

  find(id: number): Observable<Brand> {
    return this.http.get<Brand>(`${this.resourceUrl}/${id}`);
  }

  query(req?: Pagination): Observable<HttpResponse<Brand[]>> {
    const options = createRequestOption(req);
    return this.http.get<Brand[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  getLstBrand(): Observable<HttpResponse<Brand[]>> {
    return this.http.get<Brand[]>(this.resourceUrl, { observe: 'response' });
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  getCurrentData(brandId: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${brandId}`);
  }

}
