import {Component, Inject, OnInit} from '@angular/core';
import {AlertService, FileService} from '../../../services';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-newfolder-dialog',
  templateUrl: './newfolder.dialog.component.html',
  styleUrls: ['./newfolder.dialog.component.scss']
})
export class NewfolderDialogComponent implements OnInit {

  foldName: string;
  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private fileService: FileService, private alertService: AlertService) { }

  ngOnInit() {
  }

  newFolder() {
    if (this.foldName !== '') {
      this.fileService.addFolder(this.data.folder_id, this.foldName).then((resp: any) => {
        if (resp.success = 'true') {
          this.data.resources.splice(0, 0, resp.data);
        } else {
          this.alertService.error(resp.data, false);
        }
      });
    }
  }
}
