import {Component, Inject, OnInit} from '@angular/core';
import {AlertService, FileService} from '../../../services';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-text-dialog',
  templateUrl: './text.dialog.component.html',
  styleUrls: ['./text.dialog.component.scss']
})
export class TextDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private fileService: FileService) { }

  ngOnInit() {
    this.fileService.downloadFile(this.data.file_id).then((data: any ) => {
      const fileReader = new FileReader();
      fileReader.readAsText(data, 'gb2312');
      fileReader.onload = function (event) {
        document.getElementById('txt').innerHTML = this.result;
      };
    });
  }
}
