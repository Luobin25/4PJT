import {Component} from '@angular/core';
import {NavController, NavParams, Platform, ViewController} from "ionic-angular";
import {AuthenticationService} from "../../services/authentication.service";
import {TabsPage} from "../tabs/tabs";




@Component({
  templateUrl: 'signup.html'
})
export class SignupPage {

  modelSignup: any = {};
  public err = '';

  constructor(public platform: Platform, public params: NavParams, public navCtrl: NavController, public viewCtrl: ViewController,  private authenticationService: AuthenticationService){
    //console.log(this.modelSignup);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  signup() {
    this.authenticationService.signup(this.modelSignup.username, this.modelSignup.email, this.modelSignup.password)
      .then(u => {
        if (u.success = 'true') {
          this.authenticationService.setLoggedUser(u.data);
          this.navCtrl.push(TabsPage);
        }
      }).catch(err => {
        //this.navCtrl.push(SignupPage);
      this.err = 'ERROR IN THE FIELDS'
      })
  }





}
