import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  public baseUrl = environment.baseUrl;
  
  constructor(private http: HttpClient) { }

  get(endpoint: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + endpoint);
  }

  post(endpoint: string, data: any): Observable<any> {
    return this.http.post(this.baseUrl + endpoint, data);
  } 

  put(endpoint: string, data: any): Observable<any> {
    return this.http.put(this.baseUrl + endpoint, data);
  }

  delete(endpoint:string, data: any): Observable<any> {
    return this.http.delete(this.baseUrl + endpoint + '/' + data);
  }

}
