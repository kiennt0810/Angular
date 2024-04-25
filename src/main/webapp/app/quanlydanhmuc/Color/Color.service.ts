import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { API_URL } from 'app/app.constants';
import { Color } from './Color.model';

@Injectable({ providedIn: 'root' })
export class ColorService {
  //private resourceUrl = this.applicationConfigService.getEndpointFor('api/DMQuocGia');

  private resourceUrl = API_URL + "/api/Color";

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(color: Color): Observable<Color> {
    return this.http.post<Color>(this.resourceUrl, color);
  }

  update(color: Color): Observable<Color> {
    return this.http.put<Color>(this.resourceUrl, color);
  }

  find(id: number): Observable<Color> {
    return this.http.get<Color>(`${this.resourceUrl}/${id}`);
  }

  query(req?: Pagination): Observable<HttpResponse<Color[]>> {
    const options = createRequestOption(req);
    return this.http.get<Color[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  getLstColor(): Observable<HttpResponse<Color[]>> {
    return this.http.get<Color[]>(this.resourceUrl, { observe: 'response' });
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  getCurrentData(colorId: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${colorId}`);
  }

}
