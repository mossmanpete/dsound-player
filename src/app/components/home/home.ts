import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SteemService } from '../../providers/steem/steem.service';
import { AudioService } from '../../providers/audio/audio.service';
import { UIService } from '../../providers/ui/ui.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  title: String = '';
  apiRoutes: { feed?: any, trending?: any, hot?: any, new?: any } = {};
  activeRoute: String = '';
  posts: any[] = [];
  postsCount: Number = 35;
  loading: Boolean = false;

  constructor(private router: Router, private steem: SteemService, private audio: AudioService, private ui: UIService) {
    this.apiRoutes = {
      feed: null,
      trending: steem.getTrendingPosts,
      hot: steem.getHotPosts,
      new: steem.getNewPosts
    };

    this.activeRoute = router.routerState.snapshot.url.replace('/home', '').substr(1);
    this.title = `PAGES.HOME.title.${this.activeRoute}`;
  }

  ngOnInit() {
    this.loadPosts();
  }

  async loadPosts() {
    this.loading = true;

    let options = {};
    if (this.posts.length > 0) {
      const { author, permlink } = this.posts[this.posts.length - 1];
      options = { author, permlink };
    }

    let newPosts = [];
    switch (this.activeRoute) {
      case 'hot':
        newPosts = await this.steem.getHotPosts(this.postsCount, options);
        break;

      case 'new':
        newPosts = await this.steem.getNewPosts(this.postsCount, options);
        break;

      default:
        newPosts = await this.steem.getTrendingPosts(this.postsCount, options);
        break;
    }

    if (!newPosts.length) {
      this.ui.openSnackBar('ERRORS.HOME.posts', true);
    }

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
