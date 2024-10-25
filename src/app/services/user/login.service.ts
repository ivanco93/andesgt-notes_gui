import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../model/user';
import { Observable } from 'rxjs';
import { RefreshToken } from '../../model/refresh-token';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }

  public getHttpHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  public getHttpHeadersWithBearer() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("access-token")
    });
  }

  auth(user: User): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, user, {
      headers: this.getHttpHeaders(),
      responseType: 'json'
    });
  }

  refresh(refresh: RefreshToken): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/auth/token/refresh/`, refresh, {
      headers: this.getHttpHeaders(),
      responseType: 'json'
    });
  }

  me(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/auth/me`, {
      headers: this.getHttpHeadersWithBearer(),
      responseType: 'json'
    });
  }
}
