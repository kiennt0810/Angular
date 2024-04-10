import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { IHDNgoaiGiaoVM } from '../HDNgoaiGiaoVM.model';
import { API_URL } from 'app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class NgoaiGiaoDoanService {

  private resourceUrl = API_URL + '/api/HDNgoaiGiao';

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(payload: FormData) {
    return this.http.post(this.resourceUrl, payload, { observe: 'response' });  
  }

  update(payload: FormData) {
    return this.http.put(this.resourceUrl, payload, { observe: 'response' });  
  }

  find(login: string): Observable<IHDNgoaiGiaoVM> {
    return this.http.get<IHDNgoaiGiaoVM>(`${this.resourceUrl}/${login}`);
  }

  query(req?: Pagination): Observable<HttpResponse<IHDNgoaiGiaoVM[]>> {
    const options = createRequestOption(req);
    return this.http.get<IHDNgoaiGiaoVM[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  // authorities(): Observable<string[]> {
  //   return this.http.get<string[]>(this.applicationConfigService.getEndpointFor('api/authorities'));
  // }

  getCurrentData(id: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${id}`);
  }
  
  downloadFile(id: number): Observable<any> {
		return this.http.get(`${this.resourceUrl}/download/${id}`, {responseType: 'blob'});
  }


}
