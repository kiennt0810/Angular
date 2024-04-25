import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { API_URL } from 'app/app.constants';
import { Storage } from './Storage.model';

@Injectable({ providedIn: 'root' })
export class StorageService {

  private resourceUrl = API_URL + "/api/Storage";

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(storage: Storage): Observable<Storage> {
    return this.http.post<Storage>(this.resourceUrl, storage);
  }

  update(storage: Storage): Observable<Storage> {
    return this.http.put<Storage>(this.resourceUrl, storage);
  }

  find(id: number): Observable<Storage> {
    return this.http.get<Storage>(`${this.resourceUrl}/${id}`);
  }

  query(req?: Pagination): Observable<HttpResponse<Storage[]>> {
    const options = createRequestOption(req);
    return this.http.get<Storage[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  getLstStorage(): Observable<HttpResponse<Storage[]>> {
    return this.http.get<Storage[]>(this.resourceUrl, { observe: 'response' });
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  getCurrentData(storageId: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${storageId}`);
  }

}
