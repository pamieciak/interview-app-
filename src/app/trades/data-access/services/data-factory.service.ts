import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, EMPTY, map, Observable } from 'rxjs';

import { SnackBarService } from '@app/trades/util/service/snackbar.service';
import { ApiResponse, Order } from 'app/trades/util/interfaces';

@Injectable({
  providedIn: 'root',
})
export class DataFactoryService {
  #apiUrl = 'https://geeksoft.pl/assets/order-data.json';
  http = inject(HttpClient);
  snackBarService = inject(SnackBarService);

  getOrders(): Observable<Order[]> {
    return this.http.get<ApiResponse>(this.#apiUrl).pipe(
      map((response) => response.data),
      catchError((error) => {
        this.snackBarService.showErrorMessage(
          `${error.message}, Błąd pobierania danych`,
        );

        return EMPTY;
      }),
    );
  }
}
