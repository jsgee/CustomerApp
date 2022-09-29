import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private serviceUrl = 'http://localhost:45339/customers';

  constructor(private http: HttpClient) { }

   getCustomers(): Observable<Customer[]> {
     return this.http.get<Customer[]>(this.serviceUrl).pipe<Customer[]>(map((data: any) => data));;
  }

   updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.serviceUrl}/${customer.id}`, customer);
  }

   addCustomer(customer: Customer) {
    return this.http.post<Customer>(`${this.serviceUrl}`, customer);
  }
}
