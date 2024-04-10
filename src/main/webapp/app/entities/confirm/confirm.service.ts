import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Confirm } from './confirm.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  getlist(data: Confirm): Observable<void> {
    return this.http.post<any>(this.applicationConfigService.getEndpointFor('api/register-orders/find-like', 'uaa'), data);
  }

  active(data: any): Observable<any> {
    return this.http.post<any>(this.applicationConfigService.getEndpointFor('api/p/register-orders/activate', 'uaa'), data);
  }
}
