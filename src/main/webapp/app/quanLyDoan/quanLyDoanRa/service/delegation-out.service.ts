import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { IDoanRa } from '../doanRa.model';
import { API_URL } from 'app/app.constants';
import { IDktk } from '../dktk.model';

@Injectable({ providedIn: 'root' })
export class DoanRaService {
  private resourceUrl = API_URL + "/api/DRHoSo";

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(payload: FormData): Observable<any> {
    return this.http.post(this.resourceUrl, payload, { observe: 'response' });  
  }

  update(payload: FormData) {
    return this.http.put(this.resourceUrl, payload, { observe: 'response' });  
  }

  getByPage(Dktk: IDktk): Observable<HttpResponse<IDktk>> {
    const options = createRequestOption(Dktk)
    return this.http.get<IDktk>(`${this.resourceUrl}/GetByPage`, {params: options, observe: 'response'})
  }

  
  // update(user: IDoanRa): Observable<IDoanRa> {
  //   return this.http.put<IDoanRa>(this.resourceUrl, user);
  // }

  find(login: string): Observable<IDoanRa> {
    return this.http.get<IDoanRa>(`${this.resourceUrl}/${login}`);
  }

  query(maQG: string, req?: Pagination): Observable<HttpResponse<IDoanRa[]>> {
    return this.http.get<IDoanRa[]>(`${this.resourceUrl}/GetByMaQG/${maQG}`, { observe: 'response' });
  }

  delete(maDoan: number): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${maDoan}`);
  }

  authorities(): Observable<string[]> {
    return this.http.get<string[]>(this.applicationConfigService.getEndpointFor('api/authorities'));
  }

  getCurrentData(maDoan: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${maDoan}`);
  }
  
  downloadFile(id: number): Observable<any> {
		return this.http.get(`${this.resourceUrl}/download/${id}`, {responseType: 'blob'});
  }

  downloadFileAll(maDoan: number): Observable<any> {
		return this.http.get(`${this.resourceUrl}/downloadAll/${maDoan}`, {responseType: 'blob'});
  }

  getQuocGia(maDoan: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/GetQG/${maDoan}`);
  }
}
