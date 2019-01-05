import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class SteemService {
   private client;

   constructor() {
   }

   initialize(client, api) {
      this.client = client;
      this.client.api.setOptions({ url: api });
   }

   getTrack(author: String, permlink: String) {
      return new Promise(resolve => {
         this.client.api.getContent(author, permlink, (err, result) => {
            if (err) { resolve(null); }
            resolve(this.parsePost(result));
         });
      });
   }

   getUser(username: string) {
      return new Promise<any>(resolve => {
         this.client.api.getAccounts([username], (err, result) => {
            if (err) { resolve(null); }
            resolve(result[0]);
         });
      });
   }

   getFollowCount(username: string) {
      return new Promise<any>(resolve => {
         this.client.api.getFollowCount(username, (err, result) => {
            if (err) { resolve(null); }
            resolve(result);
         });
      });
   }

   getUserPosts(username: String, { limit, permlink = null }) {
      return new Promise(resolve => {
         this.client.api.getDiscussionsByAuthorBeforeDate(username, permlink, '2100-01-01T00:00:00', limit, (err, result) => {
            if (err) { resolve(null); }
            resolve(
               (permlink ? result.slice(1) : result)
               .filter(p => p.category === 'dsound' && (p.beneficiaries.length ? p.beneficiaries[0].account === 'dsound' : false))
               .map(p => this.parsePost(p))
            );
         });
      });
   }

   getFeedPosts(limit, { author = null, permlink = null }) {
      return this.getPosts(this.client.api.getDiscussionsByFeed, { tag: 'dsound', limit, author, permlink });
   }

   getTrendingPosts(limit, { author = null, permlink = null }) {
      return this.getPosts(this.client.api.getDiscussionsByTrending, { tag: 'dsound', limit, author, permlink });
   }

   getHotPosts(limit, { author = null, permlink = null }) {
      return this.getPosts(this.client.api.getDiscussionsByHot, { tag: 'dsound', limit, author, permlink });
   }

   getNewPosts(limit, { author = null, permlink = null }) {
      return this.getPosts(this.client.api.getDiscussionsByCreated, { tag: 'dsound', limit, author, permlink });
   }

   getPosts(endpoint, options) {
      return new Promise<any[]>(resolve => {
         endpoint({
            tag: options.tag,
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
      const meta = JSON.parse(post.json_metadata);
      const files = meta.audio.files;
      const node = files.node || { protocol: 'https', host: 'node01.dsound.audio'};
      const domain = `${node.protocol}://${node.host}/ipfs`;
      const cover = `${domain}/${files.cover}`;
      const sound = `${domain}/${files.sound}`;
      console.log(post);
      
      return {
         author: post.author,
         permlink: post.permlink,
         title: post.title,
         description: meta.audio.desc,
         type: meta.audio.type,
         cover: cover ? cover : '',
         audio: sound ? sound : '',
         payout: parseFloat(post.pending_payout_value.replace('SBD', '')).toFixed(2),
         replies: post.children,
         likes: post.active_votes.length,
         created: post.created
      };
   }
}
