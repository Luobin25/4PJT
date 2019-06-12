import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {User} from "../../models/user";
import {FileService} from "../../services/file.service";
import {AuthenticationService} from "../../services/authentication.service";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  currentUser: User;
  public hello: any = [];

  constructor(public navCtrl: NavController, public fileService: FileService, public authenticationService: AuthenticationService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }


}
