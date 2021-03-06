import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SteemService } from '../../providers/steem/steem.service';
import { AudioService } from '../../providers/audio/audio.service';
import { UIService } from '../../providers/ui/ui.service';
import { AppConfig } from '../../../environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.html',
  styleUrls: ['./user.scss']
})
export class UserComponent implements OnInit {
  username: string;
  user: any = {};
  posts: any[] = [];
  loading: Boolean = false;

  constructor(private route: ActivatedRoute, private steem: SteemService, private audio: AudioService, public ui: UIService) {
    this.username = this.route.snapshot.params.username;
  }

  async ngOnInit() {
    const user = await this.steem.getUser(this.username);
    this.user = Object.assign(user, JSON.parse(user.json_metadata));
    this.user.link = `${AppConfig.dsoundUrl}/@${this.user['name']}`;

    const follow = await this.steem.getFollowCount(this.username);
    this.user.followers = follow.follower_count;
    this.user.following = follow.following_count;

    console.log(this.user);
    this.loadPosts();
  }

  async loadPosts() {
    this.loading = true;

    const options = {
      limit: 20,
      permlink: ''
    };

    if (this.posts.length > 0) {
      const { permlink } = this.posts[this.posts.length - 1];
      options.permlink = permlink;
    }

    const newPosts = await this.steem.getUserPosts(this.username, options);
    this.posts = this.posts.concat(newPosts);
    this.audio.playlist = this.posts;
    this.loading = false;
    console.log(this.posts);
  }

  onScroll(event: any) {
    const target = event.target;
    if (target.offsetHeight + event.target.scrollTop >= target.scrollHeight) {
      this.loadPosts();
    }
  }

}
