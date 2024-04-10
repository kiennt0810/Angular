import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { HoChieuNgoaiGiao } from '../hoCNgoaiGiao.model';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
import * as Excel from "exceljs/dist/exceljs.min.js";
import { API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class HChieuNGService {
  //private resourceUrl = this.applicationConfigService.getEndpointFor('api/DMQuocGia');

  private resourceUrl = API_URL + "/api/HCNgoaiGiao";

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) { }

  create(formData: FormData) {
    return this.http.post(this.resourceUrl, formData, { observe: 'response' });
  }

  update(formData: FormData) {
    return this.http.put(this.resourceUrl, formData, { observe: 'response' });
  }

  find(login: string): Observable<HoChieuNgoaiGiao> {
    return this.http.get<HoChieuNgoaiGiao>(`${this.resourceUrl}/${login}`);
  }

  query(req?: Pagination): Observable<HttpResponse<HoChieuNgoaiGiao[]>> {
    const options = createRequestOption(req);
    return this.http.get<HoChieuNgoaiGiao[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  getLstHC(): Observable<HttpResponse<HoChieuNgoaiGiao[]>> {
    return this.http.get<HoChieuNgoaiGiao[]>(this.resourceUrl, { observe: 'response' });
  }

  delete(soHC: string) {
    return this.http.delete(`${this.resourceUrl}/${soHC}`);
  }
  getCurrentDataCheckExist(soHC: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${soHC}`, { observe: 'response' });
  }

  getCurrentData(soHC: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${soHC}`);
  }

  getCurrentGNHC(soHC: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${soHC}`);
  }

  uploadImage(image: File): Observable<{}> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post('/api/v1/image-upload', formData);
  }

  downloadFile(id: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/download/${id}`, { responseType: 'blob' });
  }
}
