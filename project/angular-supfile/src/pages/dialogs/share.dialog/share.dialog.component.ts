import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-share-dialog',
  templateUrl: './share.dialog.component.html',
  styleUrls: ['./share.dialog.component.scss']
})
export class ShareDialogComponent implements OnInit {

  share_link;
  constructor(@Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
    this.share_link = environment.api_url + '/p/download/' + this.data.fileId + '/' + this.data.userId;
  }
}
