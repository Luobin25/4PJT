import {Component, Injectable} from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import {FileService} from "../../services/file.service";
import {FileOpener} from "@ionic-native/file-opener";
import {User} from "../../models/user";
import {environment} from "../../environment/environment";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";
import {Clipboard} from "@ionic-native/clipboard";
import {DirectoryPage} from "../directory/directory";


@IonicPage()
@Component({
  selector: 'page-file-details',
  templateUrl: 'file-details.html',
})
@Injectable()
export class FileDetailsPage {
  currentUser: User;
  private id_file: String;
  public fileDetail: any = [];
  public loader;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public fileService: FileService,
              public modalCtrl: ModalController,
              private fileOpener: FileOpener,
              private transfer: FileTransfer,
              private file: File,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              private clipboard: Clipboard) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.id_file = navParams.get('id');
    this.getFileById(this.id_file);
  }

  public getFileById(id_file) {
    this.fileService.getFileById(id_file)
      .then(resp => {
        this.fileDetail = resp.data
      })
  }

  public rename(name) {


    let prompt = this.alertCtrl.create({
      title: 'Rename',
      message: "Change the file's name ",
      inputs: [
        {
          name: 'model',
          value: this.fileDetail.name,
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
            this.fileService.rename(this.id_file, data.model, 'file').then(resp => {
              this.fileDetail = resp.data
            })
            //this.navCtrl.push(FileDetailsPage, {id: this.id_file});
            this.presentToast('Update successfully')
          }
        }
      ]
    });
    prompt.present();

  }

  public delete(id_file) {
    this.fileService.delete(id_file);
    this.navCtrl.push(DirectoryPage);
  }

  public share() {

    let prompt = this.alertCtrl.create({
      title: 'Share link',
      message: "Share the link with your friends. ",
      inputs: [
        {
          name: 'model',
          value: this.getLink(),
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
          text: 'Copy',
          handler: data => {
            this.fileService.share(this.id_file, 'file');
            this.clipboard.copy(this.getLink());
            this.presentToast('Link copied')
          }
        }
      ]
    });
    prompt.present();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
  }

  download() {
    //this.presentToast('Download file in progress');
    this.presentLoading();
    const ext = this.fileDetail.mime_type.split("/");
    const fileTransfer: FileTransferObject = this.transfer.create();
    const url = this.getLink();
    let name = this.fileDetail.name + '.' + ext[1];

    fileTransfer.download(url, this.file.dataDirectory + name).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.openFile(this.file.dataDirectory + name);
      this.loader.dismiss()
    }, (error) => {
      // handle error
      console.log(error);
    });
/*
    fileTransfer.download(environment.api_url + 'download/' +, this.file.dataDirectory + name, false, {'Authorization': this.currentUser.token}).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.openFile(this.file.dataDirectory + name);
    }, (error) => {
      // handle error
      console.log(error);
    });*/
  }

  openFile(path) {
    this.fileOpener.open(path, this.fileDetail.mime_type)
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error openening file', e));
  }

  getLink() {
    return environment.api_url + 'p/download/' + this.id_file + '/' + this.currentUser._id;
  }


}
