import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const { apiKey } = environment;


export const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Ocp-Apim-Subscription-Key': apiKey
});
