import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { IUser, User } from './quanlynguoisudung.model';
import { API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class QuanLyNguoiSuDungService {
  private resourceUrl = API_URL + '/api/HTNhanVien';

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(user: IUser): Observable<IUser> {
    user.createdBy = JSON.parse(sessionStorage.getItem('jhi-userName'))
    return this.http.post<IUser>(this.resourceUrl, user);
  }

  update(user: IUser): Observable<IUser> {
    user.updatedBy = JSON.parse(sessionStorage.getItem('jhi-userName'))
    return this.http.put<IUser>(this.resourceUrl, user);
  }

  find(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.resourceUrl}/${id}`);
  }

  getAll(req?: Pagination): Observable<HttpResponse<IUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  resetPassword(user: User): Observable<User> {
    return this.http.post<User>(`${this.resourceUrl}/ResetPwd`, user)
  }
  
  getCurrentData(id: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${id}`);
  }

  getUser(maNhanVien: string): Observable<User> {
    return this.http.get<User>(`${this.resourceUrl}/GetByMaNV/${maNhanVien}`);
  }

  authorities(): Observable<string[]> {
    return this.http.get<string[]>(this.applicationConfigService.getEndpointFor('api/authorities'));
  }
}
