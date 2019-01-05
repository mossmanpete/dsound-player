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
  winTitle: string;
  routes: any[] = [];
  activeRoute: String = '';
  time: String = '0';

  constructor(
    public electron: ElectronService,
    public steem: SteemService,
    public audio: AudioService,
    private translate: TranslateService,
    private router: Router,
    private zone: NgZone) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electron.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electron.ipcRenderer);
      console.log('NodeJS childProcess', electron.childProcess);
    } else {
      console.log('Mode web');
    }

    this.winTitle = electron.remote.getCurrentWindow().getTitle();

    // Windows thumbar controls events
    electron.ipcRenderer.on('control-prev', (event, arg) => {
      audio.playNextTrack(false);
    });
    electron.ipcRenderer.on('control-play', (event, arg) => {
      audio.player.play();
    });
    electron.ipcRenderer.on('control-pause', (event, arg) => {
      audio.player.pause();
    });
    electron.ipcRenderer.on('control-next', (event, arg) => {
      audio.playNextTrack(true);
    });

    // Update Windows thumbar
    audio.player.onplay = () => {
      electron.ipcRenderer.send('player-onchange', false);
      electron.remote.getCurrentWindow().setTitle(`${audio.current.author} - ${audio.current.title}`);
    };
    audio.player.onpause = () => {
      electron.ipcRenderer.send('player-onchange', true);
      electron.remote.getCurrentWindow().setTitle(this.winTitle);
    };

    // Update time bar
    audio.player.ontimeupdate = (p) => {
      zone.run(() => {
        this.time = ((this.audio.player.currentTime * 1000 / this.audio.player.duration) || 0).toFixed();
      });
    };

    // Initialize SteemService
    steem.initialize(this.electron.steem, AppConfig.steemApi);

    // Initialize Routes
    this.routes = router.config[0].children.map(c => '/home/' + c.path);
    this.activeRoute = this.routes[1];
  }
}
