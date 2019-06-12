import { Component, OnInit } from '@angular/core';
import {AlertService, FileService} from '../../../services';

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save.dialog.component.html',
  styleUrls: ['./save.dialog.component.scss']
})
export class SaveDialogComponent implements OnInit {

  save_link: string;
  constructor(private fileService: FileService, private alertService: AlertService) { }

  ngOnInit() {
  }

  save() {
    if (this.save_link !== '' && this.save_link.startsWith('http')) {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none');
      a.setAttribute('href', this.save_link);
      a.click();
    }
  }
}
