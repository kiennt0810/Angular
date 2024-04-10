import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { IQuanLyTV } from '../quanLyTVRa.model';
import { API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class QuanLyTVService {
  private resourceUrl = API_URL + '/api/DRThanhVien';
  private resourceUrl1 = API_URL + "/api/HCNgoaiGiao";

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(payload: FormData) {
    return this.http.post(this.resourceUrl, payload, { observe: 'response' });  
  }

  update(payload: FormData) {
    return this.http.put(this.resourceUrl, payload, { observe: 'response' });
  }

  find(login: string): Observable<IQuanLyTV> {
    return this.http.get<IQuanLyTV>(`${this.resourceUrl}/${login}`);
  }

  query(req?: Pagination): Observable<HttpResponse<IQuanLyTV[]>> {
    const options = createRequestOption(req);
    return this.http.get<IQuanLyTV[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(login: string): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${login}`);
  }

  authorities(): Observable<string[]> {
    return this.http.get<string[]>(this.applicationConfigService.getEndpointFor('api/authorities'));
  }

  getCurrentData(maTV: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${maTV}`);
  }

  getQuocGia(maDoan: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/GetQG/${maDoan}`);
  }

  downloadFile(id: number): Observable<any> {
		return this.http.get(`${this.resourceUrl}/download/${id}`, {responseType: 'blob'});
  }
  downloadFileAll(maDoan: string): Observable<any> {
		return this.http.get(`${this.resourceUrl}/downloadAll/${maDoan}`, {responseType: 'blob'});
  }

  downloadFileIMG(id: number): Observable<any> {
		return this.http.get(`${this.resourceUrl1}/download/${id}`, {responseType: 'blob'});
  }

  getLsTV(maDoan: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/GetLsThanhVien/${maDoan}`);
  }

  getLsTVEdit(maDoan: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/GetLsThanhVien/${maDoan}`);
  }

  getCurrentDataHC(soHC: string): Observable<any> {
    return this.http.get(`${this.resourceUrl1}/${soHC}`, { observe: 'response' });
  }
}
