import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService, UserService} from '../../services';
import {environment} from '../../environments/environment';
import {FacebookService, InitParams, LoginResponse} from 'ngx-facebook';

// Google's login API namespace
declare var gapi: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  modelLogin: any = {};
  modelSignUp: any = {};
  loadingLogin = false;
  loadingSignUp = false;
  loadingFacebook = false;

  public auth2: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private alertService: AlertService,
              private zone: NgZone, private fb: FacebookService) {
    const initParams: InitParams = {
      appId: environment.facebookAppId,
      xfbml: true,
      version: 'v2.8'
    };

    fb.init(initParams);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: environment.googleAppId,
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      if (document.getElementById('glogin')) {
        this.attachSigninGoogle(document.getElementById('glogin'));
      }
    });
  }

  public onLoginClickFacebook() {
    this.fb.login({
         scope: 'public_profile,email',
         return_scopes: true,
         enable_profile_selector: true
       })
      .then((response: LoginResponse) => {
        this.loadingFacebook = true;
        this.fb.api('/me', 'get', {fields: 'last_name,first_name,email'}).then((resp: any) => {
          console.log(resp);
          this.authenticationService.setLoggedUser({username: resp.first_name + ' ' + resp.last_name, email: resp.email, type: 'facebook'});
          this.zone.run(
            () => this.router.navigate(['main'])
          );
        });
      })
      .catch((error: any) => console.error(error));
  }

  public attachSigninGoogle(element) {
    this.auth2.attachClickHandler(element, {}, (loggedInUser) => {
      console.log(loggedInUser);
      this.authenticationService.setLoggedUser({username: loggedInUser.w3.ig, email: loggedInUser.w3.U3, type: 'google'});
      this.zone.run(
        () => this.router.navigate(['main'])
      );
    }, function (error) {
      console.log(error);
    });
  }

  redirect(route: String) {
    this.router.navigate([route]);
  }

  login() {
    this.loadingLogin = true;
    this.authenticationService.login(this.modelLogin.email, this.modelLogin.password)
      .then(u => {
        if (u.success === true) {
          this.authenticationService.setLoggedUser(u.data);
          this.redirect('/main');
        } else {
          this.alertService.error(u.data, true);
        }
      }).catch((e: any) => {
      this.loadingLogin = false;
      document.getElementById('errorMessage').innerHTML = 'Account or Password Error';
    });
  }

  register() {
    this.loadingSignUp = true;
    this.userService.create(this.modelSignUp)
      .then((resp: any) => {
        if (resp.success === true) {
          this.authenticationService.setLoggedUser(resp.data);
          this.redirect('/main');
        } else {
          this.alertService.error(resp.data, true);
          this.loadingLogin = false;
        }
      }).catch((e: any) => {
      this.loadingLogin = false;
      document.getElementById('errorMessage').innerHTML = 'Account or Password Error';
    });;
  }
}

