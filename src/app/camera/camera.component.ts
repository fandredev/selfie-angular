import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

type Subjects = string | boolean

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {
  @Output() // Usado para pegar um item dentro das props do pai
  pictureTaken = new EventEmitter<WebcamImage>();

  // Ligar e desligar
  showWebcam: boolean = true
  allowCameraSwitch: boolean = true
  multipleWebcamsAvailable = false
  deviceId: string
  videoOptions: MediaTrackConstraints = {
    width: {
      ideal: 1024
    },
    height: {
      ideal: 576
    }
  }

  // Errors
  errors: WebcamInitError[] = []

  // Atributo que ouvirá o evento (Tirar foto - Subject)
  trigger: Subject<void> = new Subject<void>();

  // Atributo que ouvirá o evento (Trocar de câmera (Caso haja multiplicas cans))
  private nextWebcam: Subject<Subjects> = new Subject<Subjects>()

  /**
   * Quando o complemente for renderizado...
   *   - checa com uma promise, se o device do usuário tem mais de uma câmera.
   *   - caso true, jogue os dados de MediaDeviceInfo para multipleWebcamsAvailable
   */
  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then((mediaDevices: MediaDeviceInfo[]) =>
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1
    )

  }

  // como o trigger é um subject, eu chamo o next para buscar os dados do observable
  takeSnapshot(): void {
    this.trigger.next()
  }

  // desabilita e habilita a câmera
  toggleWebcam(): void {
    this.showWebcam = !this.showWebcam
  }

  // Verifica se há alguma erro de permissão ou outro e joga isso no array de errors
  handleInitError(error: WebcamInitError): void {
    this.errors.push(error)
    console.log(this.errors, 'Ocorreu um erro ao iniciar sua câmera.')
  }

  // como o nextWebcam é um subject, eu chamo o next para buscar os dados do observable
  showNextWebcam(dirOrDeviceId: Subjects): void {
    this.nextWebcam.next(dirOrDeviceId)
  }

  /**
   * Emite ao componente que chamar a função que eu recebi a imagem.
   * ps: o emit func, provavelmente disparará a chamada e uma ação acontecerá no pai
   * quando eu emite que recebi a imagem.
   */
  handleImage(webcamImage: WebcamImage): void {
    console.info("recebi a imagem", webcamImage)
    this.pictureTaken.emit(webcamImage)
  }

  // Pega o id do dispositivo que está tirando a foto
  cameraHasSwitch(deviceId: string): void {
    console.log('device ativo', deviceId)
    this.deviceId = deviceId
  }


  get observableCamera(): Observable<void> {
    return this.trigger.asObservable()
  }

  get nextWebcamObservable(): Observable<Subjects> {
    return this.nextWebcam.asObservable()
  }
}
