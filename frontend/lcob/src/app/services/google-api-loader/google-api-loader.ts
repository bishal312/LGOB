import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class GoogleApiLoader {
  constructor(private http: HttpClient) {}

  

  getPlacesName(query: string) {
   

    return this.http.post(`${environment.apiUrl}/orders/autocomplete`, { input: query });
  }

  getCoordinates(placeId: string) {
    
    return this.http.post(`${environment.apiUrl}/orders/coordinates`, { placeId: placeId });
  }
}
