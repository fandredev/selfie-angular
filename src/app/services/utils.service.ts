import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as Actions from '../store/webormobile.action';
import { AppState } from './../app.state';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(public _snackBar: MatSnackBar, private device: DeviceDetectorService,
    private store: Store<AppState>) { }


  openSnackbar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 3500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['blue-snackbar']
    });
  }

  userAgent(): void {
    const isMobile = this.device.isMobile();
    const isTablet = this.device.isTablet();
    const isWeb = this.device.isDesktop();
    this.store.dispatch(new Actions.WebOrMobile(isMobile, isTablet, isWeb));
  }
}
