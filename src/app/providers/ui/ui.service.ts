import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { shell } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class UIService {

  constructor(private snackBar: MatSnackBar, private translate: TranslateService) { }

  openSnackBar(i18n: string, error: boolean = false) {
    this.translate.get(i18n).subscribe((res: string) => {
      this.snackBar.open(res, 'OK', {
        duration: 100000,
        panelClass: ['snackbar', (error ? 'danger' : 'success')]
      });
    });
  }

  openBrowser(url: string) {
    if (url) {
      shell.openExternal(url);
    }
  }
}
