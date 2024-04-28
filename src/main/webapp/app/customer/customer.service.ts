import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { Customer } from './customer.model';
import { API_URL } from 'app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private resourceUrl = API_URL + '/api/Customer';

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(pro: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.resourceUrl, pro);
  }

  update(pro: Customer): Observable<Customer> {
    return this.http.put<Customer>(this.resourceUrl, pro);
  }

  find(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.resourceUrl}/${id}`);
  }

  query(req?: Pagination): Observable<HttpResponse<Customer[]>> {
    const options = createRequestOption(req);
    return this.http.get<Customer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  getCurrentData(id: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${id}`);
  }
  
  downloadFile(id: number): Observable<any> {
		return this.http.get(`${this.resourceUrl}/download/${id}`, {responseType: 'blob'});
  }


}
