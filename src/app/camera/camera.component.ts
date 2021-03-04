import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { Colors } from '../app.model';
import { DataService } from '../services/ia.service';
import { UtilsService } from '../services/utils.service';
import { AppState } from './../app.state';

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
  webcamImage: WebcamImage = null

  // Azure Atributes
  imageUrl: string
  personAge: string


  // Cores
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

  userAgent = {
    isMobile: false,
    isTablet: false,
    isWeb: false
  }

  constructor(
    private utils: UtilsService,
    private data: DataService,
    public store: Store<AppState>,
  ) {
    this.imageUrl = '';

  }

  /**
   * Quando o complemente for renderizado...
   *   - checa com uma promise, se o device do usuário tem mais de uma câmera.
   *   - caso true, jogue os dados de MediaDeviceInfo para multipleWebcamsAvailable
   */
  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then((mediaDevices: MediaDeviceInfo[]) =>
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1
    );
    this.utils.userAgent();
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

  /**
   * Captura a imagem
   */
  handleImage(image: WebcamImage): void {
    this.utils.openSnackbar(Message.success_photo, 'X');
    this.webcamImage = image;
  }

  /**
   * Evento chamado quando eu clico na área da webcam
   */
  handleImageClick(): void {
    this.store.select('webOrMobile').subscribe(v => {
      this.userAgent.isMobile = v.isMobile;
      this.userAgent.isTablet = v.isTablet;
      this.userAgent.isWeb = v.isWeb;
    });
  }

  get observableCamera(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<Subjects> {
    return this.nextWebcam.asObservable();
  }

  getPersonAge(imageUrl: string): void {
    this.data.getPersonAge(imageUrl).subscribe(data => {
      this.personAge = data;
    });
  }
}
