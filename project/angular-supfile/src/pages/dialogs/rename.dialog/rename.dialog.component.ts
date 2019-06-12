import {Component, Inject, OnInit} from '@angular/core';
import {AlertService, FileService} from '../../../services';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-rename-dialog',
  templateUrl: './rename.dialog.component.html',
  styleUrls: ['./rename.dialog.component.scss']
})
export class RenameDialogComponent implements OnInit {

  newFileName: string;
  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private fileService: FileService, private alertService: AlertService) { }

  ngOnInit() {
  }

  rename() {
    if (this.newFileName !== '') {
      this.fileService.renameFile(this.data.selectedResource._id, this.data.resourceType, this.newFileName).then((resp: any) => {
        if (resp.success = 'true') {
          this.data.selectedResource.name = this.newFileName;
        } else {
          this.alertService.error(resp.data, false);
        }
      });
    }
  }
}
