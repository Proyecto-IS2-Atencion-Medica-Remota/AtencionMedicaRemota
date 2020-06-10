import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) { }

  login(rut: string, pass: string, cargo:string ): Observable<boolean> {
    return this.http.post<{token: string, cargo: string}>('http://localhost:8000/auth', {rut: rut, pass: pass, cargo: cargo})
      .pipe(
        map(result => {
          localStorage.setItem('rut', rut);
          localStorage.setItem('cargo', result.cargo);
          localStorage.setItem('access_token', result.token);
          return true;
        })
        
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('cargo');
    localStorage.removeItem('rut');
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }
}