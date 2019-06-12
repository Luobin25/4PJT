import {Component} from '@angular/core';
import {ModalController, NavController, NavParams, Platform, ViewController} from "ionic-angular";
import {TabsPage} from "../tabs/tabs";
import {AuthenticationService} from "../../services/authentication.service";


@Component({
  templateUrl: 'login.html'
})
export class LoginPage {

  public modelLogin: any = {};
  public account: any[];
  public err = '';

  constructor(public platform: Platform, public params: NavParams, public modalCtrl: ModalController,
              public viewCtrl: ViewController, public navCtrl: NavController,
              private authenticationService: AuthenticationService,) {
  } // Constructor

  dismiss() {
    this.viewCtrl.dismiss();
  }

  login() {
    this.authenticationService.login(this.modelLogin.email, this.modelLogin.password)
      .then(u => {
        if (u.success) {
          this.authenticationService.setLoggedUser(u.data);
          this.navCtrl.push(TabsPage);
        }
      }).catch(err => {
       //console.log(err)
      this.err = 'ERROR LOGIN / PASSWORD'
    })
  }

}
