import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';


const { apiKey, azureUrl } = environment;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }

  getPersonAge(imageUrl: string) {
    console.log(imageUrl, 'Url');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': apiKey
    });


    return this.http.post(azureUrl, { url: imageUrl }, { headers }).pipe(
      map(data => data),
      tap((result: any) => console.log(result, 'Resultado'))
    );
  }
}
