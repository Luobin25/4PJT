import { Component } from '@angular/core';

import { AccountPage } from '../account/account';
import { HomePage } from '../home/home';
import {DirectoryPage} from "../directory/directory";
import {AddPage} from "../add/add";


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = DirectoryPage;
  tab3Root = AccountPage;
  tab4Root = AddPage;

  constructor() {

  }
}
