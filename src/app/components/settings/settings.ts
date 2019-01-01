import { Component, OnInit } from '@angular/core';
import { UIService } from '../../providers/ui/ui.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss']
})
export class SettingsComponent implements OnInit {

  constructor(public ui: UIService) { }

  ngOnInit() {
  }

}
