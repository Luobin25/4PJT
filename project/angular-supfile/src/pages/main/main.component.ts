import {Component, OnInit, ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import {User} from '../../models';
import {UserService, FileService, AlertService} from '../../services';
import { Pipe, PipeTransform } from '@angular/core';
import {MatDialog, MatSelectionList, MatSelectionListChange} from '@angular/material';
import {NewfolderDialogComponent} from '../dialogs/newfolder.dialog/newfolder.dialog.component';
import {UploadDialogComponent} from '../dialogs/upload.dialog/upload.dialog.component';
import {SaveDialogComponent} from '../dialogs/save.dialog/save.dialog.component';
import {RenameDialogComponent} from '../dialogs/rename.dialog/rename.dialog.component';
import {PictureDialogComponent} from '../dialogs/picture.dialog/picture.dialog.component';
import {ActivatedRoute} from '@angular/router';
import {VideoDialogComponent} from '../dialogs/video.dialog/video.dialog.component';
import {ShareDialogComponent} from '../dialogs/share.dialog/share.dialog.component';
import {TextDialogComponent} from '../dialogs/text.dialog/text.dialog.component';
import {MoveDialogComponent} from '../dialogs/move.dialog/move.dialog.component';
import {AudioDialogComponent} from '../dialogs/audio.dialog/audio.dialog.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  currentUser: User;
  resources: any;
  selectedResource: any;
  userId: number;
  folder_id: string;
  resourceType: string;
  currentLocation: string;
  @ViewChild(MatSelectionList) list: MatSelectionList;

  typeArray = {
    picture: ['image/png', 'image/jpeg', 'image/gif'],
    video:  ['video/mp4', 'video/quicktime'],
    doc: ['text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/pdf'],
    audio: ['audio/mp3', 'audio/mpeg']
  };


  constructor(public dialog: MatDialog, private userService: UserService, private route: ActivatedRoute,
              private location: Location, private fileService: FileService, private alertService: AlertService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.userId = this.currentUser['_id'];
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const fileType = this.route.snapshot.queryParams['fileType'];
      if (fileType) {
          this.filterFiles(fileType);
      }else {
        if (params.folder_id) {
          this.folder_id = params.folder_id;
        }else {
          this.folder_id = '_root';
        }
        this.fileService.getSpecFolderByUserId(this.userId, this.folder_id).then((resp: any) => {
          if (resp.success = 'true') {
            this.resources = resp.data;
            this.resources.sort(this.compare('name'));
            return this.fileService.getSpecFilesByUserId(this.userId, this.folder_id);
          } else {
            this.alertService.error(resp.data, false);
          }
        }).then((resp: any) => {
          if (resp.success = 'true') {
            resp.data.sort(this.compare('name'));
            this.resources = this.resources.concat(resp.data);
          } else {
            this.alertService.error(resp.data, false);
          }
        });
      }
    });
    this.list.selectionChange.subscribe((s: MatSelectionListChange) => {
      if (!s.option.selected) {
        s.option.selected = false;
        this.selectedResource = null;
      }else {
        this.list.deselectAll();
        s.option.selected = true;
        this.selectedResource = s.option.value;
        if (s.option.value.mime_type) {
          this.resourceType = 'file';
        }else {
          this.resourceType = 'folder';
        }
      }
    });
  }


  goBack() {
    if (this.fileService.lastLocation.length > 0) {
      this.location.back();
    }
    this.fileService.currentLocation = this.fileService.lastLocation.pop();
  }

  display(resourece: any) {
    if (this.typeArray['picture'].indexOf(resourece.mime_type) !== -1) {
      const dialogRef = this.dialog.open(PictureDialogComponent, {
        data: { file_id: resourece._id, userId: this.userId },
        width: '400px',
        height: '350px'
      });
    }else if (this.typeArray['video'].indexOf(resourece.mime_type) !== -1) {
      const dialogRef = this.dialog.open(VideoDialogComponent, {
        data: { file_id: resourece._id, userId: this.userId },
        width: '900px',
        height: '600px'
      });
    }else if (this.typeArray['audio'].indexOf(resourece.mime_type) !== -1) {
      const dialogRef = this.dialog.open(AudioDialogComponent, {
        data: {file_id: resourece._id, userId: this.userId},
        width: '400px',
        height: '250px'
      });
    } else if (resourece.mime_type === 'text/plain') {
      const dialogRef = this.dialog.open(TextDialogComponent, {
        data: { file_id: resourece._id },
        width: '600px',
        height: '400px'
      });
    }
  }

  downloadFile() {
    this.fileService.downloadFile(this.selectedResource._id).then((data: any) => {
      const blob = new Blob([data], {type: 'pplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none');
      a.setAttribute('href', objectUrl);
      a.setAttribute('download', this.selectedResource.name);
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  deleteFile() {
    if (this.resourceType === 'file') {
      this.fileService.deleteFile(this.selectedResource._id).then((resp: any) => {
        if (resp.success = 'true') {
          const index = this.resources.indexOf(this.selectedResource);
          this.resources.splice(index, 1);
        } else {
          this.alertService.error(resp.data, false);
        }
      });
    }else {
      this.fileService.deleteFolder(this.selectedResource._id).then((resp: any) => {
        if (resp.success = 'true') {
          const index = this.resources.indexOf(this.selectedResource);
          this.resources.splice(index, 1);
        } else {
          this.alertService.error(resp.data, false);
        }
      });
    }

  }

  shareFile() {
    this.fileService.shareFile(this.selectedResource._id, this.resourceType).then((resp: any) => {
      if (resp.success = 'true') {
        const dialogRef = this.dialog.open(ShareDialogComponent, {
          data: {fileId: this.selectedResource._id, userId: this.userId},
          width: '400px',
          height: '250px'
        });
      } else {
        this.alertService.error(resp.data, false);
      }
    });
  }

  filterFiles(fileType: string) {
    const typeArray = this.typeArray;
    let files = [];
    const specFiles = [];
    this.fileService.getAllFilesByUserId(this.userId).then((resp: any) => {
      if (resp.success = 'true') {
        files = resp.data;
        files.forEach(function (item) {
          if (typeArray[fileType].indexOf(item.mime_type) !== -1) {
            specFiles.push(item);
          }
        });
        this.resources = specFiles;
      }
    });
  }

  recordLocation(folder_name) {
    this.fileService.lastLocation.push(this.fileService.currentLocation);
    this.fileService.currentLocation =  folder_name;
  }
  search(searchWord) {
    if (searchWord === '') {
      this.fileService.getSpecFolderByUserId(this.userId, this.folder_id).then((resp: any) => {
        if (resp.success = 'true') {
          this.resources = resp.data;
          return this.fileService.getSpecFilesByUserId(this.userId, this.folder_id);
        } else {
          this.alertService.error(resp.data, false);
        }
      }).then((resp: any) => {
        if (resp.success = 'true') {
          this.resources = this.resources.concat(resp.data);
        } else {
          this.alertService.error(resp.data, false);
        }
      });
    }else {
      let files = [];
      const specFiles = [];
      this.fileService.getAllFilesByUserId(this.userId).then((resp: any) => {
        if (resp.success = 'true') {
          files = resp.data;
          files.forEach(function (item) {
            console.log(item.name.indexOf(searchWord));
            if (item.name.indexOf(searchWord) > -1) {
              specFiles.push(item);
            }
          });
          this.resources = specFiles;
        }
      });
    }
  }

  compare(property) {
    return function(a, b){
      const value1 = a[property];
      const value2 = b[property];
      return (value1 + '').localeCompare(value2 + '');
    };
  }

  openNewFolderDialog() {
    const dialogRef = this.dialog.open(NewfolderDialogComponent, {
      data: {folder_id: this.folder_id, resources: this.resources },
      width: '400px',
      height: '250px'
    });
  }
  openUploadDialog() {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      data: { folder_id: this.folder_id, resources: this.resources },
      width: '400px',
      height: '300px'
    });
  }
  openSaveDialog() {
    const dialogRef = this.dialog.open(SaveDialogComponent, {
      width: '400px',
      height: '250px'
    });
  }
  openRenameDialog() {
    const dialogRef = this.dialog.open(RenameDialogComponent, {
      data: {selectedResource: this.selectedResource,  resourceType: this.resourceType},
      width: '400px',
      height: '250px'
    });
  }
  openMoveDialog() {
    const dialogRef = this.dialog.open(MoveDialogComponent, {
      data: {userId: this.userId,  selectedResource: this.selectedResource, resources: this.resources},
      width: '600px',
      height: '400px'
    });
  }
}

@Pipe({name: 'volumeConverter'})
export class VolumeConverterPipe implements PipeTransform {
  transform(value: number, ...args: any[]): string {
    if (value >= Math.pow(1024, 3)) {
      return Math.round(value / Math.pow(1024, 3) * 100) / 100 + 'G';
    } else if (value >= Math.pow(1024, 2) && value <= Math.pow(1024, 3)) {
      return Math.round(value / Math.pow(1024, 2) * 100) / 100 + 'M';
    } else if (value >= 1024 && value <= Math.pow(1024, 2)) {
      return Math.round(value / 1024 * 100) / 100 + 'K';
    } else {
      return Math.round(value * 100 ) / 100 + 'B';
    }
  }
}


