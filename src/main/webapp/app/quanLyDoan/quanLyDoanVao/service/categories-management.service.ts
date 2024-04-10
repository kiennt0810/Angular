import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { IDelegationIn } from '../doanVao.model';
import { API_URL } from 'app/app.constants';
import { IDktk } from '../dktk.model';

@Injectable({ providedIn: 'root' })
export class CategoriesManagementService {
  private resourceUrl = API_URL + '/api/DVHoSo';
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  // create(user: IDelegationIn): Observable<IDelegationIn> {
  //   return this.http.post<IDelegationIn>(this.resourceUrl, user);
  // }

  create(payload: FormData): Observable<any> {
    return this.http.post(this.resourceUrl, payload);  
  }

  getByPage(Dktk: IDktk): Observable<HttpResponse<IDelegationIn[]>> {
    const options = createRequestOption(Dktk)
    return this.http.get<IDelegationIn[]>(`${this.resourceUrl}/GetByPage`, {params: options, observe: 'response'})
  }

  update(payload: FormData) {
    return this.http.put(this.resourceUrl, payload, { observe: 'response' });  
  }

  // update(user: IDelegationIn): Observable<IDelegationIn> {
  //   return this.http.put<IDelegationIn>(this.resourceUrl, user);
  // }

  find(login: string): Observable<IDelegationIn> {
    return this.http.get<IDelegationIn>(`${this.resourceUrl}/${login}`);
  }

  query(req?: Pagination): Observable<HttpResponse<IDelegationIn[]>> {
    const options = createRequestOption(req);
    return this.http.get<IDelegationIn[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(maDoan: string): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${maDoan}`);
  }

  authorities(): Observable<string[]> {
    return this.http.get<string[]>(this.applicationConfigService.getEndpointFor('api/authorities'));
  }

  getCurrentData(maDoan: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${maDoan}`);
  }
  
  downloadFile(id: number): Observable<any> {
		return this.http.get(`${this.resourceUrl}/download/${id}`, {responseType: 'blob'});
  }

  downloadFileAll(maDoan: string): Observable<any> {
		return this.http.get(`${this.resourceUrl}/downloadAll/${maDoan}`, {responseType: 'blob'});
  }
}
