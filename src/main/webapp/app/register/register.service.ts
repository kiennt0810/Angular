import { Injectable } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { Register } from './register.model';
import { Observable, mergeMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  register(registerinformation: Register): Observable<void> {
    return this.http.post<any>(this.applicationConfigService.getEndpointFor('api/p/register-orders', 'uaa'), registerinformation);
  }
}
