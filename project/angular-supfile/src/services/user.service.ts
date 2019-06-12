import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models';
import {environment} from '../environments/environment';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }
  create(user: User): Promise<any> {
    return this.http.post(environment.api_url + '/signup', user).toPromise();
  }

  edit(id: number, username: string, email: string): Promise<any> {
    const url = `${environment.api_url}/user/${id}`;
    return this.http.put(url, {username: username, email: email}).toPromise();
  }
}
