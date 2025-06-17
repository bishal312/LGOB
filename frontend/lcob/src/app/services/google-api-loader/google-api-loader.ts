import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class GoogleApiLoader {
  constructor(private http: HttpClient) {}

  apiUrl: string = 'http://localhost:5001/api/orders';

  getPlacesName(query: string) {
   

    return this.http.post(`${this.apiUrl}/autocomplete`, { input: query });
  }

  getCoordinates(placeId: string) {
    
    return this.http.post(`${this.apiUrl}/coordinates`, { placeId: placeId });
  }
}
