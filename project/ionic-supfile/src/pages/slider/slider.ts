import {Component, ViewChild} from '@angular/core';
import {ModalController, NavController, Slides} from "ionic-angular";
import {LoginPage} from "../login/login";
import {SignupPage} from "../signup/signup";
import {AuthenticationService} from "../../services/authentication.service";
import {TabsPage} from "../tabs/tabs";


@Component({
  templateUrl: 'slider.html'
})
export class SliderPage {
  @ViewChild(Slides) sld: Slides;
  index = 0;
  slides = [
    {
      title: "Welcome to Supfile",
      description: "The most <b>powerful</b> and <b>stronger</b> solution to store your data.",
      image: "assets/imgs/ica-slidebox-img-1.png",
    },
    {
      title: "What is Supfile?",
      description: "An application to store, view, organize and share your data easily, safely and quickly ",
      image: "assets/imgs/ica-slidebox-img-2.png",
    }
  ];

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public authService: AuthenticationService) {

    if (authService.getLoggedUser()) // Use the Localstorage for redirect if user is already connected.
    {
      navCtrl.push(TabsPage);
    }
  }
  openProfile(registered: Boolean) {
    let modal = registered ? this.modalCtrl.create(LoginPage) : this.modalCtrl.create(SignupPage);
    modal.present();
  }


  slideChanged() {
    this.index = this.sld.getActiveIndex();
  }

  next() {
    this.sld.slideNext();
  }

  skip() {
    this.sld.slideTo(2);
    this.index = this.sld.getActiveIndex();
  }
}
