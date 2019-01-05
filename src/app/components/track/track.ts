import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SteemService } from '../../providers/steem/steem.service';
import { AudioService } from '../../providers/audio/audio.service';
import { UIService } from '../../providers/ui/ui.service';
import { AppConfig } from '../../../environments/environment';

@Component({
  selector: 'app-track',
  templateUrl: './track.html',
  styleUrls: ['./track.scss']
})
export class TrackComponent implements OnInit {
  author: String = '';
  permlink: String = '';
  track: any = {};

  constructor(private route: ActivatedRoute, private steem: SteemService, public audio: AudioService, public ui: UIService) {
    this.author = this.route.snapshot.params.author;
    this.permlink = this.route.snapshot.params.permlink;
  }

  async ngOnInit() {
    this.track = await this.steem.getTrack(this.author, this.permlink);
    this.track.link = `${AppConfig.dsoundUrl}/@${this.track['author']}/${this.track['permlink']}`;
    console.log(this.track);
  }

}
