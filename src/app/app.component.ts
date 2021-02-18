import { Component, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  webcamImage: WebcamImage = null // Os dados da imagem retirada

  handleImage(image: WebcamImage): void {
    this.webcamImage = image
  }

  ngOnInit(): void {
    console.log(this.webcamImage, 'Imagens vazias.')
  }

  ngDoCheck(): void {
    console.log(this.webcamImage, 'Imagem preenchida')
  }
}
