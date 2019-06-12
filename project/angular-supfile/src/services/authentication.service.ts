import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

import {environment} from '../environments/environment';
import {Http} from '@angular/http';

@Injectable()
export class AuthenticationService {
  constructor(private http: Http) { }

  login(email: string, password: string): Promise<any> {
    console.log('login method auth service');
    return this.http.post(environment.api_url + '/login', { email: email, password: password })
      .toPromise()
      .then(response => response.json());
  }

  setLoggedUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    if (user.token) {
      localStorage.setItem('token', JSON.stringify(user.token));
    }
  }

  getLoggedUser(): any {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  getToken(): string {
    return JSON.parse(localStorage.getItem('token'));
  }

  logout(): void {
    localStorage.clear();
  }

  isLogged(): boolean {
    const cu: any = localStorage.getItem('currentUser');
    const u = JSON.parse(cu);
    if (u && u.type === 'google' || u && u.type === 'facebook') {
      return true;
    }else {
      return cu !== null && localStorage.getItem('token') !== null;
    }
  }

}
