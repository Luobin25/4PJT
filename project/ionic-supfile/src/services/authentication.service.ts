import {Injectable} from "@angular/core";
import "rxjs/add/operator/toPromise";
import {User} from "../models/user";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class AuthenticationService {
  currentUser: User;
  constructor(private http: HttpClient) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  setLoggedUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    if (user.token) {
      localStorage.setItem('token', JSON.stringify(user.token));
    }
  }

  login(email: string, password: string): Promise<any> {
    return this.http.post('login', { email: email, password: password })
      .toPromise()
      .then(resp => resp, err => console.log(err))
  }

  signup(username: string, email: string, password: string): Promise<any> {
    return this.http.post('signup', { email: email, password: password, username: username })
      .toPromise()
      .then(resp => resp, err => console.log(err)) // A verifier
  }

  getLoggedUser(): User {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  logout() {
    localStorage.setItem('currentUser', null)
    localStorage.setItem('token', null)
  }

  update(field: string, data: string): Promise<any> {
    if (field == 'username')
    {
      return this.http.put('user/' +
        this.currentUser._id
        , {username: data})
        .toPromise()
        .then(resp => resp, err => console.log(err))
    }
    else if (field == 'email')
    {
      return this.http.put('user/' +
        this.currentUser._id
        , {email: data})
        .toPromise()
        .then(resp => resp, err => console.log(err))
    }


  }
}
