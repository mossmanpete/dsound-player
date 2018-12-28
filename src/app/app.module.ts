import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron/electron.service';
import { SteemService } from './providers/steem/steem.service';
import { AudioService } from './providers/audio/audio.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app';
import { HomeComponent } from './components/home/home';

const routes: Routes = [
  { path: 'home',
    children: [
      { path: 'search', component: HomeComponent },
      { path: 'trending', component: HomeComponent },
      { path: 'hot', component: HomeComponent },
      { path: 'new', component: HomeComponent }
    ]
  },
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
    WebviewDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
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
    AudioService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
