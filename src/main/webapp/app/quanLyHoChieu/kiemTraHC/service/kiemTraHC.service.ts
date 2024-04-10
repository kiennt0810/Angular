import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { KiemTraHC } from '../kiemTraHC.model';
import { API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class KiemTraHCService {
  //private resourceUrl = this.applicationConfigService.getEndpointFor('api/DMQuocGia');

  private resourceUrl = API_URL + "/api/HCNgoaiGiao/checkListHC";

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  kiemtra(formData: FormData): Observable<any> {
    return this.http.post(this.resourceUrl, formData, { observe: 'response'});
  }
  query(req?: Pagination): Observable<HttpResponse<KiemTraHC[]>> {
    const options = createRequestOption(req);
    return this.http.get<KiemTraHC[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
}
