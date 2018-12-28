import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class SteemService {
   private client;
   private jsdom;

   constructor() {
   }

   initialize(client, api, jsdom) {
      this.client = client;
      this.client.api.setOptions({ url: api });
      this.jsdom = jsdom;
   }

   getFeedPosts(limit, { author = null, permlink = null }) {
      return this.getPosts(this.client.api.getDiscussionsByFeed, { limit, author, permlink });
   }

   getTrendingPosts(limit, { author = null, permlink = null }) {
      return this.getPosts(this.client.api.getDiscussionsByTrending, { limit, author, permlink });
   }

   getHotPosts(limit, { author = null, permlink = null }) {
      return this.getPosts(this.client.api.getDiscussionsByHot, { limit, author, permlink });
   }

   getNewPosts(limit, { author = null, permlink = null }) {
      return this.getPosts(this.client.api.getDiscussionsByCreated, { limit, author, permlink });
   }

   getPosts(endpoint, options) {
      return new Promise<any[]>(resolve => {
         endpoint({
            tag: 'dsound',
            limit: (options.author && options.permlink ? options.limit + 1 : options.limit),
            start_author: options.author,
            start_permlink: options.permlink
         }, (err, result) => {
            if (err) { resolve(null); }
            resolve(
               (options.author && options.permlink ? result.slice(1) : result)
               .filter(p => p.category === 'dsound' && (p.beneficiaries.length ? p.beneficiaries[0].account === 'dsound' : false))
               .map(p => this.parsePost(p))
            );
         });
      });
   }

   parsePost(post: any) {
      console.log(post);
      const doc = new this.jsdom(post.body).window.document;
      const img = doc.querySelector('img');
      let audio = '';
      doc.querySelectorAll('a').forEach(el => {
         const href = el.getAttribute('href');
         if (new RegExp(/node([0-9])\w.dsound.audio/g).test(href)) { audio = href; }
      });

      return {
         author: post.author,
         permlink: post.permlink,
         title: post.title,
         cover: img ? img.getAttribute('src') : '',
         audio: audio,
         payout: parseFloat(post.pending_payout_value.replace('SBD', '')).toFixed(2),
         replies: post.children,
         likes: post.active_votes.length
      };
   }
}
