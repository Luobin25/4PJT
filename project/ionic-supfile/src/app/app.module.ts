import {NgModule, ErrorHandler, Injectable} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AccountPage } from '../pages/account/account';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SliderPage } from "../pages/slider/slider";
import { LoginPage} from "../pages/login/login";
import { SignupPage } from "../pages/signup/signup";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {File} from "@ionic-native/file";

import {AuthenticationService} from "../services/authentication.service";
import {FileService} from "../services/file.service";


import { Observable } from 'rxjs/Observable';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpClient, HttpClientModule} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {HttpModule} from "@angular/http";
import {environment} from "../environment/environment";
import {FileTransfer} from "@ionic-native/file-transfer";
import { FileChooser } from '@ionic-native/file-chooser';
import {FileDetailsPage} from "../pages/file-details/file-details";
import {DirectoryPage} from "../pages/directory/directory";
import {AddPage} from "../pages/add/add";
import {ImagePicker} from "@ionic-native/image-picker";
import {FileOpener} from "@ionic-native/file-opener";
import { Clipboard } from '@ionic-native/clipboard';
import {VipPage} from "../pages/vip/vip";
import {TermsPage} from "../pages/terms/terms";

@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {
  public_url = ['login','signup','helloworld']

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //console.log(req.url)
    if(this.public_url.indexOf(req.url) == -1){
      const dupReq = req.clone({
        headers: req.headers.set('Authorization', localStorage.getItem('token').replace(/"/g,"")),
        url: environment.api_url + req.url
      });
      return next.handle(dupReq);
    }else{
      const dupReq = req.clone({
        url: environment.api_url + req.url
      });
      return next.handle(dupReq);
    }
  }
}


@NgModule({
  declarations: [
    MyApp,
    AccountPage,
    HomePage,
    TabsPage,
    SliderPage,
    LoginPage,
    SignupPage,
    FileDetailsPage,
    DirectoryPage,
    AddPage,
    VipPage,
    TermsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AccountPage,
    HomePage,
    TabsPage,
    SliderPage,
    LoginPage,
    SignupPage,
    FileDetailsPage,
    DirectoryPage,
    AddPage,
    VipPage,
    TermsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthenticationService,
    FileService,
    HttpClient,
    File,
    FileTransfer,
    FileOpener,
    FileChooser,
    ImagePicker,
    Clipboard,
    { provide: HTTP_INTERCEPTORS, useClass: HttpsRequestInterceptor, multi: true },
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
