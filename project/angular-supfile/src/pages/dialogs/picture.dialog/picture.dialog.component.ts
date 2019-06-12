import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {FileService} from '../../../services';

@Component({
  selector: 'app-picture-dialog',
  templateUrl: './picture.dialog.component.html',
  styleUrls: ['./picture.dialog.component.scss']
})
export class PictureDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private fileService: FileService) { }

  ngOnInit() {

  }

  getPicLink() {
    return environment.api_url + '/p/download/' + this.data.file_id + '/' + this.data.userId;
  }
}
