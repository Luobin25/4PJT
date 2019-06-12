import {Component, NgZone} from '@angular/core';
import {AlertController, ModalController, NavController, ToastController} from 'ionic-angular';
import {User} from "../../models/user";
import {AuthenticationService} from "../../services/authentication.service";
import {VipPage} from "../vip/vip";
import {PopoverController} from 'ionic-angular';
import {TermsPage} from "../terms/terms";

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  currentUser: User;
  public files: any = [];
  public used: number;
  public print_used: number;



  constructor(public navCtrl: NavController,
              private authService: AuthenticationService,
              private zone: NgZone,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public popoverCtrl: PopoverController,) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.used = Math.round(Number(this.currentUser.storage_used));
    this.print_used = this.used;
  }

  ionViewWillEnter(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  public logout() {
    this.authService.logout();
    this.reloadPage()
  }

  reloadPage() { // click handler or similar
    this.zone.runOutsideAngular(() => {
      location.reload();
    });
  }

  showPrompt(field, data) {
    let prompt = this.alertCtrl.create({
      title: field,
      message: "Please change your informations.",
      inputs: [
        {
          name: 'model',
          value: data,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.authService.update(field, data.model).then(resp => {
              this.authService.setLoggedUser(resp)
            })
            this.navCtrl.push(AccountPage)
            this.presentToast()

          }
        }
      ]
    });
    prompt.present();
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'User was update successfully',
      duration: 3000
    });
    toast.present();
  }

  vip() {
    this.navCtrl.push(VipPage);
  }

  terms() {
    this.navCtrl.push(TermsPage)
  }


}
