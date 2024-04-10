import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { IQuanLyTV } from '../quanLyTV.model';
import { API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class QuanLyTVService {
  private resourceUrl = API_URL + '/api/DVThanhVien';

  // private resourceUrl = 'https://localhost:7019/api/DVThanhVien';

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(payload: FormData): Observable<any> {
    return this.http.post(this.resourceUrl, payload, { observe: 'response' });  
  }
  update(payload: FormData) {
    return this.http.put(this.resourceUrl, payload);  
  }

  // update(user: IQuanLyTV): Observable<IQuanLyTV> {
  //   return this.http.put<IQuanLyTV>(this.resourceUrl, user);
  // }

  find(login: string): Observable<IQuanLyTV> {
    return this.http.get<IQuanLyTV>(`${this.resourceUrl}/${login}`);
  }

  query(req?: Pagination): Observable<HttpResponse<IQuanLyTV[]>> {
    const options = createRequestOption(req);
    return this.http.get<IQuanLyTV[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(login: string): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${login}`, { observe: 'response' });
  }

  authorities(): Observable<string[]> {
    return this.http.get<string[]>(this.applicationConfigService.getEndpointFor('api/authorities'));
  }

  getCurrentData(maTV: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${maTV}`);
  }

  getLsTV(maDoan: string, req?: Pagination): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get(`${this.resourceUrl}/GetLsThanhVien/${maDoan}`, {params: options, observe: 'response'});
  }

  getLsTVEdit(maDoan: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/GetLsThanhVien/${maDoan}`);
  }

  kTraHC(soHC: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/getBySoHC/${soHC}`, { observe: 'response' });
  }

  downloadFile(id: number): Observable<any> {
		return this.http.get(`${this.resourceUrl}/download/${id}`, {responseType: 'blob'});
  }

  downloadFileAll(maDoan: string): Observable<any> {
		return this.http.get(`${this.resourceUrl}/downloadAll/${maDoan}`, {responseType: 'blob'});
  }

  private maDoan = new BehaviorSubject<string>(null)

  getCurrentMaDoan = this.maDoan.asObservable();

  getMaDoan(maDoan: string) {
    this.maDoan.next(maDoan);
    console.log(maDoan);
 }


}
