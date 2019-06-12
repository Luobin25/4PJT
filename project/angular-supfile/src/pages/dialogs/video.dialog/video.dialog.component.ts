import {Component, Inject, OnInit} from '@angular/core';
import {AlertService, FileService} from '../../../services';
import {MAT_DIALOG_DATA} from '@angular/material';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-video-dialog',
  templateUrl: './video.dialog.component.html',
  styleUrls: ['./video.dialog.component.scss']
})
export class VideoDialogComponent implements OnInit {

  foldName: string;
  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private fileService: FileService, private alertService: AlertService) { }

  ngOnInit() {
  }

  getLink() {
    return environment.api_url + '/p/download/' + this.data.file_id + '/' + this.data.userId;
  }
}
