import { Component } from '@angular/core';
import {AlertService, AuthenticationService, UserService} from '../../services';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {

  modelSignUp: any = {};
  loadingSignUp = false;
  currentUser;

  constructor(private userService: UserService, private  alertService: AlertService, private authenticationService: AuthenticationService ){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  editUser() {
    if (this.modelSignUp.username || this.modelSignUp.email) {
      this.userService.edit(this.currentUser['_id'], this.modelSignUp.username, this.modelSignUp.email).then(u => {
        if (u.success = 'true') {
          u.data.token = this.currentUser['token'];
          this.authenticationService.setLoggedUser(u.data);
        } else {
          this.alertService.error(u.data, true);
        }
      });
    }
  }

  calcStorage() {
    return this.SplitAndRound(this.currentUser.storage_used / 30 * 100);
  }

  SplitAndRound(a) {
    a = a * Math.pow(10, 2);
    return (Math.round(a)) / (Math.pow(10, 2));
  }
}
