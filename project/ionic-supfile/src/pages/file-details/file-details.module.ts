import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FileDetailsPage } from './file-details';

@NgModule({
  declarations: [
    FileDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(FileDetailsPage),
  ],
})
export class FileDetailsPageModule {}
