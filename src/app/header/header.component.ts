import { Component } from '@angular/core';
import { Colors } from '../app.model';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  color: Colors = 'primary'
}
