import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class AudioService {
   public player: HTMLAudioElement;
   public current: { permlink?: string, title?: string, author?: string, cover?: string, audio?: string } = {};
   public playlist: any[] = [];

   constructor() {
      this.player = new Audio();
      this.player.volume = 0.5;

      this.player.onended = () => {
         this.playNextTrack(true);
      };
   }

   playTrack(track: any) {
      this.player.src = track.audio;
      this.player.play().catch(err => {});
      this.current = track;
   }

   playNextTrack(next: boolean) {
      for (let i = 0; i < this.playlist.length; i++) {
         const track = this.playlist[i];
         if (track.permlink === this.current.permlink) {
            const nextIndex = (next ? (i < this.playlist.length - 1 ? i + 1 : i) : (i > 0 ? i - 1 : i));
            this.playTrack(this.playlist[nextIndex]);
            break;
         }
      }
   }
}
