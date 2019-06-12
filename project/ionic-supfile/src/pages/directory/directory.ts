import {Component} from '@angular/core';
import {
  ActionSheetController,
  AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams, Platform,
  ToastController
} from 'ionic-angular';
import {FileService} from "../../services/file.service";
import {User} from "../../models/user";
import {FileDetailsPage} from "../file-details/file-details";
import {ImagePicker} from "@ionic-native/image-picker";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import {environment} from "../../environment/environment";

@IonicPage()
@Component({
  selector: 'page-directory',
  templateUrl: 'directory.html',
})
export class DirectoryPage {

  ionViewWillEnter(): void {
    this.getFolders(this.id_folder);
    this.getFilesByFolder();
  }

  currentUser: User;
  public folders: any = [];
  public files: any = [];
  public id_folder: String = '_root';
  public folders_count = 0;
  public files_count = 0;
  public loader;

  constructor(public navCtrl: NavController,
              public platform: Platform,
              public actionSheetCtrl: ActionSheetController,
              private transfer: FileTransfer,
              private file: File,
              public navParams: NavParams,
              public fileService: FileService,
              public modalCtrl: ModalController,
              private imagePicker: ImagePicker,
              public loadingCtrl: LoadingController,
              public  toastCtrl: ToastController,
              public alertCtrl: AlertController)
  {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (navParams.get('id_folder') != undefined) {
      this.id_folder = navParams.get('id_folder');
    }
    this.presentLoading();
  }

  public getFolders(id_folder: String) {
    this.fileService.getFolders(id_folder).then(resp => {
      this.folders = resp;
      this.folders_count = this.folders.data.length;
    });
  }

  public folderComponant() {
    let prompt = this.alertCtrl.create({
      title: 'New folder',
      message: "Create a new folder ",
      inputs: [
        {
          name: 'name',
          placeholder: "Folder's name"
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
          text: 'Create',
          handler: data => {
            this.fileService.createFolder(this.id_folder, data.name);
            this.navCtrl.push(DirectoryPage, {id_folder: this.id_folder});
            this.presentToast('Folder created')
          }
        }
      ]
    });
    prompt.present();
  } // create folder

  public goToFolder(id_folder: String) {
    this.navCtrl.push(DirectoryPage, {id_folder: id_folder})
  }

  public getFilesByFolder() {
    this.fileService.getFilesByFolder(this.id_folder).then(resp => {
      this.files = resp;
      this.files_count = this.files.data.length;
      this.loader.dismiss()
    });

  }

  public goToFile(id: String) {
    this.navCtrl.push(FileDetailsPage, {id: id})
  }


  public addFile(options) {
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        console.log('Image URI: ' + results[i]);

        this.upload(results[i])
      }
    }, (err) => {
      console.log(err)
    });
  }

  upload(path) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'file',
      headers: {'Authorization': this.currentUser.token}
  }

    fileTransfer.upload(path,  environment.api_url +'/create/file/' + this.id_folder, options)
      .then((data) => {
        console.log(data)
        this.presentToast('File upload successfully')
        // success
      }, (err) => {
        console.log(err)
        this.presentToast('There are some issues, try again')
        // error
      })
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  openMenu() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Actions',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Share',
          icon: !this.platform.is('ios') ? 'share' : null,
          handler: () => {
            this.share()
          }
        },
        {
          text: 'Rename',
          icon: !this.platform.is('ios') ? 'arrow-dropright-circle' : null,
          handler: () => {
            this.rename()
          }
        },

        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  public rename() {


    let prompt = this.alertCtrl.create({
      title: 'Rename',
      message: "Change the folder's name ",
      inputs: [
        {
          name: 'model',
          value: this.folders.name,
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
            this.fileService.rename(this.id_folder, data.model, 'folder').then(resp => {
              this.folders = resp.data
            })
            //this.navCtrl.push(FileDetailsPage, {id: this.id_file});
            this.presentToast('Update successfully')
          }
        }
      ]
    });
    prompt.present();

  }

  public share() {
    this.fileService.share(this.id_folder, 'folder');
    this.showAlert('You can now share this folder with your friends..')
  }

  showAlert(message) {
    const alert = this.alertCtrl.create({
      title: 'Ready for share',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}
