import {AfterViewInit, Component} from '@angular/core';
import {AuthenticationService} from '../../services';
import {NavigationStart, Router} from '@angular/router';
import {FacebookService} from 'ngx-facebook';
import {User} from '../../models';
import {UserService} from '../../services';
// Google's login API namespace
declare var gapi: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'app';
  isLogged = false;
  currentUser: User;

  constructor(private router: Router, private authWS: AuthenticationService, private fb: FacebookService, private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log('enter?App?' + this.currentUser)
  }

  ngAfterViewInit () {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLogged = this.authWS.isLogged();
      }
    });

  }
  logout() {
    const cu: any = localStorage.getItem('currentUser');
    if (cu.type === 'google') {
      const auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });
    }
    if (cu.type === 'facebook') {
      this.fb.logout().then(() => {
        console.log('User signed out.');
      });
    }
    this.authWS.logout();
  }
}
