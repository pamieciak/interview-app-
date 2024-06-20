import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponse, Order } from '../types/api-response-type';

@Injectable({
  providedIn: 'root',
})
export class DataFactoryService {
  #apiUrl = 'https://geeksoft.pl/assets/order-data.json';
  http = inject(HttpClient);

  getOrders(): Observable<Order[]> {
    return this.http
      .get<ApiResponse>(this.#apiUrl)
      .pipe(map((response) => response.data));
  }
}
