import { Component, OnInit } from '@angular/core';
import { shell } from 'electron';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  openBrowser(url: string) {
    shell.openExternal(url);
  }

}
