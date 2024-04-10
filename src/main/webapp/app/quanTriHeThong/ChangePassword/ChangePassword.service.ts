import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IUser, User } from './ChangePassword.model';
import { API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class ChangePasswordService {
  private resourceUrl = API_URL + '/api/HTNhanVien';

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(user: User): Observable<User> {
    user.createdBy = JSON.parse(sessionStorage.getItem('jhi-userName'))
    return this.http.post<User>(`${this.resourceUrl}/UpdatePwd`, user);
  }

  // authorities(): Observable<string[]> {
  //   return this.http.get<string[]>(this.applicationConfigService.getEndpointFor('api/authorities'));
  // }
}
