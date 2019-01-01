import { Component, ViewEncapsulation, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';

import { ElectronService } from './providers/electron/electron.service';
import { SteemService } from './providers/steem/steem.service';
import { AudioService } from './providers/audio/audio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  routes: any[] = [];
  activeRoute: String = '';
  time: String = '0';

  constructor(
    public electronService: ElectronService,
    public steem: SteemService,
    public audio: AudioService,
    private translate: TranslateService,
    private router: Router,
    private zone: NgZone) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }

    // Initialize SteemService
    steem.initialize(this.electronService.steem, AppConfig.steemApi);

    // Initialize Routes
    this.routes = router.config[0].children.map(c => '/home/' + c.path);
    this.activeRoute = this.routes[1];

    // Update time bar
    audio.player.ontimeupdate = (p) => {
      zone.run(() => {
        this.time = ((this.audio.player.currentTime * 1000 / this.audio.player.duration) || 0).toFixed();
      });
    };
  }
}
