import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { HttpClientModule, HttpClient } from '@angular/common/http';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron/electron.service';
import { SteemService } from './providers/steem/steem.service';
import { AudioService } from './providers/audio/audio.service';
import { UIService } from './providers/ui/ui.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app';
import { HomeComponent } from './components/home/home';
import { SettingsComponent } from './components/settings/settings';
import { UserComponent } from './components/user/user';
import { TrackComponent } from './components/track/track';
import { PostComponent } from './components/post/post.component';

const routes: Routes = [
  { path: 'home',
    children: [
      { path: 'search', component: HomeComponent },
      { path: 'trending', component: HomeComponent },
      { path: 'hot', component: HomeComponent },
      { path: 'new', component: HomeComponent }
    ]
  },
  { path: 'settings', component: SettingsComponent },
  { path: 'user/:username', component: UserComponent },
  { path: 'track/:author/:permlink', component: TrackComponent },
  { path: '', redirectTo: '/home/trending', pathMatch: 'full' }
];

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    SettingsComponent,
    UserComponent,
    TrackComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    RouterModule.forRoot(routes, { useHash: true }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  exports: [RouterModule],
  providers: [
    ElectronService,
    SteemService,
    AudioService,
    UIService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
