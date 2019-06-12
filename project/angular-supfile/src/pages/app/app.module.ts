import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {
  MatSidenavModule,
  MatProgressBarModule,
  MatButtonModule,
  MatDialogModule,
  MatTooltipModule,
  MatButtonToggleModule, MatTreeModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
} from '@angular/material';
import {AboutComponent} from '../about/about.component';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from '../notFound/notFound.component';
import {MainComponent, VolumeConverterPipe} from '../main/main.component';
import {AccountComponent} from '../account/account.component';
import {LoginComponent} from '../login/login.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {AlertComponent} from '../../directives';
import {AuthGuard} from '../../guards';
import {JwtInterceptor} from '../../helpers';
import {AlertService, AuthenticationService, UserService, FileService} from '../../services';
import {HttpModule} from '@angular/http';
import {FacebookModule} from 'ngx-facebook';
import {NewfolderDialogComponent} from '../dialogs/newfolder.dialog/newfolder.dialog.component';
import {UploadDialogComponent} from '../dialogs/upload.dialog/upload.dialog.component';
import {SaveDialogComponent} from '../dialogs/save.dialog/save.dialog.component';
import {RenameDialogComponent} from '../dialogs/rename.dialog/rename.dialog.component';
import {PictureDialogComponent} from '../dialogs/picture.dialog/picture.dialog.component';
import {VideoDialogComponent} from '../dialogs/video.dialog/video.dialog.component';
import {ShareDialogComponent} from '../dialogs/share.dialog/share.dialog.component';
import {TextDialogComponent} from '../dialogs/text.dialog/text.dialog.component';
import {ChecklistDatabase} from '../../services/ChecklistDatabase';
import {MoveDialogComponent} from '../dialogs/move.dialog/move.dialog.component';
import {AudioDialogComponent} from '../dialogs/audio.dialog/audio.dialog.component';
import {ClipboardModule} from 'ngx-clipboard';

const appRoutes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'main', component: MainComponent, canActivate: [AuthGuard] },
  { path: 'main/:folder_id', component: MainComponent, canActivate: [AuthGuard]},
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '',   redirectTo: 'about', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    NotFoundComponent,
    MainComponent,
    AccountComponent,
    LoginComponent,
    AlertComponent,
    NewfolderDialogComponent,
    UploadDialogComponent,
    SaveDialogComponent,
    RenameDialogComponent,
    PictureDialogComponent,
    VideoDialogComponent,
    MoveDialogComponent,
    ShareDialogComponent,
    TextDialogComponent,
    AudioDialogComponent,
    VolumeConverterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatTreeModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    ClipboardModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FacebookModule.forRoot()
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    ChecklistDatabase,
    FileService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
  ],
  entryComponents: [
    NewfolderDialogComponent,
    UploadDialogComponent,
    SaveDialogComponent,
    RenameDialogComponent,
    PictureDialogComponent,
    VideoDialogComponent,
    ShareDialogComponent,
    TextDialogComponent,
    MoveDialogComponent,
    AudioDialogComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
