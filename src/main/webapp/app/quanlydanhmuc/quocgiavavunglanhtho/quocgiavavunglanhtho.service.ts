import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { IUser } from './quocgiavavunglanhtho.model';
import { API_URL} from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class QuocgiavavunglanhthoService {
  private resourceUrl = API_URL + '/api/DMQuocGia';

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(user: IUser): Observable<IUser> {
    user.createdBy = JSON.parse(sessionStorage.getItem('jhi-userName'))
    return this.http.post<IUser>(this.resourceUrl, user);
  }

  update(user: IUser): Observable<IUser> {    
    user.updatedBy = JSON.parse(sessionStorage.getItem('jhi-userName'));        
    return this.http.put<IUser>(this.resourceUrl, user);
  }

  find(maQG: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.resourceUrl}/${maQG}`);
  }

  getAll(req?: Pagination): Observable<HttpResponse<IUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(maQG: string): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${maQG}`);
  }

  getCurrentData(maQG: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${maQG}`);
  }

  // authorities(): Observable<string[]> {
  //   return this.http.get<string[]>(this.applicationConfigService.getEndpointFor('api/authorities'));
  // }
}
