import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSelectionList} from '@angular/material';
import {AlertService, FileService} from '../../../services';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload.dialog.component.html',
  styleUrls: ['./upload.dialog.component.scss']
})

export class UploadDialogComponent implements OnInit {
  @ViewChild('fileInput') fileInput;
  @ViewChild(MatSelectionList) list: MatSelectionList;
  loadingLogin = false;
  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private fileService: FileService, private alertService: AlertService
              , public dialog: MatDialog) { }
  ngOnInit() {
  }

  upload() {
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const file = fileBrowser.files[0];
      const fileData = new FormData();
      fileData.append('file', file);
      this.loadingLogin = true;
      this.fileService.uploadFile(this.data.folder_id, fileData).then((resp: any) => {
        if (resp.success = 'true') {
          this.data.resources.splice(0, 0, resp.data);
          this.dialog.closeAll();
        } else {
          this.alertService.error(resp.data, false);
        }
      });
    }
  }

}
