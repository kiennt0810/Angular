import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class PasswordResetInitService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  save(mail: string): Observable<{}> {
    // return this.http.post(this.applicationConfigService.getEndpointFor('services/uaa/api/account/reset-password/init'), mail);
    return;
  }
}
