import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { GiaoNhanHC } from '../giaoNhanHC.model';
import { API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class GiaoNhanHCService {
  //private resourceUrl = this.applicationConfigService.getEndpointFor('api/DMQuocGia');

  private resourceUrl = API_URL + "/api/HCGiaoNhan";

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(formData: FormData) {
    return this.http.post(this.resourceUrl, formData , { observe: 'response' });
  }

  update(formData: FormData) {
    return this.http.put(this.resourceUrl, formData , { observe: 'response' });
  }

  // update(hoChieuId: number, hoChieu: GiaoNhanHC): Observable<GiaoNhanHC> {
  //   return this.http.put<GiaoNhanHC>(`${this.resourceUrl}/${hoChieuId}`, hoChieu);
  // }

  find(login: string): Observable<GiaoNhanHC> {
    return this.http.get<GiaoNhanHC>(`${this.resourceUrl}/${login}`);
  }

  query(req?: Pagination): Observable<HttpResponse<GiaoNhanHC[]>> {
    const options = createRequestOption(req);
    return this.http.get<GiaoNhanHC[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  // authorities(): Observable<string[]> {
  //   return this.http.get<string[]>(this.applicationConfigService.getEndpointFor('api/authorities'));
  // }
  getCurrentData(gNHCId: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${gNHCId}`);
  }
  uploadImage(image: File): Observable<{}> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post('/api/v1/image-upload', formData);
  }
}
