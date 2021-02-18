import { Component, EventEmitter, OnInit } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { Colors } from '../app.model';
import { UtilsService } from '../utils.service';

type Subjects = string | boolean

enum Message {
  success_photo = 'Foto retirada com sucesso'
}

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {
  pictureTaken = new EventEmitter<WebcamImage>();
  webcamImage: WebcamImage = null

  noShowCamButtonColor: Colors = 'primary'
  takeSnapshotButtonColor: Colors = 'secondary'

  // Ligar e desligar
  showWebcam = true
  allowCameraSwitch = true
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

  // Usuário não deu acesso a câmera
  nowAllowPermission = ''

  // Atributo que ouvirá o evento (Tirar foto - Subject)
  trigger: Subject<void> = new Subject<void>();

  // Atributo que ouvirá o evento (Trocar de câmera (Caso haja multiplicas cans))
  private nextWebcam: Subject<Subjects> = new Subject<Subjects>()

  constructor(private utils: UtilsService) { }

  /**
   * Quando o complemente for renderizado...
   *   - checa com uma promise, se o device do usuário tem mais de uma câmera.
   *   - caso true, jogue os dados de MediaDeviceInfo para multipleWebcamsAvailable
   */
  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then((mediaDevices: MediaDeviceInfo[]) =>
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1
    );
    // console.log(this.webcamImage, 'Imagens vazias.');
  }

  ngDoCheck(): void {
    // console.log(this.webcamImage, 'Imagem preenchida');
  }

  // como o trigger é um subject, eu chamo o next para buscar os dados do observable
  takeSnapshot(): void {
    this.trigger.next();
  }

  // desabilita e habilita a câmera
  toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  // Verifica se há alguma erro de permissão ou outro e joga isso no array de errors
  handleInitError(error: WebcamInitError): void {
    const { mediaStreamError, message } = error;
    const { name } = mediaStreamError;

    if (mediaStreamError && name === 'NotAllowedError') {
      this.nowAllowPermission = message;
      this.utils.openSnackbar(`Erro: ${this.nowAllowPermission && 'Você não permitiu o acesso a câmera'}`, 'X');
    }
  }

  // como o nextWebcam é um subject, eu chamo o next para buscar os dados do observable
  showNextWebcam(dirOrDeviceId: Subjects): void {
    this.nextWebcam.next(dirOrDeviceId);
  }
  // Pega o id do dispositivo que está tirando a foto
  cameraHasSwitch(deviceId: string): void {
    this.deviceId = deviceId;
  }

  handleImage(image: WebcamImage): void {
    this.utils.openSnackbar(Message.success_photo, 'X');
    this.webcamImage = image;
  }

  get observableCamera(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<Subjects> {
    return this.nextWebcam.asObservable();
  }
}
