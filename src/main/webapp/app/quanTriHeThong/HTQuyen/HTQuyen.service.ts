import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IUser } from './HTQuyen.model';
import { API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class HTQuyenService {
  private resourceUrl = API_URL + '/api/HTQuyen';

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  getTable2(maNhom: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.resourceUrl}/GetInGroup/${maNhom}`);
  }

  getTable1(maNhom: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.resourceUrl}/GetNotInGroup/${maNhom}`);
  }

  create(user: IUser[], idNhom): Observable<IUser[]> {
    return this.http.post<IUser[]>(`${this.resourceUrl}/${idNhom}`, user);
  }

  authorities(): Observable<string[]> {
    return this.http.get<string[]>(this.applicationConfigService.getEndpointFor('api/authorities'));
  }
}
