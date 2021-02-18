import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(public _snackBar: MatSnackBar) { }


  openSnackbar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 3500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['blue-snackbar']
    });
  }
}
